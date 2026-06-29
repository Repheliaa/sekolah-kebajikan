import React from 'react';
import Navbar from '@/Components/Navbar';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen">
            <Navbar /> 
            <main>{children}</main>
        </div>
    );
}