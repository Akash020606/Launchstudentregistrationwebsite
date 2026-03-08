import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LogOut, Upload, FileText, Phone, Calendar, Hash, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { getActiveStudentId, getStudent, setActiveStudentId, Student } from "../lib/storage";

interface DocumentUpload {
  file: File | null;
  error: string;
  isValid: boolean;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

const DOCUMENT_CATEGORIES = [
  { id: 'aadhaar', label: 'Aadhaar Card', category: 'ID & Admission' },
  { id: 'inter', label: 'Inter Marks Memo', category: 'Academic Transcripts' },
  { id: 'eapcet', label: 'EAPCET Rank Card', category: 'ID & Admission' },
  { id: 'fee', label: 'Fee Receipt', category: 'Fee Receipts' },
  { id: 'medical', label: 'Medical Certificate', category: 'Medical Records' },
  { id: 'hostel', label: 'Hostel Application Form', category: 'Hostel Forms' },
  { id: 'scholarship', label: 'Scholarship Documents', category: 'Scholarship Documents' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [documents, setDocuments] = useState<Record<string, DocumentUpload>>({});

  useEffect(() => {
    const activeId = getActiveStudentId();
    if (!activeId) {
      navigate("/student-login");
      return;
    }

    const data = getStudent(activeId);
    if (!data) {
      setActiveStudentId(null);
      navigate("/student-login");
      return;
    }

    setStudent(data);
    
    // Initialize documents state
    const initialDocs: Record<string, DocumentUpload> = {};
    DOCUMENT_CATEGORIES.forEach(doc => {
      initialDocs[doc.id] = { file: null, error: '', isValid: false };
    });
    setDocuments(initialDocs);
  }, [navigate]);

  const validateFile = (file: File): { isValid: boolean; error: string } => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension) && !ALLOWED_FILE_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Only PDF, JPG, JPEG, and PNG files are allowed' };
    }

    return { isValid: true, error: '' };
  };

  const handleFileChange = (docId: string, file: File | null) => {
    if (!file) {
      setDocuments(prev => ({
        ...prev,
        [docId]: { file: null, error: '', isValid: false }
      }));
      return;
    }

    const validation = validateFile(file);
    setDocuments(prev => ({
      ...prev,
      [docId]: {
        file: validation.isValid ? file : null,
        error: validation.error,
        isValid: validation.isValid
      }
    }));
  };

  const handleSubmit = (docId: string) => {
    const doc = documents[docId];
    if (!doc.file || !doc.isValid) {
      return;
    }

    // Simulate upload
    alert(`${doc.file.name} uploaded successfully!`);
    
    // Reset the document
    setDocuments(prev => ({
      ...prev,
      [docId]: { file: null, error: '', isValid: false }
    }));
  };

  const handleLogout = () => {
    setActiveStudentId(null);
    navigate("/");
  };

  if (!student) return null;

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.15)] w-full text-left animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
            title="Back to Home"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Student Dashboard</h2>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col items-center justify-center gap-1 shadow-sm">
          <p className="text-sm text-blue-800 font-semibold uppercase tracking-wider">Welcome Back</p>
          <h3 className="text-xl font-bold text-blue-950 text-center">{student.name}</h3>
          <p className="text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-sm font-medium mt-1 inline-flex items-center gap-1">
            <Hash size={14} /> {student.id}
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
          <h4 className="font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Personal Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100 text-blue-700">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs">Parent Phone</p>
                <p className="text-gray-900 font-semibold">{student.parentPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100 text-blue-700">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs">Inter Hall Ticket</p>
                <p className="text-gray-900 font-semibold">{student.interhall}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100 text-blue-700">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs">Date of Birth</p>
                <p className="text-gray-900 font-semibold">{student.dob}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Upload size={18} className="text-blue-700" /> Upload Documents
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Accepted formats: PDF, JPG, JPEG, PNG (Max size: 5MB)
          </p>
          
          <div className="space-y-6">
            {DOCUMENT_CATEGORIES.map((doc) => {
              const docState = documents[doc.id];
              return (
                <div key={doc.id} className="border-2 border-dashed border-gray-300 bg-gray-50 p-4 rounded-xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <label className="text-sm font-semibold text-gray-700">{doc.label}</label>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                          {doc.category}
                        </span>
                      </div>
                      
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] || null)}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer" 
                      />
                      
                      {docState.error && (
                        <div className="mt-2 flex items-start gap-2 text-red-600 bg-red-50 p-2 rounded-md">
                          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                          <p className="text-xs">{docState.error}</p>
                        </div>
                      )}
                      
                      {docState.isValid && docState.file && (
                        <div className="mt-2 flex items-start gap-2 text-green-600 bg-green-50 p-2 rounded-md">
                          <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                          <p className="text-xs">File is valid and ready to upload: {docState.file.name}</p>
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleSubmit(doc.id)}
                      disabled={!docState.isValid}
                      className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-900 whitespace-nowrap"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2 mt-4"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
