import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, GraduationCap, Calendar, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function AcademicSetup() {
    const [activeTab, setActiveTab] = useState('colleges');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', year: '', course: '' });

    // Sample data
    const [colleges, setColleges] = useState([
        { id: 1, name: 'ABC Engineering College', location: 'Mumbai' },
        { id: 2, name: 'XYZ Institute of Technology', location: 'Delhi' }
    ]);

    const [years, setYears] = useState([
        { id: 1, year: '2024-25' },
        { id: 2, year: '2023-24' }
    ]);

    const [courses, setCourses] = useState([
        { id: 1, course: 'Computer Science Engineering' },
        { id: 2, course: 'Information Technology' },
        { id: 3, course: 'Electronics Engineering' }
    ]);

    const tabs = [
        { id: 'colleges', label: 'Colleges', icon: GraduationCap, count: colleges.length },
        { id: 'years', label: 'Academic Years', icon: Calendar, count: years.length },
        { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length }
    ];

    const handleAdd = (type) => {
        setEditingItem(null);
        setFormData({ name: '', year: '', course: '' });
        setActiveTab(type);
        setIsModalOpen(true);
    };

    const handleEdit = (item, type) => {
        setEditingItem({ ...item, type });
        if (type === 'colleges') setFormData({ name: item.name, location: item.location });
        if (type === 'years') setFormData({ year: item.year });
        if (type === 'courses') setFormData({ course: item.course });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (activeTab === 'colleges') {
            if (!formData.name || !formData.location) {
                toast.error('College name and location are required!');
                return;
            }
            if (editingItem) {
                setColleges(colleges.map(c => c.id === editingItem.id ? { ...c, name: formData.name, location: formData.location } : c));
                toast.success('College updated successfully');
            } else {
                setColleges([...colleges, { id: Date.now(), name: formData.name, location: formData.location }]);
                toast.success('College added successfully');
            }
        }
        
        if (activeTab === 'years') {
            if (!formData.year) {
                toast.error('Academic year is required!');
                return;
            }
            if (editingItem) {
                setYears(years.map(y => y.id === editingItem.id ? { ...y, year: formData.year } : y));
                toast.success('Academic year updated successfully');
            } else {
                setYears([...years, { id: Date.now(), year: formData.year }]);
                toast.success('Academic year added successfully');
            }
        }
        
        if (activeTab === 'courses') {
            if (!formData.course) {
                toast.error('Course name is required!');
                return;
            }
            if (editingItem) {
                setCourses(courses.map(c => c.id === editingItem.id ? { ...c, course: formData.course } : c));
                toast.success('Course updated successfully');
            } else {
                setCourses([...courses, { id: Date.now(), course: formData.course }]);
                toast.success('Course added successfully');
            }
        }
        
        setIsModalOpen(false);
    };

    const handleDelete = (id, type) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#319795',
            cancelButtonColor: '#f56565',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                if (type === 'colleges') setColleges(colleges.filter(c => c.id !== id));
                if (type === 'years') setYears(years.filter(y => y.id !== id));
                if (type === 'courses') setCourses(courses.filter(c => c.id !== id));
                toast.success('Deleted successfully');
            }
        });
    };

    const renderContent = () => {
        if (activeTab === 'colleges') {
            return (
                <div className="space-y-4">
                    {colleges.map((college) => (
                        <div key={college.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-800">{college.name}</h3>
                                <p className="text-sm text-gray-500">{college.location}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(college, 'colleges')} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(college.id, 'colleges')} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'years') {
            return (
                <div className="space-y-4">
                    {years.map((year) => (
                        <div key={year.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-800">{year.year}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(year, 'years')} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(year.id, 'years')} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'courses') {
            return (
                <div className="space-y-4">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-800">{course.course}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(course, 'courses')} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(course.id, 'courses')} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="p-6 bg-[#F7FAFC] min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#2D3748] mb-2">Academic Setup</h1>
                <p className="text-gray-600">Manage colleges, academic years, and courses</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-white text-[#319795] shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Add Button */}
            <div className="mb-6">
                <button
                    onClick={() => handleAdd(activeTab)}
                    className="flex items-center gap-2 bg-[#319795] hover:bg-[#2B7A73] text-white px-4 py-2 rounded-lg font-medium transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Add {activeTab === 'colleges' ? 'College' : activeTab === 'years' ? 'Academic Year' : 'Course'}
                </button>
            </div>

            {/* Content */}
            {renderContent()}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {editingItem ? 'Edit' : 'Add'} {activeTab === 'colleges' ? 'College' : activeTab === 'years' ? 'Academic Year' : 'Course'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {activeTab === 'colleges' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                                            <input
                                                type="text"
                                                value={formData.name || ''}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#319795] outline-none"
                                                placeholder="Enter college name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                            <input
                                                type="text"
                                                value={formData.location || ''}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#319795] outline-none"
                                                placeholder="Enter location"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'years' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                                        <input
                                            type="text"
                                            value={formData.year || ''}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#319795] outline-none"
                                            placeholder="Select Year"
                                        />
                                    </div>
                                )}

                                {activeTab === 'courses' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                        <input
                                            type="text"
                                            value={formData.course || ''}
                                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#319795] outline-none"
                                            placeholder="Enter course name"
                                        />
                                    </div>
                                )}
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