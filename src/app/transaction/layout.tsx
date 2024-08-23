'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Use the correct import for the app directory

const Layout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div>
            <header className="bg-primary text-primary-foreground py-4 px-6">
                <div className="container mx-auto flex items-center justify-between">
                    <ArrowLeftIcon onClick={handleGoBack} className="h-6 w-auto cursor-pointer" />
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default Layout;
