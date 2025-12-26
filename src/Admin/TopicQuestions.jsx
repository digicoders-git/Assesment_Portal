import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Plus, Trash2, Edit, X, FileSpreadsheet } from 'lucide-react';
import { toast } from 'react-toastify';

export default function TopicQuestions() {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [topicName] = useState('TECHNICAL TEST');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

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
        answer: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    const handleDownloadSample = () => {
        const sampleData = [
            {
                question: "What is React?",
                optionA: "A JavaScript library",
                optionB: "A database",
                optionC: "A programming language",
                optionD: "An operating system",
                answer: "A"
            },
            {
                question: "Which hook is used for state management?",
                optionA: "useEffect",
                optionB: "useState",
                optionC: "useContext",
                optionD: "useReducer",
                answer: "B"
            }
        ];
        
        // Create proper Excel format with tab separation
        const headers = "Question\tOptionA\tOptionB\tOptionC\tOptionD\tAnswer\n";
        const csvContent = sampleData.map(q => 
            `${q.question}\t${q.optionA}\t${q.optionB}\t${q.optionC}\t${q.optionD}\t${q.answer}`
        ).join('\n');
        
        const blob = new Blob([headers + csvContent], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample_questions_template.xls';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Sample Excel template downloaded!");
    };

    const handleOpenAdd = () => {
        setEditingQuestion(null);
        setFormData(initialFormState);
        setIsAddModalOpen(true);
    };

    const handleExportExcel = () => {
        if (questions.length === 0) {
            toast.error("No questions available to export!");
            return;
        }
        
        const headers = "Question\tOptionA\tOptionB\tOptionC\tOptionD\tAnswer\n";
        const csvContent = questions.map(q => 
            `${q.question}\t${q.optionA}\t${q.optionB}\t${q.optionC}\t${q.optionD}\t${q.answer}`
        ).join('\n');
        
        const blob = new Blob([headers + csvContent], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${topicName}_questions_${new Date().toISOString().split('T')[0]}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(`${questions.length} questions exported to Excel successfully!`);
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

        if (!formData.answer || !['A', 'B', 'C', 'D'].includes(formData.answer)) {
            toast.error("Please select a correct answer (A, B, C, or D)!");
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
        if (!file) return;
        
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(fileExtension)) {
            toast.error("Please upload only Excel files (.xlsx, .xls)!");
            e.target.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target.result;
                const rows = text.split('\n').filter(row => row.trim());
                
                if (rows.length < 2) {
                    toast.error("File must contain at least header and one data row!");
                    return;
                }
                
                // Handle Excel format with tab separation
                const headers = rows[0].split('\t').map(h => h.trim().toLowerCase());
                const required = ['question', 'optiona', 'optionb', 'optionc', 'optiond', 'answer'];
                const isValid = required.every(h => headers.includes(h));

                if (!isValid) {
                    toast.error(`Invalid format! Required columns: Question, OptionA, OptionB, OptionC, OptionD, Answer`);
                    return;
                }

                const newQuestions = [];
                const invalidRows = [];
                
                for (let i = 1; i < rows.length; i++) {
                    const columns = rows[i].split('\t').map(c => c.trim());
                    if (columns.length >= 6 && columns[headers.indexOf('question')]) {
                        const questionData = {
                            question: columns[headers.indexOf('question')],
                            optionA: columns[headers.indexOf('optiona')],
                            optionB: columns[headers.indexOf('optionb')],
                            optionC: columns[headers.indexOf('optionc')],
                            optionD: columns[headers.indexOf('optiond')],
                            answer: columns[headers.indexOf('answer')].toUpperCase()
                        };
                        
                        // Validate answer is A, B, C, or D
                        if (!['A', 'B', 'C', 'D'].includes(questionData.answer)) {
                            invalidRows.push(`Row ${i + 1}: Answer must be A, B, C, or D`);
                            continue;
                        }
                        
                        // Convert letter to actual option text for storage
                        const optionMap = {
                            'A': questionData.optionA,
                            'B': questionData.optionB,
                            'C': questionData.optionC,
                            'D': questionData.optionD
                        };
                        
                        newQuestions.push({
                            id: Date.now() + i,
                            ...questionData,
                            answer: questionData.answer // Keep as A, B, C, D
                        });
                    }
                }

                if (invalidRows.length > 0) {
                    toast.error(`Import failed! Invalid data found:\n${invalidRows.slice(0, 3).join('\n')}${invalidRows.length > 3 ? '\n...and more' : ''}`);
                    return;
                }

                if (newQuestions.length > 0) {
                    setQuestions(prev => [...prev, ...newQuestions]);
                    toast.success(`${newQuestions.length} questions imported successfully from Excel!`);
                    setIsGuidanceOpen(false);
                } else {
                    toast.error("No valid questions found in file!");
                }
            } catch (error) {
                toast.error("Error reading Excel file. Please check format!");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const filteredQuestions = questions.filter(q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-3 sm:p-6 bg-[#EDF2F7] min-h-screen">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-sm mb-4">
                    <button onClick={() => navigate('/admin/topics')} className="text-[#319795] hover:underline">Topics</button>
                    <span>/</span>
                    <span className="text-gray-700">{topicName}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{topicName} Questions</h1>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button
                        onClick={() => setIsGuidanceOpen(true)}
                        className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span className="hidden sm:inline">Import Excel</span>
                        <span className="sm:hidden">Import</span>
                    </button>
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded text-xs sm:text-sm"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span className="hidden sm:inline">Export Excel</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 bg-[#319795] hover:bg-[#2B7A73] text-white px-3 sm:px-4 py-2 rounded text-xs sm:text-sm"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Question</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64"
                />
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg overflow-auto max-h-[70vh]">
                <table className="w-full min-w-[1400px]">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-16">Sr.</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 min-w-[250px]">Question</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 min-w-[200px]">Option A</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 min-w-[200px]">Option B</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 min-w-[200px]">Option C</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 min-w-[200px]">Option D</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-20">Answer</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-24">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredQuestions.map((q, index) => (
                            <tr key={q.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm text-gray-900">{index + 1}</td>
                                <td className="px-4 py-4 text-sm text-gray-900">{q.question}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{q.optionA}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{q.optionB}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{q.optionC}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{q.optionD}</td>
                                <td className="px-4 py-4 text-sm">
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                        {q.answer}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(q)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(q.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
                {filteredQuestions.map((q, index) => (
                    <div key={q.id} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(q)}
                                    className="text-blue-600 hover:text-blue-800 p-1"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(q.id)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-2">{q.question}</p>
                            <div className="space-y-1 text-xs text-gray-600">
                                <div>A) {q.optionA}</div>
                                <div>B) {q.optionB}</div>
                                <div>C) {q.optionC}</div>
                                <div>D) {q.optionD}</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Correct Answer:</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                {q.answer}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b">
                            <h3 className="text-lg font-semibold">
                                {editingQuestion ? 'Edit Question' : 'Add New Question'}
                            </h3>
                        </div>
                        <div className="p-4 sm:p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                <textarea
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    placeholder="Enter question..."
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Option A</label>
                                    <input
                                        type="text"
                                        value={formData.optionA}
                                        onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                        placeholder="Option A..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Option B</label>
                                    <input
                                        type="text"
                                        value={formData.optionB}
                                        onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                        placeholder="Option B..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Option C</label>
                                    <input
                                        type="text"
                                        value={formData.optionC}
                                        onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                        placeholder="Option C..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Option D</label>
                                    <input
                                        type="text"
                                        value={formData.optionD}
                                        onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                        placeholder="Option D..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Correct Answer</label>
                                <div className="flex gap-4">
                                    {['A', 'B', 'C', 'D'].map((option) => (
                                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="answer"
                                                value={option}
                                                checked={formData.answer === option}
                                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                                className="w-4 h-4 text-[#319795] focus:ring-[#319795]"
                                            />
                                            <span className="text-sm font-medium">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Select the correct option (A, B, C, or D)</p>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 order-2 sm:order-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-[#319795] hover:bg-[#2B7A73] text-white px-4 py-2 rounded order-1 sm:order-2"
                            >
                                {editingQuestion ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {isGuidanceOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Import Questions</h3>
                                <button onClick={() => setIsGuidanceOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 mb-2">Required Format:</h4>
                                <div className="text-sm text-blue-800 space-y-1">
                                    <p>• Excel file (.xlsx, .xls)</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDownloadSample}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center justify-center gap-2"
                                >
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Download Excel Sample
                                </button>
                            </div>
                            
                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Choose Excel File to Import:
                                </label>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleImportFile}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 border-t flex justify-end">
                            <button
                                onClick={() => setIsGuidanceOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}