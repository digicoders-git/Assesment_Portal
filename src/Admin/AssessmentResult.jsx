import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useState } from 'react';
import { Download, Search, ChevronLeft, Printer, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AssessmentResult() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ... (keep existing results data) ... 
    // Mock Data based on screenshot
    const results = [
        { id: 1, name: "Aditya Kashyap", phone: "Diploma [CS/IT/PGDCA]", course: "Passout", year: "7651949201", college: "G.P.Unnao", marks: "11/20", time: "13-12-2025 08:37:16pm" },
        { id: 2, name: "Masoom abbas", phone: "B. Tech [CSE/IT/Electronics]", course: "Passout", year: "9695097811", college: "Rrimt", marks: "9/10", time: "13-12-2025 05:57:46pm" },
        { id: 3, name: "Abc", phone: "Diploma [Electronics]", course: "1st Year", year: "9988776655", college: "Abc College", marks: "7/20", time: "15-12-2025 06:45:26pm" },
        { id: 4, name: "Sumesh Gupta", phone: "B. Tech [ME/EE/CE]", course: "4th Year", year: "9198483820", college: "DigiCoders", marks: "7/20", time: "13-12-2025 08:35:18pm" },
        { id: 5, name: "Gopal Singh", phone: "BCA", course: "4th Year", year: "6394296293", college: "DigiCoders", marks: "7/20", time: "13-12-2025 08:33:09pm" },
        { id: 6, name: "Abc", phone: "Diploma [Electronics]", course: "1st Year", year: "9988776655", college: "Govt Polytechnic Lucknow", marks: "6/20", time: "15-12-2025 07:09:29pm" },
        { id: 7, name: "e", phone: "Diploma [Electronics]", course: "1st Year", year: "9198483820", college: "w", marks: "6/10", time: "13-12-2025 05:16:12pm" },
        { id: 8, name: "Ved", phone: "Diploma [Other]", course: "1st Year", year: "6307275065", college: "MJP", marks: "6/20", time: "13-12-2025 08:36:38pm" },
        { id: 9, name: "Pushkal Singh", phone: "Other Course", course: "Passout", year: "9918863106", college: "DIGICODERS", marks: "6/20", time: "13-12-2025 08:32:13pm" },
        { id: 10, name: "Ashi Awasthi", phone: "Diploma [Electronics]", course: "3rd Year", year: "8707099463", college: "Government polytechnic unnao", marks: "6/10", time: "13-12-2025 06:12:23pm" },
        // Adding more dummy data to demonstrate pagination
        { id: 11, name: "Student 11", phone: "BCA", course: "1st Year", year: "1234567890", college: "Univ A", marks: "5/20", time: "13-12-2025 09:00:00pm" },
        { id: 12, name: "Student 12", phone: "MCA", course: "2nd Year", year: "0987654321", college: "Univ B", marks: "15/20", time: "13-12-2025 09:15:00pm" },
    ];

    // Filter Logic
    const filteredResults = results.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.college.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredResults.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const downloadStudentResult = (student) => {
        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.setTextColor(20, 184, 166); // Teal-500
            doc.text("Assessment Result", 105, 20, { align: 'center' });

            doc.setDrawColor(20, 184, 166);
            doc.line(20, 25, 190, 25);

            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 190, 32, { align: 'right' });

            // Student Info Table
            const data = [
                ["Student ID", student.id.toString()],
                ["Student Name", student.name],
                ["Phone/Branch", student.phone],
                ["Course Status", student.course],
                ["Mobile Number", student.year],
                ["College/Institute", student.college],
                ["Obtained Marks", student.marks],
                ["Submission Date", student.time]
            ];

            autoTable(doc, {
                startY: 40,
                head: [["Field", "Information"]],
                body: data,
                theme: 'striped',
                headStyles: { fillColor: [20, 184, 166], textColor: 255 }, // teal
                styles: { fontSize: 11, cellPadding: 5 },
                columnStyles: {
                    0: { fontStyle: 'bold', width: 60 },
                    1: { cellWidth: 'auto' }
                }
            });

            const fileName = `${student.name.replace(/\s+/g, '_')}_result.pdf`;
            doc.save(fileName);
            toast.success("Student PDF Downloaded successfully!");
        } catch (error) {
            console.error("Single PDF Error:", error);
            toast.error("Failed to generate PDF");
        }
    };

    const handleDownloadPDF = () => {
        try {
            const doc = new jsPDF();

            doc.setFontSize(16);
            doc.text("Assessment Results", 14, 15);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

            const tableColumn = ["ID", "Student Name", "Phone/Branch", "Course", "Phone No.", "College", "Marks", "Date Time"];
            const tableRows = [];

            filteredResults.forEach(item => {
                const rowData = [
                    item.id,
                    item.name,
                    item.phone,
                    item.course,
                    item.year,
                    item.college,
                    item.marks,
                    item.time
                ];
                tableRows.push(rowData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 25,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [79, 70, 229] } // indigo-600
            });

            doc.save("Assessment_Result.pdf");
            toast.success("PDF Downloaded successfully!");
        } catch (error) {
            console.error("PDF Download Error:", error);
            toast.error(`PDF Error: ${error.message || "Failed to generate PDF"}`);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const downloadExcel = () => {
        // Simple CSV generation
        const headers = ["ID", "Student Name", "Phone/Branch", "Course", "Phone No.", "College", "Marks", "Date Time"];
        const rows = filteredResults.map(item => [
            item.id,
            `"${item.name}"`, // Quote strings to handle commas
            `"${item.phone}"`,
            `"${item.course}"`,
            `"${item.year}"`,
            `"${item.college}"`,
            `"${item.marks}"`,
            `"${item.time}"`
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "assessment_result.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { margin: 1cm; size: landscape; }
                    body * {
                        visibility: hidden;
                    }
                    .print-content, .print-content * {
                        visibility: visible;
                    }
                    .print-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Header / Breadcrumb */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-teal-600 font-semibold cursor-pointer" onClick={() => navigate('/admin/dashboard')}>Admin</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-teal-600 font-semibold cursor-pointer" onClick={() => navigate(-1)}>Manage Result</span>
                    <span className="text-gray-400">/</span>
                    <div className="text-gray-600">ResultListExport</div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 print-content">
                {/* Card Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-700 uppercase">All Result</h2>
                </div>

                {/* Toolbar */}
                <div className="p-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 no-print">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={downloadExcel}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded border border-transparent transition-colors text-sm font-medium shadow-sm"
                        >
                            <Download className="h-4 w-4" />
                            Download Excel
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded border border-transparent transition-colors text-sm font-medium shadow-sm"
                        >
                            <FileText className="h-4 w-4" />
                            Download PDF
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded border border-transparent transition-colors text-sm font-medium shadow-sm"
                        >
                            <Printer className="h-4 w-4" />
                            Print
                        </button>
                    </div>

                    <div className="relative w-full sm:w-auto flex items-center gap-2">
                        <span className="text-sm text-gray-600">Search:</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="border border-gray-300 rounded px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:border-teal-500 transition-colors text-sm"
                        />
                    </div>
                </div>

                {/* Scrollable Table Container */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200">
                            <tr>
                                <th className="px-4 py-3 w-12 text-center">#</th>
                                <th className="px-4 py-3 min-w-[200px]">Student Name</th>
                                <th className="px-4 py-3 min-w-[250px]">Phone/Branch</th>
                                <th className="px-4 py-3">Course</th>
                                <th className="px-4 py-3">Phone No.</th>
                                <th className="px-4 py-3 min-w-[200px]">College</th>
                                <th className="px-4 py-3 text-center">Marks</th>
                                <th className="px-4 py-3 min-w-[180px]">Date Time</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentData.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center text-gray-500">{startIndex + index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.phone}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.course}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.year}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.college}</td>
                                    <td className="px-4 py-3 text-center text-gray-700 font-medium">{item.marks}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{item.time}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => downloadStudentResult(item)}
                                            className="text-teal-600 hover:text-teal-800 p-1.5 hover:bg-teal-50 rounded-full transition-colors"
                                            title="Download Result"
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredResults.length)} of {filteredResults.length} entries</div>
                    <div className="flex gap-1 items-center">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded transition-colors ${currentPage === page ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
