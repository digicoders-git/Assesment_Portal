import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, Trash2, Edit, Save, X, Search,
    FileSpreadsheet, List, HelpCircle, CheckCircle2, AlertCircle,
    LayoutGrid, ChevronRight, BookOpen
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function TopicQuestions() {
    const { topicId } = useParams();
    const navigate = useNavigate();

    // States
    const [topicName] = useState('TECHNICAL TEST');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    // Initial Questions Data
    const [questions, setQuestions] = useState([
        {
            id: 1,
            question: "What is the primary purpose of React Hooks?",
            optionA: "To write class components",
            optionB: "To use state and lifecycle features in functional components",
            optionC: "To replace Redux entirely",
            optionD: "To manage database connections",
            answer: "B"
        },
        {
            id: 2,
            question: "Which hook is used for side effects in React?",
            optionA: "useState",
            optionB: "useMemo",
            optionC: "useEffect",
            optionD: "useCallback",
            answer: "C"
        }
    ]);

    const initialFormState = {
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: 'A'
    };
    const [formData, setFormData] = useState(initialFormState);

    // Handlers
    const handleOpenAdd = () => {
        setEditingQuestion(null);
        setFormData(initialFormState);
        setIsAddModalOpen(true);
    };

    const handleDownloadTemplate = () => {
        const headers = "Question,OptionA,OptionB,OptionC,OptionD,Answer\n";
        const sampleRow = "What is React?,Library,Framework,Language,Tool,Library\n";
        const blob = new Blob([headers + sampleRow], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "quiz_template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Template downloaded successfully!");
    };

    const handleEdit = (q) => {
        setEditingQuestion(q);
        setFormData({ ...q });
        setIsAddModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.question || !formData.optionA || !formData.optionB) {
            toast.error("Question and at least two options are required!");
            return;
        }

        if (editingQuestion) {
            setQuestions(questions.map(q => q.id === editingQuestion.id ? { ...formData, id: q.id } : q));
            toast.success("Question updated successfully");
        } else {
            const newQ = { ...formData, id: Date.now() };
            setQuestions([...questions, newQ]);
            toast.success("New question added");
        }
        setIsAddModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            setQuestions(questions.filter(q => q.id !== id));
            toast.info("Question deleted");
        }
    };

    const handleImportFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            toast.info(`Importing ${file.name}...`);
            setTimeout(() => {
                toast.success("Questions imported successfully!");
                setIsGuidanceOpen(false);
            }, 1000);
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            {/* Breadcrumb & Header Sections */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-4">
                    <button onClick={() => navigate('/admin/topics')} className="hover:text-[#319795] transition-colors">Topics</button>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#2D3748] font-bold">{topicName}</span>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E6FFFA] flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#319795]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#319795] to-[#4FD1C5] rounded-[2rem] flex items-center justify-center shadow-xl shadow-[#319795]/20 text-white transform rotate-3">
                            <BookOpen className="h-10 w-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-[#2D3748] tracking-tight">{topicName}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="px-3 py-1 bg-teal-50 text-[#319795] text-[10px] font-black uppercase tracking-widest rounded-lg border border-teal-100">
                                    ID: {topicId}
                                </span>
                                <div className="h-4 w-[1px] bg-slate-200"></div>
                                <span className="text-slate-400 text-sm font-bold flex items-center gap-1.5">
                                    <HelpCircle className="h-4 w-4" />
                                    {questions.length} Questions
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <button
                            onClick={() => setIsGuidanceOpen(true)}
                            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#319795] hover:bg-[#E6FFFA]/30 text-slate-600 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-95"
                        >
                            <FileSpreadsheet className="h-5 w-5 text-[#319795]" />
                            Import CSV
                        </button>
                        <button
                            onClick={handleOpenAdd}
                            className="flex items-center gap-2 bg-[#319795] hover:bg-[#2B7A73] text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-[#319795]/20 active:scale-95"
                        >
                            <Plus className="h-5 w-5" />
                            Add Question
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filters Row */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="h-5 w-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search questions by keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-[#E6FFFA] rounded-2xl text-[15px] font-bold text-slate-700 focus:border-[#319795] focus:ring-4 focus:ring-[#319795]/5 outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-[#E6FFFA] shadow-sm">
                    <LayoutGrid className="h-5 w-5 text-[#319795]" />
                    <span className="text-xs font-black text-[#2D3748] uppercase tracking-widest">Visual View</span>
                </div>
            </div>

            {/* Questions Grid/List */}
            <div className="space-y-6 max-w-5xl mx-auto">
                {filteredQuestions.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300 transform -rotate-12">
                            <Search className="h-12 w-12" />
                        </div>
                        <h3 className="text-2xl font-black text-[#2D3748]">No Questions Found</h3>
                        <p className="text-slate-400 font-medium mt-2">Adjust your search or add a new question to this topic.</p>
                    </div>
                ) : (
                    filteredQuestions.map((q, index) => (
                        <div key={q.id} className="group bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E6FFFA] hover:border-[#319795]/30 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                            {/* Question Header */}
                            <div className="flex items-start justify-between gap-6 mb-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-lg font-black text-slate-300 group-hover:bg-[#E6FFFA] group-hover:text-[#319795] transition-all duration-500 shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-xl font-bold text-[#2D3748] leading-tight mb-3 pr-10">{q.question}</h4>
                                        <div className="flex items-center gap-3">
                                            <span className="px-2.5 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Question ID: #{q.id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleEdit(q)}
                                        className="p-3 bg-white text-slate-400 hover:text-[#319795] hover:bg-[#E6FFFA] border border-slate-100 hover:border-[#319795]/20 rounded-xl transition-all"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q.id)}
                                        className="p-3 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-100 hover:border-red-100 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-12 pl-0 md:pl-6 border-l-0 md:border-l-4 border-slate-50 group-hover:border-[#E6FFFA] transition-colors">
                                {['A', 'B', 'C', 'D'].map((letter) => (
                                    <div
                                        key={letter}
                                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${q.answer === letter
                                            ? 'bg-teal-50/50 border-teal-200 text-[#2C7A7B] shadow-sm'
                                            : 'bg-slate-50/30 border-transparent text-slate-600'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm transition-all ${q.answer === letter
                                            ? 'bg-[#319795] text-white rotate-3'
                                            : 'bg-white text-slate-400'
                                            }`}>
                                            {letter}
                                        </div>
                                        <span className={`text-[15px] font-bold truncate ${q.answer === letter ? 'text-[#2C7A7B]' : 'text-slate-600'}`}>
                                            {q[`option${letter}`]}
                                        </span>
                                        {q.answer === letter && (
                                            <div className="ml-auto flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#319795]">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Correct
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modals restored with full logic */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-[#319795] p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white tracking-tight">
                                    {editingQuestion ? 'Edit Question' : 'New Question'}
                                </h3>
                                <p className="text-teal-100/80 text-[10px] font-black uppercase tracking-widest mt-1">Refining the assessment hub</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white cursor-pointer z-20"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Question prompt</label>
                                <textarea
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    rows="3"
                                    className="w-full border border-slate-200 bg-slate-50 rounded-2xl px-6 py-4 text-[15px] font-bold text-slate-700 focus:border-[#319795] focus:bg-white outline-none transition-all resize-none"
                                    placeholder="What is the question you want to ask?"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['A', 'B', 'C', 'D'].map((letter) => (
                                    <div
                                        key={letter}
                                        className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.answer === letter ? 'border-[#319795] bg-[#E6FFFA]/30' : 'border-slate-100 bg-slate-50/50'}`}
                                        onClick={() => setFormData({ ...formData, answer: letter })}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all ${formData.answer === letter ? 'bg-[#319795] text-white' : 'bg-white text-slate-400'}`}>
                                                {letter}
                                            </div>
                                            <input
                                                type="text"
                                                value={formData[`option${letter}`]}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    setFormData({ ...formData, [`option${letter}`]: e.target.value });
                                                }}
                                                className="flex-1 bg-transparent text-sm font-bold text-[#2D3748] outline-none placeholder:text-slate-300"
                                                placeholder={`Option ${letter}...`}
                                            />
                                            {formData.answer === letter && <CheckCircle2 className="h-4 w-4 text-[#319795]" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                <p className="text-[11px] text-amber-800 font-bold leading-tight">
                                    Click on an option box to set it as the correct answer. You must fill the question and at least two options.
                                </p>
                            </div>
                        </div>

                        <div className="px-8 pb-8 flex gap-3 mt-2">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-[2] bg-[#319795] hover:bg-[#2B7A73] text-white py-4 rounded-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#319795]/20 transition-all active:scale-95"
                            >
                                <Save className="h-5 w-5" />
                                {editingQuestion ? 'Update Question' : 'Save Question'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Import Guidance */}
            {isGuidanceOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500">
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#2D3748] rounded-2xl flex items-center justify-center text-[#4FD1C5] transform rotate-12">
                                        <FileSpreadsheet className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-[#2D3748] tracking-tight">Bulk Import</h3>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Smart CSV Ingestion</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsGuidanceOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">CSV Header Requirements</h4>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {['Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'Answer'].map((h) => (
                                            <span key={h} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-[#319795]">{h}</span>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                                        Column headers must be exactly as shown above. The <span className="text-[#319795]">Answer</span> column should contain a single letter (A, B, C, or D).
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={handleDownloadTemplate}
                                        className="p-6 bg-[#E6FFFA] rounded-[2rem] border border-teal-100 text-center group transition-all hover:bg-[#319795]/10"
                                    >
                                        <HelpCircle className="h-8 w-8 text-[#319795] mx-auto mb-3 transition-transform group-hover:scale-110" />
                                        <h5 className="text-[11px] font-black text-[#319795] uppercase tracking-widest">Get Template</h5>
                                    </button>

                                    <label className="p-6 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-center cursor-pointer hover:border-[#319795]/50 transition-all">
                                        <Plus className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Upload File</h5>
                                        <input type="file" className="hidden" accept=".csv" onChange={handleImportFile} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
