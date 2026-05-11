'use client';

import { useState } from 'react';

export default function WallpapersPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const wallpapers = [
    {
      id: 1,
      name: 'Cherry Blossom Cat',
      description: 'Peaceful Studio Ghibli vibes',
      emoji: '🌸',
      gradient: 'from-pink-900/40 to-rose-900/40',
      border: 'border-pink-500/20',
    },
    {
      id: 2,
      name: 'Snow Samurai',
      description: 'Ink wash monochrome action',
      emoji: '⚔️',
      gradient: 'from-slate-800/40 to-gray-900/40',
      border: 'border-slate-500/20',
    },
    {
      id: 3,
      name: 'Blue Warrior',
      description: 'Cinematic gacha aesthetic',
      emoji: '💙',
      gradient: 'from-blue-900/40 to-cyan-900/40',
      border: 'border-blue-500/20',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/wallpapers/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit. Please try again.');
      setLoading(false);
    }
  };

  // ✅ SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">

          <div className="text-7xl mb-6">✨</div>

          <h2 className="text-4xl font-bold text-white mb-3">
            You're in!
          </h2>

          <p className="text-purple-200 text-lg mb-8">
            All 3 wallpapers are ready for you.
          </p>

          {/* Download Button */}
          <a
            href="https://drive.google.com/uc?export=download&id=1ZKQhxnxi0gnEwUjexK0Haqyv1uVVIEm0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-xl transition-all transform hover:scale-105 text-lg mb-6 shadow-lg shadow-purple-500/25"
          >
            ⬇️ Download Wallpapers
          </a>

          <p className="text-purple-300 text-sm mb-8">
            Love them? Share on IG and tag{' '}
            <a
              href="https://instagram.com/sliceofanimeofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 font-semibold hover:text-pink-300"
            >
              @sliceofanimeofficial
            </a>{' '}
            🎨
          </p>

          {/* Wallpaper List */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-left">
            <p className="text-white font-semibold mb-4 text-center">Your 3 Wallpapers</p>
            {wallpapers.map((wp) => (
              <div
                key={wp.id}
                className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0"
              >
                <span className="text-2xl">{wp.emoji}</span>
                <div>
                  <p className="text-white font-medium text-sm">{wp.name}</p>
                  <p className="text-purple-300 text-xs">{wp.description}</p>
                </div>
              </div>
            ))}
          </div>

          <a href="/" className="inline-block mt-8 text-purple-400 hover:text-white text-sm underline">
            ← Back to Slice of Anime
          </a>
        </div>
      </div>
    );
  }

  // 📧 EMAIL FORM SCREEN
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-4 py-12">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <a href="/" className="text-purple-400 hover:text-white text-sm mb-6 inline-block">
            ← Slice of Anime
          </a>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Free Wallpapers 🎨
          </h1>
          <p className="text-purple-200">
            3 original anime wallpapers. Phone & desktop ready.
          </p>
        </div>

        {/* Wallpaper Preview Cards */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {wallpapers.map((wp) => (
            <div
              key={wp.id}
              className={`aspect-[9/16] rounded-xl bg-gradient-to-br ${wp.gradient} border ${wp.border} flex flex-col items-center justify-center gap-2 p-3`}
            >
              <span className="text-3xl">{wp.emoji}</span>
              <p className="text-white text-xs font-medium text-center leading-tight">
                {wp.name}
              </p>
            </div>
          ))}
        </div>

        {/* What's included */}
        <div className="flex justify-center gap-6 mb-10 text-sm text-purple-300">
          <span>✅ No copyright</span>
          <span>📱 Phone ready</span>
          <span>🆓 100% free</span>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm">

          <h2 className="text-xl font-bold text-white mb-6">
            Drop your email to download
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-white/30 transition-colors"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white placeholder-white/30 transition-colors"
            />

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
            >
              {loading ? 'Getting your wallpapers...' : 'Get Wallpapers Free ✨'}
            </button>

            <p className="text-xs text-white/30 text-center">
              No spam. Occasional anime updates. Unsubscribe anytime.
            </p>

          </form>

          {/* IG Link */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-purple-300">
              Follow for daily anime recs →{' '}
              <a
                href="https://instagram.com/sliceofanimeofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 font-semibold hover:text-pink-300"
              >
                @sliceofanimeofficial
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}