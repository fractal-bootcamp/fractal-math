import Link from 'next/link';

const Navigation = () => {
    return (
        <nav className="bg-black/50 backdrop-blur-lg border-b border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-xl font-bold text-blue-400">
                        Fractal Learning
                    </Link>
                    <div className="space-x-8">
                        <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                            About
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 