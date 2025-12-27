import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AssessmentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock student data
    const students = [
        { id: 1, name: "Aditya Kashyap", phone: "Diploma [CS/IT/PGDCA]", course: "Passout", year: "7651949201", college: "G.P.Unnao", marks: "11/20", time: "13-12-2025 08:37:16pm" },
        { id: 2, name: "Masoom abbas", phone: "B. Tech [CSE/IT/Electronics]", course: "Passout", year: "9695097811", college: "Rrimt", marks: "9/10", time: "13-12-2025 05:57:46pm" },
        { id: 3, name: "Abc", phone: "Diploma [Electronics]", course: "1st Year", year: "9988776655", college: "Abc College", marks: "7/20", time: "15-12-2025 06:45:26pm" },
        { id: 4, name: "Sumesh Gupta", phone: "B. Tech [ME/EE/CE]", course: "4th Year", year: "9198483820", college: "DigiCoders", marks: "7/20", time: "13-12-2025 08:35:18pm" },
        { id: 5, name: "Gopal Singh", phone: "BCA", course: "4th Year", year: "6394296293", college: "DigiCoders", marks: "7/20", time: "13-12-2025 08:33:09pm" },
        { id: 6, name: "Ved", phone: "Diploma [Other]", course: "1st Year", year: "6307275065", college: "MJP", marks: "6/20", time: "13-12-2025 08:36:38pm" },
        { id: 7, name: "Pushkal Singh", phone: "Other Course", course: "Passout", year: "9918863106", college: "DIGICODERS", marks: "6/20", time: "13-12-2025 08:32:13pm" },
        { id: 8, name: "Ashi Awasthi", phone: "Diploma [Electronics]", course: "3rd Year", year: "8707099463", college: "Government polytechnic unnao", marks: "6/10", time: "13-12-2025 06:12:23pm" },
    ];

    // Mock questions data
    const mockQuestions = [
        {
            id: 1,
            question: "What is React?",
            options: ["A JavaScript library", "A database", "A programming language", "An operating system"],
            correctAnswer: 0,
        },
        {
            id: 2,
            question: "Which hook is used for state management?",
            options: ["useEffect", "useState", "useContext", "useReducer"],
            correctAnswer: 1,
        },
        {
            id: 3,
            question: "What does JSX stand for?",
            options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "JSON Structure"],
            correctAnswer: 0,
        },
        {
            id: 4,
            question: "Which method is used to render elements in React?",
            options: ["render()", "display()", "show()", "ReactDOM.render()"],
            correctAnswer: 3,
        },
        {
            id: 5,
            question: "What is a component in React?",
            options: ["A function", "A class", "Both function and class", "A variable"],
            correctAnswer: 2,
        }
    ];

    // Mock student answers
    const getStudentAnswers = (studentId) => {
        const answerSets = {
            1: [0, 1, 0, 3, 2],
            2: [0, 0, 0, 2, 1],
            3: [1, 1, 1, 1, 1],
            4: [0, 1, 0, 3, 0],
            5: [0, 1, 0, 3, 2],
            6: [2, 2, 2, 2, 2],
            7: [0, 1, 0, 1, 1],
            8: [0, 0, 0, 0, 0],
        };
        return answerSets[studentId] || [0, 0, 0, 0, 0];
    };

    const student = students.find(s => s.id === parseInt(id));
    
    if (!student) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Student not found</h2>
                    <button 
                        onClick={() => navigate(-1)}
                        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const studentAnswers = getStudentAnswers(student.id);

    const handlePrint = () => {
        const printContent = document.getElementById('printableArea');
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    return (
        <>
            <div style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>
            {/* Back Button */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ backgroundColor: '#6b7280', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    ← Back
                </button>
                <button
                    onClick={handlePrint}
                    style={{ backgroundColor: '#4ade80', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    Print
                </button>
            </div>

            <div id="printableArea" style={{ backgroundColor: 'white', color: 'black' }}>

            {/* Student Info */}
            <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', border: '1px solid #ccc' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Assessment Details</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <p><strong>Student Name:</strong> {student.name}</p>
                        <p><strong>Course:</strong> {student.phone}</p>
                        <p><strong>Year:</strong> {student.course}</p>
                    </div>
                    <div>
                        <p><strong>Phone:</strong> {student.year}</p>
                        <p><strong>College:</strong> {student.college}</p>
                        <p><strong>Score:</strong> {student.marks}</p>
                        <p><strong>Submitted:</strong> {student.time}</p>
                    </div>
                </div>
            </div>

            {/* Questions and Answers */}
            <div>
                <h2>Questions & Answers</h2>
                
                {mockQuestions.map((question, qIndex) => {
                    const studentAnswer = studentAnswers[qIndex];
                    const isCorrect = studentAnswer === question.correctAnswer;
                    
                    return (
                        <div key={question.id} style={{ marginBottom: '20px' }}>
                            <p><strong>Q{qIndex + 1}. {question.question}</strong></p>
                            
                            {question.options.map((option, optIndex) => {
                                const isStudentChoice = studentAnswer === optIndex;
                                const isCorrectAnswer = question.correctAnswer === optIndex;
                                
                                let style = {};
                                if (isStudentChoice && isCorrectAnswer) {
                                    style.color = 'green';
                                    style.fontWeight = 'bold';
                                } else if (isStudentChoice && !isCorrectAnswer) {
                                    style.color = 'red';
                                    style.fontWeight = 'bold';
                                }
                                
                                return (
                                    <p key={optIndex} style={style}>
                                        {String.fromCharCode(65 + optIndex)}. {option}
                                    </p>
                                );
                            })}
                            
                            <p style={{ color: 'blue', marginTop: '10px' }}><strong>Correct: {question.options[question.correctAnswer]}</strong></p>
                            <hr />
                        </div>
                    );
                })}
            </div>
            </div>
            </div>
        </>
    );
}