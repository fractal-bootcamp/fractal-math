import { useState } from 'react';

interface Step {
    id: string;
    title: string;
    content: string;
    formula?: string;
    validation?: (input: string) => boolean;
}

interface ConceptCardProps {
    conceptId: string;
    steps: Step[];
    onComplete: (conceptId: string) => void;
}

const sampleSteps: Step[] = [
    {
        id: '1',
        title: 'Understanding the Pythagorean Theorem',
        content: 'The Pythagorean theorem states that in a right triangle, a² + b² = c²',
        formula: 'a² + b² = c²',
    },
    {
        id: '2',
        title: 'Identifying the Components',
        content: 'a and b are the lengths of the two legs, c is the length of the hypotenuse',
        formula: 'c = √(a² + b²)',
    },
    {
        id: '3',
        title: 'Practice Problem',
        content: 'If a = 3 and b = 4, what is c?',
        validation: (input) => parseFloat(input) === 5,
    },
];

export default function ConceptCards({ conceptId, steps = sampleSteps, onComplete }: ConceptCardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setUserInput('');
            setIsCorrect(null);
        } else {
            onComplete(conceptId);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setUserInput('');
            setIsCorrect(null);
        }
    };

    const handleValidation = () => {
        const step = steps[currentStep];
        if (step.validation) {
            const result = step.validation(userInput);
            setIsCorrect(result);
            if (result) {
                setTimeout(handleNext, 1000);
            }
        }
    };

    const step = steps[currentStep];

    return (
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 h-2 rounded-full mb-6">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
            </div>

            {/* Card Content */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-gray-300">{step.content}</p>

                {step.formula && (
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <code className="text-green-400">{step.formula}</code>
                    </div>
                )}

                {step.validation && (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="w-full bg-gray-700 text-white p-2 rounded-lg"
                            placeholder="Enter your answer..."
                        />
                        <button
                            onClick={handleValidation}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Check Answer
                        </button>
                        {isCorrect !== null && (
                            <p className={`text-${isCorrect ? 'green' : 'red'}-400`}>
                                {isCorrect ? 'Correct!' : 'Try again!'}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                    Previous
                </button>
                {!step.validation && (
                    <button
                        onClick={handleNext}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                    </button>
                )}
            </div>
        </div>
    );
}
