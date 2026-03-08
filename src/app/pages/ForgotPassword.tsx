import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Mail, Lock, KeyRound } from "lucide-react";
import { getStudent, saveStudent } from "../lib/storage";
import { toast } from "sonner";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [fpID, setFpID] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState<number | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpID) {
      toast.error("Please enter Student ID");
      return;
    }

    const student = getStudent(fpID);
    if (!student) {
      toast.error("Student not found");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOTP(otp);
    toast.success(`OTP sent to registered mobile: ${otp}`);
    setStep("verify");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (parseInt(otpInput) !== generatedOTP) {
      toast.error("Invalid OTP");
      return;
    }

    const student = getStudent(fpID);
    if (!student) {
      toast.error("Student not found");
      return;
    }

    student.password = newPassword;
    saveStudent(student);

    toast.success("Password changed successfully");
    navigate("/student-login");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.15)] w-full text-left animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-4 border-gray-100">Reset Password</h2>

      {step === "request" ? (
        <form onSubmit={handleSendOTP} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Student ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={fpID}
                onChange={(e) => setFpID(e.target.value)}
                placeholder="e.g. 2026-bvrit-1a-0001"
                required
              />
            </div>
          </div>

          <div className="pt-4 gap-3 flex flex-col">
            <button
              type="submit"
              className="w-full p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold shadow-sm flex items-center justify-center gap-2"
            >
              <Mail size={18} /> Send OTP
            </button>
            <button
              type="button"
              onClick={() => navigate("/student-login")}
              className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Back to Login
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Enter OTP</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="123456"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-4 gap-3 flex flex-col">
            <button
              type="submit"
              className="w-full p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold shadow-sm flex items-center justify-center gap-2"
            >
              <Lock size={18} /> Reset Password
            </button>
            <button
              type="button"
              onClick={() => setStep("request")}
              className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
