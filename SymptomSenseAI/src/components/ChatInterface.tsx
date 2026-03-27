"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { Send, User, Bot, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ResultsDisplay from "./ResultsDisplay";

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } = useChat();
  const [assessmentReady, setAssessmentReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Check if the latest AI message contains the trigger word
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && lastMsg.content.includes("[ASSESSMENT_READY]")) {
      setAssessmentReady(true);
    }
  }, [messages]);

  if (assessmentReady) {
    return <ResultsDisplay messages={messages} onRestart={() => window.location.reload()} />;
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-white shadow-xl rounded-t-lg sm:rounded-lg overflow-hidden border">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="font-semibold text-navy-900 flex items-center gap-2">
              Symptom Assistant
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            </h2>
            <p className="text-xs text-slate-500">Informational intake only</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs text-slate-500 hover:text-navy-900 border px-3 py-1.5 rounded-full"
        >
          Restart
        </button>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 p-2 text-center border-b border-yellow-100 flex items-center justify-center gap-2 text-xs text-yellow-800">
        <AlertTriangle className="h-3 w-3" />
        Not a diagnostic tool. Call emergency services for severe symptoms.
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in opacity-70">
            <Bot className="h-12 w-12 text-health-500" />
            <h3 className="font-semibold text-lg text-navy-900">How are you feeling today?</h3>
            <p className="text-sm text-slate-500 max-w-md">
              Please describe your main symptom to get started. I will ask you a few brief follow-up questions to understand your situation better.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <button onClick={() => handleInputChange({ target: { value: "I have a terrible headache" } } as any)} className="bg-white border hover:bg-slate-50 px-4 py-2 rounded-full text-sm shadow-sm transition-all">"I have a terrible headache"</button>
              <button onClick={() => handleInputChange({ target: { value: "I've been coughing for 3 days" } } as any)} className="bg-white border hover:bg-slate-50 px-4 py-2 rounded-full text-sm shadow-sm transition-all">"I've been coughing for 3 days"</button>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"} animate-fade-in`}>
            {/* Avatar */}
            <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-navy-900 text-white" : "bg-health-100 text-health-600"}`}>
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            
            {/* Message Bubble */}
            <div className={`flex flex-col max-w-[80%] ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-3 rounded-2xl ${
                m.role === "user" 
                  ? "bg-navy-900 text-white rounded-tr-none shadow-md" 
                  : m.content.includes("EMERGENCY") || m.content.includes("911")
                    ? "bg-red-50 border border-red-200 text-red-900 rounded-tl-none"
                    : "bg-white border text-slate-800 rounded-tl-none shadow-sm"
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {m.content.replace("[ASSESSMENT_READY]", "Analyzing your responses...")}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-health-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-health-600" />
            </div>
            <div className="bg-white border px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
              <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-3 sm:p-4 pb-safe">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto relative">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your symptoms here..."
            className="flex-1 min-h-[50px] bg-slate-50 border border-slate-200 rounded-full px-5 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:bg-white transition-all resize-none shadow-inner"
            disabled={isLoading || assessmentReady}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || assessmentReady}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-health-500 text-white rounded-full flex items-center justify-center hover:bg-health-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-[10px] text-slate-400">
            AI can make mistakes. Always consult a real doctor for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
