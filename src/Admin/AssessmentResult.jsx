import React, { useState, useEffect, useRef } from 'react';
import { Download, Search, FileText, FileSpreadsheet, ChevronDown, ArrowLeft, Eye, Loader2, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getResultsByAssessmentIdApi, downloadResultsByAssessmentIdApi } from '../API/result';

const handleExportData = async () => {
    if (!id) return;
    setExportLoading(true);
    try {
        await downloadResultsByAssessmentIdApi(id, {
            college: filters.college,
            course: filters.course,
            year: filters.year,
            search: searchQuery
        });
        toast.success("Excel results downloaded!");
    } catch (error) {
        console.error("Export Error:", error);
        toast.error(error.message || "Failed to export results");
    } finally {
        setExportLoading(false);
    }
};
import { getSingleStudentApi } from '../API/student';

export default function AssessmentResult() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [exportLoading, setExportLoading] = useState(false);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(true);
    const [firstSubmissions, setFirstSubmissions] = useState([]);
    const [secondSubmissions, setSecondSubmissions] = useState([]);
    const [activeTab, setActiveTab] = useState('first');
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
        limit: 10
    });
    const [filters, setFilters] = useState({
        college: '',
        course: '',
        year: ''
    });
    const [isInitialLoad, setIsInitialLoad] = useState(true);


    const fetchResults = async (page = 1) => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await getResultsByAssessmentIdApi(id, {
                page,
                limit: itemsPerPage,
                search: searchQuery,
                college: filters.college,
                course: filters.course,
                year: filters.year
            });

            if (response.success) {
                const formatData = (list, submissionType) => list.map(res => ({
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
                    rank: res.rank || "N/A", // Use actual rank from backend
                    submission: submissionType
                }));

                // No sorting needed - backend already provides ranked data
                setFirstSubmissions(formatData(response.firstSubmission || [], 1));
                setSecondSubmissions(formatData(response.reattempt || [], 2));

                // Set pagination for frontend based on current tab
                const firstTotal = response.firstSubmission?.length || 0;
                const secondTotal = response.reattempt?.length || 0;
                
                setPagination({
                    total: activeTab === 'first' ? firstTotal : secondTotal,
                    totalPages: Math.ceil((activeTab === 'first' ? firstTotal : secondTotal) / itemsPerPage),
                    limit: itemsPerPage,
                    page: 1
                });
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Failed to fetch assessment results:", error);
            toast.error("Failed to load results");
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };

    useEffect(() => {
        fetchResults(1);
    }, [id]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        setCurrentPage(1);
        fetchResults(1);
    };

    const resetFilters = () => {
        setFilters({ college: '', course: '', year: '' });
        setSearchQuery('');
        setCurrentPage(1);
        fetchResults(1);
    };

    const handleViewStudent = (student) => {
        navigate(`/admin/assessment/details/${student.studentId}`);
    };

    // Get current data based on active tab
    const getCurrentData = () => {
        return activeTab === 'first' ? firstSubmissions : secondSubmissions;
    };

    // Get paginated data for current tab
    const getPaginatedData = () => {
        const currentData = getCurrentData();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return currentData.slice(startIndex, endIndex);
    };

    // Update pagination when tab changes
    useEffect(() => {
        if (!isInitialLoad) {
            const currentData = getCurrentData();
            setPagination({
                total: currentData.length,
                totalPages: Math.ceil(currentData.length / itemsPerPage),
                limit: itemsPerPage,
                page: 1 // Reset to page 1 when switching tabs
            });
            setCurrentPage(1);
        }
    }, [activeTab, firstSubmissions, secondSubmissions]);

    const handlePageChange = (page) => {
        const totalPages = Math.ceil(getCurrentData().length / itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const downloadStudentResult = async (studentItem) => {
        if (!studentItem.studentId) {
            toast.error("Invalid Student ID");
            return;
        }

        try {
            const response = await getSingleStudentApi(studentItem.studentId);

            if (response.success && response.student && response.student.certificate) {
                const certUrl = response.student.certificate;

                // Fetch the image to force download
                const imageResponse = await fetch(certUrl);
                if (!imageResponse.ok) {
                    throw new Error("Failed to fetch certificate image");
                }

                const blob = await imageResponse.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // Extract extension or default to jpg
                const ext = certUrl.split('.').pop().split('?')[0] || 'jpg';
                a.download = `Certificate_${studentItem.name.replace(/\s+/g, '_')}.${ext}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                toast.success("Certificate downloaded successfully!");
            } else {
                toast.error("Certificate not generated for this student");
            }
        } catch (error) {
            console.error("Certificate Download Error:", error);
            toast.error("Failed to download certificate. It might not be available.");
        }
    };

    const handleExportData = async () => {
        if (!id) return;
        setExportLoading(true);
        try {
            await downloadResultsByAssessmentIdApi(id, {
                college: filters.college,
                course: filters.course,
                year: filters.year,
                search: searchQuery
            });
            toast.success("Excel results downloaded successfully!");
        } catch (error) {
            console.error("Export Error:", error);
            toast.error("Failed to export results");
        } finally {
            setExportLoading(false);
        }
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 print-content flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-200px)]">
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-700 uppercase">Assessment Submissions</h2>
                </div>

                <div className="p-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 no-print border-b border-gray-200 flex-shrink-0">
                    {/* Left: Export Action */}
                    <div className="w-full xl:w-auto order-2 xl:order-1">
                        <button
                            onClick={handleExportData}
                            disabled={exportLoading}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg border border-transparent transition-colors text-sm font-bold shadow-sm w-full sm:w-auto justify-center disabled:opacity-50 h-[42px]"
                        >
                            {exportLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            Export Excel
                        </button>
                    </div>

                    {/* Right: Filters & Search */}
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto order-1 xl:order-2">
                        {/* Compact Backend Filters */}
                        <div className="flex items-center bg-zinc-50 border border-gray-300 rounded-xl p-1 gap-0.5 sm:gap-1 shadow-sm w-full md:w-auto overflow-hidden">
                            <input
                                type="text"
                                name="college"
                                value={filters.college}
                                onChange={handleFilterChange}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="College"
                                className="flex-1 min-w-0 md:w-32 bg-transparent border-none px-2 py-1.5 text-[11px] sm:text-xs font-semibold focus:ring-0 outline-none text-gray-700 placeholder:text-gray-400"
                            />
                            <div className="h-4 w-[1px] bg-gray-300 shrink-0"></div>
                            <input
                                type="text"
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Year"
                                className="w-[45px] sm:w-[65px] bg-transparent border-none px-1 py-1.5 text-[11px] sm:text-xs font-semibold focus:ring-0 outline-none text-gray-700 placeholder:text-gray-400"
                            />
                            <div className="h-4 w-[1px] bg-gray-300 shrink-0"></div>
                            <input
                                type="text"
                                name="course"
                                value={filters.course}
                                onChange={handleFilterChange}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Course"
                                className="w-[55px] sm:w-[90px] bg-transparent border-none px-1 py-1.5 text-[11px] sm:text-xs font-semibold focus:ring-0 outline-none text-gray-700 placeholder:text-gray-400"
                            />
                            <div className="h-6 w-[1px] bg-gray-200 mx-0.5 sm:mx-1 shrink-0"></div>
                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={applyFilters}
                                    className="bg-teal-600 text-white p-1.5 sm:p-2 rounded-lg hover:bg-teal-700 transition-all active:scale-95 shadow-sm shrink-0"
                                    title="Apply Filters"
                                >
                                    <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="text-gray-400 hover:text-red-500 p-1.5 sm:p-2 rounded-lg hover:bg-white transition-all active:scale-95 shrink-0"
                                    title="Reset Filters"
                                >
                                    <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="relative w-full md:w-64">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                className="pl-10 pr-4 py-2 border bg-zinc-50 border-gray-300 rounded-xl w-full focus:outline-none focus:border-teal-500 transition-colors text-xs sm:text-sm font-medium h-[40px] sm:h-[42px] shadow-sm"
                                placeholder="Name or Mobile"
                            />
                        </div>
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

                <div className="flex-1">
                    {getCurrentData().length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {activeTab === 'first' ? 'No First Submissions' : 'No Re-Attempts'}
                                </h3>
                                <p className="text-gray-500 font-inter">
                                    {searchQuery || filters.college || filters.course || filters.year ? 'No matching records found for your filters.' :
                                        activeTab === 'first' ? 'No students have submitted this assessment yet.' :
                                            'No students have re-attempted this assessment.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[1200px]">
                                <thead className="bg-[#f8fafc] text-gray-700 font-bold border-b-2 border-gray-200 font-inter">
                                    <tr>
                                        <th className="px-4 py-3 text-center min-w-[50px] text-xs uppercase tracking-wider">Sr.</th>
                                        {activeTab === 'first' && <th className="px-4 py-3 text-center min-w-[70px] text-xs uppercase tracking-wider">Rank</th>}
                                        <th className="px-4 py-3 min-w-[150px] text-xs uppercase tracking-wider">Student Name</th>
                                        <th className="px-4 py-3 text-center min-w-[60px] text-xs uppercase tracking-wider">View</th>
                                        <th className="px-4 py-3 min-w-[120px] text-xs uppercase tracking-wider">Ref Code</th>
                                        <th className="px-4 py-3 min-w-[140px] text-xs uppercase tracking-wider">Course</th>
                                        <th className="px-4 py-3 text-center min-w-[120px] text-xs uppercase tracking-wider">Year</th>
                                        <th className="px-4 py-3 min-w-[120px] text-xs uppercase tracking-wider">Phone</th>
                                        <th className="px-4 py-3 min-w-[180px] text-xs uppercase tracking-wider">College</th>
                                        <th className="px-4 py-3 text-center min-w-[90px] text-xs uppercase tracking-wider">Score</th>
                                        <th className="px-4 py-3 text-center min-w-[100px] text-xs uppercase tracking-wider">Duration</th>
                                        <th className="px-4 py-3 min-w-[150px] text-xs uppercase tracking-wider">Date/Time</th>
                                        <th className="px-4 py-3 text-center min-w-[70px] text-xs uppercase tracking-wider">Print</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {getPaginatedData().map((item, index) => (
                                        <tr key={`${item.id}-${item.submission}`} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-4 py-3 text-center text-gray-500 font-medium">{((currentPage - 1) * pagination.limit) + index + 1}</td>
                                            {activeTab === 'first' && (
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${item.rank === 1 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' :
                                                        item.rank === 2 ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-200' :
                                                            item.rank === 3 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-200' :
                                                                'bg-green-50 text-green-700'
                                                        }`}>
                                                        {item.rank}
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
                                            <td className="px-4 py-3 text-center">
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
                    <div className="font-semibold font-inter">Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} entries</div>
                    <div className="flex gap-2 items-center">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-4 py-1.5 rounded-lg border bg-white shadow-sm text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Prev
                        </button>

                        <div className="flex gap-1.5 items-center">
                            <span className="px-3 py-1.5 bg-teal-500 text-white rounded-lg font-bold text-sm">
                                {currentPage} of {pagination.totalPages}
                            </span>
                        </div>

                        <button
                            disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
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