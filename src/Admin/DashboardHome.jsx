import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    Users,
    Award,
    History,
    FileText,
    BookOpen
} from 'lucide-react';

export default function DashboardHome() {
    const navigate = useNavigate();

    const topCards = [
        {
            title: 'ACTIVE ASSESSMENT',
            value: '1',
            icon: Clock,
            gradient: 'from-teal-400 via-teal-300 to-cyan-300',
            iconBg: 'bg-white/40',
            link: '/admin/assessment'
        },
        {
            title: 'HISTORY',
            value: '1',
            icon: History,
            gradient: 'from-orange-300 via-orange-200 to-amber-200',
            iconBg: 'bg-white/40',
            link: '/admin/history'
        },
        {
            title: 'TOTAL STUDENTS',
            value: '1314',
            icon: Users,
            gradient: 'from-emerald-300 via-teal-200 to-cyan-300',
            iconBg: 'bg-white/40',
            link: '/admin/students'
        },
        {
            title: 'TOTAL RESULTS',
            value: '6827',
            icon: FileText,
            gradient: 'from-blue-300 via-indigo-200 to-purple-300',
            iconBg: 'bg-white/40',
            link: '/admin/history'
        },
    ];

    const bottomCards = [
        {
            title: 'ACTIVE TOPICS',
            value: '3',
            icon: BookOpen,
            gradient: 'from-teal-300 via-emerald-200 to-green-300',
            iconBg: 'bg-white/40',
            link: '/admin/topics'
        },
        {
            title: 'INACTIVE TOPICS',
            value: '0',
            icon: BookOpen,
            gradient: 'from-slate-200 via-gray-200 to-slate-300',
            iconBg: 'bg-white/40',
            link: '/admin/topics'
        },
        {
            title: 'TOTAL QUESTIONS',
            value: '110',
            icon: FileText,
            gradient: 'from-cyan-300 via-teal-200 to-blue-300',
            iconBg: 'bg-white/40',
            link: '/admin/topics'
        },
        {
            title: 'CERTIFICATES',
            value: '1',
            icon: Award,
            gradient: 'from-amber-300 via-orange-200 to-yellow-300',
            iconBg: 'bg-white/40',
            link: '/admin/certificate'
        },
    ];

    return (
        <div className="p-6 bg-gray-50 h-full">
            {/* Breadcrumb */}
            <div className="bg-white border-b px-6 py-3 -mx-6 -mt-6 mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-600 font-semibold">Dashboard</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">Dashboard Analytics</span>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {topCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            onClick={() => navigate(card.link)}
                            className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">
                                    {card.title}
                                </h3>
                                <div className={`${card.iconBg} p-2 rounded-lg`}>
                                    <Icon className="h-6 w-6 text-gray-600" />
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-gray-800">{card.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Content Management Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-slate-700 rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-800">CONTENT MANAGEMENT</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {bottomCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                onClick={() => navigate(card.link)}
                                className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">
                                        {card.title}
                                    </h3>
                                    <div className={`${card.iconBg} p-2 rounded-lg`}>
                                        <Icon className="h-6 w-6 text-gray-600" />
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-gray-800">{card.value}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
