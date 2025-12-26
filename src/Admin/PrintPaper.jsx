import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';

export default function PrintPaper() {
    const { topicId } = useParams();
    const navigate = useNavigate();

    // Dynamic dummy questions - in real app fetch based on topicId
    const dummyQuestions = [
        "What is the primary purpose of React Hooks?",
        "Which method is used to create components in React?",
        "What is JSX in React?",
        "Which hook is used for state management in React?",
        "What is the virtual DOM?",
        "How do you pass data from parent to child component?",
        "What is the difference between state and props?",
        "Which lifecycle method is called after component mounts?",
        "What is Redux used for?",
        "How do you handle events in React?",
        "What is the purpose of useEffect hook?",
        "How do you create a functional component?",
        "What is component lifecycle?",
        "How do you update state in React?",
        "What is the difference between controlled and uncontrolled components?",
        "How do you implement routing in React?",
        "What is context API?",
        "How do you optimize React application performance?",
        "What is the purpose of keys in React lists?",
        "How do you handle forms in React?",
        "What is higher-order component (HOC)?",
        "How do you implement lazy loading in React?",
        "What is the difference between class and functional components?",
        "How do you manage global state in React?",
        "What is the purpose of React.memo()?",
        "How do you handle API calls in React?",
        "What is the difference between useCallback and useMemo?",
        "How do you implement error boundaries?",
        "What is the purpose of useRef hook?",
        "How do you test React components?",
        "What is server-side rendering (SSR)?",
        "How do you implement authentication in React?",
        "What is the difference between React and Angular?",
        "How do you handle routing with parameters?",
        "What is the purpose of Fragment in React?",
        "How do you implement conditional rendering?",
        "What is the difference between useState and useReducer?",
        "How do you handle side effects in React?",
        "What is the purpose of custom hooks?",
        "How do you implement drag and drop functionality?"
    ];

    const dummyOptions = [
        ["To manage state", "To handle events", "To create components", "To optimize performance"],
        ["React.createClass()", "function Component()", "class Component", "React.Component()"],
        ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
        ["useEffect", "useState", "useContext", "useReducer"],
        ["Real DOM copy", "Virtual representation of DOM", "Browser DOM", "Shadow DOM"],
        ["Through props", "Through state", "Through context", "Through events"],
        ["State is mutable, props are immutable", "Props are mutable, state is immutable", "Both are mutable", "Both are immutable"],
        ["componentDidMount", "componentWillMount", "componentDidUpdate", "componentWillUnmount"],
        ["State management", "Component creation", "Event handling", "API calls"],
        ["onClick handlers", "Event listeners", "Synthetic events", "DOM events"],
        ["Side effects", "State management", "Component creation", "Event handling"],
        ["function Component()", "React.createComponent()", "class Component", "React.Component()"],
        ["Component creation to destruction", "State management", "Event handling", "Data flow"],
        ["setState()", "updateState()", "changeState()", "modifyState()"],
        ["Controlled has value prop", "Uncontrolled has no value", "Both are same", "Controlled uses refs"],
        ["React Router", "React Navigation", "React Route", "React Path"],
        ["Global state management", "Component communication", "Event handling", "API management"],
        ["Code splitting", "State optimization", "Event optimization", "Memory management"],
        ["Unique identification", "Styling purpose", "Event handling", "State management"],
        ["Controlled components", "Form libraries", "Event handlers", "State management"],
        ["Component wrapper", "State container", "Event handler", "API wrapper"],
        ["React.lazy()", "React.suspend()", "React.load()", "React.import()"],
        ["Syntax and lifecycle", "Performance only", "State management", "Event handling"],
        ["Context API", "Redux", "Local storage", "Props drilling"],
        ["Performance optimization", "State management", "Event handling", "Component creation"],
        ["fetch() or axios", "XMLHttpRequest", "jQuery AJAX", "Native fetch"],
        ["useCallback for functions, useMemo for values", "Both are same", "useCallback for values", "useMemo for functions"],
        ["componentDidCatch", "try-catch blocks", "Error boundaries", "Exception handlers"],
        ["DOM element reference", "State management", "Event handling", "Component reference"],
        ["Jest and React Testing Library", "Mocha and Chai", "Jasmine and Karma", "Cypress only"],
        ["Rendering on server", "Client-side rendering", "Static generation", "Hybrid rendering"],
        ["JWT tokens", "Session storage", "Local storage", "Cookies only"],
        ["Component-based vs MVC", "Same architecture", "Performance only", "Syntax only"],
        ["useParams hook", "props.params", "route.params", "window.params"],
        ["Group elements without wrapper", "Create components", "Handle events", "Manage state"],
        ["Ternary operator", "if-else statements", "switch cases", "Logical operators"],
        ["useState for simple, useReducer for complex", "Both are same", "useState for objects", "useReducer for primitives"],
        ["useEffect hook", "componentDidMount", "Event handlers", "State management"],
        ["Reusable stateful logic", "Component creation", "Event handling", "API calls"],
        ["HTML5 Drag and Drop API", "React DnD library", "Custom event handlers", "Third-party libraries"]
    ];

    const questions = Array(30).fill(null).map((_, i) => ({
        id: i + 1,
        question: dummyQuestions[i],
        options: dummyOptions[i]
    }));

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 p-8 print:p-0">
            {/* Print Button & Navigation - Hidden when printing */}
            <div className="print:hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-4 sm:px-0">
                    <button
                        onClick={() => navigate('/admin/topics')}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <Printer className="h-4 w-4" />
                        Print Solution
                    </button>
                </div>
            </div>

            {/* Paper Content */}
            <div className="max-w-4xl mx-auto bg-white print:max-w-none print:w-full">
                {/* Header */}
                <div className="text-center mb-8 print:mb-6">
                    <div className='flex items-center justify-center'>
                        <img className='h-16 w-40 print:h-12 print:w-32' src="/digicoders-logo.png" alt="" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700 print:text-xl print:mb-2">Interview Questions</h2>
                </div>

                {/* Student Details */}
                <div className="flex flex-wrap gap-x-6 gap-y-4 mb-8 text-sm font-medium print:break-after-avoid print:mb-6">
                    <div className="flex items-end gap-2 flex-grow min-w-[280px]">
                        <span className="text-gray-700">Name:</span>
                        <div className="flex-grow border-b border-gray-400 min-w-[180px]"></div>
                    </div>
                    <div className="flex items-end gap-2 w-56">
                        <span className="text-gray-700">Mobile No.:</span>
                        <div className="flex-grow border-b border-gray-400"></div>
                    </div>
                    <div className="flex items-end gap-2 w-40">
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
                <div className="space-y-3 print:space-y-2">
                    {questions.map((q) => (
                        <div key={q.id} className="break-inside-avoid mb-3 print:mb-2">
                            <p className="font-bold text-black mb-1 text-[0.95rem] print:text-[0.9rem] print:mb-0.5">
                                Q.{q.id}) {q.question}
                            </p>
                            <div className="grid grid-cols-2 gap-y-0.5 gap-x-3 ml-1 print:gap-y-0 print:gap-x-2">
                                {q.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 print:gap-1">
                                        <div className="w-3.5 h-3.5 border-2 border-black rounded-sm flex-shrink-0 print:w-3 print:h-3"></div>
                                        <span className="text-black font-semibold text-xs print:text-[0.7rem]">
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
                    @page { 
                        margin: 0.5cm 0.5cm 0.5cm 1cm !important;
                        size: A4;
                    }
                    html, body {
                        overflow: visible !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        height: auto !important;
                        min-height: auto !important;
                    }
                    body {
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
                        box-sizing: border-box !important;
                        overflow: visible !important;
                    }
                    .break-inside-avoid {
                        page-break-inside: avoid !important;
                        break-inside: avoid-page !important;
                        orphans: 1 !important;
                        widows: 1 !important;
                    }
                    .print\\:break-after-avoid {
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                    .print\\:max-w-none {
                        max-width: none !important;
                    }
                    .print\\:w-full {
                        width: 100% !important;
                    }
                    .print\\:mb-6 {
                        margin-bottom: 1rem !important;
                    }
                    .print\\:mb-2 {
                        margin-bottom: 0.3rem !important;
                    }
                    .print\\:mb-0\.5 {
                        margin-bottom: 0.1rem !important;
                    }
                    .print\\:text-xl {
                        font-size: 1.1rem !important;
                    }
                    .print\\:text-\[0\.9rem\] {
                        font-size: 0.85rem !important;
                    }
                    .print\\:text-\[0\.7rem\] {
                        font-size: 0.65rem !important;
                    }
                    .print\\:h-12 {
                        height: 2.5rem !important;
                    }
                    .print\\:w-32 {
                        width: 7rem !important;
                    }
                    .print\\:w-3 {
                        width: 0.6rem !important;
                    }
                    .print\\:h-3 {
                        height: 0.6rem !important;
                    }
                    .print\\:gap-1 {
                        gap: 0.2rem !important;
                    }
                    .print\\:gap-x-2 {
                        column-gap: 0.4rem !important;
                    }
                    .print\\:gap-y-0 {
                        row-gap: 0rem !important;
                    }
                    .print\\:space-y-2 > * + * {
                        margin-top: 0.3rem !important;
                    }
                    .text-gray-700, .text-gray-500 {
                        color: black !important;
                    }
                    .border-gray-400 {
                        border-color: black !important;
                    }
                    .border-black {
                        border-color: black !important;
                        border-width: 1.5px !important;
                    }
                }
            `}</style>
        </div>
    );
}
