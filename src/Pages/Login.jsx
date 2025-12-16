import React, { useState } from 'react';
import { User, Phone, GraduationCap, Calendar, BookOpen, Key, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function DigiCodersPortal() {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        batch: '',
        college: '',
        year: '',
        course: '',
        code: ''
    });

    const digi = "{Coders}"
    const navigate = useNavigate();

    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        // Helper function for alerting and focusing
        const alertAndFocus = (message, fieldName) => {
            Swal.fire({
                title: 'Missing Input!',
                text: message,
                icon: 'warning',
                confirmButtonColor: '#0D9488',
            }).then(() => {
                document.getElementsByName(fieldName)[0].focus();
            });
        };

        if (!formData.mobile) return alertAndFocus('Please enter your Mobile Number.', 'mobile');

        // Mobile Number Regex Validation
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobile)) {
            Swal.fire({
                title: 'Invalid Mobile!',
                text: 'Mobile number must be 10 digits and start with 6, 7, 8, or 9.',
                icon: 'error',
                confirmButtonColor: '#0D9488',
            }).then(() => {
                document.getElementsByName('mobile')[0].focus();
            });
            return;
        }

        if (!formData.name) return alertAndFocus('Please enter your Full Name.', 'name');
        if (!formData.batch) return alertAndFocus('Please select your Batch.', 'batch');
        if (!formData.college) return alertAndFocus('Please select your College.', 'college');
        if (!formData.year) return alertAndFocus('Please select your Current Year.', 'year');
        if (!formData.course) return alertAndFocus('Please select your Course.', 'course');
        // Code logic changed - if code is empty but implied "provided by team", we might just warn? 
        // But user asked to validate everything. Assuming code is required if field is there.
        if (!formData.code) return alertAndFocus('Please enter the Assessment Code.', 'code');

        // Simulating Login Success
        console.log('Form submitted:', formData);

        // SAVE USER TO LOCAL STORAGE
        localStorage.setItem('digi_user', JSON.stringify({
            name: formData.name,
            mobile: formData.mobile,
            isLoggedIn: true
        }));

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
                                        src="/icon.jpg"
                                        alt="DigiCoders Logo"
                                        className="h-20 md:h-24 w-auto object-contain mix-blend-darken"
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
                                    <label className="flex items-center text-sm font-bold text-gray-300 mb-3 group-hover:text-gray-600 transition-colors">

                                        MOBILE NUMBER <span className="text-pink-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="tel"
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
                                    <label className="flex items-center text-sm font-bold text-gray-300 mb-3 group-hover:text-gray-600 transition-colors">

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

                            {/* Row 2: Batch */}
                            <div className="group">
                                <label className="flex items-center text-sm font-bold text-gray-300 mb-3 group-hover:text-gray-600 transition-colors">

                                    SELECT YOUR BATCH <span className="text-pink-500 ml-1">*</span>
                                </label>
                                <select
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('batch')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'batch' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] focus:outline-none transition-all duration-300 hover:border-gray-300 cursor-pointer text-sm md:text-base`}
                                >
                                    <option value="">-- Select Batch --</option>
                                    <option value="morning">Morning Batch</option>
                                    <option value="afternoon">Afternoon Batch</option>
                                    <option value="evening">Evening Batch</option>
                                </select>
                            </div>

                            {/* Row 3: College Name */}
                            <div className="group">
                                <label className="flex items-center text-sm font-bold text-gray-300 mb-3 group-hover:text-gray-600 transition-colors">

                                    COLLEGE NAME <span className="text-pink-500 ml-1">*</span>
                                </label>
                                <select
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('college')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'college' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] focus:outline-none transition-all duration-300 hover:border-gray-300 cursor-pointer text-sm md:text-base`}
                                >
                                    <option value="">-- Select College --</option>
                                    <option value="digicoders">DigiCoders Technologies</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Row 4: Year and Course */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="flex items-center text-sm font-bold text-gray-300 mb-3 group-hover:text-gray-600 transition-colors">

                                        CURRENT YEAR <span className="text-pink-500 ml-1">*</span>
                                    </label>
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('year')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'year' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] focus:outline-none transition-all duration-300 hover:border-gray-300 cursor-pointer text-sm md:text-base`}
                                    >
                                        <option value="">-- Select Year --</option>
                                        <option value="1">First Year</option>
                                        <option value="2">Second Year</option>
                                        <option value="3">Third Year</option>
                                        <option value="4">Fourth Year</option>
                                    </select>
                                </div>

                                <div className="group">
                                    <label className="flex items-center text-sm font-bold text-gray-300 mb-3 group-hover:text-gray-600 transition-colors">

                                        COURSE <span className="text-pink-500 ml-1">*</span>
                                    </label>
                                    <select
                                        name="course"
                                        value={formData.course}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('course')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`w-full px-4 py-2 md:px-4 md:py-3 bg-gray-50 border-2 ${focusedField === 'course' ? 'border-[#0D9488]' : 'border-gray-200'} rounded-2xl text-[#1F2937] focus:outline-none transition-all duration-300 hover:border-gray-300 cursor-pointer text-sm md:text-base`}
                                    >
                                        <option value="">-- Select Course --</option>
                                        <option value="btech">B.Tech</option>
                                        <option value="bca">BCA</option>
                                        <option value="mca">MCA</option>
                                        <option value="mtech">M.Tech</option>
                                    </select>
                                </div>
                            </div>

                            {/* Assessment Code */}
                            <div className="group">
                                <label className="flex items-center text-sm font-bold text-gray-300 mb-3">

                                    ASSESSMENT CODE
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