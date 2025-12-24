import { Clock, ChevronLeft, ChevronRight, SkipForward, Menu, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Assessment() {
    // 20 Dummy Questions
    const dummyQuestions = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        question: `Question ${i + 1}: Which of the following is a valid React Hook?`,
        options: ['useState', 'usePizza', 'useCoffee', 'useSleep'],
        correct: 'useState'
    }));

    const [questions, setQuestions] = useState(dummyQuestions);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [skippedQuestions, setSkippedQuestions] = useState(new Set());
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(2 * 60); // 30 minutes in seconds
    const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
    const [testStarted, setTestStarted] = useState(false);
    const tabWarningsRef = useRef(0);

    const navigate = useNavigate();

    // Initial Guidance Modal
    useEffect(() => {
        Swal.fire({
            title: 'Assessment Started',
            html: `
            <div class="text-left">
                <p class="mb-2">Please read the instructions carefully:</p>
                <ul class="list-disc pl-5 space-y-1">
                    <li><b>Do not switch tabs</b> or minimize the browser.</li>
                    <li><b>Do not close</b> the test window.</li>
                    <li>If you switch tabs, you will be <b>Out from the TEST</b>.</li>
                </ul>
            </div>
        `,
            icon: 'info',
            iconColor: '#ef4444',
            confirmButtonText: 'I Understand, Start Test',
            confirmButtonColor: '#0D9488',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                setTestStarted(true);
            }
        });
    }, []);


    // Track Visited Questions
    useEffect(() => {
        setVisitedQuestions(prev => new Set(prev).add(currentQuestion));
    }, [currentQuestion]);

    // Security & Timer Logic
    // Timer & Alerts Logic
    useEffect(() => {
        if (!testStarted) return; // Don't start timer until test is started
        
        const totalTime = 2 * 60; // 1800 seconds
        const ninetyPercentTime = totalTime * 0.1; // 10% remaining = 180s
        const ninetyFivePercentTime = totalTime * 0.05; // 5% remaining = 90s
        const oneMinute = 60;

        const formatDuration = (seconds) => {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m > 0 ? m + ' minute' + (m !== 1 ? 's' : '') : ''} ${s > 0 ? s + ' second' + (s !== 1 ? 's' : '') : ''}`.trim();
        };

        if (Math.floor(timeLeft) === Math.floor(ninetyPercentTime)) {
            Swal.fire({
                title: 'Time Warning!',
                text: `90% of time is completed! ${formatDuration(ninetyPercentTime)} remaining.`,
                icon: 'info',
                timer: 3000,
                showConfirmButton: false,
                position: 'top-end',
                toast: true
            });
        }

        if (Math.floor(timeLeft) === Math.floor(ninetyFivePercentTime)) {
            Swal.fire({
                title: 'Hurry Up!',
                text: `95% of time is completed! ${formatDuration(ninetyFivePercentTime)} remaining.`,
                icon: 'warning',
                timer: 4000,
                showConfirmButton: false,
                position: 'top-end',
                toast: true
            });
        }

        if (timeLeft === oneMinute) {
            Swal.fire({
                title: 'Time Out Warning!',
                text: 'Only 1 Minute Remaining!',
                icon: 'warning',
                timer: 5000,
                showConfirmButton: false,
                position: 'top-end',
                toast: true
            });
        }

        if (timeLeft === 0) {
            handleAutoSubmit();
        }
    }, [timeLeft, testStarted]);

    useEffect(() => {
        // Protect Route & Security Logic
        const user = localStorage.getItem('digi_user');
        if (!user) {
            toast.error("Please Login first!");
            navigate('/');
            return;
        }

        const handleContextMenu = (e) => e.preventDefault();
        const handleCopyCutPaste = (e) => {
            e.preventDefault();
            toast.error("Action not allowed during assessment!");
        };
        const handleKeyDown = (e) => {
            if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I") || (e.ctrlKey && e.key === "u")) {
                e.preventDefault();
            }
        };
        const handleVisibilityChange = () => {
            if (document.hidden && testStarted) { // Only check tab switching after test starts
                if (tabWarningsRef.current === 0) {
                    tabWarningsRef.current = 1;
                    Swal.fire({
                        title: 'Warning!',
                        text: 'You switched tabs! This is your first and last warning. If you do it again, your test will be terminated.',
                        icon: 'warning',
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'I Understand',
                        allowOutsideClick: false
                    });
                } else {
                    localStorage.removeItem('digi_user');
                    toast.error("Tab switching detected again! Test Terminated.", { autoClose: 5000, position: "top-center", theme: "colored" });
                    navigate('/');
                }
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("copy", handleCopyCutPaste);
        document.addEventListener("cut", handleCopyCutPaste);
        document.addEventListener("paste", handleCopyCutPaste);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        let timer;
        if (testStarted) { // Only start timer after test is started
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("copy", handleCopyCutPaste);
            document.removeEventListener("cut", handleCopyCutPaste);
            document.removeEventListener("paste", handleCopyCutPaste);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [testStarted]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleOptionSelect = (option) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: option
        });
        // Remove from skipped if previously skipped
        if (skippedQuestions.has(currentQuestion)) {
            const newSkipped = new Set(skippedQuestions);
            newSkipped.delete(currentQuestion);
            setSkippedQuestions(newSkipped);
        }
    };

    const handleNext = () => {
        if (!selectedAnswers[currentQuestion]) {
            toast.error("Please select an option before proceeding!");
            return;
        }
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSkip = () => {
        // Always add to skipped, keep selected answers intact
        setSkippedQuestions(prev => new Set(prev).add(currentQuestion));
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const finalizeSubmission = () => {
        let correctCount = 0;
        let incorrectCount = 0;
        let attemptedCount = 0;

        questions.forEach((q, index) => {
            const userAnswer = selectedAnswers[index];
            if (userAnswer && !skippedQuestions.has(index)) {
                attemptedCount++;
                if (userAnswer === q.correct) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }
            }
        });

        const totalTime = 2 * 60; // 2 minutes in seconds
        const timeTaken = totalTime - timeLeft;
        const duration = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}`;

        navigate('/result', {
            state: {
                total: questions.length,
                attempted: attemptedCount,
                correct: correctCount,
                incorrect: incorrectCount,
                submissionTime: new Date().toLocaleTimeString(),
                duration: duration
            }
        });
    };

    const handleAutoSubmit = () => {
        Swal.fire({
            title: "Time's Up!",
            text: " Submitting your assessment automatically.",
            icon: 'info',
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false
        }).then(() => {
            finalizeSubmission();
        });
    };

    const handleSubmit = () => {
        const attemptedCount = Object.keys(selectedAnswers).length;
        const totalQuestions = questions.length;

        if (attemptedCount < totalQuestions) {
            Swal.fire({
                title: 'Are you sure?',
                text: `You have attempted only ${attemptedCount} out of ${totalQuestions} questions!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0D9488',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Submit!',
                cancelButtonText: 'No, Continue'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Submitted!',
                        text: 'Your assessment has been submitted successfully.',
                        icon: 'success',
                        confirmButtonColor: '#0D9488'
                    }).then(() => {
                        finalizeSubmission();
                    });
                }
            });
        } else {
            Swal.fire({
                title: 'Submit Assessment?',
                text: "You are about to submit your answers.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#0D9488',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, Submit!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Submitted!',
                        text: 'Your assessment has been submitted successfully.',
                        icon: 'success',
                        confirmButtonColor: '#0D9488'
                    }).then(() => {
                        finalizeSubmission();
                    });
                }
            });
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const jumpToQuestion = (index) => {
        setCurrentQuestion(index);
        setIsPaletteOpen(false); // Close on mobile after selection
    };

    const getQuestionStatus = (index) => {
        if (selectedAnswers[index]) return 'attempted';
        if (skippedQuestions.has(index)) return 'skipped';
        return 'unattempted';
    };



    return (
        <div className="min-h-screen bg-[#F1F5F9] p-4 font-sans select-none">
            {/* Header */}
            <header className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-[#1F2937]">DigiCoders Assessment</h1>
                    <p className="text-[#0D9488] font-bold text-sm">Testing Support</p>
                </div>

                <div>
                    <img className='h-22 w-22' src="/icon.jpg" alt="" />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#0D9488] rounded-full shadow-sm">
                        <Clock size={18} className="text-[#0D9488]" />
                        <span className="text-lg text-red-500 font-bold text-[#1F2937]">{formatTime(timeLeft)}</span>
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <button
                        onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                        className="lg:hidden p-2 text-[#1F2937] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isPaletteOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 relative">
                {/* Main Content */}
                <main className="">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden relative min-h-[500px] flex flex-col">
                        {/* Question Header */}
                        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex flex-col md:flex-row items-start gap-4">
                                <span className="bg-[#1F2937] text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                                    Q-{currentQuestion + 1}/{questions.length}
                                </span>
                                <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] leading-relaxed pt-1">
                                    {questions[currentQuestion].question}
                                </h2>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="p-8 flex-1">
                            <div className="grid gap-4">
                                {questions[currentQuestion].options.map((option, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`
                                        group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center
                                        ${selectedAnswers[currentQuestion] === option
                                                ? 'border-[#0D9488] bg-teal-50'
                                                : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50'
                                            }
                                    `}
                                    >
                                        <span className={`
                                        w-8 h-8 flex items-center justify-center rounded-lg font-bold mr-4 transition-colors
                                        ${selectedAnswers[currentQuestion] === option
                                                ? 'bg-[#0D9488] text-white'
                                                : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                            }
                                    `}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className={`text-lg font-medium ${selectedAnswers[currentQuestion] === option ? 'text-[#0D9488]' : 'text-gray-700'}`}>
                                            {option}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer / Navigation */}
                        <div className="p-3 md:p-6 border-t border-gray-100 flex items-center justify-between bg-white mt-auto gap-2 md:gap-4">
                            <button
                                onClick={handlePrev}
                                disabled={currentQuestion === 0}
                                className={`flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 rounded-xl font-bold border-2 transition-all text-xs md:text-base flex-1 md:flex-none
                                ${currentQuestion === 0
                                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    }
                            `}
                            >
                                <ChevronLeft size={16} className="md:w-5 md:h-5" /> <span className="md:hidden">PREV</span><span className="hidden md:inline">PREVIOUS</span>
                            </button>

                            {/* Skip button - always visible except on last question */}
                            {currentQuestion !== questions.length - 1 && (
                                <button
                                    onClick={handleSkip}
                                    className="flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 rounded-xl font-bold text-gray-500 hover:text-[#0D9488] transition-colors text-xs md:text-base flex-1 md:flex-none border-2 border-transparent hover:border-gray-100"
                                >
                                    SKIP <SkipForward size={16} className="md:w-5 md:h-5" />
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                className="flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-8 md:py-3 bg-[#0D9488] hover:bg-[#115E59] text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 transform hover:scale-105 transition-all text-xs md:text-base flex-1 md:flex-none"
                            >
                                {currentQuestion === questions.length - 1 ? 'SUBMIT' : 'Save&Next'} <ChevronRight size={16} className="md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Question Palette Sidebar */}
                <aside className={`
                fixed lg:static top-0 right-0 h-full lg:h-auto w-[280px] lg:w-auto bg-white lg:bg-transparent shadow-2xl lg:shadow-none z-50 transform transition-transform duration-300 ease-in-out p-6 lg:p-0
                ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 h-full lg:min-h-[500px] overflow-y-auto flex flex-col">
                        <div className="mb-6">
                            <div className="flex justify-end lg:hidden mb-2">
                                <button
                                    onClick={() => setIsPaletteOpen(false)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-[#1F2937]">Questions</h3>
                                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-bold border border-gray-200">Total: {questions.length}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-8">
                            {questions.map((q, idx) => {
                                const status = getQuestionStatus(q.id - 1); // fix to use index-based ID or modify ID logic
                                let statusColor = "bg-gray-100 text-gray-500 border-gray-200"; // Unattempted

                                if (idx === currentQuestion) {
                                    statusColor = "ring-2 ring-[#0D9488] border-[#0D9488] bg-teal-50 text-[#0D9488]";
                                } else if (status === 'attempted') {
                                    statusColor = "bg-[#0D9488] text-white border-[#0D9488]";
                                } else if (status === 'skipped') {
                                    statusColor = "bg-yellow-100 text-yellow-600 border-yellow-200";
                                } else if (!visitedQuestions.has(idx) && idx !== currentQuestion) {
                                    statusColor = "bg-red-100 text-red-500 border-red-200"; // Unvisited
                                }

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => jumpToQuestion(idx)}
                                        className={`
                                        w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all
                                        ${statusColor} hover:scale-110
                                    `}
                                    >
                                        {q.id}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-3 border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                <span className="w-4 h-4 rounded bg-[#0D9488] border border-[#0D9488]"></span> Attempted
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                <span className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200"></span> Skipped
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                <span className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></span> Unattempted
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                <span className="w-4 h-4 rounded bg-red-100 border border-red-200"></span> Unvisited
                            </div>
                        </div>

                        <div className="p-6 mt-auto border-t border-gray-100">
                            <button
                                onClick={handleSubmit}
                                className="w-full py-3 bg-[#0D9488] hover:bg-[#115E59] text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all transform hover:scale-105"
                            >
                                Submit Assessment
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            <footer className="text-center mt-8 text-gray-400 text-sm font-medium">
                © 2025 DigiCoders Technologies. All Rights Reserved.
            </footer>
        </div >
    );
}
