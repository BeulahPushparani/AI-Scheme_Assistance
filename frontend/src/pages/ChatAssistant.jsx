import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSend, FiCpu, FiUser, FiExternalLink, FiRefreshCw,
  FiMessageSquare, FiInfo,
} from "react-icons/fi";
import { chatApi } from "../api/chat.api.js";
import Button from "../components/ui/Button.jsx";

const SUGGESTIONS = [
  "What documents do I need for the Moovalur Ramamirtham scheme?",
  "Which schemes help girl students in Tamil Nadu?",
  "What are the benefits of PM-KISAN?",
  "What crop insurance schemes are available for farmers?",
  "How do I apply for the widow pension scheme?",
];

function MessageBubble({ role, content, sources }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`h-9 w-9 rounded-xl shrink-0 grid place-items-center text-white
          ${isUser ? "bg-primary-600" : "bg-gradient-to-br from-indigo-500 to-purple-500"}`}
      >
        {isUser ? <FiUser /> : <FiCpu />}
      </div>
      <div className={`max-w-[80%] space-y-2 ${isUser ? "items-end" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line
            ${isUser
              ? "bg-primary-600 text-white rounded-tr-sm"
              : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-soft"}`}
        >
          {content}
        </div>

        {sources && sources.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Sources
            </p>
            {sources.map((s, i) => (
              <Link
                key={i}
                to={`/schemes/${s.schemeId}`}
                className="block rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 hover:border-primary-200 dark:hover:border-primary-700 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {s.schemeName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                      {s.section.replace(/_/g, " ")} · {s.schemeId}
                    </p>
                  </div>
                  <FiExternalLink className="text-slate-400 shrink-0 text-xs" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your scheme assistant. Ask me anything about Tamil Nadu or Central government schemes — eligibility, documents, benefits, or how to apply.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    chatApi.stats().then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text = null) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await chatApi.ask(question);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.data.answer,
          sources: res.data.data.sources || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err.message ||
            "Sorry, I couldn't fetch an answer. Please try again in a moment.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="relative bg-slate-50 dark:bg-slate-950 transition-colors min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 bg-hero-mesh opacity-20 dark:opacity-10" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-15" />

      <div className="container-app py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-500 text-white grid place-items-center shadow-glow">
              <FiMessageSquare />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                AI Chat Assistant
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Answers grounded in official scheme data
              </p>
            </div>
          </div>
          {stats && stats.total_chunks > 0 && (
            <span className="hidden sm:inline-flex chip bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {stats.total_chunks} chunks · {stats.unique_schemes} schemes
            </span>
          )}
        </div>

        {/* Chat card */}
        <div className="rounded-3xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-slate-100 dark:border-slate-800 shadow-soft flex flex-col"
             style={{ height: "calc(100vh - 14rem)", minHeight: "420px" }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                role={m.role}
                content={m.content}
                sources={m.sources}
              />
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white grid place-items-center">
                  <FiCpu />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <FiRefreshCw className="animate-spin" />
                    Searching schemes and generating answer...
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only when only the greeting exists) */}
          {messages.length === 1 && !loading && (
            <div className="px-5 pb-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <FiInfo /> Try asking
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-700 dark:hover:text-primary-300 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-slate-100 dark:border-slate-800 p-3 md:p-4">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about any scheme... (Enter to send, Shift+Enter for new line)"
                className="input-base resize-none max-h-32 py-3"
                style={{ minHeight: "48px" }}
              />
              <Button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="shrink-0 h-12 w-12 !px-0 grid place-items-center shadow-glow"
              >
                <FiSend />
              </Button>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
              Answers are generated from indexed official scheme data. Always verify with the official portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}