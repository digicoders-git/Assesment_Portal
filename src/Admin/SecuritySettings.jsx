import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';




export function SecuritySettings() {
    const { user, login } = useUser();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [twoFactor, setTwoFactor] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || 'Admin User',
        email: user?.email || 'admin@digicoders.com',
        image: user?.image || null
    });

    const handlePasswordChange = () => {
        if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match!");
        if (!passwords.current || !passwords.new) return toast.error("Fill all password fields!");
        toast.success("Password updated successfully!");
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const handleProfileUpdate = () => {
        login({ ...user, ...profile });
        toast.success("Profile updated successfully!");
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) setProfile({ ...profile, image: URL.createObjectURL(file) });
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#319795] font-semibold">Settings</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-[#2D3748]">Security & Profile</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Edit Profile Card */}
                <div className="bg-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#2D3748] mb-6 border-b pb-2">Edit Profile</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-20 w-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center relative group">
                                {profile.image ? (
                                    <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-xs">No Image</span>
                                )}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs">
                                    Change
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Profile Picture</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#319795] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#319795] transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleProfileUpdate}
                            className="w-full bg-[#319795] hover:bg-[#2c7a7b] text-white font-medium py-2 rounded transition-colors mt-2"
                        >
                            Save Profile
                        </button>
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#2D3748] mb-6 border-b pb-2">Change Password</h3>
                    <div className="space-y-4">
                        {["current", "new", "confirm"].map((field, i) => (
                            <div key={i}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field === "current" ? "Current Password" : field === "new" ? "New Password" : "Confirm New Password"}
                                </label>
                                <input
                                    type="password"
                                    value={passwords[field]}
                                    onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#319795] transition-colors"
                                />
                            </div>
                        ))}
                        <button
                            onClick={handlePasswordChange}
                            className="w-full bg-[#319795] hover:bg-[#2c7a7b] text-white font-medium py-2 rounded transition-colors mt-2"
                        >
                            Update Password
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}