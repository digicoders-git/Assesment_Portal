import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getResultsByStudentApi } from '../API/result';
import { getSingleCertificateApi } from '../API/certificate';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Download, Home, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import domtoimage from 'dom-to-image-more';
import { useRef } from 'react';

export default function Result() {
    const { width, height } = useWindowSize();
    const location = useLocation();
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(true);
    const resultRef = useRef(null);

    const { studentId, assessmentId, certificateId } = useParams();
    const [resultData, setResultData] = useState(null);
    const [certificateData, setCertificateData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                if (!studentId || !assessmentId) {
                    throw new Error("Missing result identification");
                }

                const response = await getResultsByStudentApi(studentId);

                if (response.success && response.results) {

                    const currentResult = response.results.find(res => {
                        const targetId = res.assesmentQuestions?._id || res.assesmentQuestions || res.assessmentQuestions?._id || res.assessmentQuestions;
                        return targetId === assessmentId;
                    });

                    if (currentResult) {
                        setResultData(currentResult);

                        // Also fetch certificate data if certificateId exists
                        if (certificateId && certificateId !== 'null' && certificateId !== 'undefined') {
                            try {
                                const certResp = await getSingleCertificateApi(certificateId);
                                if (certResp) {
                                    setCertificateData(certResp);
                                }
                            } catch (error) {
                                console.error("Certificate fetch error:", error);
                            }
                        }
                    } else {
                        throw new Error("Result not found for this assessment");
                    }
                } else {
                    throw new Error(response.message || "Failed to fetch results");
                }
            } catch (error) {
                console.error("Fetch result error:", error);
                toast.error(error.message || "Something went wrong while fetching your result");
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [studentId, assessmentId]);

    // Stop confetti after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#1F2937] font-bold text-lg">Fetching Result...</p>
                </div>
            </div>
        );
    }

    if (!resultData) return null;

    const digi = "{Coders}";

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
            const studentName = resultData.student?.name || 'Student';
            const fileName = `DigiCoders_${studentName.replace(/\s+/g, '_')}_Result.png`;
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

    // Generate and Download Certificate using Canvas
    const handleDownloadCertificate = async () => {
        if (!certificateData) {
            toast.error("Certificate template not found!");
            return;
        }

        const toastId = toast.loading("Generating your certificate...");

        try {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Essential for cross-origin Cloudinary images
            img.src = certificateData.certificateImage;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error("Failed to load certificate template image"));
            });

            // Create Canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw Base Image
            ctx.drawImage(img, 0, 0);

            // Function to draw styled text
            const drawText = (text, style) => {
                if (!style || !text) return;

                // Setup Font
                const weight = style.bold ? 'bold ' : '';
                const italic = style.italic ? 'italic ' : '';
                const fontSize = style.fontSize || '20px';
                const fontFamily = style.fontFamily || 'Inter, sans-serif';
                ctx.font = `${weight}${italic}${fontSize} ${fontFamily}`;

                // Color and Alignment
                ctx.fillStyle = style.textColor || '#000000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Position (positions usually come as strings like "50%")
                const parsePos = (pos, base) => {
                    const val = parseFloat(pos);
                    return isNaN(val) ? base / 2 : (val / 100) * base;
                };

                const x = parsePos(style.horizontalPosition, canvas.width);
                const y = parsePos(style.verticalPosition, canvas.height);

                // Add underline if needed
                if (style.underline) {
                    const metrics = ctx.measureText(text);
                    const textWidth = metrics.width;
                    ctx.fillText(text, x, y);
                    ctx.beginPath();
                    ctx.strokeStyle = ctx.fillStyle;
                    ctx.lineWidth = 2;
                    ctx.moveTo(x - textWidth / 2, y + parseInt(fontSize) / 2);
                    ctx.lineTo(x + textWidth / 2, y + parseInt(fontSize) / 2);
                    ctx.stroke();
                } else {
                    ctx.fillText(text, x, y);
                }
            };

            // Overlay Data
            // 1. Student Name (Always required)
            drawText(resultData.student?.name, certificateData.studentName);

            // 2. Assessment Name (Optional)
            if (certificateData.assessmentName) {
                const aName = resultData.assesmentQuestions?.assesmentId?.assessmentName ||
                    resultData.assessmentQuestions?.assesmentId?.assessmentName;
                drawText(aName, certificateData.assessmentName);
            }

            // 3. Assessment Code (Optional)
            if (certificateData.assessmentCode) {
                const aCode = resultData.student?.code || "DIGICODERS";
                drawText(aCode, certificateData.assessmentCode);
            }

            // 4. College Name (Optional)
            if (certificateData.collegeName) {
                drawText(resultData.student?.college, certificateData.collegeName);
            }

            // 5. Date (Optional)
            if (certificateData.date) {
                const dateToUse = resultData.createdAt || resultData.assesmentQuestions?.createdAt || resultData.assessmentQuestions?.createdAt;
                const formattedDate = dateToUse ? new Date(dateToUse).toLocaleDateString() : '';
                drawText(formattedDate, certificateData.date);
            }

            // Download
            const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `DigiCoders_Certificate_${(resultData.student?.name || 'Student').replace(/\s+/g, '_')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.update(toastId, {
                render: "Certificate downloaded successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });
        } catch (error) {
            console.error("Certificate generation failed:", error);
            toast.update(toastId, {
                render: `Failed to generate certificate: ${error.message}`,
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
                                Congratulations, <span className='text-purple-500'>{resultData.student?.name?.split(' ')[0]}!</span>
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
                                            <td className="py-3 px-4 text-center font-medium text-gray-600">{resultData.student?.code}</td>
                                            <td className="py-3 px-4 text-center font-medium text-gray-600">{resultData.createdAt ? new Date(resultData.createdAt).toLocaleDateString() : 'N/A'}</td>
                                            <td className="py-3 px-4 text-center font-medium text-gray-600">{location.state?.submissionTime || new Date(resultData.createdAt).toLocaleTimeString()}</td>
                                            <td className="py-3 px-4 text-center font-medium text-gray-600">{resultData.duration || 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Compact Layout - Labels Left, Values Right */}
                            <div className="md:hidden border border-gray-300 rounded-lg p-3 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-700 text-sm">Assessment Code:</span>
                                    <span className="font-medium text-gray-600 text-sm">{resultData.student?.code}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-700 text-sm">Date:</span>
                                    <span className="font-medium text-gray-600 text-sm">{resultData.createdAt ? new Date(resultData.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-700 text-sm">Time:</span>
                                    <span className="font-medium text-gray-600 text-sm">{location.state?.submissionTime || new Date(resultData.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-700 text-sm">Duration:</span>
                                    <span className="font-medium text-gray-600 text-sm">{resultData.duration || 'N/A'}</span>
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
                                <p className="text-2xl font-black text-[#1F2937]">{resultData.total}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Attempted</p>
                                <p className="text-2xl font-black text-blue-600">{resultData.attempted}</p>
                            </div>
                            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">Correct</p>
                                <p className="text-2xl font-black text-[#0D9488]">{resultData.correct}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Incorrect</p>
                                <p className="text-2xl font-black text-red-500">{resultData.incorrect}</p>
                            </div>
                        </div>

                        {/* Final Score */}
                        <div className="w-full max-w-md bg-gradient-to-r from-[#0D9488] to-[#115E59] rounded-2xl p-6 text-white shadow-xl mb-6 transform hover:scale-105 transition-transform duration-300">
                            <p className="text-teal-100 font-bold mb-2 uppercase tracking-widest text-sm">Your Final Score</p>
                            <p className="text-5xl md:text-6xl font-black">{resultData.correct} <span className="text-3xl text-teal-200">/ {resultData.total}</span></p>
                        </div>

                        {/* Actions */}
                        <div id="action-buttons" className="flex flex-col md:flex-row gap-4">
                            <button
                                onClick={handleDownloadCertificate}
                                disabled={!certificateData}
                                className={`flex items-center gap-2 px-8 py-3 text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1 ${!certificateData ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#a855f7] hover:bg-[#9333ea] shadow-purple-200'}`}
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
