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
            {/* Breadcrumb */}
            <div className="bg-white border-b border-[#319795] px-6 py-3 -mx-6 -mt-6 mb-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#2D3748] font-semibold">Dashboard</span>
                    <span className="text-[#319795]">/</span>
                    <span className="text-[#319795]">Dashboard Analytics</span>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            onClick={() => navigate(card.link)}
                            className="bg-white rounded-xl p-6 border border-[#E6FFFA] shadow-md
                                hover:shadow-xl transform hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden"
                        >
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#319795]/20 to-[#F56565]/20 opacity-0 hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>

                            {/* Card Content */}
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#2D3748]">
                                    {card.title}
                                </h3>

                                {/* Icon Circle */}
                                <div className="bg-[#319795] p-3 rounded-full shadow-sm flex items-center justify-center">
                                    <Icon className="h-5 w-5 text-[#E6FFFA]" />
                                </div>
                            </div>

                            <p className="text-3xl font-bold text-[#2D3748] relative z-10">
                                {card.value}
                            </p>

                            {/* Coral Accent */}
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#F56565]/20 rounded-full pointer-events-none"></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
