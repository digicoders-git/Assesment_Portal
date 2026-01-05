import React, { useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Save, Search, CheckCircle2, Circle, BookOpen, Download, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function AssignQuestions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
    const [assignedQuestions, setAssignedQuestions] = useState([]);
    const [assignedSearchQuery, setAssignedSearchQuery] = useState('');
    const topicDropdownRef = useRef(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


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


    // Load already assigned questions
    useEffect(() => {
        const storageKey = `assessment_${id}_assigned_questions`;
        const assigned = JSON.parse(localStorage.getItem(storageKey) || '[]');
        setAssignedQuestions(assigned);
    }, [id]);

    // Mock Questions database with full question data
    const questionsDatabase = {
        1: [
            { 
                id: 101, 
                text: "What is React?", 
                optionA: "A JavaScript library", 
                optionB: "A database", 
                optionC: "A programming language", 
                optionD: "An operating system", 
                answer: "A JavaScript library" 
            },
            { 
                id: 102, 
                text: "What is JSX?", 
                optionA: "JavaScript XML", 
                optionB: "Java Syntax Extension", 
                optionC: "JavaScript Extension", 
                optionD: "JSON Structure", 
                answer: "JavaScript XML" 
            },
            { 
                id: 103, 
                text: "Difference between state and props?", 
                optionA: "State is mutable, Props are immutable", 
                optionB: "Both are same", 
                optionC: "Props are mutable, State is immutable", 
                optionD: "Both are mutable", 
                answer: "State is mutable, Props are immutable" 
            },
            { 
                id: 104, 
                text: "Explain React Lifecycle methods.", 
                optionA: "componentDidMount, componentDidUpdate, componentWillUnmount", 
                optionB: "constructor, render, componentDidMount", 
                optionC: "useState, useEffect, useContext", 
                optionD: "Mount, Update, Unmount phases", 
                answer: "componentDidMount, componentDidUpdate, componentWillUnmount" 
            },
        ],
        2: [
            { 
                id: 201, 
                text: "Explain Closure in JS.", 
                optionA: "Function inside another function with access to outer variables", 
                optionB: "Loop concept in JavaScript", 
                optionC: "Variable scope management", 
                optionD: "Memory management technique", 
                answer: "Function inside another function with access to outer variables" 
            },
            { 
                id: 202, 
                text: "What is Event Looping?", 
                optionA: "Mechanism for handling asynchronous operations", 
                optionB: "Loop execution pattern", 
                optionC: "Event handling system", 
                optionD: "Memory allocation process", 
                answer: "Mechanism for handling asynchronous operations" 
            },
        ],
        3: [
            { 
                id: 301, 
                text: "What are your strengths?", 
                optionA: "Problem solving and analytical thinking", 
                optionB: "Communication and teamwork", 
                optionC: "Leadership and management", 
                optionD: "Technical expertise", 
                answer: "Problem solving and analytical thinking" 
            },
            { 
                id: 302, 
                text: "Where do you see yourself in 5 years?", 
                optionA: "In a senior technical role", 
                optionB: "Leading a team", 
                optionC: "Starting my own company", 
                optionD: "Continuing to learn and grow", 
                answer: "In a senior technical role" 
            },
        ],
    };

    // Mock Topics with dynamic count from questionsDatabase
    const topics = [
        { id: 1, name: 'TECHNICAL TEST' },
        { id: 2, name: 'Tech Interview Test' },
        { id: 3, name: 'Interview Questions' },
        { id: 4, name: 'Aptitude Reasoning' },
    ].map(topic => ({
        ...topic,
        count: questionsDatabase[topic.id]?.length || 0
    }));

    const toggleQuestion = (qId) => {
        setSelectedQuestions(prev =>
            prev.includes(qId)
                ? prev.filter(id => id !== qId)
                : [...prev, qId]
        );
    };

    const handleSelectAll = () => {
        const availableIds = availableQuestions.map(q => q.id);
        const allSelected = availableIds.every(id => selectedQuestions.includes(id));
        
        if (allSelected) {
            // Deselect all from current topic
            setSelectedQuestions(prev => prev.filter(id => !availableIds.includes(id)));
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
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedAssigned = assignedQuestions.filter(q => q.id !== questionId);
                setAssignedQuestions(updatedAssigned);
                
                const storageKey = `assessment_${id}_questions`;
                const assignedKey = `assessment_${id}_assigned_questions`;
                
                localStorage.setItem(storageKey, updatedAssigned.length);
                localStorage.setItem(assignedKey, JSON.stringify(updatedAssigned));
                
                toast.success("Question removed successfully!");
            }
        });
    };

    const handleSave = () => {
        if (selectedQuestions.length === 0) {
            toast.error("Please select at least one question!");
            return;
        }

        const storageKey = `assessment_${id}_questions`;
        const assignedKey = `assessment_${id}_assigned_questions`;
        
        // Get selected question details
        const selectedQuestionDetails = [];
        Object.keys(questionsDatabase).forEach(topicId => {
            questionsDatabase[topicId].forEach(q => {
                if (selectedQuestions.includes(q.id)) {
                    selectedQuestionDetails.push({
                        ...q,
                        topicId: parseInt(topicId),
                        topicName: topics.find(t => t.id === parseInt(topicId))?.name
                    });
                }
            });
        });
        
        // Check for duplicates
        const assignedIds = assignedQuestions.map(q => q.id);
        const duplicates = selectedQuestionDetails.filter(q => assignedIds.includes(q.id));
        
        if (duplicates.length > 0) {
            toast.error(`${duplicates.length} question(s) already assigned!`);
            return;
        }
        
        // Merge with existing assigned questions
        const updatedAssigned = [...assignedQuestions, ...selectedQuestionDetails];
        
        localStorage.setItem(storageKey, updatedAssigned.length);
        localStorage.setItem(assignedKey, JSON.stringify(updatedAssigned));

        // Activates the assessment when questions are assigned
        const allAssessments = JSON.parse(localStorage.getItem('all_assessments') || '[]');
        const updatedAssessments = allAssessments.map(a =>
            a.id == id ? { ...a, status: true } : a
        );
        localStorage.setItem('all_assessments', JSON.stringify(updatedAssessments));

        toast.success(`${selectedQuestions.length} Questions successfully added & Assessment Activated!`);
        setTimeout(() => navigate('/admin/assessment'), 1500);
    };

    // Calculate assigned questions count per topic
    const getTopicAssignedCount = (topicId) => {
        return assignedQuestions.filter(q => q.topicId === topicId).length;
    };

    // Get correct answer letter (A, B, C, D)
    const getCorrectAnswerLetter = (question) => {
        const options = [question.optionA, question.optionB, question.optionC, question.optionD];
        const answerIndex = options.findIndex(option => option === question.answer);
        return answerIndex !== -1 ? String.fromCharCode(65 + answerIndex) : 'N/A';
    };

    // Filter assigned questions based on search
    const filteredAssignedQuestions = assignedQuestions.filter(q => 
        q.text.toLowerCase().includes(assignedSearchQuery.toLowerCase()) ||
        q.topicName.toLowerCase().includes(assignedSearchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(assignedSearchQuery.toLowerCase())
    );

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
    const assignedIds = assignedQuestions.map(q => q.id);
    const currentQuestions = selectedTopic ? questionsDatabase[selectedTopic] || [] : [];
    const availableQuestions = currentQuestions.filter(q => !assignedIds.includes(q.id));

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
                            {selectedTopic ? topics.find(t => t.id === selectedTopic)?.name : 'Select Topic'}
                        </span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${isTopicDropdownOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {isTopicDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg overflow-hidden z-[50]">
                            {topics.map(topic => (
                                <button
                                    key={topic.id}
                                    onClick={() => {
                                        setSelectedTopic(topic.id);
                                        setIsTopicDropdownOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-sm text-left hover:bg-teal-50 flex items-center justify-between border-b border-gray-50 last:border-0"
                                >
                                    <span className={`font-bold ${selectedTopic === topic.id ? 'text-[#319795]' : 'text-gray-600'}`}>{topic.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                                            {getTopicAssignedCount(topic.id)}/{topic.count} Assigned
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{topic.count} Qs</span>
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
                ) : availableQuestions.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 font-bold">No questions available in this topic.</div>
                ) : (
                    <>
                        {/* Select All Button */}
                        <div className="mb-4">
                            <button
                                onClick={handleSelectAll}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                            >
                                {availableQuestions.every(q => selectedQuestions.includes(q.id)) ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        {availableQuestions.map((q) => (
                            <div
                                key={q.id}
                                onClick={() => toggleQuestion(q.id)}
                                className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedQuestions.includes(q.id)
                                    ? 'border-[#319795] bg-teal-50'
                                    : 'border-white bg-white hover:border-gray-100'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${selectedQuestions.includes(q.id) ? 'bg-[#319795] text-white' : 'bg-gray-100 text-gray-300'
                                        }`}>
                                        {selectedQuestions.includes(q.id) ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                    </div>
                                    <span className={`text-sm font-bold ${selectedQuestions.includes(q.id) ? 'text-[#2C7A7B]' : 'text-gray-600'}`}>
                                        {q.text}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {assignedQuestions.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Already Assigned Questions ({assignedQuestions.length})</h3>
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
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                                        <tr key={q.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-center text-gray-500 border-r border-gray-200">{startIndex + index + 1}</td>
                                            <td className="px-4 py-3 border-r border-gray-200">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                                    {q.topicName}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800 border-r border-gray-200">{q.text}</td>
                                            <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{q.optionA}</td>
                                            <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{q.optionB}</td>
                                            <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{q.optionC}</td>
                                            <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{q.optionD}</td>
                                            <td className="px-4 py-3 text-center font-bold text-green-700 border-r border-gray-200">
                                                {getCorrectAnswerLetter(q)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleRemoveQuestion(q.id)}
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
                                            className={`px-3 py-1 text-sm rounded transition-colors ${
                                                currentPage === page 
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
                    </div>
                </div>
            )}
        </div>
    );
}
