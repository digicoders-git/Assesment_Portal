import React, { useState, useEffect, useRef } from 'react';
import { Search, Edit, Trash2, X, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';



export function ManageStudents() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAssessment, setSelectedAssessment] = useState('');
    const [assessmentSearch, setAssessmentSearch] = useState('');
    const [showAssessmentDropdown, setShowAssessmentDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const assessmentDropdownRef = useRef(null);

    const itemsPerPage = 10;

    // Get assessments from localStorage
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('all_assessments');
        if (saved) {
            setAssessments(JSON.parse(saved));
        }
    }, []);

    const filteredAssessments = assessments.filter(assessment =>
        assessment.name.toLowerCase().includes(assessmentSearch.toLowerCase())
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


    const [students, setStudents] = useState([
        { id: 1, name: "Aditya Kashyap", phone: "9876543210", email: "aditya@example.com", college: "IIT Delhi", course: "B.Tech CSE", year: "4th Year", date: "2023-12-12" },
        { id: 2, name: "Masoom Abbas", phone: "7890123456", email: "masoom@example.com", college: "NIT Allahabad", course: "B.Tech IT", year: "3rd Year", date: "2023-12-10" },
        { id: 3, name: "Rahul Singh", phone: "8901234567", email: "rahul@example.com", college: "AKTU", course: "MCA", year: "2nd Year", date: "2023-11-25" },
        { id: 4, name: "Priya Sharma", phone: "9012345678", email: "priya@example.com", college: "DU", course: "BCA", year: "1st Year", date: "2023-12-01" },
        { id: 5, name: "Amit Patel", phone: "6789012345", email: "amit@example.com", college: "GTU", course: "Diploma CS", year: "2nd Year", date: "2023-12-05" },
        { id: 6, name: "Sneha Gupta", phone: "9123456780", email: "sneha@example.com", college: "RGPV", course: "B.Tech ECE", year: "4th Year", date: "2023-11-28" },
        { id: 7, name: "Vikram Kumar", phone: "8234567891", email: "vikram@example.com", college: "MDU", course: "MBA", year: "1st Year", date: "2023-12-03" },
        { id: 8, name: "Anita Roy", phone: "7345678902", email: "anita@example.com", college: "CU", course: "B.Sc IT", year: "3rd Year", date: "2023-11-30" },
        { id: 9, name: "Rajesh Verma", phone: "6456789013", email: "rajesh@example.com", college: "JNU", course: "M.Tech", year: "2nd Year", date: "2023-12-07" },
        { id: 10, name: "Kavya Nair", phone: "9567890124", email: "kavya@example.com", college: "KTU", course: "BCA", year: "2nd Year", date: "2023-11-22" },
        { id: 11, name: "Arjun Reddy", phone: "8678901235", email: "arjun@example.com", college: "JNTU", course: "B.Tech ME", year: "4th Year", date: "2023-12-09" },
        { id: 12, name: "Deepika Joshi", phone: "7789012346", email: "deepika@example.com", college: "PTU", course: "MCA", year: "1st Year", date: "2023-11-26" },
        { id: 13, name: "Suresh Yadav", phone: "6890123457", email: "suresh@example.com", college: "RTU", course: "Diploma EE", year: "3rd Year", date: "2023-12-04" },
        { id: 14, name: "Meera Iyer", phone: "9901234568", email: "meera@example.com", college: "VTU", course: "B.Tech CSE", year: "2nd Year", date: "2023-11-29" },
        { id: 15, name: "Karan Malhotra", phone: "8012345679", email: "karan@example.com", college: "GGSIPU", course: "MBA", year: "2nd Year", date: "2023-12-06" },
        { id: 16, name: "Pooja Agarwal", phone: "7123456780", email: "pooja@example.com", college: "BHU", course: "B.Sc CS", year: "1st Year", date: "2023-11-24" },
        { id: 17, name: "Rohit Sharma", phone: "6234567891", email: "rohit@example.com", college: "UPTU", course: "B.Tech IT", year: "3rd Year", date: "2023-12-08" },
        { id: 18, name: "Sanya Kapoor", phone: "9345678902", email: "sanya@example.com", college: "IGNOU", course: "BCA", year: "2nd Year", date: "2023-11-27" },
        { id: 19, name: "Nikhil Jain", phone: "8456789013", email: "nikhil@example.com", college: "BITS", course: "M.Tech CSE", year: "1st Year", date: "2023-12-02" },
        { id: 20, name: "Ritu Singh", phone: "7567890124", email: "ritu@example.com", college: "MNNIT", course: "Diploma CS", year: "1st Year", date: "2023-11-23" },
        { id: 21, name: "Abhishek Tiwari", phone: "6678901235", email: "abhishek@example.com", college: "IIT BHU", course: "B.Tech ECE", year: "4th Year", date: "2023-12-11" },
        { id: 22, name: "Nisha Pandey", phone: "9789012346", email: "nisha@example.com", college: "IIIT", course: "MCA", year: "2nd Year", date: "2023-11-21" },
        { id: 23, name: "Gaurav Mishra", phone: "8890123457", email: "gaurav@example.com", college: "XLRI", course: "MBA", year: "1st Year", date: "2023-12-13" },
        { id: 24, name: "Swati Dubey", phone: "7901234568", email: "swati@example.com", college: "KIIT", course: "B.Sc IT", year: "3rd Year", date: "2023-11-20" },
        { id: 25, name: "Manish Gupta", phone: "6012345679", email: "manish@example.com", college: "SRM", course: "B.Tech ME", year: "2nd Year", date: "2023-12-14" },
        { id: 26, name: "Priyanka Das", phone: "9123456789", email: "priyanka@example.com", college: "Amity", course: "BCA", year: "1st Year", date: "2023-11-19" },
        { id: 27, name: "Sachin Rao", phone: "8234567890", email: "sachin@example.com", college: "LPU", course: "Diploma EE", year: "3rd Year", date: "2023-12-15" },
        { id: 28, name: "Divya Sinha", phone: "7345678901", email: "divya@example.com", college: "Manipal", course: "B.Tech CSE", year: "4th Year", date: "2023-11-18" },
        { id: 29, name: "Harsh Agrawal", phone: "6456789012", email: "harsh@example.com", college: "VIT", course: "M.Tech", year: "1st Year", date: "2023-12-16" },
        { id: 30, name: "Shruti Bhatt", phone: "9567890123", email: "shruti@example.com", college: "NMIMS", course: "MBA", year: "2nd Year", date: "2023-11-17" },
        { id: 31, name: "Varun Chopra", phone: "8678901234", email: "varun@example.com", college: "Symbiosis", course: "B.Sc CS", year: "1st Year", date: "2023-12-17" },
        { id: 32, name: "Tanvi Mehta", phone: "7789012345", email: "tanvi@example.com", college: "Christ", course: "BCA", year: "3rd Year", date: "2023-11-16" },
        { id: 33, name: "Akash Bansal", phone: "6890123456", email: "akash@example.com", college: "Thapar", course: "B.Tech IT", year: "2nd Year", date: "2023-12-18" },
        { id: 34, name: "Neha Saxena", phone: "9901234567", email: "neha@example.com", college: "JIIT", course: "Diploma CS", year: "1st Year", date: "2023-11-15" },
        { id: 35, name: "Siddharth Jha", phone: "8012345678", email: "siddharth@example.com", college: "IIIT Delhi", course: "M.Tech CSE", year: "2nd Year", date: "2023-12-19" },
        { id: 36, name: "Aarti Kulkarni", phone: "7123456789", email: "aarti@example.com", college: "COEP", course: "B.Tech ECE", year: "4th Year", date: "2023-11-14" },
        { id: 37, name: "Vishal Thakur", phone: "6234567890", email: "vishal@example.com", college: "IIM", course: "MBA", year: "1st Year", date: "2023-12-20" },
        { id: 38, name: "Ritika Sharma", phone: "9345678901", email: "ritika@example.com", college: "PESIT", course: "B.Sc IT", year: "2nd Year", date: "2023-11-13" },
        { id: 39, name: "Mohit Arora", phone: "8456789012", email: "mohit@example.com", college: "LNMIIT", course: "BCA", year: "3rd Year", date: "2023-12-21" },
        { id: 40, name: "Ishita Goyal", phone: "7567890123", email: "ishita@example.com", college: "NSIT", course: "B.Tech ME", year: "1st Year", date: "2023-11-12" }
    ]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone.includes(searchQuery) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const toggleStatus = (id) => {
        // Function removed as status column is no longer needed
    };

    // Edit Modal Logic
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const handleEditStudent = (student) => {
        setEditingStudent({ ...student });
        setIsEditModalOpen(true);
    };

    const handleSaveStudent = () => {
        if (!editingStudent.name || !editingStudent.phone || !editingStudent.email || !editingStudent.college || !editingStudent.course || !editingStudent.year) {
            toast.error("All fields are required!");
            return;
        }
        setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
        setIsEditModalOpen(false);
        toast.success("Student updated successfully!");
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

    const downloadStudentPDF = (student) => {
        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.setTextColor(49, 151, 149); // Teal color
            doc.text("Student Information", 105, 20, { align: 'center' });

            doc.setDrawColor(49, 151, 149);
            doc.line(20, 25, 190, 25);

            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 190, 32, { align: 'right' });

            // Student Info Table
            const data = [
                ["Student ID", student.id.toString()],
                ["Full Name", student.name],
                ["Phone Number", student.phone],
                ["Email Address", student.email],
                ["College", student.college],
                ["Course", student.course],
                ["Year", student.year],
                ["Registration Date", student.date]
            ];

            autoTable(doc, {
                startY: 40,
                head: [["Field", "Information"]],
                body: data,
                theme: 'striped',
                headStyles: { fillColor: [49, 151, 149], textColor: 255 },
                styles: { fontSize: 11, cellPadding: 5 },
                columnStyles: {
                    0: { fontStyle: 'bold', width: 60 },
                    1: { cellWidth: 'auto' }
                }
            });

            const fileName = `${student.name.replace(/\s+/g, '_')}_info.pdf`;
            doc.save(fileName);
            toast.success("Student PDF downloaded successfully!");
        } catch (error) {
            console.error("PDF Error:", error);
            toast.error("Failed to generate PDF");
        }
    };

    const downloadExcel = () => {
        // Create HTML table for Excel
        const headers = ["Sr No.", "Name", "Phone", "Email", "College", "Course", "Year", "Registration Date"];

        let htmlTable = '<table border="1">';

        // Add headers
        htmlTable += '<tr>';
        headers.forEach(header => {
            htmlTable += `<th style="background-color: #E6FFFA; padding: 8px; font-weight: bold;">${header}</th>`;
        });
        htmlTable += '</tr>';

        // Add data rows
        filteredStudents.forEach((student, index) => {
            htmlTable += '<tr>';
            htmlTable += `<td style="padding: 8px;">${index + 1}</td>`;
            htmlTable += `<td style="padding: 8px;">${student.name}</td>`;
            htmlTable += `<td style="padding: 8px;">${student.phone}</td>`;
            htmlTable += `<td style="padding: 8px;">${student.email}</td>`;
            htmlTable += `<td style="padding: 8px;">${student.college}</td>`;
            htmlTable += `<td style="padding: 8px;">${student.course}</td>`;
            htmlTable += `<td style="padding: 8px;">${student.year}</td>`;
            htmlTable += `<td style="padding: 8px;">${student.date}</td>`;
            htmlTable += '</tr>';
        });

        htmlTable += '</table>';

        // Create blob with Excel MIME type
        const blob = new Blob([htmlTable], {
            type: 'application/vnd.ms-excel;charset=utf-8;'
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `students_data_${new Date().toISOString().split('T')[0]}.xls`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Excel file downloaded successfully!");
    };



    const downloadPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("Students Data Report", 14, 15);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
            doc.text(`Total Records: ${filteredStudents.length}`, 14, 28);

            const tableColumn = ["Sr No.", "Name", "Phone", "Email", "College", "Course", "Year", "Reg. Date"];
            const tableRows = [];

            filteredStudents.forEach((student, index) => {
                const rowData = [
                    index + 1,
                    student.name,
                    student.phone,
                    student.email,
                    student.college,
                    student.course,
                    student.year,
                    student.date
                ];
                tableRows.push(rowData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 35,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [49, 151, 149] }
            });

            doc.save(`students_data_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("PDF downloaded successfully!");
        } catch (error) {
            console.error("PDF Download Error:", error);
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#319795] font-semibold">Students</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#2D3748]">Manage Students</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {/* Assessment Dropdown */}
                    <div className="relative w-full sm:w-64">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Select Assessment</label>
                        <input
                            type="text"
                            value={assessmentSearch}
                            onChange={(e) => {
                                setAssessmentSearch(e.target.value);
                                setShowAssessmentDropdown(true);
                            }}
                            onFocus={() => setShowAssessmentDropdown(true)}
                            placeholder="Search assessments..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#319795] transition-colors bg-zinc-100"
                        />
                        {showAssessmentDropdown && (
                            <div ref={assessmentDropdownRef} className="custom-scrollbar absolute z-10 w-full bg-zinc-200 border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto text-zinc-600">
                                <div
                                    onClick={() => {
                                        setSelectedAssessment('');
                                        setAssessmentSearch('All Assessments');
                                        setShowAssessmentDropdown(false);
                                    }}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                                >
                                    All Assessments
                                </div>
                                {filteredAssessments.map((assessment) => (
                                    <div
                                        key={assessment.id}
                                        onClick={() => {
                                            setSelectedAssessment(assessment.id);
                                            setAssessmentSearch(assessment.name);
                                            setShowAssessmentDropdown(false);
                                        }}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        {assessment.name}
                                    </div>
                                ))}
                                {filteredAssessments.length === 0 && (
                                    <div className="px-3 py-2 text-gray-500 text-sm">No assessments found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                    {/* Search Input */}
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
                            className="bg-zinc-100 pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#319795] transition-colors"
                        />
                    </div>

                    {/* Export Buttons */}
                    <div className="flex gap-2 mt-5">
                        <button
                            onClick={downloadExcel}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Excel
                        </button>
                        <button
                            onClick={downloadPDF}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            PDF
                        </button>
                    </div>

                    {/* Total Count */}
                    <div className="text-sm text-gray-500 whitespace-nowrap mt-5">
                        Total Students: <span className="font-semibold text-gray-700">{filteredStudents.length}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-[#E6FFFA] overflow-hidden">
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
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6FFFA]">
                            {currentStudents.map((student, index) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#2D3748]">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        {student.phone}
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        {student.email}
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        <span className="bg-green-50 text-green-600 py-1 px-2 rounded text-xs border border-green-100">
                                            {student.college}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        <span className="bg-blue-50 text-blue-600 py-1 px-2 rounded text-xs border border-blue-100">
                                            {student.course}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        <span className="bg-purple-50 text-purple-600 py-1 px-2 rounded text-xs border border-purple-100">
                                            {student.year}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        {student.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {/* <button
                                                onClick={() => downloadStudentPDF(student)}
                                                className="text-[#319795] border border-[#319795] p-1.5 rounded hover:bg-[#E6FFFA]"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button> */}

                                            <button
                                                onClick={() => handleEditStudent(student)}
                                                className="text-[#319795] border border-[#319795] p-1.5 rounded hover:bg-[#E6FFFA]"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>

                                            <button 
                                                onClick={() => handleDeleteStudent(student)}
                                                className="text-[#F56565] border border-[#F56565] p-1.5 rounded hover:bg-[#F56565]/20"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {currentStudents.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-[#E6FFFA] flex justify-between items-center text-sm text-gray-600">
                    <div>Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} entries</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded transition-colors ${currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded transition-colors ${currentPage === page
                                    ? 'bg-[#319795] text-white'
                                    : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded transition-colors ${currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            {/* Edit Student Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl transform scale-100 transition-all">
                        <div className="bg-[#319795] text-white px-6 py-4 flex justify-between items-center bg-gradient-to-r from-teal-600 to-teal-500">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                Edit Student Details
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editingStudent?.name || ''}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-300"
                                    placeholder="Enter student name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={editingStudent?.phone || ''}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-300"
                                        placeholder="Enter phone"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">College</label>
                                    <input
                                        type="text"
                                        value={editingStudent?.college || ''}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, college: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-300"
                                        placeholder="Enter college"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course</label>
                                    <input
                                        type="text"
                                        value={editingStudent?.course || ''}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-300"
                                        placeholder="Enter course"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label>
                                    <input
                                        type="text"
                                        value={editingStudent?.year || ''}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, year: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-300"
                                        placeholder="Enter year"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={editingStudent?.email || ''}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-300"
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveStudent}
                                className="px-6 py-2 rounded-lg text-sm font-medium bg-[#319795] text-white hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all transform active:scale-95"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}