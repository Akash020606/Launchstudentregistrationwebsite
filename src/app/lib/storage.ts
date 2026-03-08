export interface Student {
  id: string;
  name: string;
  parentPhone: string;
  interhall: string;
  dob: string;
  password?: string;
}

// Convert DOB from YYYY-MM-DD format to DDMMYYYY format
export function convertDobToPassword(dob: string): string {
  // dob is in format YYYY-MM-DD, convert to DDMMYYYY
  const parts = dob.split('-');
  if (parts.length === 3) {
    return `${parts[2]}${parts[1]}${parts[0]}`;
  }
  return dob.replace(/-/g, '');
}

export function generateStudentID(): string {
  let counterStr = localStorage.getItem("bvritCounter");
  let counter = 1;
  if (counterStr) {
    counter = parseInt(counterStr, 10) + 1;
  }
  localStorage.setItem("bvritCounter", counter.toString());
  const padded = counter.toString().padStart(4, "0");
  return `2026-bvrit-1a-${padded}`;
}

export function saveStudent(student: Student) {
  localStorage.setItem(student.id, JSON.stringify(student));
}

export function getStudent(id: string): Student | null {
  const data = localStorage.getItem(id);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setActiveStudentId(id: string | null) {
  if (id) {
    localStorage.setItem("bvritActiveStudent", id);
  } else {
    localStorage.removeItem("bvritActiveStudent");
  }
}

export function getActiveStudentId(): string | null {
  return localStorage.getItem("bvritActiveStudent");
}