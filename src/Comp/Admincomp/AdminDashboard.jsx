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

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { id: 'topics', label: 'Manage Topics', icon: BookOpen, path: '/admin/topics' },
        { id: 'assessment', label: 'Active Assessment', icon: Clock, path: '/admin/assessment' },
        { id: 'history', label: 'Assessment History', icon: History, path: '/admin/history' },
        { id: 'students', label: 'Manage Students', icon: Users, path: '/admin/students' },
        { id: 'certificate', label: 'Manage Certificate', icon: Award, path: '/admin/certificate' },
        { id: 'security', label: 'Security Settings', icon: Shield, path: '/admin/security' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#EDF2F7' }}> {/* Soft Gray Background */}
            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen transition-all duration-300 z-50 overflow-hidden flex-shrink-0`}
                style={{
                    width: sidebarOpen ? '16rem' : '0',
                    backgroundColor: '#319795', // Teal Sidebar
                    color: '#E6FFFA' // Light text/icons
                }}
            >
                {/* Logo */}
                <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <h1 className={`text-2xl font-black flex items-center gap-2 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="text-white">Digi</span>
                        <span style={{ color: '#4FD1C5' }}>{'{Coders}'}</span>
                    </h1>

                    {sidebarOpen && (
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-white/10">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Menu */}
                <nav className="mt-6 px-3 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.id === 'dashboard' && location.pathname === '/admin/dashboard');

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.path)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group`}
                                style={{
                                    backgroundColor: isActive ? '#287D80' : 'transparent',
                                    color: isActive ? '#FFFFFF' : '#E6FFFA',
                                }}
                            >
                                <Icon className={`h-6 w-6 transition-colors ${isActive ? 'text-white' : 'text-[#4FD1C5] group-hover:text-white'}`} />
                                <span className={`text-[15px] whitespace-nowrap font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#2D3748' }}>
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(prev => !prev)} className="p-2 rounded-lg hover:bg-[#FF7F50]/20">
                                {sidebarOpen ? <X className="h-6 w-6" style={{ color: '#319795' }} /> : <Menu className="h-6 w-6" style={{ color: '#319795' }} />}
                            </button>
                            <h2 className="text-xl font-semibold" style={{ color: '#2D3748' }}>
                                DigiCoders Assessment Portal
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium hidden sm:block" style={{ color: '#2D3748' }}>
                                {user?.name || 'Admin'}
                            </span>

                            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#FF7F50' }}>
                                {user?.image ? (
                                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Users className="h-5 w-5 text-[#E6FFFA]" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto min-w-0" style={{ backgroundColor: '#EDF2F7' }}>
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="px-6 py-4 text-center border-t" style={{ backgroundColor: '#EDF2F7', borderColor: '#2D3748' }}>
                    <p className="text-sm" style={{ color: '#2D3748' }}>
                        © 2025 <span style={{ color: '#FF7F50', fontWeight: '600' }}>DigiCoders Assessment Portal</span>
                    </p>
                </footer>
            </div>
        </div>
    );
}
