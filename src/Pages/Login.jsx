import React, { useState, useRef, useEffect } from 'react';
import { User, Phone, GraduationCap, Calendar, BookOpen, Key, Sparkles, ArrowRight, ChevronDown, Search, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAcademicDataApi, studentRegisterApi } from '../API/student';

export default function DigiCodersPortal() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        college: '',
        year: '',
        course: '',
        code: '',
    });

    const [collegeSearch, setCollegeSearch] = useState('');
    const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
    const collegeDropdownRef = useRef(null);

    const [yearSearch, setYearSearch] = useState('');
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const yearDropdownRef = useRef(null);

    const [courseSearch, setCourseSearch] = useState('');
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const courseDropdownRef = useRef(null);

    const [academicData, setAcademicData] = useState({
        colleges: [],
        years: [],
        courses: []
    });
    const [loadingAcademic, setLoadingAcademic] = useState(true);

    useEffect(() => {
        const fetchAcademicData = async () => {
            try {
                const response = await getAcademicDataApi();
                if (response.success) {
                    setAcademicData({
                        colleges: response.colleges || [],
                        years: response.years || [],
                        courses: response.course || [] // API uses 'course' (singular) for the array
                    });
                }
            } catch (error) {
                console.error("Failed to fetch academic data:", error);
                toast.error("Failed to load college and course data");
            } finally {
                setLoadingAcademic(false);
            }
        };
        fetchAcademicData();
    }, []);

    const digi = "{Coders}"
    const navigate = useNavigate();
    const { code } = useParams();

    const [focusedField, setFocusedField] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Auto-fill assessment code from URL parameter
        if (code) {
            setFormData(prev => ({ ...prev, code: code }));
        }
    }, [code]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(event.target)) {
                setShowCollegeDropdown(false);
            }
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
                setShowYearDropdown(false);
            }
            if (courseDropdownRef.current && !courseDropdownRef.current.contains(event.target)) {
                setShowCourseDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCollegeSelect = (college) => {
        setFormData({ ...formData, college });
        setCollegeSearch('');
        setShowCollegeDropdown(false);
    };

    const handleYearSelect = (year) => {
        setFormData({ ...formData, year });
        setYearSearch('');
        setShowYearDropdown(false);
    };

    const handleCourseSelect = (course) => {
        setFormData({ ...formData, course });
        setCourseSearch('');
        setShowCourseDropdown(false);
    };

    const filteredColleges = (academicData.colleges || []).filter(item =>
        item.collegeName?.toLowerCase().includes(collegeSearch.toLowerCase())
    );

    const filteredYears = (academicData.years || []).filter(item =>
        item.academicYear?.toLowerCase().includes(yearSearch.toLowerCase())
    );

    const filteredCourses = (academicData.courses || []).filter(item =>
        item.course?.toLowerCase().includes(courseSearch.toLowerCase())
    );

    const handleSubmit = async () => {
        // Helper function for alerting and focusing
        const alertAndFocus = (message, fieldName) => {
            Swal.fire({
                title: 'Missing Input!',
                text: message,
                icon: 'warning',
                confirmButtonColor: '#0D9488',
            }).then(() => {
                const field = document.getElementsByName(fieldName)[0];
                if (field) field.focus();
            });
        };

        // Name validation
        if (!formData.name.trim()) return alertAndFocus('Please enter your Full Name.', 'name');
        if (formData.name.trim().length < 2) {
            Swal.fire({
                title: 'Invalid Name!',
                text: 'Name must be at least 2 characters long.',
                icon: 'error',
                confirmButtonColor: '#0D9488',
            });
            return;
        }

        // Email validation
        if (!formData.email.trim()) return alertAndFocus('Please enter your Email Address.', 'email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Swal.fire({
                title: 'Invalid Email!',
                text: 'Please enter a valid email address.',
                icon: 'error',
                confirmButtonColor: '#0D9488',
            });
            return;
        }

        // Mobile validation
        if (!formData.mobile.trim()) return alertAndFocus('Please enter your Mobile Number.', 'mobile');
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobile)) {
            Swal.fire({
                title: 'Invalid Mobile!',
                text: 'Mobile number must be 10 digits and start with 6, 7, 8, or 9.',
                icon: 'error',
                confirmButtonColor: '#0D9488',
            });
            return;
        }

        // College validation
        if (!formData.college.trim()) return alertAndFocus('Please select your College.', 'college');
        const collegeExists = academicData.colleges.some(c => c.collegeName === formData.college);
        if (!collegeExists) {
            Swal.fire({
                title: 'Invalid College!',
                text: 'Please select a college from the dropdown list.',
                icon: 'error',
                confirmButtonColor: '#0D9488',
            });
            return;
        }

        // Year validation
        if (!formData.year.trim()) return alertAndFocus('Please select your Current Year.', 'year');
        const yearExists = academicData.years.some(y => y.academicYear === formData.year);
        if (!yearExists) {
            Swal.fire({
                title: 'Invalid Year!',
                text: 'Please select a year from the dropdown list.',
                icon: 'error',
                confirmButtonColor: '#0D9488',
            });
            return;
        }

        // Course validation
        if (!formData.course.trim()) return alertAndFocus('Please select your Course.', 'course');
        const courseExists = academicData.courses.some(c => c.course === formData.course);
        if (!courseExists) {
            Swal.fire({
                title: 'Invalid Course!',
                text: 'Please select a course from the dropdown list.',
                icon: 'error',
                confirmButtonColor: '#0D9488',
            });
            return;
        }

        // API Integration
        setSubmitting(true);
        try {
            // Ensure assessment code is uppercase when sent to backend
            const payload = {
                ...formData,
                code: formData.code.toUpperCase()
            };
            const response = await studentRegisterApi(payload);
            if (response.success) {
                // Store student data in localStorage for persistence
                const studentData = {
                    name: response.newStudent.name,
                    mobile: response.newStudent.mobile,
                    email: response.newStudent.email,
                    college: response.newStudent.college,
                    year: response.newStudent.year,
                    course: response.newStudent.course,
                    code: response.newStudent.code,
                    id: response.newStudent._id,
                    submissionDate: response.newStudent.createdAt,
                    isLoggedIn: true
                };

                Swal.fire({
                    title: 'Registration Successful!',
                    text: response.message || 'Starting Assessment...',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#FFFFFF',
                    color: '#2D3748'
                });

                setTimeout(() => {
                    navigate(`/assessment/${studentData.code}/${studentData.id}`);
                }, 1500);
            } else {
                Swal.fire({
                    title: 'Registration Failed!',
                    text: response.message || 'Something went wrong',
                    icon: 'error',
                    confirmButtonColor: '#0D9488',
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'An error occurred during registration. Please check your assessment code or try again.',
                icon: 'error',
                confirmButtonColor: '#0D9488',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 relative overflow-hidden">




            {/* Main Container */}
            <div className="relative w-full max-w-4xl z-10 transition-all duration-300">
                {/* Top Sparkle Effect */}
                <div className="flex justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-[#0D9488] animate-pulse" />
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                    {/* Header Section with Animated Background */}
                    {/* Header Section with Animated Background */}
                    <div className="relative px-6 py-8 overflow-hidden">


                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <div className="inline-flex items-center justify-center mb-4">

                                {/* CLEAN CONTAINER */}
                                <div className="bg-white px-4 py-3 rounded-2xl">

                                    {/* IMAGE SMALLER SIZE */}
                                    <img
                                        src="/digicoders-logo-circle.png"
                                        alt="DigiCoders Logo"
                                        className="h-24 md:h-32 w-auto object-contain mix-blend-darken"
                                    />

                                </div>

                            </div>

                            <h1 className="text-2xl md:text-5xl font-black text-[#1F2937] mb-4">
                                Assessment Portal
                            </h1>

                            <div className="flex items-center justify-center gap-2">
                                <div className="w-8 md:w-12 h-[2px] bg-[#0D9488]" />
                                <p className="text-sm md:text-lg font-medium text-[#115E59]">
                                    Welcome! Let's get you started
                                </p>
                                <div className="w-8 md:w-12 h-[2px] bg-[#0D9488]" />
                            </div>
                        </div>



                    </div>

                    {/* Form Section */}
                    <div className="p-8 md:p-12 bg-transparent">
                        <div className="space-y-6">
                            {/* Row 1: Name and Mobile */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="flex items-center text-sm font-bold text-black mb-3">

                                        MOBILE NUMBER <span className="text-pink-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('mobile')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="10 Digit Mobile Number"
                                        maxLength="10"
                                        className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'mobile' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] placeholder-gray-400 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm md:text-base`}
                                    />
                                </div>

                                <div className="group">
                                    <label className="flex items-center text-sm font-bold text-black mb-3">
                                        YOUR NAME <span className="text-pink-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Enter Your Full Name"
                                        className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'name' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] placeholder-gray-400 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm md:text-base`}
                                    />
                                </div>
                            </div>

                            {/* Row 2: Email */}
                            <div className="group">
                                <label className="flex items-center text-sm font-bold text-black mb-3">
                                    EMAIL ADDRESS <span className="text-pink-500 ml-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter Your Email Address"
                                    className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'email' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] placeholder-gray-400 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm md:text-base`}
                                />
                            </div>

                            {/* Row 3: College Name */}
                            <div className="group" ref={collegeDropdownRef}>
                                <label className="flex items-center text-sm font-bold text-black mb-3">
                                    COLLEGE NAME <span className="text-pink-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        readOnly
                                        value={formData.college}
                                        onClick={() => setShowCollegeDropdown(true)}
                                        onFocus={() => {
                                            setFocusedField('college');
                                            setShowCollegeDropdown(true);
                                        }}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Choose College"
                                        className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'college' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] placeholder-gray-400 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm md:text-base pr-10 cursor-pointer`}
                                    />
                                    <ChevronDown
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${showCollegeDropdown ? 'rotate-180' : ''}`}
                                        onClick={() => setShowCollegeDropdown(!showCollegeDropdown)}
                                    />

                                    {showCollegeDropdown && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-68 overflow-hidden flex flex-col">
                                            {/* Internal Search */}
                                            <div className="p-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-20">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={collegeSearch}
                                                        onChange={(e) => setCollegeSearch(e.target.value)}
                                                        placeholder="Search college..."
                                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D9488] bg-white"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            </div>

                                            <div className="overflow-y-auto max-h-52 custom-scrollbar">
                                                {filteredColleges.length > 0 ? (
                                                    filteredColleges.map((item, index) => (
                                                        <div
                                                            key={item._id || index}
                                                            onClick={() => handleCollegeSelect(item.collegeName)}
                                                            className="px-4 py-3 hover:bg-teal-50 hover:text-teal-700 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                                                        >
                                                            {item.collegeName}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                                        No colleges found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Row 4: Year and Course */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group" ref={yearDropdownRef}>
                                    <label className="flex items-center text-sm font-bold text-black mb-3">
                                        CURRENT YEAR <span className="text-pink-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={formData.year}
                                            onClick={() => setShowYearDropdown(true)}
                                            onFocus={() => {
                                                setFocusedField('year');
                                                setShowYearDropdown(true);
                                            }}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Choose Year"
                                            className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'year' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] placeholder-gray-400 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm md:text-base pr-10 cursor-pointer`}
                                        />
                                        <ChevronDown
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`}
                                            onClick={() => setShowYearDropdown(!showYearDropdown)}
                                        />

                                        {showYearDropdown && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-68 overflow-hidden flex flex-col">
                                                {/* Internal Search */}
                                                <div className="p-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-20">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={yearSearch}
                                                            onChange={(e) => setYearSearch(e.target.value)}
                                                            placeholder="Search year..."
                                                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D9488] bg-white"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="overflow-y-auto max-h-52 custom-scrollbar">
                                                    {filteredYears.length > 0 ? (
                                                        filteredYears.map((item, index) => (
                                                            <div
                                                                key={item._id || index}
                                                                onClick={() => handleYearSelect(item.academicYear)}
                                                                className="px-4 py-3 hover:bg-teal-50 hover:text-teal-700 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                                                            >
                                                                {item.academicYear}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                                            No years found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="group" ref={courseDropdownRef}>
                                    <label className="flex items-center text-sm font-bold text-black mb-3">
                                        COURSE <span className="text-pink-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={formData.course}
                                            onClick={() => setShowCourseDropdown(true)}
                                            onFocus={() => {
                                                setFocusedField('course');
                                                setShowCourseDropdown(true);
                                            }}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Choose Course"
                                            className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'course' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] placeholder-gray-400 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm md:text-base pr-10 cursor-pointer`}
                                        />
                                        <ChevronDown
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${showCourseDropdown ? 'rotate-180' : ''}`}
                                            onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                                        />

                                        {showCourseDropdown && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-68 overflow-hidden flex flex-col">
                                                {/* Internal Search */}
                                                <div className="p-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-20">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={courseSearch}
                                                            onChange={(e) => setCourseSearch(e.target.value)}
                                                            placeholder="Search course..."
                                                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D9488] bg-white"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="overflow-y-auto max-h-52 custom-scrollbar">
                                                    {filteredCourses.length > 0 ? (
                                                        filteredCourses.map((item, index) => (
                                                            <div
                                                                key={item._id || index}
                                                                onClick={() => handleCourseSelect(item.course)}
                                                                className="px-4 py-3 hover:bg-teal-50 hover:text-teal-700 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                                                            >
                                                                {item.course}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                                            No courses found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>



                            {/* Assessment Code */}
                            <div className="group">
                                <label className="flex items-center text-sm font-bold text-black mb-3">

                                    ASSESSMENT CODE <span className="text-pink-500 ml-1">*</span>
                                    <span className="ml-2 md:ml-3 text-[8px] md:text-[10px] bg-slate-800 text-white px-2 py-1 rounded-full font-semibold border border-slate-700">PROVIDED BY TEAM</span>
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('code')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="ENTER CODE"
                                    className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'code' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] placeholder-gray-400 focus:outline-none transition-all duration-300 hover:border-gray-300 text-center font-mono text-lg md:text-xl tracking-[0.3em] md:tracking-[0.5em] uppercase font-bold`}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`group relative w-full ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0D9488] hover:bg-[#115E59]'} text-white font-black py-2 px-4 md:py-3 md:px-6 rounded-2xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300 text-base md:text-lg mt-5 md:mt-6 overflow-hidden`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            REGISTERING...
                                        </>
                                    ) : (
                                        <>
                                            START ASSESSMENT
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>

                            {/* Info Text */}
                            <div className="text-center pt-4">
                                <p className="text-gray-500 text-sm">🔒 Your information is secure and encrypted</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 space-y-2">
                    <p className="text-gray-500 text-sm">© 2025 DigiCoders. All rights reserved.</p>
                    <p className="text-gray-400 text-xs">Powered by Innovation & Excellence</p>
                </div>
            </div>
        </div>
    );
}