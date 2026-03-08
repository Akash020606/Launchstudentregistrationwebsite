import { useNavigate } from "react-router";
import { UserPlus, LogIn, ShieldAlert } from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-8 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.15)] w-full text-center animate-in fade-in zoom-in-95 duration-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Portal</h2>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/register")}
          className="flex items-center justify-center gap-2 w-full p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-sm font-semibold text-lg"
        >
          <UserPlus size={20} />
          Student Registration
        </button>

        <button
          onClick={() => navigate("/student-login")}
          className="flex items-center justify-center gap-2 w-full p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-sm font-semibold text-lg"
        >
          <LogIn size={20} />
          Student Login
        </button>

        <button
          onClick={() => navigate("/admin-login")}
          className="flex items-center justify-center gap-2 w-full p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm font-semibold text-lg mt-2"
        >
          <ShieldAlert size={20} />
          Admin Login
        </button>
      </div>
    </div>
  );
}
