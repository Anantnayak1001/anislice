'use client';               // ← line 1 ✅

import React from 'react';  // ← line 3 ✅

import { useState } from 'react';
import Image from 'next/image';

export default function WallpapersPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const wallpapers = [
    { id: 1, name: 'Cherry Blossom Cat', description: 'Studio Ghibli vibes', emoji: '🌸', image: '/wallpapers/cat.jpg' },
    { id: 2, name: 'Snow Samurai', description: 'Ink wash monochrome', emoji: '⚔️', image: '/wallpapers/samurai.jpg' },
    { id: 3, name: 'Blue Warrior', description: 'Cinematic gacha style', emoji: '💙', image: '/wallpapers/warrior.jpg' },
  ];

  const handleSubmit = async (e: any) =>  {
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
        setError(data.error || 'Something went wrong.');
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit. Please try again.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="text-7xl mb-6">✨</div>
          <h2 className="text-4xl font-bold text-white mb-3">You're in!</h2>
          <p className="text-purple-200 text-lg mb-8">All 3 wallpapers are ready.</p>
          
            <a href="https://drive.google.com/uc?export=download&id=1ZKQhxnxi0gnEwUjexK0Haqyv1uVVIEm0" target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-10 rounded-xl mb-8">
  Download All Wallpapers
</a>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {wallpapers.map((wp) => (
              <div key={wp.id} className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-800">
                <Image src={wp.image} alt={wp.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center p-2">
                  <p className="text-white text-xs font-medium text-center">{wp.name}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-purple-300 text-sm mb-6">
            Tag us →{' '}
            <a href="https://instagram.com/sliceofanimeofficial" target="_blank" rel="noopener noreferrer" className="text-pink-400 font-semibold">
              @sliceofanimeofficial
            </a>
          </p>
          <a href="/" className="text-purple-400 hover:text-white text-sm underline">← Back to Slice of Anime</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <a href="/" className="text-purple-400 hover:text-white text-sm mb-6 inline-block">← Slice of Anime</a>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Free Wallpapers 🎨</h1>
          <p className="text-purple-200">3 original anime wallpapers. Phone & desktop ready.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {wallpapers.map((wp) => (
            <div key={wp.id} className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-800 border border-white/10">
              <Image src={wp.image} alt={wp.name} fill className="object-cover" />
              <div className="absolute inset-0 backdrop-blur-sm bg-black/30 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">{wp.emoji}</span>
                <p className="text-white text-xs font-medium text-center px-1">{wp.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-6 mb-8 text-sm text-purple-300">
          <span>✅ No copyright</span>
          <span>📱 Phone ready</span>
          <span>🆓 Always free</span>
        </div>

        <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-2">Drop your email to unlock 🔓</h2>
          <p className="text-purple-300 text-sm mb-6">Instant download. No spam ever.</p>
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
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
            >
              {loading ? 'Unlocking...' : 'Get Wallpapers Free ✨'}
            </button>
            <p className="text-xs text-white/30 text-center">Occasional anime updates. Unsubscribe anytime.</p>
          </form>
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-purple-300">
              Follow for daily anime recs →{' '}
              <a href="https://instagram.com/sliceofanimeofficial" target="_blank" rel="noopener noreferrer" className="text-pink-400 font-semibold hover:text-pink-300">
                @sliceofanimeofficial
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}