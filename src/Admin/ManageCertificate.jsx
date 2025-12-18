import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, X, Eye, ArrowLeft, Save, Image as ImageIcon, Type, Layout, Grid } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';

export function ManageCertificate() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [view, setView] = useState('list'); // 'list' or 'editor'
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const [certificates, setCertificates] = useState([
        {
            id: 1,
            name: "Skill Up Test by DigiCoders",
            image: "/certificate.jpg",
            studentName: { included: true, color: "#1e2a59", top: "45", left: "50", fontSize: "32", fontFamily: "Playfair Display" },
            assessmentName: { included: true, color: "#1e2a59", top: "35", left: "50", fontSize: "24", fontFamily: "Inter" },
            assessmentCode: { included: true, color: "#1e2a59", top: "60", left: "50", fontSize: "18", fontFamily: "Roboto" },
            usedIn: "2 Assessments",
            status: true
        }
    ]);

    const initialFormState = {
        name: '',
        image: null,
        studentName: { included: true, color: '#1e2a59', top: '50', left: '50', fontSize: '30', fontFamily: 'Inter' },
        assessmentName: { included: false, color: '#1e2a59', top: '40', left: '50', fontSize: '20', fontFamily: 'Inter' },
        assessmentCode: { included: false, color: '#1e2a59', top: '65', left: '50', fontSize: '16', fontFamily: 'Inter' }
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleBackToList = () => {
        setView('list');
        setEditingId(null);
        setFormData(initialFormState);
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setView('editor');
    };

    const handleEdit = (cert) => {
        setEditingId(cert.id);
        setFormData({
            name: cert.name,
            image: cert.image,
            studentName: { ...cert.studentName },
            assessmentName: { ...cert.assessmentName },
            assessmentCode: { ...cert.assessmentCode }
        });
        setView('editor');
    };

    const handlePreviewModal = (cert) => {
        setSelectedImage(cert);
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
        if (!formData.name || !formData.image) {
            toast.error("Please provide a name and upload a certificate image.");
            return;
        }

        if (editingId) {
            setCertificates(certificates.map(c => c.id === editingId ? {
                ...c,
                name: formData.name,
                image: formData.image,
                studentName: formData.studentName,
                assessmentName: formData.assessmentName,
                assessmentCode: formData.assessmentCode
            } : c));
            toast.success("Certificate updated successfully!");
        } else {
            setCertificates([...certificates, {
                id: certificates.length + 1,
                name: formData.name,
                image: formData.image,
                usedIn: "0 Assessments",
                status: true,
                studentName: formData.studentName,
                assessmentName: formData.assessmentName,
                assessmentCode: formData.assessmentCode
            }]);
            toast.success("Certificate added successfully!");
        }
        handleBackToList();
    };

    const toggleStatus = (id) => {
        setCertificates(certificates.map(cert =>
            cert.id === id ? { ...cert, status: !cert.status } : cert
        ));
    };

    const fontFamilies = [
        { name: 'Inter', value: 'Inter, sans-serif' },
        { name: 'Roboto', value: 'Roboto, sans-serif' },
        { name: 'Playfair Display', value: 'Playfair Display, serif' },
        { name: 'Montserrat', value: 'Montserrat, sans-serif' },
        { name: 'Dancing Script', value: 'Dancing Script, cursive' },
        { name: 'Courier New', value: 'Courier New, monospace' },
    ];

    if (view === 'editor') {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Editor Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{editingId ? 'Edit Certificate' : 'Create New Certificate'}</h2>
                            <p className="text-sm text-gray-500">Design your certificate layout with live preview</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md active:scale-95"
                    >
                        <Save className="h-5 w-5" />
                        Save Certificate
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Properties */}
                    <div className="lg:col-span-5 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] pr-2 custom-scrollbar">
                        {/* Basic Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Layout className="h-4 w-4 text-teal-500" />
                                Basic Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">CERTIFICATE NAME</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. React Workshop Completion"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">UPLOAD TEMPLATE</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="cert-upload"
                                            accept="image/*"
                                        />
                                        <label
                                            htmlFor="cert-upload"
                                            className="flex items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer"
                                        >
                                            <ImageIcon className="h-8 w-8 text-gray-400 group-hover:text-teal-500" />
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-gray-700">Click to upload template</p>
                                                <p className="text-xs text-gray-500 mt-1">PNG, JPG recommended (1200x800)</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Text Layer Components */}
                        {[
                            { id: 'studentName', label: 'Student Name', sample: 'John Doe' },
                            { id: 'assessmentName', label: 'Assessment Name', sample: 'Full Stack Development Quiz' },
                            { id: 'assessmentCode', label: 'Assessment Code', sample: 'DCT-2025-001' }
                        ].map((layer) => (
                            <div key={layer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                        <Type className="h-4 w-4 text-teal-500" />
                                        {layer.label}
                                    </h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData[layer.id].included}
                                            onChange={(e) => updateNestedState(layer.id, 'included', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                                    </label>
                                </div>

                                {formData[layer.id].included && (
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-2">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Font Family</label>
                                            <select
                                                value={formData[layer.id].fontFamily}
                                                onChange={(e) => updateNestedState(layer.id, 'fontFamily', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                            >
                                                {fontFamilies.map(f => (
                                                    <option key={f.name} value={f.name}>{f.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Font Size (px)</label>
                                            <input
                                                type="number"
                                                value={formData[layer.id].fontSize}
                                                onChange={(e) => updateNestedState(layer.id, 'fontSize', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Text Color</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={formData[layer.id].color}
                                                    onChange={(e) => updateNestedState(layer.id, 'color', e.target.value)}
                                                    className="w-10 h-9 p-1 border border-gray-300 rounded-lg cursor-pointer bg-white"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData[layer.id].color}
                                                    onChange={(e) => updateNestedState(layer.id, 'color', e.target.value)}
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none uppercase"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase font-serif">Vertical Position (%)</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={formData[layer.id].top}
                                                    onChange={(e) => updateNestedState(layer.id, 'top', e.target.value)}
                                                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                                />
                                                <span className="text-xs font-medium text-gray-600 min-w-[30px]">{formData[layer.id].top}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Horizontal Position (%)</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={formData[layer.id].left}
                                                    onChange={(e) => updateNestedState(layer.id, 'left', e.target.value)}
                                                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                                />
                                                <span className="text-xs font-medium text-gray-600 min-w-[30px]">{formData[layer.id].left}%</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Grid className="h-4 w-4 text-teal-500" />
                                    Live Preview
                                </div>
                                <span className="text-[10px] text-gray-400 font-normal">WYSIWYG EDITOR</span>
                            </h3>

                            <div className="aspect-[3/2] bg-slate-100 rounded-lg border-4 border-slate-200 overflow-hidden relative shadow-inner flex items-center justify-center">
                                {formData.image ? (
                                    <div className="relative w-full h-full">
                                        <img src={formData.image} alt="Template" className="w-full h-full object-contain" />

                                        {/* Dynamic Overlay Layers */}
                                        {[
                                            { id: 'studentName', sample: 'Sample Student Name' },
                                            { id: 'assessmentName', sample: 'Sample Assessment Name' },
                                            { id: 'assessmentCode', sample: 'DCT-2025-XXXX' }
                                        ].map((layer) => {
                                            const settings = formData[layer.id];
                                            if (!settings.included) return null;

                                            // Find full font family string
                                            const fontDetail = fontFamilies.find(f => f.name === settings.fontFamily);
                                            const fontStyle = fontDetail ? fontDetail.value : 'inherit';

                                            return (
                                                <div
                                                    key={layer.id}
                                                    className="absolute pointer-events-none whitespace-nowrap"
                                                    style={{
                                                        top: `${settings.top}%`,
                                                        left: `${settings.left}%`,
                                                        transform: 'translate(-50%, -50%)',
                                                        color: settings.color,
                                                        fontSize: `${settings.fontSize}px`,
                                                        fontFamily: fontStyle,
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    {layer.sample}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center p-8">
                                        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-400 text-sm">Upload a template image to begin</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-100">
                                <h4 className="text-xs font-bold text-teal-700 uppercase mb-2">Editor Hub Tip:</h4>
                                <p className="text-xs text-teal-600 leading-relaxed">
                                    Use the Vertical and Horizontal position sliders to align text over the specific placeholders in your certificate image. Changes reflect instantly in the preview above.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header / Breadcrumb */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Certificates</h2>
                    <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-teal-600 font-semibold cursor-pointer" onClick={() => navigate('/admin/dashboard')}>Dashboard</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">Manage Certificate</span>
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    New Certificate
                </button>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h3 className="text-gray-700 font-bold uppercase text-xs tracking-widest">Available Templates</h3>
                    <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-teal-500 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-gray-100 uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-16 text-center">ID</th>
                                <th className="px-6 py-4">Certificate Identity</th>
                                <th className="px-6 py-4">Visual Preview</th>
                                <th className="px-6 py-4">Assignments</th>
                                <th className="px-6 py-4">Enrollment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {certificates.map((cert, index) => (
                                <tr key={cert.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-center text-gray-400">#0{cert.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{cert.name}</div>
                                        <div className="text-[10px] text-gray-400 mt-0.5">ID: {cert.id * 1234}CERT</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-10 w-16 bg-slate-100 border border-slate-200 rounded shadow-sm overflow-hidden flex items-center justify-center relative group-hover:ring-2 ring-teal-500/20 transition-all">
                                            {cert.image ? (
                                                <img src={cert.image} alt="cert" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-4 w-4 text-slate-300" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 text-slate-600 py-1 px-3 rounded-full text-xs font-medium border border-slate-200">
                                            {cert.usedIn}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">Dec 18, 2025</td>
                                    <td className="px-6 py-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={cert.status}
                                                onChange={() => toggleStatus(cert.id)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2 transition-opacity">
                                            <button
                                                onClick={() => handlePreviewModal(cert.image)}
                                                className="text-slate-400 hover:text-teal-600 hover:bg-teal-50 p-2 rounded-lg transition-all"
                                                title="Preview Full Size"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(cert)}
                                                className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all"
                                                title="Edit Template"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                title="Delete Template"
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

            {/* Preview Modal for existing certificates */}
            {isPreviewOpen && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh] scale-in duration-300 shadow-2xl rounded-2xl overflow-hidden border-4 border-white/10" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsPreviewOpen(false)}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition-all z-10"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <img src={selectedImage} alt="Certificate Preview" className="w-full h-auto" />
                    </div>
                </div>
            )}
        </div>
    );
}
