import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Save, Search, CheckCircle2, Circle, BookOpen, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AssignQuestions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

    // Mock Topics
    const topics = [
        { id: 1, name: 'TECHNICAL TEST', count: 45 },
        { id: 2, name: 'Tech Interview Test', count: 12 },
        { id: 3, name: 'Interview Questions', count: 28 },
        { id: 4, name: 'Aptitude Reasoning', count: 156 },
    ];

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

    const toggleQuestion = (qId) => {
        setSelectedQuestions(prev =>
            prev.includes(qId)
                ? prev.filter(id => id !== qId)
                : [...prev, qId]
        );
    };

    const handleSave = () => {
        if (selectedQuestions.length === 0) {
            toast.error("Please select at least one question!");
            return;
        }

        const storageKey = `assessment_${id}_questions`;
        localStorage.setItem(storageKey, selectedQuestions.length);

        toast.success(`${selectedQuestions.length} Questions successfully added!`);
        setTimeout(() => navigate(-1), 1500);
    };

    const currentQuestions = selectedTopic ? questionsDatabase[selectedTopic] || [] : [];
    const filteredQuestions = currentQuestions.filter(q =>
        q.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <p className="text-gray-500 text-xs">Assessment ID: <span className="text-[#319795] font-bold">#{id}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected</p>
                            <p className="text-lg font-black text-[#319795]">{selectedQuestions.length} Items</p>
                        </div>
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
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{topic.count} Qs</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative flex-1 w-full">
                    <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search questions in this topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#319795] outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {!selectedTopic ? (
                    <div className="bg-white rounded-xl p-20 text-center border-2 border-dashed border-gray-200">
                        <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-700">Select a Topic</h3>
                        <p className="text-gray-500 text-sm mt-1">Please choose a topic from the dropdown to see questions.</p>
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 font-bold">No questions found matching your search.</div>
                ) : (
                    filteredQuestions.map((q) => (
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
                            <span className="text-[10px] font-bold text-gray-300 group-hover:text-gray-400 transition-colors">ID: #{q.id}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
