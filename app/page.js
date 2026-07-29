"use client";

import { useState } from "react";

export default function Home() {
  const [direction, setDirection] = useState("toHuman"); // toHuman or toCorporate
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, direction }),
      });
      const data = await res.json();
      setOutput(data.result || data.error || "Something went wrong.");
    } catch (err) {
      setOutput("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const swapDirection = () => {
    setDirection((prev) => (prev === "toHuman" ? "toCorporate" : "toHuman"));
    setInput(output);
    setOutput("");
  };

  return (
    <main className="min-h-screen bg-[#F3F2EF] flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0A66C2]">
          Corporate Sentence Decoder
        </h1>
        <p className="text-gray-600 mt-2">
          Synergize your communication paradigm, or just say what you mean.
        </p>
      </div>

      {/* Direction toggle */}
      <div className="flex items-center gap-4 mb-6 bg-white rounded-full shadow px-2 py-2">
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium transition ${
            direction === "toHuman"
              ? "bg-[#0A66C2] text-white"
              : "text-gray-500"
          }`}
        >
          LinkedIn 💼
        </span>
        <button
          onClick={swapDirection}
          className="text-[#0A66C2] font-bold text-lg hover:scale-110 transition"
          title="Swap direction"
        >
          ⇄
        </button>
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium transition ${
            direction === "toCorporate"
              ? "bg-[#0A66C2] text-white"
              : "text-gray-500"
          }`}
        >
          Human 🗣️
        </span>
      </div>

      {/* Split panel */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <span className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
            {direction === "toHuman" ? "LinkedIn Speak" : "Plain Human"}
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === "toHuman"
                ? "e.g. I am thrilled to have initiated my first culinary transformation journey..."
                : "e.g. I cooked for the first time."
            }
            className="flex-1 min-h-[160px] resize-none outline-none text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="mt-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full py-2 font-semibold transition disabled:opacity-50"
          >
            {loading ? "Translating..." : "Decode ➜"}
          </button>
        </div>

        {/* Output */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <span className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
            {direction === "toHuman" ? "Plain Human" : "LinkedIn Speak"}
          </span>
          <div className="flex-1 min-h-[160px] text-gray-800 whitespace-pre-wrap">
            {output || (
              <span className="text-gray-300">
                Translation will appear here...
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        Powered by Groq · Not affiliated with LinkedIn
      </p>
    </main>
  );
}