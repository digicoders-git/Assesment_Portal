import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    Plus, Trash2, Edit, Save, X, Search,
    FileSpreadsheet, CheckCircle2, AlertCircle,
    LayoutGrid, ChevronRight, BookOpen, HelpCircle
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
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#319795",
            cancelButtonColor: "#f56565",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setQuestions(questions.filter(q => q.id !== id));
                toast.success("Question deleted successfully");
            }
        });
    };

    const handleImportFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const rows = text.split('\n');
                const headers = rows[0].split(',').map(h => h.trim().toLowerCase());

                // Validate headers
                const required = ['question', 'optiona', 'optionb', 'optionc', 'optiond', 'answer'];
                const isValid = required.every(h => headers.includes(h));

                if (!isValid) {
                    toast.error("Invalid CSV Format! Use the provided template.");
                    return;
                }

                const newQuestions = [];
                for (let i = 1; i < rows.length; i++) {
                    const columns = rows[i].split(',').map(c => c.trim());
                    if (columns.length >= 6) {
                        newQuestions.push({
                            id: Date.now() + i,
                            question: columns[headers.indexOf('question')],
                            optionA: columns[headers.indexOf('optiona')],
                            optionB: columns[headers.indexOf('optionb')],
                            optionC: columns[headers.indexOf('optionc')],
                            optionD: columns[headers.indexOf('optiond')],
                            answer: columns[headers.indexOf('answer')].toUpperCase()
                        });
                    }
                }

                if (newQuestions.length > 0) {
                    setQuestions(prev => [...prev, ...newQuestions]);
                    toast.success(`${newQuestions.length} Questions imported successfully!`);
                    setIsGuidanceOpen(false);
                } else {
                    toast.error("No valid questions found in CSV.");
                }
            };
            reader.readAsText(file);
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-[#F7FAFC] min-h-screen">
            {/* Breadcrumb & Header Sections */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-4">
                    <button onClick={() => navigate('/admin/topics')} className="hover:text-[#319795] transition-colors">Topics</button>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#2D3748] font-bold">{topicName}</span>
                </div>

                <div className="bg-white rounded-xl p-8 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-[#319795] rounded-xl flex items-center justify-center text-white">
                            <BookOpen className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#2D3748] tracking-tight">{topicName}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="px-2 py-0.5 bg-gray-100 text-[#4A5568] text-[10px] font-bold uppercase tracking-widest rounded border border-gray-200">
                                    ID: {topicId}
                                </span>
                                <div className="h-4 w-[1px] bg-slate-200"></div>
                                <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
                                    {questions.length} Questions
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <button
                            onClick={() => setIsGuidanceOpen(true)}
                            className="flex items-center gap-2 bg-white border border-gray-300 hover:border-[#319795] text-[#2D3748] px-5 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95"
                        >
                            <FileSpreadsheet className="h-4 w-4 text-[#319795]" />
                            Import CSV
                        </button>
                        <button
                            onClick={handleOpenAdd}
                            className="flex items-center gap-2 bg-[#319795] hover:bg-[#2B7A73] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Add Question
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Row */}
            <div className="mb-6">
                <div className="relative w-full max-w-2xl">
                    <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search questions by keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] text-[#2D3748] focus:border-[#319795] outline-none transition-all"
                    />
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6 max-w-5xl">
                {filteredQuestions.length === 0 ? (
                    <div className="bg-white rounded-xl p-16 text-center border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Search className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-[#2D3748]">No Questions Found</h3>
                        <p className="text-gray-500 text-sm mt-1">Try a different search or add a new question.</p>
                    </div>
                ) : (
                    filteredQuestions.map((q, index) => (
                        <div key={q.id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#319795] rounded-lg flex items-center justify-center text-xs font-black text-white">
                                        {index + 1}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Question ID: #{q.id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleEdit(q)}
                                        className="p-2 text-gray-400 hover:text-[#319795] hover:bg-white rounded-lg transition-all border border-transparent hover:border-teal-100"
                                        title="Edit"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-red-100"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-lg font-bold text-[#2D3748] leading-snug mb-6">{q.question}</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                    {['A', 'B', 'C', 'D'].map((letter) => (
                                        <div
                                            key={letter}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${q.answer === letter
                                                ? 'bg-white border-[#319795]'
                                                : 'bg-white border-transparent shadow-sm'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${q.answer === letter
                                                ? 'bg-[#319795] text-white'
                                                : 'bg-gray-100 text-gray-400 border border-gray-100'
                                                }`}>
                                                {letter}
                                            </div>
                                            <span className="text-sm font-bold truncate flex-1">
                                                {q[`option${letter}`]}
                                            </span>
                                            {q.answer === letter && (
                                                <div className="flex items-center gap-1.5 bg-[#319795] text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Correct Answer
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden border border-gray-200">
                        <div className="bg-[#319795] p-6 text-white flex justify-between items-center text-left">
                            <h3 className="text-xl font-bold">
                                {editingQuestion ? 'Edit Question' : 'Add New Question'}
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 text-left">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Question Title</label>
                                <textarea
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#319795] outline-none transition-all resize-none placeholder:opacity-40"
                                    placeholder="Enter question text here..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['A', 'B', 'C', 'D'].map((letter) => (
                                    <div key={letter} className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Option {letter}</label>
                                        <input
                                            type="text"
                                            value={formData[`option${letter}`]}
                                            onChange={(e) => setFormData({ ...formData, [`option${letter}`]: e.target.value })}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#2D3748] focus:border-[#319795] outline-none transition-all bg-gray-50/30 placeholder:opacity-30"
                                            placeholder={`Option ${letter}...`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Correct Answer</span>
                                <div className="flex gap-2">
                                    {['A', 'B', 'C', 'D'].map((letter) => (
                                        <button
                                            key={letter}
                                            onClick={() => setFormData({ ...formData, answer: letter })}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border font-bold ${formData.answer === letter
                                                ? 'bg-[#319795] border-[#319795] text-white shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-teal-200 active:bg-teal-50'
                                                }`}
                                        >
                                            {letter}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-6 py-2.5 text-gray-500 font-bold text-sm hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-[#319795] hover:bg-[#2B7A73] text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all"
                                >
                                    {editingQuestion ? 'Update Changes' : 'Save Question'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Import Guidance */}
            {isGuidanceOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[120] p-4">
                    <div className="bg-white rounded-xl w-full max-w-xl overflow-hidden border border-gray-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-[#2D3748]">Bulk Import Questions</h3>
                                <button onClick={() => setIsGuidanceOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-sm">
                                    <p className="font-bold text-gray-700 mb-2">CSV Column Headers:</p>
                                    <code className="block bg-white p-2 border border-gray-200 rounded text-xs text-[#319795]">
                                        Question, OptionA, OptionB, OptionC, OptionD, Answer
                                    </code>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={handleDownloadTemplate}
                                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#319795] hover:bg-teal-50 transition-all group"
                                    >
                                        <HelpCircle className="h-8 w-8 text-gray-300 mb-2 group-hover:text-[#319795]" />
                                        <span className="text-xs font-bold text-gray-500 group-hover:text-[#319795]">Download Template</span>
                                    </button>

                                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#319795] hover:bg-teal-50 transition-all group cursor-pointer">
                                        <Plus className="h-8 w-8 text-gray-300 mb-2 group-hover:text-[#319795]" />
                                        <span className="text-xs font-bold text-gray-500 group-hover:text-[#319795]">Upload CSV File</span>
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
