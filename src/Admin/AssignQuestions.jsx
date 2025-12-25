import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Save, Search, CheckCircle2, Circle, BookOpen, HelpCircle, X, Download } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AssignQuestions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
    const [assignedQuestions, setAssignedQuestions] = useState([]);

    // Load already assigned questions
    React.useEffect(() => {
        const storageKey = `assessment_${id}_assigned_questions`;
        const assigned = JSON.parse(localStorage.getItem(storageKey) || '[]');
        setAssignedQuestions(assigned);
    }, [id]);

    // Mock Questions database
    const questionsDatabase = {
        1: [
            { id: 101, text: "What is React?" },
            { id: 102, text: "What is JSX?" },
            { id: 103, text: "Difference between state and props?" },
            { id: 104, text: "Explain React Lifecycle methods." },
        ],
        2: [
            { id: 201, text: "Explain Closure in JS." },
            { id: 202, text: "What is Event Looping?" },
        ],
        3: [
            { id: 301, text: "What are your strengths?" },
            { id: 302, text: "Where do you see yourself in 5 years?" },
        ]
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

    const handleRemoveQuestion = (questionId) => {
        const updatedAssigned = assignedQuestions.filter(q => q.id !== questionId);
        setAssignedQuestions(updatedAssigned);
        
        const storageKey = `assessment_${id}_questions`;
        const assignedKey = `assessment_${id}_assigned_questions`;
        
        localStorage.setItem(storageKey, updatedAssigned.length);
        localStorage.setItem(assignedKey, JSON.stringify(updatedAssigned));
        
        toast.success("Question removed successfully!");
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

            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
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
                    availableQuestions.map((q) => (
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
                    ))
                )}
            </div>

            {assignedQuestions.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Already Assigned Questions ({assignedQuestions.length})</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {assignedQuestions.map((q) => (
                            <div
                                key={q.id}
                                className="p-5 rounded-xl border-2 border-green-200 bg-green-50 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500 text-white">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-bold text-green-700">{q.text}</span>
                                    <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">{q.topicName}</span>
                                </div>
                                <div className=" ml-4 flex items-center">
                                    <button
                                        onClick={() => handleRemoveQuestion(q.id)}
                                        className="p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                        title="Remove Question"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
