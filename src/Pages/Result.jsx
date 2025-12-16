import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Download, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

export default function Result() {
    const { width, height } = useWindowSize();
    const location = useLocation();
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(true);
    const resultRef = useRef(null);

    // Get data passed from Assessment page
    const { total, attempted, correct, incorrect } = location.state || {};

    const [userName, setUserName] = useState('');

    useEffect(() => {
        // 1. Check Login
        const userStr = localStorage.getItem('digi_user');
        if (!userStr) {
            toast.error("Please Login first!");
            navigate('/');
            return;
        }

        const user = JSON.parse(userStr);
        setUserName(user.name);

        // 2. Check if accessed directly without submission
        if (!location.state) {
            toast.error("Please complete the assessment first!");
            navigate('/assessment');
            return;
        }
    }, [location.state, navigate]);

    if (!location.state) return null; // Prevent flicker

    const digi = "{Coders}";

    // Stop confetti after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div id="result-screen">

            <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 font-sans select-none relative overflow-hidden">
                {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} style={{ zIndex: 50, pointerEvents: 'none' }} />}

                <div id="result-card" className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-4 md:p-6 relative z-10 border border-gray-100 text-center animate-fade-in-up">

                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex justify-center mb-3">
                            <img
                                src="/icon.jpg"
                                alt="DigiCoders Logo"
                                className="h-20 md:h-24 object-contain mix-blend-darken"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center gap-2 mb-6">
                            <div className="bg-teal-50 p-3 md:p-4 rounded-full">
                                <span className="text-3xl md:text-4xl">🎉</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#0D9488] text-center">
                                Congratulations, <span className='text-purple-500'>{userName.split(' ')[0]}!</span>
                            </h2>
                        </div>

                        <p className="text-gray-500 text-base">You have successfully completed the assessment.</p>
                    </div>

                    <div className="flex flex-col items-center gap-2 mb-3">
                        <h3 className="text-lg font-bold text-[#1F2937] mb-4 border-b-2 border-[#0D9488] pb-1 inline-block">Assessment Result</h3>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-5">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Questions</p>
                                <p className="text-2xl font-black text-[#1F2937]">{total}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Attempted</p>
                                <p className="text-2xl font-black text-blue-600">{attempted}</p>
                            </div>
                            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">Correct</p>
                                <p className="text-2xl font-black text-[#0D9488]">{correct}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Incorrect</p>
                                <p className="text-2xl font-black text-red-500">{incorrect}</p>
                            </div>
                        </div>

                        {/* Final Score */}
                        <div className="w-full max-w-md bg-gradient-to-r from-[#0D9488] to-[#115E59] rounded-2xl p-6 text-white shadow-xl mb-6 transform hover:scale-105 transition-transform duration-300">
                            <p className="text-teal-100 font-bold mb-2 uppercase tracking-widest text-sm">Your Final Score</p>
                            <p className="text-5xl md:text-6xl font-black">{correct} <span className="text-3xl text-teal-200">/ {total}</span></p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-8 py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all hover:-translate-y-1"
                            >
                                <Download size={20} /> DOWNLOAD CERTIFICATE
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                            >
                                <Home size={20} /> Back to Home
                            </button>
                        </div>

                        <p className="mt-4 text-gray-400 text-sm">Congratulations! You have completed the assessment.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
