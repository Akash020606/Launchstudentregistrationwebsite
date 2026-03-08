import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, UserPlus, Mail, CheckCircle2 } from "lucide-react";
import { generateStudentID, saveStudent, convertDobToPassword } from "../lib/storage";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    parentPhone: "",
    interhall: "",
    dob: "",
  });

  const [successInfo, setSuccessInfo] = useState<{ id: string } | null>(null);
  
  // OTP Verification State
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = () => {
    if (!formData.parentPhone) {
      toast.error("Please enter Parent Phone Number first");
      return;
    }
    
    // Basic phone validation (e.g., must be 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.parentPhone.replace(/[^0-9]/g, ''))) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const newOTP = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOTP(newOTP);
    setCountdown(30);
    toast.success(`OTP sent to ${formData.parentPhone}: ${newOTP}`);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    if (parseInt(otp) !== generatedOTP) {
      toast.error("Invalid OTP");
      return;
    }

    setIsPhoneVerified(true);
    toast.success("Phone Number Verified Successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.parentPhone || !formData.interhall || !formData.dob) {
      toast.error("Please fill all fields");
      return;
    }

    if (!isPhoneVerified) {
      toast.error("Please verify Parent Phone Number using OTP");
      return;
    }

    const id = generateStudentID();
    const password = convertDobToPassword(formData.dob);
    saveStudent({ ...formData, id, password });
    setSuccessInfo({ id });
    toast.success("Registration Successful");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.15)] w-full text-left animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-4 border-gray-100">Student Registration</h2>

      {successInfo ? (
        <div className="bg-green-50 border border-green-200 text-green-900 p-6 rounded-lg text-center shadow-inner space-y-4">
          <UserPlus className="mx-auto text-green-600 w-12 h-12" />
          <p className="text-lg font-semibold">Registration Successful!</p>
          <div className="bg-white p-4 rounded-md border border-green-100 mt-2">
            <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Student ID</p>
            <p className="text-xl font-bold text-gray-900">{successInfo.id}</p>
          </div>
          <div className="bg-white p-4 rounded-md border border-green-100 mt-2">
            <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Default Password</p>
            <p className="text-xl font-bold text-gray-900">{convertDobToPassword(formData.dob)}</p>
            <p className="text-xs text-gray-500 mt-1">Your Date of Birth (DDMMYYYY)</p>
          </div>

          <button
            onClick={() => navigate("/student-login")}
            className="w-full mt-4 p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
          >
            Go to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Student Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Phone Number <span className="text-gray-400 font-normal">(Registered Mobile)</span></label>
            <div className="flex gap-2">
              <input
                type="tel"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${
                  isPhoneVerified ? 'bg-gray-100 border-gray-300 text-gray-600' : 'border-gray-300'
                }`}
                value={formData.parentPhone}
                onChange={(e) => {
                  setFormData({ ...formData, parentPhone: e.target.value });
                  if (isPhoneVerified) {
                    setIsPhoneVerified(false);
                    setGeneratedOTP(null);
                    setOtp("");
                  }
                }}
                placeholder="e.g. 9876543210"
                disabled={isPhoneVerified}
                required
              />
              {!isPhoneVerified && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={countdown > 0}
                  className={`px-4 py-3 min-w-[120px] rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    countdown > 0 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  <Mail size={16} />
                  {countdown > 0 ? `${countdown}s` : (generatedOTP ? 'Resend' : 'Send OTP')}
                </button>
              )}
              {isPhoneVerified && (
                <div className="px-4 py-3 min-w-[120px] rounded-lg font-semibold flex items-center justify-center gap-2 bg-green-100 text-green-800">
                  <CheckCircle2 size={18} /> Verified
                </div>
              )}
            </div>
            
            {/* OTP Input Section */}
            {!isPhoneVerified && generatedOTP !== null && (
              <div className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-lg animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Enter Verification Code</label>
                <div className="flex justify-center mb-4">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
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
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6}
                  className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Inter Hall Ticket Number</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              value={formData.interhall}
              onChange={(e) => setFormData({ ...formData, interhall: e.target.value })}
              placeholder="e.g. 230910112"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
            />
          </div>

          <div className="pt-2 gap-3 flex flex-col">
            <button
              type="submit"
              disabled={!isPhoneVerified}
              className="w-full p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register
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
    </div>
  );
}