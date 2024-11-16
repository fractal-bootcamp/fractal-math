"use client"
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { PeerCollaborators } from './PeerCollaborators';

const Navigation = () => {
    const { data: session, status } = useSession();

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <nav className="bg-black/50 backdrop-blur-lg border-b border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-xl font-bold text-blue-400">
                            Fractal Learning
                        </Link>
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                                About
                            </Link>
                            {status === "authenticated" && (
                                <>
                                    <Link href="/learn" className="text-gray-300 hover:text-white transition-colors">
                                        Learn
                                    </Link>
                                    <PeerCollaborators />
                                </>
                            )}
                            {status === "authenticated" ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-300">{session.user?.name}</span>
                                    <button
                                        onClick={() => signOut()}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm transition-colors duration-300"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition-colors duration-300"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navigation; 