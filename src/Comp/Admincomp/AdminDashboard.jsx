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
                className={`fixed lg:sticky top-0 left-0 h-screen transition-all duration-500 z-50 overflow-hidden flex-shrink-0 print:hidden 
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{
                    width: sidebarOpen ? '17rem' : '5rem',
                    backgroundColor: '#319795',
                    color: '#E6FFFA',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {/* Logo */}
                <div className="p-6 h-20 flex items-center justify-center border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="flex items-center justify-center transition-all duration-500">
                        <div
                            className="rounded-full flex items-center justify-center overflow-hidden transition-all duration-500"
                            style={{
                                width: sidebarOpen ? '4rem' : '2.5rem',
                                height: sidebarOpen ? '4rem' : '2.5rem',
                                backgroundColor: '#319795'
                            }}
                        >
                            <img
                                src='/icon.jpg'
                                alt="logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {sidebarOpen && (
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors">
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
                                className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3.5 rounded-xl transition-all duration-300 group relative`}
                                style={{
                                    backgroundColor: isActive ? '#287D80' : 'transparent',
                                    color: isActive ? '#FFFFFF' : '#E6FFFA',
                                }}
                                title={!sidebarOpen ? item.label : ''}
                            >
                                <Icon className={`h-6 w-6 shrink-0 transition-all duration-300 ${isActive ? 'text-white' : 'text-[#4FD1C5] group-hover:text-white'} ${!sidebarOpen ? 'scale-110' : ''}`} />
                                <span className={`text-[15px] whitespace-nowrap font-medium tracking-wide transition-all duration-500 overflow-hidden ${sidebarOpen ? 'opacity-100 ml-4 w-auto' : 'opacity-0 w-0 ml-0'}`}>
                                    {item.label}
                                </span>

                                {/* Tooltip for collapsed state */}
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-2 px-3 py-2 bg-[#2D3748] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60] border border-white/10">
                                        {item.label}
                                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#2D3748] rotate-45 border-l border-b border-white/10"></div>
                                    </div>
                                )}
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
                <header className="sticky top-0 z-30 border-b print:hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#2D3748' }}>
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
                <footer className="px-6 py-4 text-center border-t print:hidden" style={{ backgroundColor: '#EDF2F7', borderColor: '#2D3748' }}>
                    <p className="text-sm" style={{ color: '#2D3748' }}>
                        © 2025 <span style={{ color: '#FF7F50', fontWeight: '600' }}>DigiCoders Assessment Portal</span>
                    </p>
                </footer>
            </div>
        </div>
    );
}
