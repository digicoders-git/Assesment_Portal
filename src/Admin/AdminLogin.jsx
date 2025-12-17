import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useUser();

    const handleSubmit = () => {
        if (username && password) {
            // Set default admin profile on login
            login({
                name: 'Admin User',
                email: username,
                image: null, // No image initially
                role: 'admin'
            });
            toast.success("Login Successful");
            navigate('/admin/dashboard');
        } else {
            toast.error("Please fill in both fields");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-100 to-emerald-200 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-teal-300 opacity-30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 opacity-25 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200 opacity-20 rounded-full blur-3xl"></div>

            {/* Floating shapes */}
            <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-teal-400 opacity-20 rounded-lg rotate-45 blur-sm"></div>
            <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-cyan-400 opacity-20 rounded-full blur-sm"></div>

            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">
                            <span className="text-gray-800">Digi</span>
                            <span className="text-teal-500">{'{Coders}'}</span>
                        </h1>
                        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Admin Login</h2>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-teal-500" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="skillup@gmail.com"
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-teal-500" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                        >
                            LOGIN
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}