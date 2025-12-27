import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useState, useEffect, useRef } from 'react';
import { Download, Search,  FileText, FileSpreadsheet, ChevronDown, ArrowLeft, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AssessmentResult() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportMenuRef = useRef(null);
    const itemsPerPage = 10;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Mock Data - Separate first and second submissions with additional fields
    const firstSubmissions = [
        { id: 1, name: "Aditya Kashyap", phone: "Diploma [CS/IT/PGDCA]", course: "Passout", year: "7651949201", college: "G.P.Unnao", marks: "11/20", time: "13-12-2025 08:37:16pm", submission: 1, duration: "25 min 30 sec", refNo: "DCT-2025-001" },
        { id: 2, name: "Masoom abbas", phone: "B. Tech [CSE/IT/Electronics]", course: "Passout", year: "9695097811", college: "Rrimt", marks: "9/10", time: "13-12-2025 05:57:46pm", submission: 1, duration: "18 min 45 sec", refNo: "DCT-2025-002" },
        { id: 3, name: "Abc", phone: "Diploma [Electronics]", course: "1st Year", year: "9988776655", college: "Abc College", marks: "7/20", time: "15-12-2025 06:45:26pm", submission: 1, duration: "30 min 12 sec", refNo: "DCT-2025-003" },
        { id: 4, name: "Sumesh Gupta", phone: "B. Tech [ME/EE/CE]", course: "4th Year", year: "9198483820", college: "DigiCoders", marks: "7/20", time: "13-12-2025 08:35:18pm", submission: 1, duration: "22 min 58 sec", refNo: "DCT-2025-004" },
        { id: 5, name: "Gopal Singh", phone: "BCA", course: "4th Year", year: "6394296293", college: "DigiCoders", marks: "7/20", time: "13-12-2025 08:33:09pm", submission: 1, duration: "28 min 20 sec", refNo: "DCT-2025-005" },
        { id: 6, name: "Ved", phone: "Diploma [Other]", course: "1st Year", year: "6307275065", college: "MJP", marks: "6/20", time: "13-12-2025 08:36:38pm", submission: 1, duration: "20 min 15 sec", refNo: "DCT-2025-006" },
        { id: 7, name: "Pushkal Singh", phone: "Other Course", course: "Passout", year: "9918863106", college: "DIGICODERS", marks: "6/20", time: "13-12-2025 08:32:13pm", submission: 1, duration: "15 min 40 sec", refNo: "DCT-2025-007" },
        { id: 8, name: "Ashi Awasthi", phone: "Diploma [Electronics]", course: "3rd Year", year: "8707099463", college: "Government polytechnic unnao", marks: "6/10", time: "13-12-2025 06:12:23pm", submission: 1, duration: "12 min 25 sec", refNo: "DCT-2025-008" },
    ];

    const secondSubmissions = [
        { id: 2, name: "Masoom abbas", phone: "B. Tech [CSE/IT/Electronics]", course: "Passout", year: "9695097811", college: "Rrimt", marks: "15/20", time: "14-12-2025 10:30:22pm", submission: 2, duration: "27 min 35 sec", refNo: "DCT-2025-002" },
        { id: 3, name: "Abc", phone: "Diploma [Electronics]", course: "1st Year", year: "9988776655", college: "Abc College", marks: "12/20", time: "16-12-2025 07:09:29pm", submission: 2, duration: "24 min 50 sec", refNo: "DCT-2025-003" },
        { id: 5, name: "Gopal Singh", phone: "BCA", course: "4th Year", year: "6394296293", college: "DigiCoders", marks: "14/20", time: "14-12-2025 09:15:45pm", submission: 2, duration: "26 min 18 sec", refNo: "DCT-2025-005" },
        { id: 8, name: "Ashi Awasthi", phone: "Diploma [Electronics]", course: "3rd Year", year: "8707099463", college: "Government polytechnic unnao", marks: "8/10", time: "14-12-2025 07:45:12pm", submission: 2, duration: "16 min 42 sec", refNo: "DCT-2025-008" },
    ];

    const [activeTab, setActiveTab] = useState('first');

    const handleViewStudent = (student) => {
        navigate(`/admin/assessment/details/${student.id}`);
    };

    // Get current data based on active tab
    const getCurrentData = () => {
        return activeTab === 'first' ? firstSubmissions : secondSubmissions;
    };

    // Filter Logic
    const filteredResults = getCurrentData().filter(item =>
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
            doc.setFontSize(20);
            doc.setTextColor(20, 184, 166);
            doc.text("Assessment Result", 105, 20, { align: 'center' });
            doc.setDrawColor(20, 184, 166);
            doc.line(20, 25, 190, 25);
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 190, 32, { align: 'right' });

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
                headStyles: { fillColor: [20, 184, 166], textColor: 255 },
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

            const tableColumn = ["ID", "Student Name", "Course", "Year", "Phone No.", "College", "Marks", "Date Time"];
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
                headStyles: { fillColor: [79, 70, 229] }
            });

            doc.save("Assessment_Result.pdf");
            toast.success("PDF Downloaded successfully!");
        } catch (error) {
            console.error("PDF Download Error:", error);
            toast.error(`PDF Error: ${error.message || "Failed to generate PDF"}`);
        }
    };

    const downloadCSV = () => {
        const headers = ["ID", "Student Name", "Course", "Year", "Phone No.", "College", "Marks", "Date Time"];
        const rows = filteredResults.map(item => [
            item.id,
            `"${item.name}"`,
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
        link.setAttribute("download", `assessment_results_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV file downloaded successfully!");
        setShowExportMenu(false);
    };

    const downloadExcel = () => {
        const headers = ["S.No", "Student Name", "Branch/Course Type", "Course Status", "Mobile Number", "College/Institute", "Obtained Marks", "Submission Date & Time"];
        const rows = filteredResults.map((item, index) => [
            index + 1,
            `"${item.name}"`,
            `"${item.phone}"`,
            `"${item.course}"`,
            `"${item.year}"`,
            `"${item.college}"`,
            `"${item.marks}"`,
            `"${item.time}"`
        ]);

        const csvContent = [
            `"Assessment Results Report - Generated on ${new Date().toLocaleString()}",,,,,,,`,
            `"Total Records: ${filteredResults.length}",,,,,,,`,
            "",
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `assessment_results_detailed_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Excel file downloaded successfully!");
        setShowExportMenu(false);
    };

    const downloadJSON = () => {
        const jsonData = {
            exportDate: new Date().toISOString(),
            totalRecords: filteredResults.length,
            searchQuery: searchQuery || "All Records",
            results: filteredResults.map((item, index) => ({
                serialNumber: index + 1,
                studentId: item.id,
                studentName: item.name,
                branchCourse: item.phone,
                courseStatus: item.course,
                mobileNumber: item.year,
                college: item.college,
                obtainedMarks: item.marks,
                submissionDateTime: item.time
            }))
        };

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `assessment_results_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("JSON file downloaded successfully!");
        setShowExportMenu(false);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-teal-600 font-semibold cursor-pointer" onClick={() => navigate('/admin/dashboard')}>Admin</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-teal-600 font-semibold cursor-pointer" onClick={() => navigate(-1)}>Manage Result</span>
                    <span className="text-gray-400">/</span>
                    <div className="text-gray-600">ResultListExport</div>
                </div>
            </div>

            <div className="overflow-y-scroll bg-white rounded-lg shadow-sm border border-gray-200 print-content flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-200px)]">
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-700 uppercase">All Result</h2>
                </div>

                <div className="p-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 no-print border-b border-gray-200 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                        <div className="relative" ref={exportMenuRef}>
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded border border-transparent transition-colors text-sm font-medium shadow-sm w-full sm:w-auto justify-center"
                            >
                                <Download className="h-4 w-4" />
                                Export Data
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            
                            {showExportMenu && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                                    <button
                                        onClick={downloadExcel}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 border-b border-gray-100"
                                    >
                                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                        Excel Format
                                    </button>
                                    <button
                                        onClick={downloadCSV}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 border-b border-gray-100"
                                    >
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        CSV Format
                                    </button>
                                    <button
                                        onClick={downloadJSON}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 rounded-b-lg"
                                    >
                                        <FileText className="h-4 w-4 text-purple-600" />
                                        JSON Format
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded border border-transparent transition-colors text-sm font-medium shadow-sm w-full sm:w-auto justify-center"
                        >
                            <FileText className="h-4 w-4" />
                            Download PDF
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

                <div className="px-4 pt-4 flex-shrink-0">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        <button
                            onClick={() => {
                                setActiveTab('first');
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors rounded whitespace-nowrap ${
                                activeTab === 'first'
                                    ? 'border-teal-500 text-white bg-teal-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            First Submission ({firstSubmissions.length})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('second');
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors rounded whitespace-nowrap ${
                                activeTab === 'second'
                                    ? 'border-teal-500 text-teal-600 bg-orange-300 text-white'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Duplicate Submission ({secondSubmissions.length})
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden min-h-[400px]">
                    {filteredResults.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {activeTab === 'first' ? 'No First Submissions' : 'No Second Submissions'}
                                </h3>
                                <p className="text-gray-500">
                                    {searchQuery ? 'No results found for your search.' : 
                                     activeTab === 'first' ? 'No students have submitted their first attempt yet.' :
                                     'No students have made a second submission yet.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full overflow-x-auto overflow-y-auto">
                            <table className="w-full text-sm text-left min-w-[1200px]">
                                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-2 py-2 text-center min-w-[40px] text-xs">#</th>
                                        {activeTab === 'first' && <th className="px-2 py-2 text-center min-w-[60px] text-xs">Rank</th>}
                                        <th className="px-2 py-2 min-w-[120px] text-xs">Name</th>
                                        <th className="px-2 py-2 text-center min-w-[50px] text-xs">View</th>
                                        <th className="px-2 py-2 min-w-[100px] text-xs">Ref No.</th>
                                        <th className="px-2 py-2 min-w-[150px] text-xs">Course</th>
                                        <th className="px-2 py-2 min-w-[70px] text-xs">Year</th>
                                        <th className="px-2 py-2 min-w-[100px] text-xs">Phone</th>
                                        <th className="px-2 py-2 min-w-[120px] text-xs">College</th>
                                        <th className="px-2 py-2 text-center min-w-[70px] text-xs">Marks</th>
                                        <th className="px-2 py-2 text-center min-w-[80px] text-xs">Duration</th>
                                        <th className="px-2 py-2 min-w-[120px] text-xs">Date</th>
                                        <th className="px-2 py-2 text-center min-w-[60px] text-xs">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentData.map((item, index) => (
                                        <tr key={`${item.id}-${item.submission}`} className="hover:bg-gray-50">
                                            <td className="px-2 py-2 text-center text-gray-500 text-xs">{startIndex + index + 1}</td>
                                            {activeTab === 'first' && (
                                                <td className="px-2 py-2 text-center">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-200 text-yellow-800 rounded-full text-xs font-bold">
                                                        {startIndex + index + 1}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="px-2 py-2 font-medium text-gray-800">
                                                <div className="truncate max-w-[110px] text-xs" title={item.name}>
                                                    {item.name}
                                                </div>
                                                {activeTab === 'second' && (
                                                    <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                                                        Re-Attempt
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-2 py-2 text-center">
                                                <button
                                                    onClick={() => handleViewStudent(item)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-full transition-colors"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                            </td>
                                            <td className="px-2 py-2 text-gray-600 font-mono text-xs">
                                                <div className="truncate max-w-[90px]" title={item.refNo}>{item.refNo}</div>
                                            </td>
                                            <td className="px-2 py-2 text-gray-600 text-xs">
                                                <div className="truncate max-w-[140px]" title={item.phone}>{item.phone}</div>
                                            </td>
                                            <td className="px-2 py-2 text-gray-600 text-xs">
                                                <div className="truncate max-w-[60px]" title={item.course}>{item.course}</div>
                                            </td>
                                            <td className="px-2 py-2 text-gray-600 text-xs">
                                                <div className="truncate max-w-[90px]" title={item.year}>{item.year}</div>
                                            </td>
                                            <td className="px-2 py-2 text-gray-600 text-xs">
                                                <div className="truncate max-w-[110px]" title={item.college}>{item.college}</div>
                                            </td>
                                            <td className="px-2 py-2 text-center text-gray-700 font-medium text-xs">{item.marks}</td>
                                            <td className="px-2 py-2 text-center text-gray-600 text-xs">
                                                <div className="truncate max-w-[70px]" title={item.duration}>{item.duration}</div>
                                            </td>
                                            <td className="px-2 py-2 text-gray-500 text-xs">
                                                <div className="truncate max-w-[110px]" title={item.time}>{item.time}</div>
                                            </td>
                                            <td className="px-2 py-2 text-center">
                                                <button
                                                    onClick={() => downloadStudentResult(item)}
                                                    className="text-teal-600 hover:text-teal-800 p-1 hover:bg-teal-50 rounded-full transition-colors"
                                                >
                                                    <Download className="h-3 w-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
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