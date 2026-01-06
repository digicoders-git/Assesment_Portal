import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Save, Search, CheckCircle2, Circle, BookOpen, Download, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { getAllTopicsApi } from '../API/topic';
import { getQuestionsByTopicApi } from '../API/question';
import { addQuestionsToAssessmentApi, getAssessmentQuestionsApi, deleteQuestionFromAssessmentApi } from '../API/assesmentQuestions';

export default function AssignQuestions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
    const [assignedQuestions, setAssignedQuestions] = useState([]);
    const [assignedSearchQuery, setAssignedSearchQuery] = useState('');
    const topicDropdownRef = useRef(null);

    const [topics, setTopics] = useState([]);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(false);
    const [junctionId, setJunctionId] = useState(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                topicDropdownRef.current &&
                !topicDropdownRef.current.contains(event.target)
            ) {
                setIsTopicDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        fetchTopics();
        fetchAssignedQuestions();
    }, [id]);

    const fetchTopics = async () => {
        try {
            const response = await getAllTopicsApi();
            if (response.success) {
                setTopics(response.topics || []);
            }
        } catch (error) {
            console.error("Failed to fetch topics:", error);
        }
    };

    const fetchAssignedQuestions = async () => {
        try {
            if (!id) return;
            const response = await getAssessmentQuestionsApi(id);


            if (response && response.success) {
                let list = [];
                let jId = null;

                // 1. Logic to extract the junction document ID and the questions array
                // Case A: The junction doc itself is in response.questions
                if (response.questions && typeof response.questions === 'object' && !Array.isArray(response.questions)) {
                    jId = response.questions._id || response.questions.id;
                    list = response.questions.questionIds || response.questions.questions || [];
                }
                // Case B: response.questions is a direct array (as per your sample)
                else if (Array.isArray(response.questions)) {
                    list = response.questions;
                    // Try to find the junction ID in common places
                    jId = response.assesmentQuestionId || response._id || response.id || (response.data ? response.data._id : null);
                }
                // Case C: Data is in response.data
                else if (response.data) {
                    jId = response.data._id || response._id || null;
                    list = response.data.questionIds || response.data.questions || (Array.isArray(response.data) ? response.data : []);
                }



                setJunctionId(jId);
                setAssignedQuestions(Array.isArray(list) ? list : []);
            }
        } catch (error) {
            console.error("Error in fetchAssignedQuestions:", error);
            if (error.response?.status === 404) {
                setAssignedQuestions([]);
                setJunctionId(null);
            }
        }
    };

    const fetchQuestionsByTopic = async (topicId) => {
        setLoading(true);
        try {
            const response = await getQuestionsByTopicApi(topicId);
            if (response.success) {
                setAvailableQuestions(response.questions || []);
            }
        } catch (error) {
            toast.error("Failed to fetch questions for this topic");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTopic) {
            fetchQuestionsByTopic(selectedTopic);
        } else {
            setAvailableQuestions([]);
        }
    }, [selectedTopic]);



    const toggleQuestion = (qId) => {
        setSelectedQuestions(prev =>
            prev.includes(qId)
                ? prev.filter(q_id => q_id !== qId)
                : [...prev, qId]
        );
    };

    const handleSelectAll = () => {
        const availableIds = finalAvailableQuestions.map(q => q._id);
        const allSelected = availableIds.every(q_id => selectedQuestions.includes(q_id));

        if (allSelected) {
            // Deselect all from current topic
            setSelectedQuestions(prev => prev.filter(q_id => !availableIds.includes(q_id)));
        } else {
            // Select all from current topic
            setSelectedQuestions(prev => [...new Set([...prev, ...availableIds])]);
        }
    };

    const handleRemoveQuestion = (questionId) => {
        Swal.fire({
            title: 'Remove Question?',
            text: 'Are you sure you want to remove this question from the assessment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F56565',
            cancelButtonColor: '#319795',
            confirmButtonText: 'Yes, Remove!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!junctionId) {
                    toast.error("Internal Error: Junction record not found.");
                    return;
                }
                try {
                    const response = await deleteQuestionFromAssessmentApi(junctionId, questionId);
                    if (response.success) {
                        toast.success("Question removed successfully!");
                        fetchAssignedQuestions();
                    } else {
                        toast.error(response.message || "Failed to remove question");
                    }
                } catch (error) {
                    toast.error(error.response?.data?.message || "Failed to remove question");
                }
            }
        });
    };

    const handleSave = async () => {
        if (selectedQuestions.length === 0) {
            toast.error("Please select at least one question!");
            return;
        }

        const payload = {
            questionIds: selectedQuestions
        };

        try {
            const response = await addQuestionsToAssessmentApi(id, payload);
            if (response.success) {
                toast.success(`${selectedQuestions.length} Questions successfully added!`);
                setSelectedQuestions([]);
                fetchAssignedQuestions();
            } else {
                toast.error(response.message || "Failed to assign questions");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to assign questions");
        }
    };

    // Correctly count assigned questions by topic
    const getTopicAssignedCount = (topicId) => {
        if (!assignedQuestions) return 0;
        return assignedQuestions.filter(q => {
            const qTopicId = q.topic && typeof q.topic === 'object' ? q.topic._id : q.topic;
            return String(qTopicId) === String(topicId);
        }).length;
    };



    // Filter assigned questions based on search
    const filteredAssignedQuestions = (assignedQuestions || []).filter(q => {
        if (!q || typeof q !== 'object') return false;

        const qText = String(q.question || '').toLowerCase();
        const searchInput = String(assignedSearchQuery || '').toLowerCase();
        const correctOpt = String(q.correctOption || '').toLowerCase();

        let tName = '';
        if (q.topic && typeof q.topic === 'object') {
            tName = q.topic.topicName || '';
        } else if (q.topic) {
            const topicId = String(q.topic);
            const topicObj = topics.find(t => String(t._id) === topicId);
            tName = topicObj ? topicObj.topicName : '';
        }

        return qText.includes(searchInput) ||
            tName.toLowerCase().includes(searchInput) ||
            correctOpt.includes(searchInput);
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredAssignedQuestions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedQuestions = filteredAssignedQuestions.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Filter out already assigned questions from current questions
    const assignedQuestionIds = assignedQuestions.map(q => typeof q === 'object' ? q._id : q);
    const finalAvailableQuestions = availableQuestions.filter(q => !assignedQuestionIds.includes(q._id));

    const handleExportPDF = () => {
        if (assignedQuestions.length === 0) {
            toast.error("No questions assigned to export!");
            return;
        }
        navigate(`/admin/print-assigned-questions/${id}`);
    };

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            {/* Back Button */}
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mb-4">
                    <span className="text-[#319795] font-semibold">Assessment</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-gray-700 font-bold">Assign Questions</span>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#319795] p-3 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Pick Questions</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected</p>
                            <p className="text-lg font-black text-[#319795]">{selectedQuestions.length} Items</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {assignedQuestions.length > 0 && (
                                <button
                                    onClick={handleExportPDF}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Export PDF
                                </button>
                            )}
                            <button
                                onClick={handleSave}
                                className="bg-[#319795] hover:bg-[#2B7A73] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                Assign Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={topicDropdownRef} className="flex flex-col md:flex-row gap-4 items-center mb-6">
                <div className="relative w-full md:w-72">
                    <button
                        onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold text-gray-700 flex items-center justify-between hover:border-[#319795] transition-all"
                    >
                        <span className="flex items-center gap-2">
                            {selectedTopic ? topics.find(t => t._id === selectedTopic)?.topicName : 'Select Topic'}
                        </span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${isTopicDropdownOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {isTopicDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg overflow-hidden z-[50]">
                            {topics.map(topic => (
                                <button
                                    key={topic._id}
                                    onClick={() => {
                                        setSelectedTopic(topic._id);
                                        setIsTopicDropdownOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-sm text-left hover:bg-teal-50 flex items-center justify-between border-b border-gray-50 last:border-0"
                                >
                                    <span className={`font-bold ${selectedTopic === topic._id ? 'text-[#319795]' : 'text-gray-600'}`}>{topic.topicName}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                                            {getTopicAssignedCount(topic._id)} Assigned
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {!selectedTopic ? (
                    <div className="flex items-center justify-center flex-col h-2 bg-white rounded-xl p-20 text-center border-2 border-dashed border-gray-200">
                        <h3 className="text-lg font-bold text-gray-700">Select a Topic</h3>
                        <p className="text-gray-500 text-sm mt-1">Please choose a topic from the dropdown to see questions.</p>
                    </div>
                ) : loading ? (
                    <div className="p-10 text-center text-gray-400 font-bold">Loading questions...</div>
                ) : finalAvailableQuestions.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 font-bold">No questions available in this topic.</div>
                ) : (
                    <>
                        {/* Select All Button */}
                        <div className="mb-4">
                            <button
                                onClick={handleSelectAll}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                            >
                                {finalAvailableQuestions.every(q => selectedQuestions.includes(q._id)) ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        {finalAvailableQuestions.map((q) => (
                            <div
                                key={q._id}
                                onClick={() => toggleQuestion(q._id)}
                                className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedQuestions.includes(q._id)
                                    ? 'border-[#319795] bg-teal-50'
                                    : 'border-white bg-white hover:border-gray-100'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${selectedQuestions.includes(q._id) ? 'bg-[#319795] text-white' : 'bg-gray-100 text-gray-300'
                                        }`}>
                                        {selectedQuestions.includes(q._id) ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                    </div>
                                    <span className={`text-sm font-bold ${selectedQuestions.includes(q._id) ? 'text-[#2C7A7B]' : 'text-gray-600'}`}>
                                        {q.question}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {assignedQuestions.length >= 0 && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Already Assigned Questions ({assignedQuestions.length})</h3>
                        {assignedQuestions.length > 0 && (
                            <div className="relative w-64">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={assignedSearchQuery}
                                    onChange={(e) => setAssignedSearchQuery(e.target.value)}
                                    placeholder="Search assigned questions..."
                                    className="bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#319795] transition-colors"
                                />
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {assignedQuestions.length === 0 ? (
                            <div className="p-20 text-center border-2 border-dashed border-gray-100 m-4 rounded-xl">
                                <Search className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-gray-500 font-bold">No questions assigned yet</h3>
                                <p className="text-gray-400 text-sm mt-1">Select questions from a topic above to assign them to this assessment.</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left whitespace-nowrap border-collapse">
                                        <thead className="bg-gray-50 text-gray-700 font-semibold">
                                            <tr>
                                                <th className="px-4 py-3 w-16 border-r border-gray-200">Sr No.</th>
                                                <th className="px-4 py-3 border-r border-gray-200">Category</th>
                                                <th className="px-4 py-3 min-w-[300px] border-r border-gray-200">Question</th>
                                                <th className="px-4 py-3 min-w-[150px] border-r border-gray-200">Option A</th>
                                                <th className="px-4 py-3 min-w-[150px] border-r border-gray-200">Option B</th>
                                                <th className="px-4 py-3 min-w-[150px] border-r border-gray-200">Option C</th>
                                                <th className="px-4 py-3 min-w-[150px] border-r border-gray-200">Option D</th>
                                                <th className="px-4 py-3 w-32 text-center border-r border-gray-200">Correct Answer</th>
                                                <th className="px-4 py-3 w-20 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {paginatedQuestions.map((q, index) => (
                                                <tr key={q._id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-center text-gray-500 border-r border-gray-200">{startIndex + index + 1}</td>
                                                    <td className="px-4 py-3 border-r border-gray-200">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                                            {(() => {
                                                                if (q.topic && typeof q.topic === 'object') return q.topic.topicName || 'N/A';
                                                                if (q.topic) {
                                                                    const topicObj = topics.find(t => String(t._id) === String(q.topic));
                                                                    return topicObj ? topicObj.topicName : 'N/A';
                                                                }
                                                                return 'N/A';
                                                            })()}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-gray-800 border-r border-gray-200">{q.question}</td>
                                                    <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{q.options?.A}</td>
                                                    <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{q.options?.B}</td>
                                                    <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{q.options?.C}</td>
                                                    <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{q.options?.D}</td>
                                                    <td className="px-4 py-3 text-center font-bold text-green-700 border-r border-gray-200">
                                                        {q.correctOption}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button
                                                            onClick={() => handleRemoveQuestion(q._id)}
                                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Question"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAssignedQuestions.length)} of {filteredAssignedQuestions.length} entries
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-1 text-sm rounded transition-colors ${currentPage === page
                                                        ? 'bg-teal-500 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {filteredAssignedQuestions.length === 0 && assignedSearchQuery && (
                                    <div className="p-8 text-center text-gray-500">
                                        <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                        <p>No questions found matching "{assignedSearchQuery}"</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
