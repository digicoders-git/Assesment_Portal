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
            login({
                name: 'Admin User',
                email: username,
                image: null,
                role: 'admin'
            });
            toast.success("Login Successful");
            navigate('/admin/dashboard');
        } else {
            toast.error("Please fill in both fields");
        }
    };

    return (
        <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black mb-1">
                            <span className="text-gray-900">Digi</span>
                            <span className="text-[#319795]">{'{Coders}'}</span>
                        </h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Management Suite</p>
                        <h2 className="text-xl font-bold text-gray-700 mt-8">Admin Access</h2>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Username / Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#319795] focus:bg-white outline-none transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Access Token / Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#319795] focus:bg-white outline-none transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-[#319795] hover:bg-[#2B7A73] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest mt-4 active:scale-[0.98]"
                        >
                            Log In to Dashboard
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    Authorized Personnel Only
                </p>
            </div>
        </div>
    );
}