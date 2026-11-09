
import React, { useState } from "react";
import logo from "../assets/playtube.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showCustomAlert } from "../component/CustomAlert";
import ClipLoader from "react-spinners/ClipLoader";

const serverUrl = "http://localhost:8000";

function ForgetPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            showCustomAlert("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            const result = await axios.post(
                `${serverUrl}/api/auth/sendotp`,
                { email: email.trim() },
                { withCredentials: true }
            );

            showCustomAlert(
                result.data?.message || "OTP request completed."
            );

            setStep(2);
        } catch (error) {
            console.error("Send OTP error:", error.response?.data || error);

            showCustomAlert(
                error.response?.data?.message ||
                "Unable to send OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (!otp.trim()) {
            showCustomAlert("Please enter the OTP.");
            return;
        }

        try {
            setLoading(true);

            const result = await axios.post(
                `${serverUrl}/api/auth/verifyotp`,
                {
                    email: email.trim(),
                    otp: otp.trim()
                },
                { withCredentials: true }
            );

            showCustomAlert(
                result.data?.message || "OTP verified successfully."
            );

            setStep(3);
        } catch (error) {
            console.error("Verify OTP error:", error.response?.data || error);

            showCustomAlert(
                error.response?.data?.message ||
                "OTP verification failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            showCustomAlert("Please fill in both password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            showCustomAlert("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const result = await axios.post(
                `${serverUrl}/api/auth/resetPassword`,
                {
                    email: email.trim(),
                    password: newPassword
                },
                { withCredentials: true }
            );

            showCustomAlert(
                result.data?.message || "Password reset successfully."
            );

            navigate("/signin");
        } catch (error) {
            console.error(
                "Reset password error:",
                error.response?.data || error
            );

            showCustomAlert(
                error.response?.data?.message ||
                "Unable to reset password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
    "mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500";

    const buttonClass =
    "w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium disabled:opacity-50";

    const backToSignin = () => navigate("/signin");

    return (
        <div className="min-h-screen flex flex-col bg-[#202124] text-white">
            <header className="flex items-center gap-2 p-4 border-b
             border-gray-700">
                <img src={logo} alt="Playtube logo" className="w-8 h-8" />
                <span className="text-white font-bold text-xl tracking-tight
                 font-roboto">
                    Youtube Clone
                </span>
            </header>

            <main className="flex flex-1 items-center justify-center px-4">

                {/* STEP 1: SEND OTP */}
                {step === 1 && (
                    <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md
                     w-full">
                        <h2 className="text-2xl font-semibold mb-6">
                            Forgot Password
                        </h2>

                        <form className="space-y-4" onSubmit={handleSendOtp}>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm mb-1 text-gray-300"
                                >
                                    Enter your email address
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    className={inputClass}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <button
                                type="submit"
                                className={buttonClass}
                                disabled={loading}
                            >
                                {loading
                                    ? <ClipLoader color="black" size={20} />
                                    : "Send OTP"}
                            </button>
                        </form>

                        <div
                            className="text-sm text-blue-400 text-center mt-4
                             cursor-pointer"
                            onClick={backToSignin}
                        >
                            Back to sign in
                        </div>
                    </div>
                )}

                {/* STEP 2: VERIFY OTP */}
                {step === 2 && (
                    <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md 
                    w-full">
                        <h2 className="text-2xl font-semibold mb-6">
                            Verify OTP
                        </h2>

                        <form className="space-y-4" onSubmit={handleVerifyOtp}>
                            <div>
                                <label
                                    htmlFor="otp"
                                    className="block text-sm mb-1 text-gray-300"
                                >
                                    Enter the code sent to your email
                                </label>

                                <input
                                    type="text"
                                    id="otp"
                                    className={inputClass}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    autoComplete="one-time-code"
                                />
                            </div>

                            <button
                                type="submit"
                                className={buttonClass}
                                disabled={loading}
                            >
                                {loading
                                    ? <ClipLoader color="black" size={20} />
                                    : "Verify OTP"}
                            </button>
                        </form>

                        <div
                            className="text-sm text-blue-400 text-center mt-4 
                            cursor-pointer"
                            onClick={backToSignin}
                        >
                            Back to sign in
                        </div>
                    </div>
                )}

                {/* STEP 3: RESET PASSWORD */}
                {step === 3 && (
                    <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md
                     w-full">
                        <h2 className="text-2xl font-semibold mb-6">
                            Reset Your Password
                        </h2>

                        <p className="text-sm text-gray-400 mb-6">
                            Enter a new password below to regain access to your account.
                        </p>

                        <form
                            className="space-y-4"
                            onSubmit={handleResetPassword}
                        >
                            <div>
                                <label
                                    htmlFor="newpass"
                                    className="block text-sm mb-1 text-gray-300"
                                >
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    id="newpass"
                                    className={inputClass}
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    required
                                    autoComplete="new-password"
                                />

                                <label
                                    htmlFor="confirmpass"
                                    className="block text-sm mb-1 text-gray-300 mt-5"
                                >
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    id="confirmpass"
                                    className={inputClass}
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className={buttonClass}
                                disabled={loading}
                            >
                                {loading
                                    ? <ClipLoader color="black" size={20} />
                                    : "Reset Password"}
                            </button>
                        </form>

                        <div
                            className="text-sm text-blue-400 text-center mt-4 
                            cursor-pointer"
                            onClick={backToSignin}
                        >
                            Back to sign in
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default ForgetPassword;

