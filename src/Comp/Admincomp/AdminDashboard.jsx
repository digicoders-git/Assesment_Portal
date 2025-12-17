import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Clock,
    Users,
    Award,
    Shield,
    History,
    Menu,
    X
} from 'lucide-react';

import { useUser } from '../../context/UserContext';

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();

    // ... (menuItems and handleNavigation remain same - checking lines to skip them for brevity if possible, but replace_file_content needs contiguity if I don't use multi)
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { id: 'topics', label: 'Manage Topics', icon: BookOpen, path: '/admin/topics' },
        { id: 'assessment', label: 'Active Assessment', icon: Clock, path: '/admin/assessment' },
        { id: 'history', label: 'Assessment History', icon: History, path: '/admin/history' },
        { id: 'students', label: 'Manage Students', icon: Users, path: '/admin/students' },
        { id: 'certificate', label: 'Manage Certificate', icon: Award, path: '/admin/certificate' },
        { id: 'security', label: 'Security Settings', icon: Shield, path: '/admin/security' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        // On mobile, close sidebar after navigation
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-slate-700 to-slate-800 text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'} overflow-hidden`}>
                {/* Logo and Mobile Close Button */}
                <div className="p-6 border-b border-slate-600 flex items-center justify-between">
                    <h1 className={`text-2xl font-bold flex items-center gap-2 transition-opacity duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
                        <span className="text-white">Digi</span>
                        <span className="text-teal-400">{'{Coders}'}</span>
                    </h1>

                    {/* Mobile Close Button - Only visible on mobile when sidebar is open */}
                    {sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-slate-600 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Menu Items */}
                <nav className="mt-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.path)}
                                className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${isActive
                                    ? 'bg-teal-500 text-white border-l-4 border-teal-300'
                                    : 'text-gray-300 hover:bg-slate-600 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <span className={`text-sm transition-opacity duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            {/* Toggle Button - Shows X when open, Menu when closed */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {sidebarOpen ? (
                                    <X className="h-6 w-6 text-gray-700" />
                                ) : (
                                    <Menu className="h-6 w-6 text-gray-700" />
                                )}
                            </button>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">DigiCoders Assessment Portal</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                {user?.name || "Admin"}
                            </span>
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center overflow-hidden border border-teal-100">
                                {user?.image ? (
                                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Users className="h-5 w-5 text-white" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="bg-white border-t px-6 py-4 text-center">
                    <p className="text-sm text-gray-600">
                        Copyright © 2025 <span className="text-teal-600 font-semibold">DigiCoders Assessment Portal</span> | All Rights Reserved.
                    </p>
                </footer>
                {/* hello */}
            </div>
        </div>
    );
}
