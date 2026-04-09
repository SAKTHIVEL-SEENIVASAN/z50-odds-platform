import { useState, useMemo, useRef, useEffect } from 'react';
import { MATCHES } from '@/lib/matches-data';
import { processAllMatches } from '@/lib/odds-engine';
import { queryAgent } from '@/lib/ai-agent';
import { AgentResponse } from '@/lib/types';
import MatchCard from '@/components/MatchCard';
import { Bot, Send, Sparkles } from 'lucide-react';

const QUICK_QUERIES = [
  'Who will win?',
  'Show me close matches',
  'Which match is most predictable?',
  'Tell me about Barcelona',
  'Show me NBA picks',
];

const AgentPage = () => {
  const [messages, setMessages] = useState<AgentResponse[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const allMatches = useMemo(() => processAllMatches(MATCHES), []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (query?: string) => {
    const q = query || input.trim();
    if (!q) return;
    setInput('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const response = queryAgent(q, allMatches);
      setMessages((prev) => [...prev, response]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col animate-fade-in">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground">AI Agent</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about matches, odds, and predictions
        </p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <p className="mb-1 font-semibold text-foreground">Z50 AI Agent</p>
            <p className="mb-6 text-xs text-muted-foreground">
              Powered by weighted statistical analysis
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-all hover:border-primary hover:bg-primary/5"
                >
                  <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="space-y-3 animate-slide-up">
            {/* User query */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
                {msg.query}
              </div>
            </div>
            {/* Agent response */}
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="max-w-[85%] space-y-3">
                <div className="rounded-xl rounded-tl-sm border border-border bg-muted/50 px-4 py-3 text-sm text-foreground whitespace-pre-line">
                  {msg.answer}
                </div>
                {msg.relevantMatches && msg.relevantMatches.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-1">
                    {msg.relevantMatches.map((m) => (
                      <MatchCard key={m.match_id} match={m} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 animate-fade-in">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/50 px-4 py-3">
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about matches, odds, predictions..."
          className="flex-1 rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="rounded-xl bg-primary px-4 py-3 text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AgentPage;
