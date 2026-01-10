import React, { useState, useEffect, useRef } from 'react';
import { Search, Edit, Trash2, X, Download, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { getAllStudentApi, getStudentByAssessmentApi, updateStudentApi, downloadStudentsByAssessmentApi } from '../API/student';
import { getAllAssessmentsApi } from '../API/assesment';

export function ManageStudents() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [lastFetchedAsmt, setLastFetchedAsmt] = useState(null);
    const [assessmentSearch, setAssessmentSearch] = useState('All Assessments');
    const [showAssessmentDropdown, setShowAssessmentDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const assessmentDropdownRef = useRef(null);
    const itemsPerPage = 10;

    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const response = await getAllAssessmentsApi();
            if (response.success) {
                setAssessments(response.assessments || []);
            }

            // Fetch All Students initially
            await fetchStudents();
        } catch (error) {
            console.error("Initial Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await getAllStudentApi();
            if (response.success) {
                mapAndSetStudents(response.students);
                setLastFetchedAsmt(null); // Reset asmt filter
            }
        } catch (error) {
            toast.error("Failed to fetch students");
        }
    };

    const mapAndSetStudents = (rawStudents) => {
        const mapped = rawStudents.map(s => ({
            id: s._id,
            name: s.name,
            phone: String(s.mobile),
            email: s.email,
            college: s.college,
            course: s.course,
            year: s.year,
            date: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'
        }));
        setStudents(mapped);
    };

    const handleSearchByAssessment = async () => {
        // Check for "All Assessments" case
        if (!selectedAssessment || assessmentSearch === 'All Assessments') {
            if (lastFetchedAsmt === null) {
                toast.info("Data already loaded for All Assessments");
                return;
            }
            setLoading(true);
            try {
                await fetchStudents();
                setLastFetchedAsmt(null);
                setAssessmentSearch('All Assessments');
                setSelectedAssessment(null);
                toast.success("Showing all students");
            } catch (error) {
                toast.error("Failed to fetch students");
            } finally {
                setLoading(false);
            }
            return;
        }

        // Check for specific assessment case
        if (selectedAssessment.assessmentCode === lastFetchedAsmt) {
            toast.info(`Data already loaded for ${selectedAssessment.assessmentName}`);
            return;
        }

        setLoading(true);
        try {
            const response = await getStudentByAssessmentApi(selectedAssessment.assessmentCode);
            if (response.success) {
                // The API returns 'student' array, not 'students'
                mapAndSetStudents(response.student || response.students || []);
                setLastFetchedAsmt(selectedAssessment.assessmentCode);
                toast.success(`Students for ${selectedAssessment.assessmentName} loaded`);
            } else {
                toast.error(response.message || "No students found for this assessment");
                setStudents([]);
            }
        } catch (error) {
            console.error("Filter Fetch Error:", error);
            toast.error("Failed to filter students");
        } finally {
            setLoading(false);
        }
    };

    const filteredAssessments = assessments.filter(assessment =>
        assessment.assessmentName?.toLowerCase().includes(assessmentSearch.toLowerCase()) ||
        assessment.assessmentCode?.toLowerCase().includes(assessmentSearch.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                assessmentDropdownRef.current &&
                !assessmentDropdownRef.current.contains(event.target)
            ) {
                setShowAssessmentDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredStudentsList = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone.includes(searchQuery) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredStudentsList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStudents = filteredStudentsList.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Edit Modal Logic
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const handleEditStudent = (student) => {
        setEditingStudent({ ...student });
        setIsEditModalOpen(true);
    };

    const handleSaveStudent = async () => {
        if (!editingStudent.name || !editingStudent.phone || !editingStudent.email || !editingStudent.college || !editingStudent.course || !editingStudent.year) {
            toast.error("All fields are required!");
            return;
        }

        try {
            const payload = {
                name: editingStudent.name,
                mobile: editingStudent.phone,
                email: editingStudent.email,
                college: editingStudent.college,
                course: editingStudent.course,
                year: editingStudent.year
                // Include other fields if necessary
            };

            const response = await updateStudentApi(editingStudent.id, payload);

            if (response.success) {
                setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
                setIsEditModalOpen(false);
                toast.success("Student updated successfully!");
            } else {
                toast.error(response.message || "Failed to update student");
            }
        } catch (error) {
            console.error("Update Error:", error);
            toast.error(error.response?.data?.message || "Failed to update student");
        }
    };

    const handleDeleteStudent = (student) => {
        Swal.fire({
            title: 'Delete Student?',
            text: `Are you sure you want to delete ${student.name}? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F56565',
            cancelButtonColor: '#319795',
            confirmButtonText: 'Yes, Delete!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setStudents(students.filter(s => s.id !== student.id));
                Swal.fire({
                    title: 'Deleted!',
                    text: `${student.name} has been deleted successfully.`,
                    icon: 'success',
                    confirmButtonColor: '#319795'
                });
            }
        });
    };

    const downloadExcel = async () => {
        setExportLoading(true);
        try {
            // If selectedAssessment is null, it downloads all students
            const code = selectedAssessment?.assessmentCode || null;
            await downloadStudentsByAssessmentApi(code);
            toast.success("Excel file downloaded!");
        } catch (error) {
            console.error("Export Error:", error);
            toast.error("Failed to download Excel file");
        } finally {
            setExportLoading(false);
        }
    };

    const downloadPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("Students Data Report", 14, 15);
            doc.setFontSize(10);
            const tableColumn = ["Sr No.", "Name", "Phone", "Email", "College", "Course", "Year", "Reg. Date"];
            const tableRows = filteredStudentsList.map((student, index) => [
                index + 1, student.name, student.phone, student.email, student.college, student.course, student.year, student.date
            ]);
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 35,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [49, 151, 149] }
            });
            doc.save(`students_data_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("PDF downloaded!");
        } catch (error) {
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#319795] font-semibold">Students</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#2D3748]">Manage Students</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-end">
                    {/* Assessment Dropdown */}
                    <div className="relative w-full sm:w-80">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Select Assessment</label>
                        <div className="flex gap-2">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    value={assessmentSearch}
                                    onChange={(e) => {
                                        setAssessmentSearch(e.target.value);
                                        setShowAssessmentDropdown(true);
                                    }}
                                    onFocus={() => setShowAssessmentDropdown(true)}
                                    placeholder="Search assessments..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#319795] transition-colors bg-zinc-100 text-sm"
                                />
                                {showAssessmentDropdown && (
                                    <div ref={assessmentDropdownRef} className="custom-scrollbar absolute z-20 w-full bg-white shadow-xl border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto">
                                        <div
                                            onClick={() => {
                                                setSelectedAssessment(null);
                                                setAssessmentSearch('All Assessments');
                                                setShowAssessmentDropdown(false);
                                            }}
                                            className="px-4 py-2.5 hover:bg-teal-50 hover:text-teal-700 cursor-pointer text-sm border-b font-medium text-gray-600"
                                        >
                                            All Assessments
                                        </div>
                                        {filteredAssessments.map((assessment) => (
                                            <div
                                                key={assessment._id || assessment.assessmentId}
                                                onClick={() => {
                                                    setSelectedAssessment(assessment);
                                                    setAssessmentSearch(assessment.assessmentName);
                                                    setShowAssessmentDropdown(false);
                                                }}
                                                className="px-4 py-2.5 hover:bg-teal-50 hover:text-teal-700 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0"
                                            >
                                                <div className="font-semibold">{assessment.assessmentName}</div>
                                                <div className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">{assessment.assessmentCode}</div>
                                            </div>
                                        ))}
                                        {filteredAssessments.length === 0 && (
                                            <div className="px-4 py-3 text-gray-400 text-sm italic">No assessments found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSearchByAssessment}
                                disabled={loading}
                                className="bg-[#319795] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-teal-700 transition-all active:scale-95 disabled:opacity-50"
                            >
                                Enter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Search Students</label>
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                            <Search className="h-4 w-4 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search students..."
                            className="bg-zinc-100 pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#319795]"
                        />
                    </div>

                    <div className="flex gap-2 mt-5">
                        <button
                            onClick={downloadExcel}
                            disabled={exportLoading}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {exportLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            Excel
                        </button>
                        <button onClick={downloadPDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"><Download className="h-4 w-4" /> PDF</button>
                    </div>

                    <div className="text-sm text-gray-500 whitespace-nowrap mt-5">
                        Total Students: <span className="font-semibold text-gray-700">{filteredStudentsList.length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E6FFFA] overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-[#319795] mb-4" />
                        <p className="text-gray-500 font-medium font-inter">Loading students data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-[#E6FFFA] text-[#2D3748] font-semibold border-b border-[#319795]">
                                <tr>
                                    <th className="px-6 py-4">Sr No.</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">College</th>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Year</th>
                                    <th className="px-6 py-4">Reg. Date</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E6FFFA]">
                                {currentStudents.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-[#4A5568]">{startIndex + index + 1}</td>
                                        <td className="px-6 py-4 font-bold text-[#2D3748]">{student.name}</td>
                                        <td className="px-6 py-4 text-[#4A5568]">{student.phone}</td>
                                        <td className="px-6 py-4 text-[#4A5568]">{student.email}</td>
                                        <td className="px-6 py-4 text-[#4A5568]"><span className="bg-green-50 text-green-600 py-1 px-2 rounded text-xs border border-green-100 font-medium">{student.college}</span></td>
                                        <td className="px-6 py-4 text-[#4A5568]"><span className="bg-blue-50 text-blue-600 py-1 px-2 rounded text-xs border border-blue-100 font-medium">{student.course}</span></td>
                                        <td className="px-6 py-4 text-[#4A5568]"><span className="bg-purple-50 text-purple-600 py-1 px-2 rounded text-xs border border-purple-100 font-medium">{student.year}</span></td>
                                        <td className="px-6 py-4 text-[#718096] text-xs">{student.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEditStudent(student)} className="text-[#319795] border border-[#319795] p-1.5 rounded-lg hover:bg-[#E6FFFA] transition-all active:scale-90"><Edit className="h-4 w-4" /></button>
                                                <button onClick={() => handleDeleteStudent(student)} className="text-[#F56565] border border-[#F56565] p-1.5 rounded-lg hover:bg-[#F56565]/10 transition-all active:scale-90"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-gray-500 italic">No students found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && (
                    <div className="px-6 py-4 border-t border-[#E6FFFA] flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                        <div className="font-medium">Showing {startIndex + 1} to {Math.min(endIndex, filteredStudentsList.length)} of {filteredStudentsList.length} entries</div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-1.5 rounded-lg border bg-white shadow-sm font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Prev</button>
                            <div className="flex gap-1.5">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button key={p} onClick={() => handlePageChange(p)} className={`w-9 h-9 rounded-lg font-bold transition-all ${currentPage === p ? 'bg-[#319795] text-white ring-2 bg-teal-400' : 'bg-white border text-gray-700 hover:bg-gray-100'}`}>{p}</button>
                                ))}
                            </div>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="px-4 py-1.5 rounded-lg border bg-white shadow-sm font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all animate-in zoom-in duration-200">
                        <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-4 flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2"><Edit className="h-5 w-5" /> Edit Student Details</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white"><X className="h-6 w-6" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label><input type="text" value={editingStudent?.name || ''} onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label><input type="text" value={editingStudent?.phone || ''} onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">College</label><input type="text" value={editingStudent?.college || ''} onChange={(e) => setEditingStudent({ ...editingStudent, college: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course</label><input type="text" value={editingStudent?.course || ''} onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label><input type="text" value={editingStudent?.year || ''} onChange={(e) => setEditingStudent({ ...editingStudent, year: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label><input type="email" value={editingStudent?.email || ''} onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-200">Cancel</button>
                            <button onClick={handleSaveStudent} className="px-6 py-2 rounded-lg text-sm font-bold bg-[#319795] text-white hover:bg-teal-700 shadow-lg shadow-teal-500/20 active:scale-95 transition-all">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}