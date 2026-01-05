import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Plus, Search, Edit, Trash2, X, Copy, Link } from 'lucide-react';
import { toast } from 'react-toastify';



export function ActiveAssessment() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);
    const [assessments, setAssessments] = useState([]);
    const [certificateSearch, setCertificateSearch] = useState('');
    const [showCertificateDropdown, setShowCertificateDropdown] = useState(false);
    const certificateRef = useRef(null);


    // Add click outside handler for certificate dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.querySelector('.certificate-dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                setShowCertificateDropdown(false);
            }
        };
        if (showCertificateDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCertificateDropdown]);

    // Helper function to convert datetime to Kolkata timezone
    const toKolkataTime = (dateTime) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        return new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date).replace(' ', 'T');
    };

    useEffect(() => {
        const saved = localStorage.getItem('all_assessments');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Filter: ONLY active status
            const activeOnes = parsed.filter(item => item.status === true);
            setAssessments(activeOnes);
        } else {
            const initial = [
                {
                    id: 1,
                    status: true,
                    currentQuestions: 100,
                    totalQuestions: 100,
                    name: "Skill Up Test by DigiCoders",
                    duration: "30 Min",
                    code: "DCT2025",
                    attempts: 6780,
                    startedAttempts: 4200,
                    submittedAttempts: 2580,
                    startTime: "2025-12-13T11:46",
                    endTime: "2025-12-13T23:46",
                    remark: "Skill Up Test by DigiCoders 13 Dec 2025",
                    hasCertificate: true,
                    certificateType: "Custom",
                    includeAssessmentName: true,
                    includeAssessmentCode: true,
                    includeStudentName: true
                }
            ];
            localStorage.setItem('all_assessments', JSON.stringify(initial));
            setAssessments(initial);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                certificateRef.current &&
                !certificateRef.current.contains(event.target)
            ) {
                setShowCertificateDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const updateGlobalAssessments = (newList) => {
        localStorage.setItem('all_assessments', JSON.stringify(newList));
        const activeOnes = newList.filter(item => item.status === true);
        setAssessments(activeOnes);
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            toast.success("Assessment code copied!");
        }).catch(() => {
            toast.error("Failed to copy code");
        });
    };

    const handleCopyLink = (code) => {
        const link = `${window.location.origin}/${code}`;
        navigator.clipboard.writeText(link).then(() => {
            toast.success("Assessment link copied!");
        }).catch(() => {
            toast.error("Failed to copy link");
        });
    };

    const handleExport = (assessment) => {
        const headers = ["Name", "Code", "Total Questions", "Duration", "Start Time", "End Time", "Status", "Remark"];
        const row = [
            assessment.name,
            assessment.code,
            assessment.totalQuestions,
            assessment.duration,
            assessment.startTime,
            assessment.endTime,
            assessment.status ? "Active" : "Inactive",
            assessment.remark
        ];

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + row.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${assessment.name.replace(/ /g, "_")}_results.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
        certificateName: '',
        remark: '',
        includeAssessmentName: 'Yes',
        includeAssessmentCode: 'Yes',
        includeStudentName: 'Yes'
    });

    // Certificate options
    const certificateOptions = [
        { id: 1, name: 'Default Certificate' },
        { id: 2, name: 'Skill Up Certificate' },
        { id: 3, name: 'Achievement Certificate' },
        { id: 4, name: 'Completion Certificate' },
        { id: 5, name: 'Excellence Certificate' }
    ];


    const filteredCertificates = certificateOptions.filter(cert =>
        cert.name.toLowerCase().includes(certificateSearch.toLowerCase())
    );

    const handleEdit = (assessment) => {
        setEditingAssessment(assessment);
        setFormData({
            name: assessment.name,
            code: assessment.code,
            totalQuestions: assessment.totalQuestions,
            duration: assessment.duration.replace(' Min', ''),
            startTime: toKolkataTime(assessment.startTime),
            endTime: toKolkataTime(assessment.endTime),
            hasCertificate: assessment.hasCertificate ? 'Yes' : 'No',
            certificateType: assessment.certificateType || 'Default',
            certificateName: assessment.certificateName || '',
            remark: assessment.remark,
            includeAssessmentName: assessment.includeAssessmentName ? 'Yes' : 'No',
            includeAssessmentCode: assessment.includeAssessmentCode ? 'Yes' : 'No',
            includeStudentName: assessment.includeStudentName ? 'Yes' : 'No'
        });
        setCertificateSearch(assessment.certificateName || '');
        setShowCertificateDropdown(false);
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
            certificateName: '',
            remark: '',
            includeAssessmentName: 'Yes',
            includeAssessmentCode: 'Yes',
            includeStudentName: 'Yes'
        });
        setCertificateSearch('');
        setShowCertificateDropdown(false);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        // Validate all required fields
        if (!formData.name.trim()) {
            toast.error("Assessment Name is required!");
            return;
        }
        if (!formData.code.trim()) {
            toast.error("Assessment Code is required!");
            return;
        }
        if (!formData.totalQuestions.trim()) {
            toast.error("Total Questions is required!");
            return;
        }
        if (!formData.duration.trim()) {
            toast.error("Duration is required!");
            return;
        }
        if (!formData.startTime.trim()) {
            toast.error("Start Date-Time is required!");
            return;
        }
        if (!formData.endTime.trim()) {
            toast.error("End Date-Time is required!");
            return;
        }

        // Validate certificate field if certificate is enabled
        if (formData.hasCertificate === 'Yes') {
            const isValidCertificate = certificateOptions.some(cert => cert.name === certificateSearch);
            if (!isValidCertificate) {
                toast.error("Please select a valid certificate from the dropdown options!");
                return;
            }
        }

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
                certificateName: formData.hasCertificate === 'Yes' ? certificateSearch : '',
                remark: formData.remark,
                includeAssessmentName: formData.includeAssessmentName === 'Yes',
                includeAssessmentCode: formData.includeAssessmentCode === 'Yes',
                includeStudentName: formData.includeStudentName === 'Yes'
            } : a);
            updateGlobalAssessments(newList);
        } else {
            const newList = [{
                id: Date.now(),
                status: true, // Auto-activate
                currentQuestions: 0,
                totalQuestions: parseInt(formData.totalQuestions) || 0,
                name: formData.name,
                duration: `${formData.duration} Min`,
                code: formData.code,
                attempts: 0,
                startedAttempts: 0,
                submittedAttempts: 0,
                startTime: formData.startTime,
                endTime: formData.endTime,
                remark: formData.remark,
                hasCertificate: formData.hasCertificate === 'Yes',
                certificateType: formData.hasCertificate === 'Yes' ? formData.certificateType : null,
                certificateName: formData.hasCertificate === 'Yes' ? certificateSearch : '',
                includeAssessmentName: formData.includeAssessmentName === 'Yes',
                includeAssessmentCode: formData.includeAssessmentCode === 'Yes',
                includeStudentName: formData.includeStudentName === 'Yes'
            }, ...saved];
            updateGlobalAssessments(newList);
        }
        setIsModalOpen(false);
        setCertificateSearch('');
        setShowCertificateDropdown(false);
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
        <div className="p-6">
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
                    className="flex items-center gap-2 bg-[#319795] hover:bg-[#2c7a7b] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
                >
                    <Plus className="h-4 w-4 text-white" />
                    Add Assessment
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-[#E6FFFA] overflow-hidden">
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
                            {assessments.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-4 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Search className="h-12 w-12 mb-4 opacity-20" />
                                            <p className="text-lg font-bold">No Active Assessments</p>
                                            <p className="text-sm">Activate an assessment from history to see it here.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : assessments.map((item, index) => (
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
                                        <div className="font-medium text-[#2D3748] mb-2">{item.code}</div>
                                        <div className="flex gap-1 mb-1">
                                            <button
                                                onClick={() => handleCopyCode(item.code)}
                                                className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition-colors"
                                                title="Copy Assessment Code"
                                            >
                                                <Copy className="h-3 w-3" />
                                                Copy
                                            </button>
                                            <button
                                                onClick={() => handleCopyLink(item.code)}
                                                className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100 transition-colors"
                                                title="Copy Assessment Link"
                                            >
                                                <Link className="h-3 w-3" />
                                                Copy Link
                                            </button>
                                        </div>
                                        <div className="space-y-1 space-x-1">
                                            <div className="text-xs bg-[#319795]/20 text-[#2B7A73] inline-block px-1.5 rounded">
                                                Start: {item.startedAttempts || Math.floor((item.attempts || 0) * 0.62)}
                                            </div>
                                            <div className="text-xs bg-[#F56565]/20 text-[#B8322F] inline-block px-1.5 rounded">
                                                Submit: {item.submittedAttempts || Math.floor((item.attempts || 0) * 0.38)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top text-gray-500 text-xs whitespace-nowrap">
                                        <div>{item.startTime}</div>
                                        <div>{item.endTime}</div>
                                    </td>
                                    <td className="px-4 py-3 align-top text-[#2D3748]">{item.remark}</td>
                                    <td className="px-4 py-3 align-top text-[#2D3748]">
                                        <div>{item.hasCertificate ? 'Yes' : 'No'}</div>
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
                                            <button
                                                onClick={() => navigate(`/admin/assessment/started-students/${item.id}`)}
                                                className="border border-orange-500 text-orange-500 px-2 py-0.5 rounded text-xs hover:bg-orange-50"
                                            >
                                                Export
                                            </button>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAssessment(item.id)}
                                                    className="p-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-3 w-3" />
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
                                            name="cert_active"
                                            checked={formData.hasCertificate === 'Yes'}
                                            onChange={() => setFormData({ ...formData, hasCertificate: 'Yes' })}
                                            className="text-[#319795] focus:ring-[#319795]"
                                        /> Yes
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                        <input
                                            type="radio"
                                            name="cert_active"
                                            checked={formData.hasCertificate === 'No'}
                                            onChange={() => setFormData({ ...formData, hasCertificate: 'No' })}
                                            className="text-[#319795] focus:ring-[#319795]"
                                        /> No
                                    </label>
                                </div>
                            </div>
                            {formData.hasCertificate === 'Yes' && (
                                <div className="relative" ref={certificateRef}>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Choose Certificate Name
                                    </label>

                                    <input
                                        type="text"
                                        value={certificateSearch}
                                        onChange={(e) => {
                                            setCertificateSearch(e.target.value);
                                            setShowCertificateDropdown(true);
                                        }}
                                        onFocus={() => setShowCertificateDropdown(true)}
                                        placeholder="Search certificate..."
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#319795]"
                                    />

                                    {showCertificateDropdown && (
                                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
                                            {filteredCertificates.length > 0 ? (
                                                filteredCertificates.map((cert) => (
                                                    <div
                                                        key={cert.id}
                                                        onClick={() => {
                                                            setCertificateSearch(cert.name);
                                                            setFormData({
                                                                ...formData,
                                                                certificateName: cert.name
                                                            });
                                                            setShowCertificateDropdown(false);
                                                        }}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                    >
                                                        {cert.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-gray-500 text-sm">
                                                    No certificates found
                                                </div>
                                            )}
                                        </div>
                                    )}
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