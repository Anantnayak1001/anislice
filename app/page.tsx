'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setMessage('✓ You\'re on the waitlist! Check your inbox.');
      setEmail('');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Slice of Anime
          </h1>
          <p className="text-lg text-slate-300">
            Your reading tracker for manga, manhwa & manhua
          </p>
        </div>

        <div className="space-y-4 text-slate-200">
          <p className="text-xl font-semibold">Lost track of your 200+ series? 📚</p>
          <p className="text-base leading-relaxed">
            Too many reading apps. Too many tabs. Too much chaos. <br />
            We've read 350+ series — we get it.
          </p>
        </div>

        <div className="bg-slate-900 border border-purple-700/50 rounded-lg p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Notion Reading Tracker</h2>
            <ul className="text-left space-y-3 text-slate-300">
              <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> 200+ series pre-loaded</li>
              <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Track manga, manhwa & manhua separately</li>
              <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Hidden Gems list (15 underrated picks)</li>
              <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Personal Top 10 rankings</li>
              <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Monthly reading goals</li>
              <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Dark mode aesthetic</li>
            </ul>
          </div>

          <button onClick={() => window.open('https://payhip.com/b/M2wmg', '_blank')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-200">
            Buy Now on Payhip
          </button>

          <p className="text-sm text-slate-400 text-center">One-time purchase. Lifetime access.</p>
        </div>

        <div className="space-y-4">
          <p className="text-slate-300 font-semibold">Coming soon: Manhwa Tracker App (free)</p>
          <form onSubmit={handleSubscribe} className="space-y-3">
            <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors" />
            <button type="submit" disabled={loading} className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              {loading ? 'Subscribing...' : 'Get Early Access'}
            </button>
          </form>

          {message && <p className="text-green-400 text-sm font-semibold">{message}</p>}
          {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2 text-slate-400 text-sm">
          <p>@sliceofanimeofficial • 1,200+ followers</p>
          <p>Made by someone who read 350+ series</p>
        </div>
      </div>
    </div>
  );
}