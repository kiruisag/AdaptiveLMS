import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../api/ai.api';
import { AIMessageDTO } from '../types/ai.types';
import { AppIcon } from '../../../components/ui/AppIcon';
import ReactMarkdown from 'react-markdown';

export function AITutor() {
  const [messages, setMessages] = useState<AIMessageDTO[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your AI Tutor. I can help explain concepts, provide examples, or quiz you on the material you are learning. What would you like to explore today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: AIMessageDTO = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Mocking streaming or API response
      const response = await sendMessage('conv-1', userMessage.content);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <AppIcon name="brain" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold">AI Tutor</h2>
            <p className="text-xs text-slate-300">Context: Introduction to Machine Learning</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start space-x-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>
               {msg.role === 'user' ? <AppIcon name="user" className="w-4 h-4" /> : <AppIcon name="robot" className="w-4 h-4" />}
             </div>
             
             <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
               <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                 <div className="markdown-body text-sm leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                 </div>
               </div>
               
               {msg.sources && msg.sources.length > 0 && (
                 <div className="mt-2 bg-white border border-slate-200 rounded-lg p-3 w-full shadow-sm">
                   <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sources</p>
                   <div className="space-y-2">
                     {msg.sources.map(source => (
                       <a key={source.id} href={source.url || '#'} className="flex items-center space-x-2 text-xs hover:bg-slate-50 p-1.5 rounded transition-colors group border border-transparent hover:border-slate-100">
                         <AppIcon name="file-lines" className="w-3 h-3 text-indigo-500" />
                         <span className="font-medium text-slate-700 group-hover:text-indigo-600 truncate">{source.title}</span>
                         {source.page && <span className="text-slate-400 shrink-0">({source.page})</span>}
                       </a>
                     ))}
                   </div>
                 </div>
               )}
             </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start space-x-3 max-w-[85%]">
             <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-slate-200 text-slate-700">
               <AppIcon name="robot" className="w-4 h-4" />
             </div>
             <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
               <AppIcon name="spinner" className="w-4 h-4 text-indigo-500 animate-spin" />
               <span className="text-sm text-slate-500 font-medium">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
         <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
           {['Explain equivalent fractions', 'Quiz me on Module 1', 'Give me a real-world example'].map(suggestion => (
             <button 
               key={suggestion}
               onClick={() => setInput(suggestion)}
               className="whitespace-nowrap px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors"
             >
               {suggestion}
             </button>
           ))}
         </div>
         <form onSubmit={handleSend} className="relative">
           <input
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Ask a question..."
             className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
           />
           <button
             type="submit"
             disabled={!input.trim() || isTyping}
             className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
           >
             <AppIcon name="paper-plane" className="w-4 h-4" />
           </button>
         </form>
      </div>
    </div>
  );
}
