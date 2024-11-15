"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: input.trim(),
            role: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input.trim() }),
            });

            if (!response.ok) {
                throw new Error('API endpoint not configured');
            }

            const data = await response.json();

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                content: data.message,
                role: 'assistant',
                timestamp: new Date(),
            }]);
        } catch (error) {
            // Add error message to the chat
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                content: "Sorry, I'm not fully configured yet. Please set up the API endpoint first.",
                role: 'assistant',
                timestamp: new Date(),
            }]);
            console.error('Chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="bg-gray-900 rounded-lg shadow-xl w-80 md:w-96 h-[500px] flex flex-col">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "flex flex-col max-w-[80%] rounded-lg p-3",
                                        message.role === 'user'
                                            ? "ml-auto bg-blue-600 text-white"
                                            : "bg-gray-800 text-gray-100"
                                    )}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <span className="text-xs opacity-70 mt-1">
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
                        <div className="flex gap-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 bg-gray-800 text-white rounded-lg p-2 text-sm resize-none"
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !input.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-12 h-12"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
} 