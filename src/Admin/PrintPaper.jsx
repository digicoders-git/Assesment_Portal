import React from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';

export default function PrintPaper() {
    const { topicId } = useParams();

    // Mock data - in real app fetch based on topicId
    const questions = Array(20).fill(null).map((_, i) => ({
        id: i + 1,
        question: i === 0 ? "Who is known as the father of computer?" :
            i === 1 ? "Who is the brain of a computer system called?" :
                "Which of the following is not a valid C variable name?",
        options: [
            "Dennis Ritchie",
            "Bill Gates",
            "Charles Babbage",
            "James Gosling"
        ]
    }));

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 p-8 print:p-0">
            {/* Print Button & Navigation - Hidden when printing */}
            <div className="max-w-4xl mx-auto mb-8 print:hidden flex justify-end items-center">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Printer className="h-4 w-4" />
                    Print Solution
                </button>
            </div>

            {/* Paper Content */}
            <div className="max-w-4xl mx-auto bg-white print:w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-2xl font-bold text-gray-500 mb-2">DigiCoders</h1>
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
                    {questions.map((q) => (
                        <div key={q.id}>
                            <p className="font-bold text-gray-900 mb-3">
                                Q.{q.id}) {q.question}
                            </p>
                            <div className="space-y-2 ml-1">
                                {q.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-gray-400 rounded-sm flex-shrink-0"></div>
                                        <span className="text-gray-700">
                                            {String.fromCharCode(65 + idx)}). {opt}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { margin: 2cm; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}
