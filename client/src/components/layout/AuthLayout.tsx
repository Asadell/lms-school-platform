import React from 'react';
import { Outlet } from 'react-router-dom';
// import { GraduationCap } from 'lucide-react'; // Uncomment when lucide is ready

export function AuthLayout() {
    return (
        <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500 text-white mb-4">
                        {/* <GraduationCap size={24} /> */}
                        <span className="font-bold text-xl">LMS</span>
                    </div>
                    <h1 className="text-2xl text-slate-900">Selamat Datang</h1>
                    <p className="text-slate-500 mt-2">Masuk untuk mulai belajar</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
