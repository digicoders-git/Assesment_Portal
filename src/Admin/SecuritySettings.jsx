import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAdminApi, updateAdminApi } from '../API/admin';

export function SecuritySettings() {
    const [loading, setLoading] = useState(false);
    const [originalAdmin, setOriginalAdmin] = useState(null);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [profile, setProfile] = useState({
        userName: '',
        image: null,      // This will store the File object for upload
        imagePreview: null // This will store the preview URL
    });

    React.useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const res = await getAdminApi();
            if (res.success && res.admin?.length > 0) {
                const adminData = res.admin[0];
                setOriginalAdmin(adminData);
                setProfile({
                    userName: adminData.userName,
                    image: null,
                    imagePreview: adminData.image
                });
            }
        } catch (error) {
            toast.error("Failed to load admin profile");
        }
    };

    const handlePasswordChange = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            return toast.error("All password fields are required");
        }
        if (passwords.new !== passwords.confirm) {
            return toast.error("New passwords do not match!");
        }

        setLoading(true);
        try {
            const payload = {
                currentPassword: passwords.current,
                newPassword: passwords.new,
                confirmPassword: passwords.confirm
            };
            const res = await updateAdminApi(originalAdmin._id, payload);
            if (res.success) {
                toast.success("Password updated successfully!");
                setPasswords({ current: '', new: '', confirm: '' });
            }
        } catch (error) {
            toast.error(error.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        let hasChanges = false;
        const payload = {};

        // Only add userName if it changed
        if (profile.userName !== originalAdmin.userName) {
            payload.userName = profile.userName;
            hasChanges = true;
        }

        // Only add image if a new one was selected
        if (profile.image) {
            payload.image = profile.image;
            hasChanges = true;
        }

        if (!hasChanges) {
            return toast.info("No changes to save");
        }

        setLoading(true);
        try {
            const res = await updateAdminApi(originalAdmin._id, payload);
            if (res.success) {
                toast.success("Profile updated successfully!");
                await fetchAdminData(); // Refresh local data
                window.dispatchEvent(new Event('adminUpdated')); // Trigger Dashboard refresh
            }
        } catch (error) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({
                ...profile,
                image: file,
                imagePreview: URL.createObjectURL(file)
            });
        }
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
                                {profile.imagePreview ? (
                                    <img src={profile.imagePreview} alt="Profile" className="w-full h-full object-cover" />
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
                                value={profile.userName}
                                onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#319795] transition-colors"
                            />
                        </div>

                        <button
                            onClick={handleProfileUpdate}
                            disabled={loading}
                            className="w-full bg-[#319795] hover:bg-[#2c7a7b] text-white font-medium py-2 rounded transition-colors mt-2 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Profile"}
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
                            disabled={loading}
                            className="w-full bg-[#319795] hover:bg-[#2c7a7b] text-white font-medium py-2 rounded transition-colors mt-2 disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}