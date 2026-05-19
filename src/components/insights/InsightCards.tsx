"use client";

import { Lightbulb } from "lucide-react";

export default function InsightCards({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className="card bg-base-100 border border-primary/20 shadow-sm rounded-2xl"
        >
          <div className="card-body p-4 flex gap-3">
            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
            <p className="text-sm leading-relaxed">{msg}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
