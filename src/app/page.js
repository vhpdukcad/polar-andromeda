"use client";
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const startAnalysis = async () => {
    if (!url) return;
    setLoading(true);
    setResult('');
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setResult(data.analysis || data.error);
    } catch (e) {
      setResult("Помилка зв'язку з API. Спробуйте пізніше.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Фоновий шум для текстури */}
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-50"></div>
      
      {/* Головний контейнер з ефектом скла */}
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-8 sm:p-12 z-10 relative overflow-hidden transition-all duration-500 hover:shadow-indigo-500/20 hover:border-white/20">
        
        {/* Декоративний блік */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-600/30 rounded-full filter blur-[80px] animate-pulse-slow"></div>

        <header className="relative z-10 text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            AI Design Architect
          </h1>
          <p className="text-zinc-400 mt-4 text-lg">
            Аналізуйте UI/UX будь-якого сайту за лічені секунди.
          </p>
        </header>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="relative group">
            <input 
              type="url" 
              className="w-full p-4 pl-12 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-zinc-100 placeholder-zinc-500 group-hover:border-zinc-600"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {/* Іконка посилання */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l-1.414-1.414m-2.828 0l-4 4a4 4 0 105.656 5.656l-1.414-1.414m5.656-5.656a4 4 0 010-5.656l4-4a4 4 0 015.656 0l-1.414 1.414m2.828 0l4-4a4 4 0 10-5.656-5.656l-1.414 1.414" />
            </svg>
          </div>

          <button 
            onClick={startAnalysis}
            disabled={loading || !url}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden ${
              loading || !url
                ? "bg-zinc-700/50 text-zinc-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Аналізуємо дизайн...
              </span>
            ) : (
              "Розпочати Аналіз"
            )}
          </button>
        </div>

        {result && (
          <div className="relative z-10 mt-10 p-6 sm:p-8 bg-zinc-800/40 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Результат Аналізу
            </h2>
            <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-headings:text-zinc-100 prose-strong:text-indigo-400">
              <div className="whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="absolute bottom-4 text-zinc-600 text-sm">
        &copy; 2026 AI Design Systems. Powered by Llama 4 Scout.
      </footer>
    </main>
  );
}