import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Download, Home, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import domtoimage from 'dom-to-image-more';
import { useRef } from 'react';
import { useUser } from '../context/UserContext';

export default function Result() {
    const { width, height } = useWindowSize();
    const location = useLocation();
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(true);
    const resultRef = useRef(null);

    // Get data passed from Assessment page
    const { total, attempted, correct, incorrect, duration } = location.state || {};

    const [userName, setUserName] = useState('');
    const [assessmentCode, setAssessmentCode] = useState('');
    const { user } = useUser();

    useEffect(() => {
        // 1. Check Login and Assessment Code
        if (!user || !user.code) {
            toast.error("Assessment code not found! Please login first.");
            navigate('/');
            return;
        }

        setUserName(user.name);
        setAssessmentCode(user.code);

        // 2. Check if accessed directly without submission
        if (!location.state) {
            toast.error("Please complete the assessment first!");
            navigate('/assessment');
            return;
        }
    }, [user, location.state, navigate]);

    if (!user || !user.code || !location.state) return null; // Prevent flicker

    const digi = "{Coders}";

    // Stop confetti after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    // Screenshot and download result card as PNG
    const handleSaveResult = async () => {
        console.log("Save Result clicked!");

        if (!resultRef.current) {
            toast.error("Result card not found!");
            return;
        }

        const toastId = toast.loading("Generating result image...");

        try {
            // Hide action buttons during screenshot
            const actionButtons = document.getElementById('action-buttons');
            if (actionButtons) actionButtons.style.display = 'none';

            // Use dom-to-image-more which supports modern CSS colors
            const dataUrl = await domtoimage.toPng(resultRef.current, {
                quality: 0.95,
                bgcolor: '#ffffff',
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                },
                filter: (node) => {
                    // Remove borders from all elements during capture
                    if (node.style) {
                        node.style.border = 'none';
                        node.style.outline = 'none';
                        node.style.boxShadow = 'none';
                    }
                    return true;
                }
            });

            // Show action buttons again
            if (actionButtons) actionButtons.style.display = 'flex';

            // Create download link
            const link = document.createElement('a');
            const fileName = `DigiCoders_${userName.replace(/\s+/g, '_')}_Result.png`;
            link.href = dataUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("Download triggered!");

            toast.update(toastId, {
                render: "Result saved successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });
        } catch (error) {
            // Show action buttons again in case of error
            const actionButtons = document.getElementById('action-buttons');
            if (actionButtons) actionButtons.style.display = 'flex';
            
            console.error("Screenshot failed:", error);
            toast.update(toastId, {
                render: `Failed to save result: ${error.message}`,
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    return (
        <div id="result-screen">

            <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 font-sans select-none relative overflow-hidden">
                {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} style={{ zIndex: 50, pointerEvents: 'none' }} />}

                <div id="result-card" ref={resultRef} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-4 md:p-6 relative z-10 border border-gray-100 text-center animate-fade-in-up">

                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex justify-center mb-3">
                            <img
                                src="/icon.jpg"
                                alt="DigiCoders Logo"
                                className="h-24 md:h-32 object-contain mix-blend-darken"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center gap-2 mb-6">

                            <h2 className="text-2xl md:text-3xl font-bold text-[#0D9488] text-center">
                                Congratulations, <span className='text-purple-500'>{userName.split(' ')[0]}!</span>
                            </h2>
                        </div>

                        <p className="text-gray-500 text-base">You have successfully completed the assessment.</p>
                        
                        {/* Assessment Details Table */}
                        <div className="mt-4 mb-6">
                            {/* Desktop Table */}
                            <div className="hidden md:block border border-gray-300 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-300">
                                            <th className="py-3 px-4 text-center font-bold text-gray-700">Assessment Code</th>
                                            <th className="py-3 px-4 text-center font-bold text-gray-700">Date</th>
                                            <th className="py-3 px-4 text-center font-bold text-gray-700">Time</th>
                                            <th className="py-3 px-4 text-center font-bold text-gray-700">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-3 px-4 text-center font-medium text-gray-600">{assessmentCode}</td>
                                            <td className="py-3 px-4 text-center font-medium text-gray-600">{user.submissionDate ? new Date(user.submissionDate).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-center font-medium text-gray-600">{location.state.submissionTime || new Date().toLocaleTimeString()}</td>
                                            <td className="py-3 px-4 text-center font-medium text-gray-600">{duration || 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Mobile Column Layout */}
                            <div className="md:hidden space-y-3">
                                <div className="border border-gray-300 rounded-lg p-3">
                                    <div className="font-bold text-gray-700 text-sm mb-1">Assessment Code</div>
                                    <div className="font-medium text-gray-600">{assessmentCode}</div>
                                </div>
                                <div className="border border-gray-300 rounded-lg p-3">
                                    <div className="font-bold text-gray-700 text-sm mb-1">Date</div>
                                    <div className="font-medium text-gray-600">{user.submissionDate ? new Date(user.submissionDate).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                                </div>
                                <div className="border border-gray-300 rounded-lg p-3">
                                    <div className="font-bold text-gray-700 text-sm mb-1">Time</div>
                                    <div className="font-medium text-gray-600">{location.state.submissionTime || new Date().toLocaleTimeString()}</div>
                                </div>
                                <div className="border border-gray-300 rounded-lg p-3">
                                    <div className="font-bold text-gray-700 text-sm mb-1">Duration</div>
                                    <div className="font-medium text-gray-600">{duration || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
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
                        <div id="action-buttons" className="flex flex-col md:flex-row gap-4">
                            <button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = '/certificate.jpg';
                                    link.download = `DigiCoders_Certificate_${userName.replace(/\s+/g, '_')}.jpg`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="flex items-center gap-2 px-8 py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all hover:-translate-y-1"
                            >
                                <Download size={20} /> DOWNLOAD CERTIFICATE
                            </button>

                            <button
                                onClick={handleSaveResult}
                                className="flex items-center gap-2 px-8 py-3 bg-[#0D9488] hover:bg-[#115E59] text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1"
                            >
                                <Download size={20} /> SAVE RESULT
                            </button>
                        </div>

                        <p className="mt-4 text-gray-400 text-sm">Congratulations! You have completed the assessment.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
