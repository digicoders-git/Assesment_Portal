import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createTopicApi, getAllTopicsApi, updateTopicApi, deleteTopicApi, toggleTopicStatusApi } from '../API/topic';

export function ManageTopics() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [topicName, setTopicName] = useState('');
    const [topics, setTopics] = useState([]);
    const [editingTopic, setEditingTopic] = useState(null);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await getAllTopicsApi();
            const topicsData = response.topics;
            // console.log(response.topics)
            setTopics(Array.isArray(topicsData) ? topicsData : []);
        } catch (error) {
            toast.error('Failed to fetch topics');
            setTopics([]);
        }
    };

    const filteredTopics = Array.isArray(topics) ? topics.filter(topic =>
        topic.topicName?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const handleSubmit = async () => {
        if (topicName.trim()) {
            try {
                if (editingTopic) {
                    await updateTopicApi(editingTopic._id, { topicName });
                    toast.success("Topic Updated Successfully!");
                } else {
                    await createTopicApi({ topicName });
                    toast.success("Topic Added Successfully!");
                }
                setTopicName('');
                setEditingTopic(null);
                setIsDialogOpen(false);
                fetchTopics();
                window.dispatchEvent(new Event('dashboardUpdated'));
            } catch (error) {
                toast.error(editingTopic ? 'Failed to update topic' : 'Failed to add topic');
            }
        }
    };

    const handleToggleStatus = async (topic) => {
        try {
            const response = await toggleTopicStatusApi(topic._id);
            toast.success(response.message);
            fetchTopics();
            window.dispatchEvent(new Event('dashboardUpdated'));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to toggle status');
        }
    };

    const handleEdit = (topic) => {
        setEditingTopic(topic);
        setTopicName(topic.topicName);
        setIsDialogOpen(true);
    };

    const handleDelete = async (topic) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete "${topic.topicName}" topic?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteTopicApi(topic._id);
                toast.success('Topic deleted successfully!');
                fetchTopics();
                window.dispatchEvent(new Event('dashboardUpdated'));
            } catch (error) {
                toast.error('Failed to delete topic');
            }
        }
    };

    return (
        <div className="p-6">
            {/* Breadcrumb */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#319795] font-semibold">Topics</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-700">Manage Topics</span>
                </div>
            </div>

            {/* Add Topic Button and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <button
                    onClick={() => {
                        setTopicName('');
                        setEditingTopic(null);
                        setIsDialogOpen(true);
                    }}
                    className="flex items-center gap-2 bg-[#319795] hover:bg-[#2B7A73] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Topic
                </button>

                <div className="relative w-full sm:w-auto">
                    <span className="text-sm text-gray-700 mr-2">Search:</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Topic"
                        className="border border-gray-300 rounded px-3 py-1.5 w-48 focus:outline-none focus:border-[#319795] transition-colors"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#E6FFFA] border-b border-[#B2F5EA]">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[#2D3748]">Sr.No.</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[#2D3748]">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[#2D3748]">Topic Name</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[#2D3748]">Add Question</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[#2D3748]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTopics.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No topics found
                                    </td>
                                </tr>
                            ) : (
                                filteredTopics.map((topic, index) => (
                                    <tr key={topic._id} className="border-b border-gray-100 hover:bg-[#E6FFFA] transition-colors">
                                        <td className="px-6 py-4 text-[#2D3748]">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={topic.status}
                                                    onChange={() => handleToggleStatus(topic)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#319795]"></div>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4 text-[#2D3748]">{topic.topicName}</td>

                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => navigate(`/admin/topic-questions/${topic._id}`)}
                                                className="bg-[#319795] hover:bg-[#2B7A73] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                Questions ({topic.questionCout || 0})
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/print/${topic._id}`)}
                                                    className="text-[#319795] hover:text-[#2B7A73] border border-[#319795] hover:border-[#2B7A73] px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                                >
                                                    Print
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(topic)}
                                                    className="text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 p-1.5 rounded transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(topic)}
                                                    className="text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 p-1.5 rounded transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
                    <div>Showing 1 to {filteredTopics.length} of {topics.length} entries</div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 hover:bg-gray-100 rounded transition-colors">Previous</button>
                        <button className="px-3 py-1 bg-[#319795] text-white rounded">1</button>
                        <button className="px-3 py-1 hover:bg-gray-100 rounded transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {/* Add Topic Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
                    <div className="bg-white rounded-lg max-w-md w-full transform transition-all scale-100">
                        <div className="flex items-center justify-between px-6 py-4 bg-[#319795] text-white rounded-t-lg">
                            <h3 className="text-xl font-semibold">{editingTopic ? 'Edit Topic' : 'Add Topic'}</h3>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Topic Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={topicName}
                                onChange={(e) => setTopicName(e.target.value)}
                                placeholder="Assessment Name"
                                className="w-full border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:border-[#319795] transition-colors"
                                autoFocus
                            />
                        </div>
                        <div className="px-6 pb-6">
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-[#319795] hover:bg-[#2B7A73] text-white py-2.5 rounded font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="inline-block w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#319795] text-xs">✓</span>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}