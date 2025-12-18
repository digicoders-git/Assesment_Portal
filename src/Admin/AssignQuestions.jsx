import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Save, Search, CheckCircle2, Circle, BookOpen, Layout, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AssignQuestions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

    // Mock Topics - Normally these would come from your state/API
    const topics = [
        { id: 1, name: 'TECHNICAL TEST', count: 45 },
        { id: 2, name: 'Tech Interview Test', count: 12 },
        { id: 3, name: 'Interview Questions', count: 28 },
        { id: 4, name: 'Aptitude Reasoning', count: 156 },
    ];

    // Mock Questions for each topic
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

        // ✅ Save selection count to localStorage keyed by assessment ID
        const storageKey = `assessment_${id}_questions`;
        localStorage.setItem(storageKey, selectedQuestions.length);

        toast.success(`${selectedQuestions.length} Questions successfully added to this Assessment!`);
        setTimeout(() => navigate(-1), 1500);
    };

    const currentQuestions = selectedTopic ? questionsDatabase[selectedTopic] || [] : [];
    const filteredQuestions = currentQuestions.filter(q =>
        q.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            {/* Header / Breadcrumb */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-4">
                    <span className="text-[#319795] font-semibold">Assessment</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#2D3748] font-bold">Assign Questions</span>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E6FFFA] flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#FF7F50] p-3 rounded-xl shadow-lg shadow-[#FF7F50]/20">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-[#2D3748] leading-tight">Pick Questions</h1>
                            <p className="text-gray-500 text-sm font-medium">Assignment ID: <span className="text-[#319795]">#{id}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Selected Counter</p>
                            <p className="text-xl font-black text-[#319795]">{selectedQuestions.length} <span className="text-slate-300 font-medium">/ 100</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Controls: Topic Selector & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                {/* Modern Dropdown For Topics */}
                <div className="relative w-full md:w-72">
                    <button
                        onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
                        className="w-full bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-[#E6FFFA] flex items-center justify-between text-slate-700 hover:border-[#319795] transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Layout className="h-4 w-4 text-[#319795]" />
                            <span className="font-bold text-sm">
                                {selectedTopic ? topics.find(t => t.id === selectedTopic)?.name : 'Choose Topic'}
                            </span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isTopicDropdownOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {isTopicDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                            {topics.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setSelectedTopic(t.id);
                                        setIsTopicDropdownOpen(false);
                                    }}
                                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-colors ${selectedTopic === t.id ? 'bg-[#E6FFFA] text-[#319795]' : 'hover:bg-slate-50 text-slate-600'}`}
                                >
                                    <span className="font-bold text-xs">{t.name}</span>
                                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-400">{t.count}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search specific questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E6FFFA] rounded-2xl text-sm focus:border-[#319795] focus:ring-4 focus:ring-[#319795]/5 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Progress Card (Sticky-ish) */}
                <div className="lg:col-span-1">
                    {selectedTopic ? (
                        <div className="bg-[#2D3748] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Topic Progress</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-2xl font-black">{selectedQuestions.length}</span>
                                    <span className="text-xs font-bold text-slate-400 mb-1">Target: 100</span>
                                </div>
                                <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden p-0.5">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#319795] to-[#4FD1C5] rounded-full transition-all duration-700"
                                        style={{ width: `${Math.min((selectedQuestions.length / 100) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">Auto-calculating coverage area...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
                            <p className="text-slate-400 text-xs font-bold uppercase">Topic Metrics Pending</p>
                        </div>
                    )}
                </div>

                {/* Questions List Card */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E6FFFA] overflow-hidden">
                        <div className="p-5 border-b border-[#E6FFFA] bg-slate-50/50 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${selectedTopic ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">
                                    {selectedTopic ? topics.find(t => t.id === selectedTopic)?.name : 'Database'}
                                </h3>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={selectedQuestions.length === 0}
                                className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 text-sm shadow-md ${selectedQuestions.length > 0
                                    ? 'bg-[#319795] text-white hover:shadow-[#319795]/20'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <Save className="h-4 w-4" />
                                Assign Now
                            </button>
                        </div>

                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-5">
                            {!selectedTopic ? (
                                <div className="py-24 text-center">
                                    <div className="w-20 h-20 bg-slate-100 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <HelpCircle className="h-10 w-10 text-slate-300 -rotate-12" />
                                    </div>
                                    <h3 className="text-slate-900 font-black text-xl mb-2">Ready to Start?</h3>
                                    <p className="text-slate-400 font-medium max-w-xs mx-auto">First pick a topic from the dropdown above to see available questions.</p>
                                </div>
                            ) : filteredQuestions.length === 0 ? (
                                <div className="py-24 text-center">
                                    <p className="text-slate-400 font-medium">No results found for your search query.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredQuestions.map((q) => (
                                        <div
                                            key={q.id}
                                            onClick={() => toggleQuestion(q.id)}
                                            className={`group p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-start gap-4 ${selectedQuestions.includes(q.id)
                                                ? 'border-[#319795] bg-[#E6FFFA]/30 shadow-md'
                                                : 'border-slate-100 hover:border-[#319795]/30 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="mt-0.5">
                                                {selectedQuestions.includes(q.id) ? (
                                                    <div className="bg-[#319795] p-1 rounded-lg">
                                                        <CheckCircle2 className="h-5 w-5 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="bg-slate-100 p-1 rounded-lg group-hover:bg-[#319795]/10">
                                                        <Circle className="h-5 w-5 text-slate-300 group-hover:text-[#319795]/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-[15px] font-bold leading-relaxed ${selectedQuestions.includes(q.id) ? 'text-[#2D3748]' : 'text-slate-600'}`}>
                                                    {q.text}
                                                </p>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">ID: #{q.id}</span>
                                                    {selectedQuestions.includes(q.id) && (
                                                        <span className="text-[10px] font-black uppercase text-[#319795] tracking-widest">Added to List</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
