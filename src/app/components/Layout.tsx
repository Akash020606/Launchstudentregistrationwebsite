import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-blue-900 text-white p-6 text-center shadow-md shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">B V Raju Institute Of Technology</h1>
        <p className="text-blue-200 mt-1 font-medium">Student Registration Portal</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full h-full">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
