import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminLogin } from '../API/auth';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (username && password) {
            setLoading(true);
            try {
                // userName uses camelCase as per your controller { userName, password }
                const response = await adminLogin({ userName: username, password });

                // console.log("Login Response:", response);

                if (response.success) {
                    toast.success(response.message || "Login Successful");
                    // Navigating to dashboard - browser will handle the cookie automatically
                    navigate('/admin/dashboard');
                } else {
                    toast.error(response.message || "Login failed");
                }
            } catch (error) {
                console.error("Login Error Details:", error);
                const errorMsg = error.response?.data?.message || "Login failed - Check CORS/Network";
                toast.error(errorMsg);
            } finally {
                setLoading(false);
            }
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
                        <div className="flex justify-center items-center  mt-5">
                            <img src="/icon.jpg" className='h-32 w-32' alt="" />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Username</label>
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
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
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
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-[#319795]/70 cursor-not-allowed' : 'bg-[#319795] hover:bg-[#2B7A73]'} text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest mt-4 active:scale-[0.98]`}
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Log In to Dashboard"
                            )}
                            {!loading && <ArrowRight className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}