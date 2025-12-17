import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Eye } from 'lucide-react';

export function ManageCertificate() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const [certificates, setCertificates] = useState([
        {
            id: 1,
            name: "Skill Up Test by DigiCoders",
            image: "/certificate.jpg", // Changed from via.placeholder.com to local file to prevent timeout/network errors
            category: "Custom",
            studentName: { included: true, color: "#1e2a59", top: "40%", left: "50%" },
            assessmentName: { included: true, color: "#1e2a59", top: "30%", left: "50%" },
            assessmentCode: { included: false, color: "#1e2a59", top: "0%", left: "0%" },
            usedIn: "2 Assessments",
            status: true
        }
    ]);

    const initialFormState = {
        name: '',
        category: 'Default',
        image: null,
        studentName: { included: false, color: '', top: '', left: '' },
        assessmentName: { included: false, color: '', top: '', left: '' },
        assessmentCode: { included: false, color: '', top: '', left: '' }
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleAdd = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const handleEdit = (cert) => {
        setEditingId(cert.id);
        setFormData({
            name: cert.name,
            category: cert.category,
            image: cert.image,
            studentName: { ...cert.studentName },
            assessmentName: { ...cert.assessmentName },
            assessmentCode: { ...cert.assessmentCode }
        });
        setIsModalOpen(true);
    };

    const handlePreview = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsPreviewOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFormData({ ...formData, image: url });
        }
    };

    const updateNestedState = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        if (editingId) {
            setCertificates(certificates.map(c => c.id === editingId ? {
                ...c,
                name: formData.name,
                category: formData.category,
                image: formData.image || c.image,
                studentName: formData.studentName,
                assessmentName: formData.assessmentName,
                assessmentCode: formData.assessmentCode
            } : c));
        } else {
            setCertificates([...certificates, {
                id: certificates.length + 1,
                name: formData.name,
                image: formData.image || "/certificate.jpg",
                category: formData.category,
                studentName: formData.studentName,
                assessmentName: formData.assessmentName,
                assessmentCode: formData.assessmentCode,
                usedIn: "0 Assessments",
                status: true
            }]);
        }
        setIsModalOpen(false);
    };

    const toggleStatus = (id) => {
        setCertificates(certificates.map(cert =>
            cert.id === id ? { ...cert, status: !cert.status } : cert
        ));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header / Breadcrumb */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-teal-600 font-semibold">Assessment</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">Manage Certificate</span>
                </div>
            </div>

            {/* Controls */}
            <div className="mb-6">
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-md"
                >
                    <Plus className="h-5 w-5" />
                    Add Certificate
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-gray-700 font-semibold uppercase text-sm">All Certificates</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 w-16">#</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Used In</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {certificates.map((cert, index) => (
                                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{cert.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="h-12 w-20 bg-gray-100 border border-gray-200 rounded overflow-hidden flex items-center justify-center relative group">
                                            {cert.image ? (
                                                <img src={cert.image} alt="cert" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-xs text-gray-400">Image</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{cert.category}</td>
                                    <td className="px-6 py-4 text-gray-600">{cert.usedIn}</td>
                                    <td className="px-6 py-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={cert.status}
                                                onChange={() => toggleStatus(cert.id)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePreview(cert.image)}
                                                className="text-gray-500 hover:text-gray-700 border border-gray-400 hover:bg-gray-50 p-1.5 rounded transition-colors"
                                                title="Preview"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(cert)}
                                                className="text-blue-500 hover:text-blue-600 border border-blue-500 hover:bg-blue-50 p-1.5 rounded transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-500 hover:text-red-600 border border-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
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
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-teal-500 text-white px-6 py-4 flex justify-between items-center">
                            <h3 className="font-semibold text-lg">{editingId ? 'Edit Certificate' : 'Add Certificate'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-800 border-b pb-2">Basic Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Certificate Name<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            placeholder="Certificate Name"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Certificate Category<span className="text-red-500">*</span></label>
                                        <div className="flex gap-4 mt-2">
                                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                                <input
                                                    type="radio"
                                                    name="certCategory"
                                                    checked={formData.category === 'Default'}
                                                    onChange={() => setFormData({ ...formData, category: 'Default' })}
                                                    className="text-teal-500 focus:ring-teal-500"
                                                /> Default
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                                <input
                                                    type="radio"
                                                    name="certCategory"
                                                    checked={formData.category === 'Custom'}
                                                    onChange={() => setFormData({ ...formData, category: 'Custom' })}
                                                    className="text-teal-500 focus:ring-teal-500"
                                                /> Custom
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Upload Image<span className="text-red-500">*</span></label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-500 text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                </div>
                            </div>

                            {/* Configurations */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-semibold text-gray-800 border-b pb-2">Content Configuration</h4>

                                {/* Student Name Section */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-sm font-medium text-gray-700">Student Name</h5>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.studentName.included}
                                                onChange={(e) => updateNestedState('studentName', 'included', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                                        </label>
                                    </div>
                                    {formData.studentName.included && (
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Color</label>
                                                <input
                                                    type="text"
                                                    placeholder="#000000"
                                                    value={formData.studentName.color}
                                                    onChange={(e) => updateNestedState('studentName', 'color', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Top</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 40%"
                                                    value={formData.studentName.top}
                                                    onChange={(e) => updateNestedState('studentName', 'top', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Left</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 50%"
                                                    value={formData.studentName.left}
                                                    onChange={(e) => updateNestedState('studentName', 'left', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Assessment Name Section */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-sm font-medium text-gray-700">Assessment Name</h5>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.assessmentName.included}
                                                onChange={(e) => updateNestedState('assessmentName', 'included', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                                        </label>
                                    </div>
                                    {formData.assessmentName.included && (
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Color</label>
                                                <input
                                                    type="text"
                                                    placeholder="#000000"
                                                    value={formData.assessmentName.color}
                                                    onChange={(e) => updateNestedState('assessmentName', 'color', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Top</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 50%"
                                                    value={formData.assessmentName.top}
                                                    onChange={(e) => updateNestedState('assessmentName', 'top', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Left</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 20%"
                                                    value={formData.assessmentName.left}
                                                    onChange={(e) => updateNestedState('assessmentName', 'left', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Assessment Code Section */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-sm font-medium text-gray-700">Assessment Code</h5>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.assessmentCode.included}
                                                onChange={(e) => updateNestedState('assessmentCode', 'included', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                                        </label>
                                    </div>
                                    {formData.assessmentCode.included && (
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Color</label>
                                                <input
                                                    type="text"
                                                    placeholder="#000000"
                                                    value={formData.assessmentCode.color}
                                                    onChange={(e) => updateNestedState('assessmentCode', 'color', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Top</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 60%"
                                                    value={formData.assessmentCode.top}
                                                    onChange={(e) => updateNestedState('assessmentCode', 'top', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Left</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 20%"
                                                    value={formData.assessmentCode.left}
                                                    onChange={(e) => updateNestedState('assessmentCode', 'left', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-start">
                            <button
                                onClick={handleSave}
                                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                            >
                                <span className="bg-white text-teal-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">✓</span>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {isPreviewOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh]">
                        <button
                            onClick={() => setIsPreviewOpen(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <X className="h-8 w-8" />
                        </button>
                        <img src={selectedImage} alt="Certificate Preview" className="w-full h-auto rounded-lg shadow-2xl" />
                    </div>
                </div>
            )}
        </div>
    );
}
