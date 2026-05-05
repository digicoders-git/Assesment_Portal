import React, { useState } from 'react';
import { Shield, X, Loader2, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { sendDownloadOtpApi, verifyDownloadOtpApi } from '../API/student';

const getLocationAndIP = async () => {
    let ip = 'Unknown';
    try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        ip = (await ipRes.json()).ip;
    } catch (e) {}
    return new Promise((resolve) => {
        if (!navigator.geolocation) return resolve({ ip });
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                try {
                    const geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const geoData = await geoRes.json();
                    if (geoData.display_name) address = geoData.display_name;
                } catch (e) {}
                resolve({ latitude, longitude, address, ip });
            },
            (err) => {
                console.warn('Location denied for download OTP:', err.message);
                resolve({ ip });
            },
            { timeout: 10000, enableHighAccuracy: false }
        );
    });
};

export function OtpVerificationModal({ isOpen, onClose, onVerified }) {
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [failCount, setFailCount] = useState(0);

    const requestOtp = async () => {
        setLocationLoading(true);
        const locationData = await getLocationAndIP();
        setLocationLoading(false);
        setOtpLoading(true);
        try {
            const response = await sendDownloadOtpApi(locationData);
            if (response.success) {
                setOtpSent(true);
                toast.success(response.message || "OTP sent to admin email");
            } else {
                toast.error(response.message || "Failed to send OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error("Please enter valid 6-digit OTP");
            return;
        }
        setOtpLoading(true);
        try {
            const response = await verifyDownloadOtpApi(otp);
            if (response.success) {
                toast.success("OTP verified successfully");
                setOtp('');
                setOtpSent(false);
                setFailCount(0);
                onClose();
                await onVerified();
            } else {
                const newFail = failCount + 1;
                setFailCount(newFail);
                if (newFail >= 3) {
                    toast.error("Too many failed attempts. Please request a new OTP.");
                    setOtp('');
                    setOtpSent(false);
                    setFailCount(0);
                } else {
                    toast.error(`Invalid OTP. ${3 - newFail} attempt(s) remaining.`);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleClose = () => {
        setOtp('');
        setOtpSent(false);
        setFailCount(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all animate-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5" /> Verify OTP
                    </h3>
                    <button onClick={handleClose} className="text-white/80 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {!otpSent ? (
                        <>
                            <p className="text-sm text-gray-600">
                                To download data, you need to verify your identity. Click below to receive an OTP on the admin email.
                            </p>
                            <button
                                onClick={requestOtp}
                                disabled={otpLoading || locationLoading}
                                className={`w-full px-6 py-3 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 ${(otpLoading || locationLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {locationLoading
                                    ? <><MapPin className="h-4 w-4 animate-bounce" /> Getting Location...</>
                                    : otpLoading
                                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending OTP...</>
                                    : "Send OTP"
                                }
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600">
                                An OTP has been sent to your registered email. Please enter it below to proceed with the download.
                            </p>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={verifyOtp}
                                    disabled={otpLoading || otp.length !== 6}
                                    className={`flex-1 px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 ${(otpLoading || otp.length !== 6) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {otpLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {otpLoading ? "Verifying..." : "Verify & Download"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
