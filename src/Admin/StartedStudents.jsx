import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Download } from 'lucide-react';
import { toast } from 'react-toastify';

export default function StartedStudents() {
    const { assessmentId } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock data for students who started but didn't submit
    const [startedStudents] = useState([
        { id: 1, name: "Rahul Kumar", phone: "9876543210", college: "IIT Delhi", course: "B.Tech CSE", year: "4th Year", dateTime: "2023-12-15 10:30:45" },
        { id: 2, name: "Priya Sharma", phone: "8765432109", college: "NIT Allahabad", course: "B.Tech IT", year: "3rd Year", dateTime: "2023-12-15 11:15:22" },
        { id: 3, name: "Amit Singh", phone: "7654321098", college: "AKTU", course: "MCA", year: "2nd Year", dateTime: "2023-12-15 09:45:18" },
        { id: 4, name: "Sneha Gupta", phone: "6543210987", college: "DU", course: "BCA", year: "1st Year", dateTime: "2023-12-15 12:20:33" },
        { id: 5, name: "Vikram Patel", phone: "5432109876", college: "GTU", course: "Diploma CS", year: "2nd Year", dateTime: "2023-12-15 08:55:41" },
        { id: 6, name: "Anita Roy", phone: "4321098765", college: "RGPV", course: "B.Tech ECE", year: "4th Year", dateTime: "2023-12-15 13:10:29" },
        { id: 7, name: "Deepak Joshi", phone: "3210987654", college: "MDU", course: "MBA", year: "1st Year", dateTime: "2023-12-15 14:25:17" },
        { id: 8, name: "Kavya Nair", phone: "2109876543", college: "CU", course: "B.Sc IT", year: "3rd Year", dateTime: "2023-12-15 15:40:52" },
        { id: 9, name: "Arjun Reddy", phone: "1098765432", college: "JNU", course: "M.Tech", year: "2nd Year", dateTime: "2023-12-15 16:05:38" },
        { id: 10, name: "Meera Iyer", phone: "0987654321", college: "KTU", course: "BCA", year: "2nd Year", dateTime: "2023-12-15 17:30:14" },
        { id: 11, name: "Rohit Sharma", phone: "9988776655", college: "JNTU", course: "B.Tech ME", year: "4th Year", dateTime: "2023-12-15 18:15:27" },
        { id: 12, name: "Pooja Agarwal", phone: "8877665544", college: "PTU", course: "MCA", year: "1st Year", dateTime: "2023-12-15 19:20:43" },
        { id: 13, name: "Suresh Yadav", phone: "7766554433", college: "RTU", course: "Diploma EE", year: "3rd Year", dateTime: "2023-12-15 20:35:19" },
        { id: 14, name: "Divya Sinha", phone: "6655443322", college: "VTU", course: "B.Tech CSE", year: "2nd Year", dateTime: "2023-12-15 21:50:06" },
        { id: 15, name: "Karan Malhotra", phone: "5544332211", college: "GGSIPU", course: "MBA", year: "2nd Year", dateTime: "2023-12-15 22:15:58" }
    ]);

    const filteredStudents = startedStudents.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone.includes(searchQuery) ||
        student.college.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const downloadExcel = () => {
        const headers = ["Sr No.", "Name", "Phone", "College", "Course", "Year", "Date-Time"];
        
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
            htmlTable += `<td style="padding: 8px;">${student.college}</td>`;
            htmlTable += `<td style="padding: 8px;">${student.course}</td>`;
            htmlTable += `<td style="padding: 8px;">${student.year}</td>`;
            htmlTable += `<td style="padding: 8px;">${student.dateTime}</td>`;
            htmlTable += '</tr>';
        });
        
        htmlTable += '</table>';
        
        const blob = new Blob([htmlTable], { 
            type: 'application/vnd.ms-excel;charset=utf-8;' 
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `started_students_${new Date().toISOString().split('T')[0]}.xls`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Excel file downloaded successfully!");
    };

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            {/* Header */}
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#319795] font-semibold">Assessment</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#2D3748]">Started Students</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-700">Students Who Started But Didn't Submit</h2>
                
                <div className="flex items-center gap-4">
                    <button
                        onClick={downloadExcel}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#319795] transition-colors"
                        />
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
                                    <td className="px-6 py-4 font-medium text-[#2D3748]">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        {student.phone}
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
                                        {student.dateTime}
                                    </td>
                                </tr>
                            ))}

                            {currentStudents.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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
        </div>
    );
}