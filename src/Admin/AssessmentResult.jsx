import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useState, useEffect, useRef } from 'react';
import { Download, Search, FileText, FileSpreadsheet, ChevronDown, ArrowLeft, Eye, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getResultsByAssessmentIdApi } from '../API/result';

export default function AssessmentResult() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportMenuRef = useRef(null);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(true);
    const [firstSubmissions, setFirstSubmissions] = useState([]);
    const [secondSubmissions, setSecondSubmissions] = useState([]);
    const [activeTab, setActiveTab] = useState('first');

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

    useEffect(() => {
        const fetchResults = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await getResultsByAssessmentIdApi(id);
                if (response.success) {
                    const formatData = (list) => list.map(res => ({
                        id: res._id,
                        studentId: res.student?._id,
                        name: res.student?.name || "N/A",
                        phone: res.student?.mobile || "N/A",
                        course: res.student?.course || "N/A",
                        year: res.student?.year || "N/A",
                        college: res.student?.college || "N/A",
                        marks: `${res.marks || 0}/${res.total || 0}`,
                        time: res.createdAt ? new Date(res.createdAt).toLocaleString() : "N/A",
                        duration: res.duration || "N/A",
                        refNo: res.student?.code || "N/A",
                        rank: res.rank || "N/A",
                        submission: activeTab === 'first' ? 1 : 2
                    }));

                    const getSortedData = (list) => {
                        const formatted = formatData(list);
                        return formatted.sort((a, b) => {
                            const rankA = parseInt(a.rank) || 999999;
                            const rankB = parseInt(b.rank) || 999999;
                            return rankA - rankB;
                        });
                    };

                    setFirstSubmissions(getSortedData(response.firstSubmission || []));
                    setSecondSubmissions(getSortedData(response.reattempt || []));
                }
            } catch (error) {
                console.error("Failed to fetch assessment results:", error);
                toast.error("Failed to load results");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [id]);

    const handleViewStudent = (student) => {
        navigate(`/admin/assessment/details/${student.studentId}`);
    };

    // Get current data based on active tab
    const getCurrentData = () => {
        return activeTab === 'first' ? firstSubmissions : secondSubmissions;
    };

    // Filter Logic
    const filteredResults = getCurrentData().filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.phone).includes(searchQuery) ||
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
                ["Phone", student.phone],
                ["Course", student.course],
                ["Year", student.year],
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
                    item.course,
                    item.year,
                    item.phone,
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
            `"${item.course}"`,
            `"${item.year}"`,
            `"${item.phone}"`,
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
        const headers = ["S.No", "Student Name", "Course", "Year", "Phone Number", "College/Institute", "Obtained Marks", "Submission Date & Time"];
        const rows = filteredResults.map((item, index) => [
            index + 1,
            `"${item.name}"`,
            `"${item.course}"`,
            `"${item.year}"`,
            `"${item.phone}"`,
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
                course: item.course,
                year: item.year,
                mobileNumber: item.phone,
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium font-inter">Loading assessment results...</p>
                </div>
            </div>
        );
    }

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
                    <div className="text-gray-600">Result Tracking</div>
                </div>
            </div>

            <div className="overflow-y-scroll bg-white rounded-lg shadow-sm border border-gray-200 print-content flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-200px)]">
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-700 uppercase">Assessment Submissions</h2>
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
                            Batch PDF
                        </button>
                    </div>

                    <div className="relative w-full sm:w-auto flex items-center gap-2">
                        <span className="text-sm text-gray-600">Search:</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="border bg-zinc-50 border-gray-300 rounded px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:border-teal-500 transition-colors text-sm"
                            placeholder="Name, Phone, or College"
                        />
                    </div>
                </div>

                <div className="px-4 pt-4 flex-shrink-0">
                    <div className="flex border-b border-gray-200 overflow-x-auto gap-2">
                        <button
                            onClick={() => {
                                setActiveTab('first');
                                setCurrentPage(1);
                            }}
                            className={`px-6 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all rounded-t-lg whitespace-nowrap ${activeTab === 'first'
                                ? 'border-teal-500 text-white bg-teal-500 shadow-md'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            First Submission ({firstSubmissions.length})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('second');
                                setCurrentPage(1);
                            }}
                            className={`px-6 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all rounded-t-lg whitespace-nowrap ${activeTab === 'second'
                                ? 'border-orange-500 text-white bg-orange-500 shadow-md'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Re-Attempt ({secondSubmissions.length})
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden min-h-[400px]">
                    {filteredResults.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {activeTab === 'first' ? 'No First Submissions' : 'No Re-Attempts'}
                                </h3>
                                <p className="text-gray-500 font-inter">
                                    {searchQuery ? 'No matching records found for your search.' :
                                        activeTab === 'first' ? 'No students have submitted this assessment yet.' :
                                            'No students have re-attempted this assessment.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full overflow-x-scroll overflow-y-hidden">
                            <table className="w-full text-sm text-left min-w-[1200px]">
                                <thead className="bg-[#f8fafc] text-gray-700 font-bold border-b-2 border-gray-200 sticky top-0 z-10 font-inter">
                                    <tr>
                                        <th className="px-4 py-3 text-center min-w-[50px] text-xs uppercase tracking-wider">Sr.</th>
                                        {activeTab === 'first' && <th className="px-4 py-3 text-center min-w-[70px] text-xs uppercase tracking-wider">Rank</th>}
                                        <th className="px-4 py-3 min-w-[150px] text-xs uppercase tracking-wider">Student Name</th>
                                        <th className="px-4 py-3 text-center min-w-[60px] text-xs uppercase tracking-wider">View</th>
                                        <th className="px-4 py-3 min-w-[120px] text-xs uppercase tracking-wider">Ref Code</th>
                                        <th className="px-4 py-3 min-w-[140px] text-xs uppercase tracking-wider">Course</th>
                                        <th className="px-4 py-3 min-w-[90px] text-xs uppercase tracking-wider">Year</th>
                                        <th className="px-4 py-3 min-w-[120px] text-xs uppercase tracking-wider">Phone</th>
                                        <th className="px-4 py-3 min-w-[180px] text-xs uppercase tracking-wider">College</th>
                                        <th className="px-4 py-3 text-center min-w-[90px] text-xs uppercase tracking-wider">Score</th>
                                        <th className="px-4 py-3 text-center min-w-[100px] text-xs uppercase tracking-wider">Duration</th>
                                        <th className="px-4 py-3 min-w-[150px] text-xs uppercase tracking-wider">Date/Time</th>
                                        <th className="px-4 py-3 text-center min-w-[70px] text-xs uppercase tracking-wider">Print</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentData.map((item, index) => (
                                        <tr key={`${item.id}-${item.submission}`} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-4 py-3 text-center text-gray-500 font-medium">{startIndex + index + 1}</td>
                                            {activeTab === 'first' && (
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' :
                                                        index === 1 ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-200' :
                                                            index === 2 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-200' :
                                                                'bg-green-50 text-green-700'
                                                        }`}>
                                                        {item.rank || startIndex + index + 1}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="px-4 py-3">
                                                <div className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                                                    {item.name}
                                                </div>
                                                {activeTab === 'second' && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 uppercase mt-1">
                                                        Re-Attempt
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleViewStudent(item)}
                                                    className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-100 rounded-lg transition-all active:scale-90"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 font-mono text-xs font-semibold">
                                                {item.refNo}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-bold border border-blue-100 uppercase">
                                                    {item.course}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded text-xs font-bold border border-purple-100">
                                                    {item.year}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 font-medium">
                                                {item.phone}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="truncate max-w-[200px] text-gray-600 font-medium" title={item.college}>
                                                    {item.college}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="bg-orange-50 text-orange-700 font-extrabold px-3 py-1 rounded-lg text-sm border border-orange-200 shadow-sm">
                                                    {item.marks}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600 font-bold text-xs uppercase">
                                                {item.duration}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 font-medium text-xs">
                                                {item.time}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => downloadStudentResult(item)}
                                                    className="text-teal-600 hover:text-teal-800 p-1.5 hover:bg-teal-100 rounded-lg transition-all active:scale-90"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
                    <div className="font-semibold font-inter">Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredResults.length)} of {filteredResults.length} entries</div>
                    <div className="flex gap-2 items-center">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-4 py-1.5 rounded-lg border bg-white shadow-sm text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Prev
                        </button>

                        <div className="flex gap-1.5 items-center">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-9 h-9 rounded-lg font-bold transition-all shadow-sm ${currentPage === page ? 'bg-teal-500 text-white ring-2 ring-teal-200' : 'bg-white border text-gray-700 hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-4 py-1.5 rounded-lg border bg-white shadow-sm text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}