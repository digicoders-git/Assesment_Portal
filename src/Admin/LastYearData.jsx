import React, { useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function LastYearData() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const data = [
        { id: 1, name: "Bittu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:29pm", phone: "6392907806", batch: "Seminar/Workshop 2026", college: "Goverment polytechnic bansdeeh ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 2, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:23pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 3, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:23pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 4, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:25pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 5, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:25pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 6, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:26pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 7, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:28pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 8, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:28pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 9, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:29pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 10, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:29pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 11, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:29pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 12, name: "Ayush yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:07:32pm", phone: "7985383019", batch: "Seminar/Workshop 2026", college: "Goverment polytechnic bansdih", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 13, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:30pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 14, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:30pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 15, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:31pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 16, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:31pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 17, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:31pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 18, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:31pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 19, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:32pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 20, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:32pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 21, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:32pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 22, name: "Suraj kumar Gond", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:07:22pm", phone: "6390855752", batch: "Seminar/Workshop 2026", college: "Government polytechnic basdeeh ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 23, name: "Shivanshu Pratap", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:22:39pm", phone: "8577984917", batch: "Internship [2026]", college: "Government Polytechnic Bansdeeh ballia", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 24, name: "Jafeer Alam", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:19:23pm", phone: "7565947673", batch: "Seminar/Workshop 2026", college: "Government polytechnic banshdeeh 277219", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 25, name: "Sangi kumar sahani", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:15:21pm", phone: "7238961905", batch: "Seminar/Workshop 2026", college: "Government polytechnic college bansdih ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 26, name: "Sumit Thakur", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:10:35pm", phone: "9305190820", batch: "Seminar/Workshop 2026", college: "Government polytechnic Banshdeeh Ballia 277219", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 27, name: "Aditya Kumar", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:09:38pm", phone: "8810881771", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdeeh  ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 28, name: "Jaish kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:09:04pm", phone: "7084244917", batch: "Seminar/Workshop 2026", college: "Government polytechnic college Banshdeeh Ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 29, name: "Ashutosh chaubey", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:03:47pm", phone: "9026676605", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdeeh ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 30, name: "Amresh Kumar Chauhan", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:04:22pm", phone: "9559329162", batch: "Seminar/Workshop 2026", college: "Government polytechnic basdeeh Ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 31, name: "Rohit Maurya", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:05:10pm", phone: "8737952713", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdih Ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 32, name: "AYUSH", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:05:14pm", phone: "9628684380", batch: "Seminar/Workshop 2026", college: "Goverment polytechnic bansdih", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 33, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:33pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 34, name: "Raghu kumar yadav", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:08:33pm", phone: "9129811456", batch: "Summer Training [2026]", college: "GOVERNMENT POLYTECHNIC BANSDEEH BALLIA", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 35, name: "Priyanshu Sharma", obtainedMarks: 10, totalMarks: 10, dateTime: "29-01-2026 02:07:07pm", phone: "9151046907", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdeeh ballia 277219", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 36, name: "Abhishek Kumar", obtainedMarks: 9, totalMarks: 10, dateTime: "29-01-2026 02:09:29pm", phone: "8808955288", batch: "Seminar/Workshop 2026", college: "Government polytechnic basndeeh ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 37, name: "Ak pathak", obtainedMarks: 9, totalMarks: 10, dateTime: "29-01-2026 02:10:58pm", phone: "9129246238", batch: "Seminar/Workshop 2026", college: "Government Polytechnic College basdih (Ballia)", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 38, name: "Ak pathak", obtainedMarks: 9, totalMarks: 10, dateTime: "29-01-2026 02:11:38pm", phone: "9129246238", batch: "Seminar/Workshop 2026", college: "Government Polytechnic College basdih (Ballia)", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 39, name: "Sumit tiwari", obtainedMarks: 9, totalMarks: 10, dateTime: "29-01-2026 02:13:08pm", phone: "8090784384", batch: "Seminar/Workshop 2026", college: "Government polytechnic bassd Baliya", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 40, name: "Shubham tiwari", obtainedMarks: 9, totalMarks: 10, dateTime: "29-01-2026 02:18:28pm", phone: "6393152352", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdih", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 41, name: "Aditya kumar yadav", obtainedMarks: 9, totalMarks: 10, dateTime: "29-01-2026 01:44:48pm", phone: "7800545747", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdih Ballia", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 42, name: "Naval sahu", obtainedMarks: 9, totalMarks: 10, dateTime: "29-01-2026 02:05:58pm", phone: "9621791200", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdeeh ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 43, name: "Vivek kumar gupta", obtainedMarks: 9, totalMarks: 10, dateTime: "29-01-2026 02:02:42pm", phone: "6293102536", batch: "Summer Training [2026]", college: "Government polytechnic Banshdeeh", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 44, name: "Saurabh Singh", obtainedMarks: 9, totalMarks: 10, dateTime: "29-01-2026 02:01:09pm", phone: "9889771122", batch: "Summer Training [2026]", college: "Government Polytechnic Banshdeeh Ballia", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 45, name: "Aditya Kumar", obtainedMarks: 9, totalMarks: 10, dateTime: "29-01-2026 02:00:23pm", phone: "8810881771", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdeeh", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 46, name: "Aman Mishra", obtainedMarks: 8, totalMarks: 10, dateTime: "29-01-2026 02:00:52pm", phone: "9971694869", batch: "Summer Training [2026]", college: "Government Polytechnic bansdeeh ballia", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 47, name: "Vivek Kumar Gupta", obtainedMarks: 8, totalMarks: 10, dateTime: "29-01-2026 02:13:45pm", phone: "6293102536", batch: "Summer Training [2026]", college: "Grovement polytechnic Banshdeeh", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 48, name: "Vivek kumar gupta", obtainedMarks: 8, totalMarks: 10, dateTime: "29-01-2026 03:18:40pm", phone: "6293102536", batch: "Summer Training [2026]", college: "Grovement polytechnic Banshdeeh", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 49, name: "Saumya mishra", obtainedMarks: 7, totalMarks: 10, dateTime: "29-01-2026 02:08:59pm", phone: "9511491404", batch: "Seminar/Workshop 2026", college: "Government polytechnic banshdeeh Ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 50, name: "Alok yadav", obtainedMarks: 7, totalMarks: 10, dateTime: "29-01-2026 02:01:08pm", phone: "8810703497", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdeeh ballia", course: "Diploma [Electronics]", year: "2nd Year" },
        { id: 51, name: "Ahvdnb", obtainedMarks: 5, totalMarks: 10, dateTime: "29-01-2026 01:41:01pm", phone: "9801077990", batch: "Seminar/Workshop 2026", college: "Bsbxkxbdb", course: "Other Course", year: "4th Year" },
        { id: 52, name: "Shivanand triphti", obtainedMarks: 4, totalMarks: 10, dateTime: "29-01-2026 02:06:13pm", phone: "7348255606", batch: "Seminar/Workshop 2026", college: "Government polytechnic Bansdeeh ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 53, name: "Ayush yadav", obtainedMarks: 4, totalMarks: 10, dateTime: "29-01-2026 02:01:07pm", phone: "7985383019", batch: "Seminar/Workshop 2026", college: "Goverment polytechnic bansdih", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 54, name: "Abhishek pathak", obtainedMarks: 4, totalMarks: 10, dateTime: "29-01-2026 01:57:56pm", phone: "9129246238", batch: "Seminar/Workshop 2026", college: "Government Polytechnic College basdih (Ballia)", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 55, name: "Sumit tiwari", obtainedMarks: 2, totalMarks: 10, dateTime: "29-01-2026 02:00:46pm", phone: "8090784384", batch: "Seminar/Workshop 2026", college: "Government polytechnic basudev Ballia", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 56, name: "Aditya Prajapati", obtainedMarks: 2, totalMarks: 10, dateTime: "29-01-2026 01:57:11pm", phone: "8810881771", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdeeh", course: "Diploma [Electronics]", year: "1st Year" },
        { id: 57, name: "Aditya Prajapati", obtainedMarks: 2, totalMarks: 10, dateTime: "29-01-2026 01:57:09pm", phone: "8810881771", batch: "Seminar/Workshop 2026", college: "Government polytechnic bansdeeh", course: "Diploma [Electronics]", year: "1st Year" }
    ];

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-screen">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Last Year Data</h2>
                <p className="text-sm text-gray-500">DigiCoders Assessment Portal - Historical Records</p>
            </div>

            <div className="bg-white rounded-lg border border-[#E6FFFA] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-[#E6FFFA] text-[#2D3748] font-semibold border-b border-[#319795]">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Student Name</th>
                                <th className="px-4 py-3">Marks</th>
                                <th className="px-4 py-3">Date Time</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Student Batch</th>
                                <th className="px-4 py-3">College</th>
                                <th className="px-4 py-3">Course</th>
                                <th className="px-4 py-3">Year</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6FFFA]">
                            {paginatedData.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-[#4A5568]">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="px-4 py-3 font-bold text-[#2D3748]">{item.name}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-bold">{item.obtainedMarks}/{item.totalMarks}</span>
                                    </td>
                                    <td className="px-4 py-3 text-[#718096] text-xs">{item.dateTime}</td>
                                    <td className="px-4 py-3 text-[#4A5568]">
                                        <div className="flex items-center gap-2">
                                            <span>{item.phone}</span>
                                            <div className="flex gap-1">
                                                <a
                                                    href={`tel:${item.phone}`}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Call"
                                                >
                                                    <Phone className="h-3.5 w-3.5" />
                                                </a>
                                                <a
                                                    href={`https://wa.me/${item.phone}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                    title="WhatsApp"
                                                >
                                                    <MessageCircle className="h-3.5 w-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[#4A5568]">{item.batch}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-50 text-green-700 py-1 px-2 rounded text-xs font-medium max-w-[200px] inline-block truncate" title={item.college}>
                                            {item.college}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">{item.course}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold">{item.year}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-[#E6FFFA] text-xs text-[#2D3748] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} entries</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1.5 rounded transition-colors ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-[#319795] font-medium'}`}
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1.5 bg-[#319795] text-white rounded font-medium">{currentPage}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1.5 rounded transition-colors ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-[#319795] font-medium'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
