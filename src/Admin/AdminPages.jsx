import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Printer, X, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
export { ManageCertificate } from './ManageCertificate';

const PlaceholderPage = ({ title }) => (
    <div className="p-6 bg-gray-50 h-full flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500">This feature is coming soon.</p>
    </div>
);




export function ManageTopics() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [topicName, setTopicName] = useState('');

    const [topics, setTopics] = useState([
        { id: 1, name: 'TECHNICAL TEST', questions: 2, status: true },
        { id: 2, name: 'Tech Interview Test', questions: 0, status: true },
        { id: 3, name: 'Interview Questions', questions: 0, status: true },
    ]);

    const filteredTopics = topics.filter(topic =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = () => {
        if (topicName.trim()) {
            const newTopic = {
                id: topics.length + 1,
                name: topicName,
                questions: 0,
                status: true
            };
            setTopics([...topics, newTopic]);
            setTopicName('');
            setIsDialogOpen(false);
            toast.success("Topic Added Successfully!");
        }
    };

    const toggleStatus = (id) => {
        setTopics(topics.map(topic =>
            topic.id === id ? { ...topic, status: !topic.status } : topic
        ));
    };

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
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
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2 bg-[#319795] hover:bg-[#2B7A73] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-md"
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                            {filteredTopics.map((topic, index) => (
                                <tr key={topic.id} className="border-b border-gray-100 hover:bg-[#E6FFFA] transition-colors">
                                    <td className="px-6 py-4 text-[#2D3748]">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={topic.status}
                                                onChange={() => toggleStatus(topic.id)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#319795]"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 text-[#2D3748]">{topic.name}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => navigate(`/admin/topic-questions/${topic.id}`)}
                                            className="bg-[#319795] hover:bg-[#2B7A73] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Questions ({topic.questions})
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/print/${topic.id}`)}
                                                className="text-[#319795] hover:text-[#2B7A73] border border-[#319795] hover:border-[#2B7A73] px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                            >
                                                Print
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/edit/${topic.id}`)}
                                                className="text-[#319795] hover:text-[#2B7A73] border border-[#319795] hover:border-[#2B7A73] p-1.5 rounded transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 p-1.5 rounded transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all scale-100">
                        <div className="flex items-center justify-between px-6 py-4 bg-[#319795] text-white rounded-t-lg">
                            <h3 className="text-xl font-semibold">Add Topic</h3>
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


export function ActiveAssessment() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);
    const [assessments, setAssessments] = useState([
        {
            id: 1,
            status: true,
            currentQuestions: 100,
            totalQuestions: 100,
            name: "Skill Up Test by DigiCoders",
            duration: "30 Min",
            code: "DCT2025",
            attempts: 6780,
            startTime: "2025-12-13T11:46",
            endTime: "2025-12-13T23:46",
            remark: "Skill Up Test by DigiCoders 13 Dec 2025",
            hasCertificate: true,
            certificateType: "Custom",
            includeAssessmentName: true,
            includeAssessmentCode: true,
            includeStudentName: true
        }
    ]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        totalQuestions: '',
        duration: '',
        startTime: '',
        endTime: '',
        hasCertificate: 'No',
        certificateType: 'Default',
        remark: '',
        includeAssessmentName: 'Yes',
        includeAssessmentCode: 'Yes',
        includeStudentName: 'Yes'
    });

    const handleEdit = (assessment) => {
        setEditingAssessment(assessment);
        setFormData({
            name: assessment.name,
            code: assessment.code,
            totalQuestions: assessment.totalQuestions,
            duration: assessment.duration.replace(' Min', ''),
            startTime: assessment.startTime,
            endTime: assessment.endTime,
            hasCertificate: assessment.hasCertificate ? 'Yes' : 'No',
            certificateType: assessment.certificateType || 'Default',
            remark: assessment.remark,
            includeAssessmentName: assessment.includeAssessmentName ? 'Yes' : 'No',
            includeAssessmentCode: assessment.includeAssessmentCode ? 'Yes' : 'No',
            includeStudentName: assessment.includeStudentName ? 'Yes' : 'No'
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingAssessment(null);
        setFormData({
            name: '',
            code: '',
            totalQuestions: '',
            duration: '',
            startTime: '',
            endTime: '',
            hasCertificate: 'No',
            certificateType: 'Default',
            remark: '',
            includeAssessmentName: 'Yes',
            includeAssessmentCode: 'Yes',
            includeStudentName: 'Yes'
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingAssessment) {
            setAssessments(assessments.map(a => a.id === editingAssessment.id ? {
                ...a,
                name: formData.name,
                code: formData.code,
                totalQuestions: parseInt(formData.totalQuestions),
                duration: `${formData.duration} Min`,
                startTime: formData.startTime,
                endTime: formData.endTime,
                hasCertificate: formData.hasCertificate === 'Yes',
                certificateType: formData.hasCertificate === 'Yes' ? formData.certificateType : null,
                remark: formData.remark,
                includeAssessmentName: formData.includeAssessmentName === 'Yes',
                includeAssessmentCode: formData.includeAssessmentCode === 'Yes',
                includeStudentName: formData.includeStudentName === 'Yes'
            } : a));
        } else {
            setAssessments([...assessments, {
                id: assessments.length + 1,
                status: true,
                currentQuestions: 0,
                totalQuestions: parseInt(formData.totalQuestions) || 0,
                name: formData.name,
                duration: `${formData.duration} Min`,
                code: formData.code,
                attempts: 0,
                startTime: formData.startTime,
                endTime: formData.endTime,
                remark: formData.remark,
                hasCertificate: formData.hasCertificate === 'Yes',
                certificateType: formData.hasCertificate === 'Yes' ? formData.certificateType : null,
                includeAssessmentName: formData.includeAssessmentName === 'Yes',
                includeAssessmentCode: formData.includeAssessmentCode === 'Yes',
                includeStudentName: formData.includeStudentName === 'Yes'
            }]);
        }
        setIsModalOpen(false);
    };

    const toggleStatus = (id) => {
        setAssessments(assessments.map(a => a.id === id ? { ...a, status: !a.status } : a));
    };

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#319795] font-semibold">Assessment</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#2D3748]">Active Assessment</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-[#319795] hover:bg-[#2c7a7b] text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm text-sm"
                >
                    <Plus className="h-4 w-4 text-white" />
                    Add Assessment
                </button>

                <div className="relative w-full sm:w-auto flex items-center gap-2">
                    <span className="text-sm text-[#2D3748]">Search:</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1.5 w-64 focus:outline-none focus:border-[#319795] transition-colors text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E6FFFA] overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar ">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-[#E6FFFA] text-[#2D3748] font-semibold border-b border-[#319795]">
                            <tr>
                                <th className="px-4 py-3 w-16">Sr No.</th>
                                <th className="px-4 py-3 w-20">Status</th>
                                <th className="px-4 py-3">Questions</th>
                                <th className="px-4 py-3">Assessment Name</th>
                                <th className="px-4 py-3">Assessment Code</th>
                                <th className="px-4 py-3">Date-Time</th>
                                <th className="px-4 py-3">Remark</th>
                                <th className="px-4 py-3">Certificate</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6FFFA]">
                            {assessments.map((item, index) => (
                                <tr key={item.id} >
                                    <td className="px-4 py-3 align-top">{index + 1}</td>
                                    <td className="px-4 py-3 align-top">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={item.status}
                                                onChange={() => toggleStatus(item.id)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#319795]"></div>
                                        </label>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <button
                                            onClick={() => navigate(`/admin/assign-questions/${item.id}`)}
                                            className="bg-emerald-400 text-white px-3 py-1 rounded text-xs font-medium hover:bg-emerald-500 transition-colors"
                                        >
                                            Questions ({localStorage.getItem(`assessment_${item.id}_questions`) || item.currentQuestions}/{item.totalQuestions})
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="font-medium text-[#2D3748]">{item.name}</div>
                                        <div className="text-xs bg-[#F56565]/20 text-[#B8322F] inline-block px-1.5 rounded mt-1">
                                            {item.duration}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="font-medium text-[#2D3748]">{item.code}</div>
                                        <div className="text-xs bg-[#F56565]/20 text-[#B8322F] inline-block px-1.5 rounded mt-1">
                                            Attempts: {item.attempts}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top text-gray-500 text-xs whitespace-nowrap">
                                        <div>{item.startTime}</div>
                                        <div>{item.endTime}</div>
                                    </td>
                                    <td className="px-4 py-3 align-top text-[#2D3748]">{item.remark}</td>
                                    <td className="px-4 py-3 align-top text-[#2D3748]">
                                        <div>{item.hasCertificate ? 'Yes' : 'No'} , {item.certificateType}</div>
                                        <div className="text-xs text-gray-400">{item.name}</div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="flex flex-col gap-1.5">
                                            <button
                                                onClick={() => navigate(`/admin/assessment/result/${item.id}`)}
                                                className="border border-[#319795] text-[#319795] px-2 py-0.5 rounded text-xs hover:bg-[#E6FFFA]"
                                            >
                                                Result
                                            </button>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-1 border border-[#319795] text-[#319795] rounded hover:bg-[#E6FFFA]"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </button>
                                                <button className="px-2 py-0.5 border border-[#F56565] text-[#F56565] rounded text-xs hover:bg-[#F56565]/20">
                                                    Data Export
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-[#E6FFFA] text-xs text-[#2D3748] flex justify-between items-center">
                    <span>Showing 1 to {assessments.length} of {assessments.length} entries</span>
                    <div className="flex gap-1">
                        <span className="text-gray-400">Previous</span>
                        <span className="font-medium text-[#2D3748]">1</span>
                        <span className="text-gray-400">Next</span>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-[#319795] text-[#E6FFFA] px-6 py-4 flex justify-between items-center">
                            <h3 className="font-semibold text-lg">{editingAssessment ? 'Edit Assessment Schedule' : 'Add Assessment Schedule'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#E6FFFA] hover:text-[#B2F5EA]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                            {/* Form fields (same as before) */}
                            {/* Inputs with focus:border-[#319795] */}
                        </div>

                        <div className="bg-[#EDF2F7] px-6 py-4 flex justify-start">
                            <button
                                onClick={handleSave}
                                className="bg-[#319795] hover:bg-[#2c7a7b] text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <span className="bg-white text-[#319795] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✓</span>
                                {editingAssessment ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export function AssessmentHistory() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);
    const [assessments, setAssessments] = useState([
        {
            id: 1,
            status: false,
            currentQuestions: 100,
            totalQuestions: 100,
            name: "Skill Up Test by DigiCoders",
            duration: "30 Min",
            code: "DCT2025",
            attempts: 6780,
            startTime: "2025-12-13T11:46",
            endTime: "2025-12-13T23:46",
            remark: "Skill Up Test by DigiCoders 13 Dec 2025",
            hasCertificate: true,
            certificateType: "Custom"
        }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        totalQuestions: '',
        duration: '',
        startTime: '',
        endTime: '',
        hasCertificate: 'No',
        certificateType: 'Default',
        remark: ''
    });

    const handleEdit = (assessment) => {
        setEditingAssessment(assessment);
        setFormData({
            name: assessment.name,
            code: assessment.code,
            totalQuestions: assessment.totalQuestions,
            duration: assessment.duration.replace(' Min', ''),
            startTime: assessment.startTime,
            endTime: assessment.endTime,
            hasCertificate: assessment.hasCertificate ? 'Yes' : 'No',
            certificateType: assessment.certificateType || 'Default',
            remark: assessment.remark
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingAssessment(null);
        setFormData({
            name: '',
            code: '',
            totalQuestions: '',
            duration: '',
            startTime: '',
            endTime: '',
            hasCertificate: 'No',
            certificateType: 'Default',
            remark: ''
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingAssessment) {
            setAssessments(assessments.map(a => a.id === editingAssessment.id ? {
                ...a,
                name: formData.name,
                code: formData.code,
                totalQuestions: parseInt(formData.totalQuestions),
                duration: `${formData.duration} Min`,
                startTime: formData.startTime,
                endTime: formData.endTime,
                hasCertificate: formData.hasCertificate === 'Yes',
                certificateType: formData.hasCertificate === 'Yes' ? formData.certificateType : null,
                remark: formData.remark
            } : a));
        } else {
            setAssessments([...assessments, {
                id: assessments.length + 1,
                status: false,
                currentQuestions: 0,
                totalQuestions: parseInt(formData.totalQuestions) || 0,
                name: formData.name,
                duration: `${formData.duration} Min`,
                code: formData.code,
                attempts: 0,
                startTime: formData.startTime,
                endTime: formData.endTime,
                remark: formData.remark,
                hasCertificate: formData.hasCertificate === 'Yes',
                certificateType: formData.hasCertificate === 'Yes' ? formData.certificateType : null
            }]);
        }
        setIsModalOpen(false);
    };

    const toggleStatus = (id) => {
        setAssessments(assessments.map(a => a.id === id ? { ...a, status: !a.status } : a));
    };

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#319795] font-semibold">Assessment</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#2D3748]">Assessment History</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-[#319795] hover:bg-[#2c7a7b] text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm text-sm"
                >
                    <Plus className="h-4 w-4 text-white" />
                    Add Assessment
                </button>

                <div className="relative w-full sm:w-auto flex items-center gap-2">
                    <span className="text-sm text-[#2D3748]">Search:</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1.5 w-64 focus:outline-none focus:border-[#319795] transition-colors text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E6FFFA] overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-[#E6FFFA] text-[#2D3748] font-semibold border-b border-[#319795]">
                            <tr>
                                <th className="px-4 py-3 w-16">Sr No.</th>
                                <th className="px-4 py-3 w-20">Status</th>
                                <th className="px-4 py-3">Questions</th>
                                <th className="px-4 py-3">Assessment Name</th>
                                <th className="px-4 py-3">Assessment Code</th>
                                <th className="px-4 py-3">Date-Time</th>
                                <th className="px-4 py-3">Remark</th>
                                <th className="px-4 py-3">Certificate</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6FFFA]">
                            {assessments.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-3 align-top">{index + 1}</td>
                                    <td className="px-4 py-3 align-top">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={item.status}
                                                onChange={() => toggleStatus(item.id)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#319795]"></div>
                                        </label>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <button
                                            onClick={() => navigate(`/admin/assign-questions/${item.id}`)}
                                            className="bg-emerald-400 text-white px-3 py-1 rounded text-xs font-medium hover:bg-emerald-500 transition-colors"
                                        >
                                            Questions ({localStorage.getItem(`assessment_${item.id}_questions`) || item.currentQuestions}/{item.totalQuestions})
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="font-medium text-[#2D3748]">{item.name}</div>
                                        <div className="text-xs bg-[#F56565]/20 text-[#B8322F] inline-block px-1.5 rounded mt-1">
                                            {item.duration}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="font-medium text-[#2D3748]">{item.code}</div>
                                        <div className="text-xs bg-[#F56565]/20 text-[#B8322F] inline-block px-1.5 rounded mt-1">
                                            Attempts: {item.attempts}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top text-gray-500 text-xs whitespace-nowrap">
                                        <div>{item.startTime}</div>
                                        <div>{item.endTime}</div>
                                    </td>
                                    <td className="px-4 py-3 align-top text-[#2D3748]">{item.remark}</td>
                                    <td className="px-4 py-3 align-top text-[#2D3748]">
                                        <div>{item.hasCertificate ? 'Yes' : 'No'} , {item.certificateType}</div>
                                        <div className="text-xs text-gray-400">{item.name}</div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="flex flex-col gap-1.5">
                                            <button
                                                onClick={() => navigate(`/admin/assessment/result/${item.id}`)}
                                                className="border border-[#319795] text-[#319795] px-2 py-0.5 rounded text-xs hover:bg-[#E6FFFA]"
                                            >
                                                Result
                                            </button>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-1 border border-[#319795] text-[#319795] rounded hover:bg-[#E6FFFA]"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </button>
                                                <button className="px-2 py-0.5 border border-[#F56565] text-[#F56565] rounded text-xs hover:bg-[#F56565]/20">
                                                    Data Export
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-[#319795] text-[#E6FFFA] px-6 py-4 flex justify-between items-center">
                            <h3 className="font-semibold text-lg">{editingAssessment ? 'Edit Assessment Schedule' : 'Add Assessment Schedule'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#E6FFFA] hover:text-[#B2F5EA]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                            {/* Form fields same as ActiveAssessment */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Assessment Name<span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#319795]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Assessment Code<span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#319795]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Total Question<span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    value={formData.totalQuestions}
                                    onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#319795]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Time Duration (Min)<span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#319795]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date-Time<span className="text-red-500">*</span></label>
                                <input
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#319795]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">End Date-Time<span className="text-red-500">*</span></label>
                                <input
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#319795]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Generate Certificate</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                        <input
                                            type="radio"
                                            name="cert_history"
                                            checked={formData.hasCertificate === 'Yes'}
                                            onChange={() => setFormData({ ...formData, hasCertificate: 'Yes' })}
                                            className="text-[#319795] focus:ring-[#319795]"
                                        /> Yes
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                        <input
                                            type="radio"
                                            name="cert_history"
                                            checked={formData.hasCertificate === 'No'}
                                            onChange={() => setFormData({ ...formData, hasCertificate: 'No' })}
                                            className="text-[#319795] focus:ring-[#319795]"
                                        /> No
                                    </label>
                                </div>
                            </div>
                            {formData.hasCertificate === 'Yes' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Certificate Type</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm text-gray-600">
                                            <input
                                                type="radio"
                                                name="certType_history"
                                                checked={formData.certificateType === 'Default'}
                                                onChange={() => setFormData({ ...formData, certificateType: 'Default' })}
                                                className="text-[#319795] focus:ring-[#319795]"
                                            /> Default
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-gray-600">
                                            <input
                                                type="radio"
                                                name="certType_history"
                                                checked={formData.certificateType === 'Custom'}
                                                onChange={() => setFormData({ ...formData, certificateType: 'Custom' })}
                                                className="text-[#319795] focus:ring-[#319795]"
                                            /> Custom
                                        </label>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Remark</label>
                                <input
                                    type="text"
                                    value={formData.remark}
                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#319795]"
                                />
                            </div>
                        </div>

                        <div className="bg-[#EDF2F7] px-6 py-4 flex justify-start">
                            <button
                                onClick={handleSave}
                                className="bg-[#319795] hover:bg-[#2c7a7b] text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <span className="bg-white text-[#319795] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✓</span>
                                {editingAssessment ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export function ManageStudents() {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([
        { id: 1, name: "Aditya Kashyap", phone: "9876543210", email: "aditya@example.com", course: "B.Tech CSE", status: true, date: "2023-12-12" },
        { id: 2, name: "Masoom Abbas", phone: "7890123456", email: "masoom@example.com", course: "B.Tech IT", status: true, date: "2023-12-10" },
        { id: 3, name: "Rahul Singh", phone: "8901234567", email: "rahul@example.com", course: "MCA", status: false, date: "2023-11-25" },
        { id: 4, name: "Priya Sharma", phone: "9012345678", email: "priya@example.com", course: "BCA", status: true, date: "2023-12-01" },
        { id: 5, name: "Amit Patel", phone: "6789012345", email: "amit@example.com", course: "Diploma CS", status: true, date: "2023-12-05" },
    ]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone.includes(searchQuery) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleStatus = (id) => {
        setStudents(students.map(s => s.id === id ? { ...s, status: !s.status } : s));
    };

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#319795] font-semibold">Students</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#2D3748]">Manage Students</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search students..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#319795] transition-colors"
                    />
                </div>
                <div className="text-sm text-gray-500">
                    Total Students: <span className="font-semibold text-gray-700">{filteredStudents.length}</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E6FFFA] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-[#E6FFFA] text-[#2D3748] font-semibold border-b border-[#319795]">
                            <tr>
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Course</th>
                                <th className="px-6 py-4">Reg. Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6FFFA]">
                            {filteredStudents.map((student, index) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-[#2D3748]">{student.name}</td>
                                    <td className="px-6 py-4 text-[#4A5568]">{student.phone}</td>
                                    <td className="px-6 py-4 text-[#4A5568]">{student.email}</td>
                                    <td className="px-6 py-4 text-[#4A5568]">
                                        <span className="bg-blue-50 text-blue-600 py-1 px-2 rounded text-xs border border-blue-100">
                                            {student.course}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">{student.date}</td>
                                    <td className="px-6 py-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={student.status}
                                                onChange={() => toggleStatus(student.id)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#319795]"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="text-[#319795] hover:text-[#2c7a7b] border border-[#319795] hover:bg-[#E6FFFA] p-1.5 rounded transition-colors" title="Edit">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-[#F56565] hover:text-[#C53030] border border-[#F56565] hover:bg-[#F56565]/20 p-1.5 rounded transition-colors" title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


export function ManageCertificate_Old() {
    const [certificates, setCertificates] = useState([
        {
            id: 1,
            name: "Skill Up Test by DigiCoders",
            image: "https://via.placeholder.com/150",
            category: "Custom",
            color: "#1e2a59",
            usedIn: "2 Assessments",
            status: true
        }
    ]);

    const toggleStatus = (id) => {
        setCertificates(certificates.map(cert =>
            cert.id === id ? { ...cert, status: !cert.status } : cert
        ));
    };

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            {/* Header / Breadcrumb */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#319795] font-semibold">Assessment</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#2D3748]">Manage Certificate</span>
                </div>
            </div>

            {/* Controls */}
            <div className="mb-6">
                <button className="flex items-center gap-2 bg-[#319795] hover:bg-[#2c7a7b] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                    <Plus className="h-5 w-5" />
                    Add Certificate
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E6FFFA] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E6FFFA]">
                    <h3 className="text-[#2D3748] font-semibold uppercase text-sm">All Certificates</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-[#E6FFFA] text-[#2D3748] font-semibold border-b border-[#319795]">
                            <tr>
                                <th className="px-6 py-4 w-16">#</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Color</th>
                                <th className="px-6 py-4">Used In</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6FFFA]">
                            {certificates.map((cert, index) => (
                                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-[#2D3748]">{cert.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="h-12 w-20 bg-gray-100 border border-gray-200 rounded overflow-hidden flex items-center justify-center text-xs text-gray-400">
                                            Image
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#4A5568]">{cert.category}</td>
                                    <td className="px-6 py-4 text-[#4A5568]">{cert.color}</td>
                                    <td className="px-6 py-4 text-[#4A5568]">{cert.usedIn}</td>
                                    <td className="px-6 py-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={cert.status}
                                                onChange={() => toggleStatus(cert.id)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#319795]"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="text-[#319795] hover:text-[#2c7a7b] border border-[#319795] hover:bg-[#E6FFFA] p-1.5 rounded transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-[#F56565] hover:text-[#C53030] border border-[#F56565] hover:bg-[#F56565]/20 p-1.5 rounded transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


export function SecuritySettings() {
    const { user, login } = useUser();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [twoFactor, setTwoFactor] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || 'Admin User',
        email: user?.email || 'admin@digicoders.com',
        image: user?.image || null
    });

    const handlePasswordChange = () => {
        if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match!");
        if (!passwords.current || !passwords.new) return toast.error("Fill all password fields!");
        toast.success("Password updated successfully!");
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const handleProfileUpdate = () => {
        login({ ...user, ...profile });
        toast.success("Profile updated successfully!");
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) setProfile({ ...profile, image: URL.createObjectURL(file) });
    };

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#319795] font-semibold">Settings</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#2D3748]">Security & Profile</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Edit Profile Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-[#2D3748] mb-6 border-b pb-2">Edit Profile</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-20 w-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center relative group">
                                {profile.image ? (
                                    <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-xs">No Image</span>
                                )}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs">
                                    Change
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Profile Picture</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#319795] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#319795] transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleProfileUpdate}
                            className="w-full bg-[#319795] hover:bg-[#2c7a7b] text-white font-medium py-2 rounded transition-colors shadow-sm mt-2"
                        >
                            Save Profile
                        </button>
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-[#2D3748] mb-6 border-b pb-2">Change Password</h3>
                    <div className="space-y-4">
                        {["current", "new", "confirm"].map((field, i) => (
                            <div key={i}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field === "current" ? "Current Password" : field === "new" ? "New Password" : "Confirm New Password"}
                                </label>
                                <input
                                    type="password"
                                    value={passwords[field]}
                                    onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#319795] transition-colors"
                                />
                            </div>
                        ))}
                        <button
                            onClick={handlePasswordChange}
                            className="w-full bg-[#319795] hover:bg-[#2c7a7b] text-white font-medium py-2 rounded transition-colors shadow-sm mt-2"
                        >
                            Update Password
                        </button>
                    </div>
                </div>

                {/* Two-Factor Authentication Card */}
                <div className="bg-white rounded-lg shadow-md p-6 h-fit lg:col-span-2">
                    <h3 className="text-lg font-semibold text-[#2D3748] mb-6 border-b pb-2">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-700">Enable Two-Factor Authentication (2FA)</p>
                            <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={twoFactor}
                                onChange={() => {
                                    setTwoFactor(!twoFactor);
                                    toast.info(twoFactor ? "2FA Disabled" : "2FA Enabled");
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#319795]"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

