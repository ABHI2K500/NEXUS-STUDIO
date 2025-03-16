'use client';

import { useState } from 'react';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([
        { 
            role: 'assistant', 
            content: 'Hello! I\'m the Nexus Studio AI assistant. I can help you learn about our services like live streaming, media production, digital marketing, event management, and esports services. How can I assist you today?' 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        // Only include messages with role 'user' or 'assistant' for display
        const displayMessages: Message[] = [...messages.filter(m => m.role !== 'system'), userMessage];
        setMessages(displayMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Include all messages including system messages for the API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: displayMessages }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            const assistantMessage: Message = { role: 'assistant', content: data.response };
            setMessages([
                ...displayMessages,
                assistantMessage,
            ]);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to get response. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.filter(m => m.role !== 'system').map((message, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg ${
                            message.role === 'user'
                                ? 'bg-blue-100 ml-auto'
                                : 'bg-gray-100'
                        } max-w-[80%]`}
                    >
                        <p className="text-sm">{message.content}</p>
                    </div>
                ))}
                {isLoading && (
                    <div className="p-3 bg-gray-100 rounded-lg max-w-[80%]">
                        <p className="text-sm">Thinking...</p>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                    Send
                </button>
            </form>
        </div>
    );
} 