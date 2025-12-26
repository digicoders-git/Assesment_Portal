import React, { useState, useRef, useEffect } from 'react';
import { User, Phone, GraduationCap, Calendar, BookOpen, Key, Sparkles, ArrowRight, ChevronDown, Search, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../context/UserContext';

export default function DigiCodersPortal() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        batch: '',
        college: '',
        year: '',
        course: '',
        code: '',
        testName: ''
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

    const colleges = [
        'DigiCoders Technologies',
        'Government Polytechnic Unnao',
        'Government Polytechnic Lucknow',
        'RRIMT',
        'MJP Rohilkhand University',
        'Integral University',
        'Amity University',
        'Lucknow University',
        'AKTU (UPTU)',
        'IIT Kanpur',
        'NIT Allahabad',
        'BIT Mesra',
        'Jamia Millia Islamia',
        'Aligarh Muslim University',
        'Banaras Hindu University',
        'Other'
    ];
    
    const years = [
        '1st Year',
        '2nd Year', 
        '3rd Year',
        '4th Year',
        'Passout'
    ];
    
    const courses = [
        'B.Tech [CSE/IT/Electronics]',
        'B.Tech [ME/EE/CE]',
        'BCA',
        'MCA',
        'M.Tech',
        'Diploma [CS/IT/PGDCA]',
        'Diploma [Electronics]',
        'Diploma [Other]',
        'Other Course'
    ];

    const digi = "{Coders}"
    const navigate = useNavigate();
    const { code } = useParams();
    const { login } = useUser();

    const [focusedField, setFocusedField] = useState(null);

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
        setCollegeSearch(college);
        setShowCollegeDropdown(false);
    };
    
    const handleYearSelect = (year) => {
        setFormData({ ...formData, year });
        setYearSearch(year);
        setShowYearDropdown(false);
    };
    
    const handleCourseSelect = (course) => {
        setFormData({ ...formData, course });
        setCourseSearch(course);
        setShowCourseDropdown(false);
    };

    const filteredColleges = colleges.filter(college =>
        college.toLowerCase().includes(collegeSearch.toLowerCase())
    );
    
    const filteredYears = years.filter(year =>
        year.toLowerCase().includes(yearSearch.toLowerCase())
    );
    
    const filteredCourses = courses.filter(course =>
        course.toLowerCase().includes(courseSearch.toLowerCase())
    );

    const handleSubmit = () => {
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
        if (!colleges.includes(formData.college)) {
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
        if (!years.includes(formData.year)) {
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
        if (!courses.includes(formData.course)) {
            Swal.fire({
                title: 'Invalid Course!',
                text: 'Please select a course from the dropdown list.',
                icon: 'error',
                confirmButtonColor: '#0D9488',
            });
            return;
        }
        
        // Code validation
        if (!formData.code.trim()) return alertAndFocus('Please enter the Assessment Code.', 'code');
       

        // Simulating Login Success
        console.log('Form submitted:', formData);

        // SAVE USER TO CONTEXT
        login({
            name: formData.name,
            mobile: formData.mobile,
            code: formData.code,
            testName: formData.testName,
            submissionDate: new Date().toISOString(),
            isLoggedIn: true
        });

        toast.success('🎉 Assessment Started Successfully!');
        setTimeout(() => {
            navigate('/assessment');
        }, 1500);
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
                                        value={collegeSearch}
                                        onChange={(e) => {
                                            setCollegeSearch(e.target.value);
                                            setFormData({ ...formData, college: e.target.value });
                                            setShowCollegeDropdown(true);
                                        }}
                                        onFocus={() => {
                                            setFocusedField('college');
                                            setShowCollegeDropdown(true);
                                        }}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Search or select college"
                                        className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'college' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] placeholder-gray-400 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm md:text-base pr-10`}
                                    />
                                    <ChevronDown 
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${showCollegeDropdown ? 'rotate-180' : ''}`}
                                        onClick={() => setShowCollegeDropdown(!showCollegeDropdown)}
                                    />
                                    
                                    {showCollegeDropdown && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                            {filteredColleges.length > 0 ? (
                                                filteredColleges.map((college, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleCollegeSelect(college)}
                                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                                                    >
                                                        {college}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-gray-500 text-sm">
                                                    No colleges found
                                                </div>
                                            )}
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
                                            value={yearSearch}
                                            onChange={(e) => {
                                                setYearSearch(e.target.value);
                                                setFormData({ ...formData, year: e.target.value });
                                                setShowYearDropdown(true);
                                            }}
                                            onFocus={() => {
                                                setFocusedField('year');
                                                setShowYearDropdown(true);
                                            }}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Search or select year"
                                            className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'year' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] placeholder-gray-400 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm md:text-base pr-10`}
                                        />
                                        <ChevronDown 
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`}
                                            onClick={() => setShowYearDropdown(!showYearDropdown)}
                                        />
                                        
                                        {showYearDropdown && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                                {filteredYears.length > 0 ? (
                                                    filteredYears.map((year, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => handleYearSelect(year)}
                                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                                                        >
                                                            {year}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-gray-500 text-sm">
                                                        No years found
                                                    </div>
                                                )}
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
                                            value={courseSearch}
                                            onChange={(e) => {
                                                setCourseSearch(e.target.value);
                                                setFormData({ ...formData, course: e.target.value });
                                                setShowCourseDropdown(true);
                                            }}
                                            onFocus={() => {
                                                setFocusedField('course');
                                                setShowCourseDropdown(true);
                                            }}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Search or select course"
                                            className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'course' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] placeholder-gray-400 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm md:text-base pr-10`}
                                        />
                                        <ChevronDown 
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${showCourseDropdown ? 'rotate-180' : ''}`}
                                            onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                                        />
                                        
                                        {showCourseDropdown && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                                {filteredCourses.length > 0 ? (
                                                    filteredCourses.map((course, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => handleCourseSelect(course)}
                                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                                                        >
                                                            {course}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-gray-500 text-sm">
                                                        No courses found
                                                    </div>
                                                )}
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
                                className="group relative w-full bg-[#0D9488] hover:bg-[#115E59] text-white font-black py-2 px-4 md:py-3 md:px-6 rounded-2xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300 text-base md:text-lg mt-5 md:mt-6 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    START ASSESSMENT
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
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