import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Lock, Mail } from "lucide-react";
import { getStudent, setActiveStudentId } from "../lib/storage";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";

export function StudentLogin() {
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [loginID, setLoginID] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginID || !loginPassword) {
      toast.error("Please enter both ID and password");
      return;
    }

    const student = getStudent(loginID);

    if (!student) {
      toast.error("Student not found. Please check your ID.");
      return;
    }

    if (student.password !== loginPassword) {
      toast.error("Incorrect Password");
      return;
    }

    setActiveStudentId(loginID);
    toast.success("Login Successful");
    navigate("/dashboard");
  };

  const handleSendOTP = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!loginID) {
      toast.error("Please enter Student ID");
      return;
    }

    const student = getStudent(loginID);
    if (!student) {
      toast.error("Student not found. Please check your ID.");
      return;
    }

    const newOTP = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOTP(newOTP);
    setCountdown(30);
    toast.success(`OTP sent to registered mobile: ${newOTP}`);
  };

  const handleOTPLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginID || !otp) {
      toast.error("Please enter Student ID and OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    if (parseInt(otp) !== generatedOTP) {
      toast.error("Invalid OTP");
      return;
    }

    const student = getStudent(loginID);
    if (!student) {
      toast.error("Student not found");
      return;
    }

    setActiveStudentId(loginID);
    toast.success("Login Successful");
    navigate("/dashboard");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.15)] w-full text-left animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-4 border-gray-100">Student Login</h2>

      {/* Login Mode Toggle */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setLoginMode("password")}
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
            loginMode === "password"
              ? "bg-blue-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setLoginMode("otp")}
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
            loginMode === "otp"
              ? "bg-blue-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          OTP
        </button>
      </div>

      {loginMode === "password" ? (
        <form onSubmit={handlePasswordLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Student ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={loginID}
                onChange={(e) => setLoginID(e.target.value)}
                placeholder="e.g. 2026-bvrit-1a-0001"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Your default password is your Date of Birth (DDMMYYYY)</p>
          </div>

          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="pt-4 gap-3 flex flex-col">
            <button
              type="submit"
              className="w-full p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold shadow-sm"
            >
              Login
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Back to Home
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleOTPLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Student ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={loginID}
                onChange={(e) => setLoginID(e.target.value)}
                placeholder="e.g. 2026-bvrit-1a-0001"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">Enter OTP</label>
              {!generatedOTP ? (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <Mail size={14} /> Send OTP
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={countdown > 0}
                  className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                    countdown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  <Mail size={14} /> {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              )}
            </div>
            
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={!generatedOTP}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {!generatedOTP && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please send OTP first to enable login
              </p>
            )}
          </div>

          <div className="pt-4 gap-3 flex flex-col">
            <button
              type="submit"
              disabled={!generatedOTP || otp.length !== 6}
              className="w-full p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Login with OTP
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Back to Home
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4 border-gray-100">
        Don't have an ID?{" "}
        <button onClick={() => navigate("/register")} className="text-blue-600 font-semibold hover:underline">
          Register here
        </button>
      </div>
    </div>
  );
}
