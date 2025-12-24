import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Award, History, FileText, BookOpen } from 'lucide-react';

export default function DashboardHome() {
    const navigate = useNavigate();

    const cards = [
        { title: 'ACTIVE ASSESSMENT', value: '1', icon: Clock, link: '/admin/assessment' },
        { title: 'HISTORY', value: '1', icon: History, link: '/admin/history' },
        { title: 'TOTAL STUDENTS', value: '1314', icon: Users, link: '/admin/students' },
        { title: 'TOTAL RESULTS', value: '6827', icon: FileText, link: '/admin/history' },
        { title: 'ACTIVE TOPICS', value: '3', icon: BookOpen, link: '/admin/topics' },
        { title: 'INACTIVE TOPICS', value: '0', icon: BookOpen, link: '/admin/topics' },
        { title: 'TOTAL QUESTIONS', value: '110', icon: FileText, link: '/admin/topics' },
        { title: 'CERTIFICATES', value: '1', icon: Award, link: '/admin/certificate' },
    ];

    return (
        <div className="p-6 bg-[#EDF2F7] min-h-full">
            {/* Breadcrumb - Simplified */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 -mx-6 -mt-6 mb-6 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 font-medium">Admin</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#319795] font-bold">Dashboard Analytics</span>
                </div>
            </div>

            {/* Cards - Exact match to reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            onClick={() => navigate(card.link)}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden h-[150px] flex flex-col justify-between"
                        >
                            {/* Pink corner decoration */}
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-red-200 rounded-full opacity-60 z-0"></div>

                            <div className="relative z-10 w-full">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mt-1">
                                        {card.title}
                                    </h3>
                                    <div className="bg-[#319795] w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                </div>

                                <p className="text-4xl font-bold text-[#2D3748] mt-2">
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}