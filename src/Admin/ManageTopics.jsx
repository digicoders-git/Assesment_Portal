import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, BookOpen, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function ManageTopics() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    // Load topics from localStorage on component mount
    useEffect(() => {
        const savedTopics = JSON.parse(localStorage.getItem('manage_topics') || '[]');
        if (savedTopics.length === 0) {
            // Default topics if none exist
            const defaultTopics = [
                { id: 1, name: 'TECHNICAL TEST', description: 'Technical programming questions', createdAt: new Date().toISOString() },
                { id: 2, name: 'Tech Interview Test', description: 'Technical interview questions', createdAt: new Date().toISOString() },
                { id: 3, name: 'Interview Questions', description: 'General interview questions', createdAt: new Date().toISOString() }
            ];
            setTopics(defaultTopics);
            localStorage.setItem('manage_topics', JSON.stringify(defaultTopics));
        } else {
            setTopics(savedTopics);
        }
    }, []);

    // Save topics to localStorage whenever topics change
    useEffect(() => {
        if (topics.length > 0) {
            localStorage.setItem('manage_topics', JSON.stringify(topics));
        }
    }, [topics]);

    const handleAdd = () => {
        setEditingTopic(null);
        setFormData({ name: '', description: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (topic) => {
        setEditingTopic(topic);
        setFormData({ name: topic.name, description: topic.description || '' });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            toast.error('Topic name is required!');
            return;
        }

        // Check for duplicate names (excluding current editing topic)
        const isDuplicate = topics.some(topic => 
            topic.name.toLowerCase() === formData.name.toLowerCase() && 
            topic.id !== editingTopic?.id
        );

        if (isDuplicate) {
            toast.error('Topic name already exists!');
            return;
        }

        if (editingTopic) {
            setTopics(topics.map(topic => 
                topic.id === editingTopic.id 
                    ? { ...topic, name: formData.name.trim(), description: formData.description.trim() }
                    : topic
            ));
            toast.success('Topic updated successfully');
        } else {
            const newTopic = {
                id: Date.now(),
                name: formData.name.trim(),
                description: formData.description.trim(),
                createdAt: new Date().toISOString()
            };
            setTopics([...topics, newTopic]);
            toast.success('Topic added successfully');
        }
        
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will also delete all questions in this topic!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#319795',
            cancelButtonColor: '#f56565',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setTopics(topics.filter(topic => topic.id !== id));
                
                // Also remove questions for this topic
                const questionsKey = `topic_${id}_questions`;
                localStorage.removeItem(questionsKey);
                
                toast.success('Topic and its questions deleted successfully');
            }
        });
    };

    const getQuestionCount = (topicId) => {
        const questionsKey = `topic_${topicId}_questions`;
        const questions = JSON.parse(localStorage.getItem(questionsKey) || '[]');
        return questions.length;
    };

    const handleManageQuestions = (topicId) => {
        navigate(`/admin/topic-questions/${topicId}`);
    };

    return (
        <div className="p-6 bg-[#F7FAFC] min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#2D3748] mb-2">Manage Topics</h1>
                <p className="text-gray-600">Create and manage question topics for assessments</p>
            </div>

            {/* Add Button */}
            <div className="mb-6">
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-[#319795] hover:bg-[#2B7A73] text-white px-4 py-2 rounded-lg font-medium transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Add New Topic
                </button>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                    <div key={topic.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#319795] p-2 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{topic.name}</h3>
                                    <p className="text-sm text-gray-500">{getQuestionCount(topic.id)} Questions</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button 
                                    onClick={() => handleEdit(topic)} 
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit Topic"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(topic.id)} 
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    title="Delete Topic"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        
                        {topic.description && (
                            <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                        )}
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleManageQuestions(topic.id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-all"
                            >
                                <HelpCircle className="h-4 w-4" />
                                Manage Questions
                            </button>
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-400">
                            Created: {new Date(topic.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {topics.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Topics Yet</h3>
                    <p className="text-gray-500 mb-4">Create your first topic to get started</p>
                    <button
                        onClick={handleAdd}
                        className="bg-[#319795] hover:bg-[#2B7A73] text-white px-4 py-2 rounded-lg font-medium"
                    >
                        Add First Topic
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {editingTopic ? 'Edit Topic' : 'Add New Topic'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#319795] outline-none"
                                        placeholder="Enter topic name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#319795] outline-none"
                                        placeholder="Enter topic description (optional)"
                                        rows="3"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-4 py-2 bg-[#319795] text-white rounded-lg hover:bg-[#2B7A73] flex items-center justify-center gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}