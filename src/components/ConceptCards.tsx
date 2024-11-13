import { useState, useEffect } from 'react';
import { CurveInfo } from '@/types/curveTypes';

interface ConceptCardProps {
    conceptId: string;
    onComplete: (conceptId: string) => void;
}

export default function ConceptCards({ conceptId, onComplete }: ConceptCardProps) {
    const [curveData, setCurveData] = useState<CurveInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurveData = async () => {
            try {
                const response = await fetch(`/api/curves/${conceptId}`);
                const data = await response.json();
                setCurveData(data);
            } catch (error) {
                console.error('Error fetching curve data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurveData();
    }, [conceptId]);

    if (loading) return <div className="bg-white p-6 rounded-lg">Loading...</div>;
    if (!curveData) return <div className="bg-white p-6 rounded-lg">No data found</div>;

    return (
        <div className="bg-white p-6 rounded-lg w-[500px] h-[600px] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 sticky top-0 bg-white">{curveData.name}</h2>
            <p className="text-gray-600 mb-4">{curveData.description}</p>

            <div className="space-y-4">
                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Equations:</h3>
                    <pre className="bg-gray-100 p-2 rounded">
                        {JSON.stringify(curveData.equations, null, 2)}
                    </pre>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Parameters:</h3>
                    <pre className="bg-gray-100 p-2 rounded">
                        {JSON.stringify(curveData.parameters, null, 2)}
                    </pre>
                </div>
            </div>

            <button
                onClick={() => onComplete(conceptId)}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sticky bottom-4"
            >
                Complete
            </button>
        </div>
    );
}
