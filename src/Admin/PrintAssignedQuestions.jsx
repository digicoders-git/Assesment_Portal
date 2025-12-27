import React from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';

export default function PrintAssignedQuestions() {
    const { id } = useParams();

    // Load assigned questions from localStorage
    const assignedQuestions = JSON.parse(localStorage.getItem(`assessment_${id}_assigned_questions`) || '[]');

    const handlePrint = () => {
        window.print();
    };

    if (assignedQuestions.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">No Questions Assigned</h2>
                    <p className="text-gray-500">Please assign questions first to print the paper.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 p-8 print:p-0">
            {/* Print Button - Hidden when printing */}
            <div className="max-w-4xl mx-auto mb-8 print:hidden flex justify-end items-center">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    <Printer className="h-4 w-4" />
                    Print Solution
                </button>
            </div>

            {/* Paper Content */}
            <div className="max-w-4xl mx-auto bg-white print:w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className='flex items-center justify-center'>
                        <img className='h-16 w-48' src="/digicoders-logo.png" alt="" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-700">Interview Questions</h2>
                </div>

                {/* Student Details */}
                <div className="flex flex-wrap gap-x-8 gap-y-6 mb-12 text-sm font-medium">
                    <div className="flex items-end gap-2 flex-grow">
                        <span className="text-gray-700">Name:</span>
                        <div className="flex-grow border-b border-gray-400"></div>
                    </div>
                    <div className="flex items-end gap-2 w-64">
                        <span className="text-gray-700">Phone:</span>
                        <div className="flex-grow border-b border-gray-400"></div>
                    </div>
                    <div className="flex items-end gap-2 w-48">
                        <span className="text-gray-700">Date:</span>
                        <div className="flex-grow border-b border-gray-400 text-center">/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/</div>
                    </div>
                    <div className="w-full flex items-end gap-2">
                        <div className="flex items-end gap-2 w-1/2">
                            <span className="text-gray-700">Branch/Batch:</span>
                            <div className="flex-grow border-b border-gray-400"></div>
                        </div>
                        <div className="flex items-end gap-2 w-1/2">
                            <span className="text-gray-700">College:</span>
                            <div className="flex-grow border-b border-gray-400"></div>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-8">
                    {assignedQuestions.map((q, index) => {
                        // Get actual options from the question data
                        const options = [q.optionA, q.optionB, q.optionC, q.optionD].filter(opt => opt && opt.trim());
                        
                        // Fallback options if none exist
                        const displayOptions = options.length > 0 ? options : [
                            "Option A", "Option B", "Option C", "Option D"
                        ];
                        
                        return (
                            <div key={q.id} className="break-inside-avoid mb-8">
                                <p className="font-bold text-black mb-3 text-[1.1rem]">
                                    Q.{index + 1}) {q.text || q.question}
                                </p>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-8 ml-2">
                                    {displayOptions.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-black rounded-sm flex-shrink-0"></div>
                                            <span className="text-black font-semibold text-sm">
                                                {String.fromCharCode(65 + idx)}). {opt}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { 
                        margin: 2cm 2.5cm 2cm 3cm !important;
                        size: A4;
                    }
                    html, body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: white !important;
                        color: black !important;
                        opacity: 1 !important;
                        font-weight: bold !important;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        opacity: 1 !important;
                        color: black !important;
                        background: transparent !important;
                    }
                    .text-gray-700, .text-gray-500 {
                        color: black !important;
                    }
                    .border-gray-400 {
                        border-color: black !important;
                    }
                    .border-black {
                        border-color: black !important;
                        border-width: 2px !important;
                    }
                }
            `}</style>
        </div>
    );
}