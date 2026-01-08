import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { getStudentByAssessmentApi } from '../API/student';

export default function StartedStudents() {
    // Route parameter is :id, but we need code passed via state
    const { id: assessmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(true);
    const [startedStudents, setStartedStudents] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const code = location.state?.assessmentCode;
            if (!code) {
                toast.error("Assessment Code missing. Please navigate from Assessment page.");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Using getStudentByAssessmentApi instead of result API
                const response = await getStudentByAssessmentApi(code);

                if (response.success) {
                    // Response key is 'student' which is an array
                    const studentsList = response.student || [];

                    const mappedData = studentsList.map(stu => ({
                        id: stu._id,
                        name: stu.name || "N/A",
                        phone: stu.mobile || "N/A",
                        college: stu.college || "N/A",
                        course: stu.course || "N/A",
                        year: stu.year || "N/A",
                        // Marks not available in this API
                        dateTime: stu.createdAt ? new Date(stu.createdAt).toLocaleString() : "N/A"
                    }));

                    setStartedStudents(mappedData);
                }
            } catch (error) {
                console.error("Failed to fetch started students:", error);
                toast.error("Failed to load students data");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [assessmentId, location.state]);

    const filteredStudents = startedStudents.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(student.phone).includes(searchQuery) ||
        student.college.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const downloadExcel = () => {
        const headers = ["Sr No.", "Name", "Phone", "College", "Course", "Year", "Date-Time"];
        let htmlTable = '<table border="1"><tr>' + headers.map(h => `<th style="background-color: #E6FFFA; padding: 8px;">${h}</th>`).join('') + '</tr>';

        filteredStudents.forEach((student, index) => {
            htmlTable += `<tr>
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.phone}</td>
                <td>${student.college}</td>
                <td>${student.course}</td>
                <td>${student.year}</td>
                <td>${student.dateTime}</td>
            </tr>`;
        });

        htmlTable += '</table>';
        const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `assessment_results.xls`;
        link.click();
        toast.success("Excel downloaded!");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EDF2F7] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#319795] mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Fetching student results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Assessment Takers</h2>
                    <p className="text-sm text-gray-500">Showing first attempt submissions for each student</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={downloadExcel}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border-none"
                    >
                        <Download className="h-4 w-4" />
                        Download Excel
                    </button>

                    <div className="relative w-full sm:w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search students..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#319795]"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E6FFFA] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-[#E6FFFA] text-[#2D3748] font-bold border-b border-[#319795]">
                            <tr>
                                <th className="px-6 py-4">Sr No.</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">College</th>
                                <th className="px-6 py-4">Course</th>
                                <th className="px-6 py-4">Year</th>
                                <th className="px-6 py-4">Date-Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6FFFA]">
                            {currentStudents.map((student, index) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#2D3748]">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        {student.phone}
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        <span className="bg-green-50 text-green-700 py-1 px-3 rounded text-xs border border-green-100 font-medium whitespace-normal inline-block max-w-[200px]">
                                            {student.college}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-wide">
                                            {student.course}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        <span className="bg-purple-50 text-purple-700 py-1 px-3 rounded-full text-xs font-bold border border-purple-100 uppercase tracking-wide">
                                            {student.year}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#718096] text-xs">
                                        {student.dateTime}
                                    </td>
                                </tr>
                            ))}
                            {currentStudents.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500 italic">
                                        No students found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-[#E6FFFA] flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                    <div className="font-medium">Showing {Math.min(startIndex + 1, filteredStudents.length)} to {Math.min(startIndex + currentStudents.length, filteredStudents.length)} of {filteredStudents.length} entries</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Prev
                        </button>
                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-8 h-8 rounded font-bold transition-all ${currentPage === page ? 'bg-[#319795] text-white shadow-sm' : 'bg-white border hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}