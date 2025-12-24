import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';

export function AssessmentHistoryEnhanced() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('all_assessments');
        if (saved) {
            setAssessments(JSON.parse(saved));
        }
    }, []);

    const updateGlobalAssessments = (newList) => {
        localStorage.setItem('all_assessments', JSON.stringify(newList));
        setAssessments(newList);
    };

    const handleExport = (assessment) => {
        // Create comprehensive export data
        const exportData = {
            assessmentInfo: {
                name: assessment.name,
                code: assessment.code,
                totalQuestions: assessment.totalQuestions,
                duration: assessment.duration,
                startTime: assessment.startTime,
                endTime: assessment.endTime,
                status: assessment.status ? "Active" : "Inactive",
                remark: assessment.remark,
                attempts: assessment.attempts,
                hasCertificate: assessment.hasCertificate ? "Yes" : "No",
                certificateType: assessment.certificateType || "N/A"
            },
            exportDate: new Date().toLocaleString(),
            exportedBy: "Admin"
        };

        // Create CSV content
        const headers = ["Field", "Value"];
        const rows = Object.entries(exportData.assessmentInfo).map(([key, value]) => [
            key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            value
        ]);

        const csvContent = [
            `"Assessment Export Report - ${exportData.exportDate}",`,
            `"Exported By: ${exportData.exportedBy}",`,
            "",
            headers.join(","),
            ...rows.map(row => `"${row[0]}","${row[1]}"`)
        ].join("\n");

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${assessment.name.replace(/[^a-zA-Z0-9]/g, "_")}_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Assessment data exported successfully!");
    };

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
        const saved = JSON.parse(localStorage.getItem('all_assessments') || '[]');
        if (editingAssessment) {
            const newList = saved.map(a => a.id === editingAssessment.id ? {
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
            } : a);
            updateGlobalAssessments(newList);
        } else {
            const newList = [...saved, {
                id: Date.now(),
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
                certificateType: formData.hasCertificate === 'Yes' ? formData.certificateType : null
            }];
            updateGlobalAssessments(newList);
        }
        setIsModalOpen(false);
    };

    const toggleStatus = (id) => {
        const saved = JSON.parse(localStorage.getItem('all_assessments') || '[]');
        const newList = saved.map(a => a.id === id ? { ...a, status: !a.status } : a);
        updateGlobalAssessments(newList);
        toast.info("Status updated");
    };

    const handleDeleteAssessment = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This assessment will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#319795",
            cancelButtonColor: "#f56565",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const saved = JSON.parse(localStorage.getItem('all_assessments') || '[]');
                const newList = saved.filter(a => a.id !== id);
                updateGlobalAssessments(newList);
                toast.success("Assessment deleted successfully");
            }
        });
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
                    className="flex items-center gap-2 bg-[#319795] hover:bg-[#2c7a7b] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
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
            <div className="bg-white rounded-lg border border-[#E6FFFA] overflow-hidden">
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
                                                    onClick={() => handleDeleteAssessment(item.id)}
                                                    className="p-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                                <button 
                                                    onClick={() => handleExport(item)}
                                                    className="px-1.5 py-0.5 border border-green-500 text-green-600 rounded text-[10px] hover:bg-green-50 transition-colors"
                                                    title="Export Assessment Data"
                                                >
                                                    Export
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
                    <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-[#319795] text-[#E6FFFA] px-6 py-4 flex justify-between items-center">
                            <h3 className="font-semibold text-lg">{editingAssessment ? 'Edit Assessment Schedule' : 'Add Assessment Schedule'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#E6FFFA] hover:text-[#B2F5EA]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
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