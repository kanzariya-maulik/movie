'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function RecommendationForm() {
  const [movieName, setMovieName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieName.trim()) return;

    setStatus('loading');
    
    // Get or create a unique user ID for tracking without login
    let userId = localStorage.getItem('cinemax-user-id');
    if (!userId) {
      userId = Math.random().toString(36).slice(2, 11);
      localStorage.setItem('cinemax-user-id', userId);
    }

    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieName, userId }),
      });

      if (res.ok) {
        setStatus('success');
        setMovieName('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col items-center gap-4 sm:flex-row">
      <div className="flex w-full flex-1 flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Enter the movie name you want us to add..."
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          className="w-full flex-1 rounded bg-netflix-light-grey px-4 py-3 outline-none focus:ring-2 focus:ring-netflix-red text-white"
          required
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex w-full items-center justify-center space-x-2 rounded bg-netflix-red px-8 py-3 font-semibold transition hover:bg-red-700 disabled:opacity-50 sm:w-auto"
      >
        <span>{status === 'loading' ? 'Sending...' : 'Request'}</span>
        <Send className="h-4 w-4" />
      </button>
      {status === 'success' && <p className="mt-2 text-green-500 w-full text-center">Request sent successfully!</p>}
      {status === 'error' && <p className="mt-2 text-red-500 w-full text-center">Something went wrong. Try again.</p>}
    </form>
  );
}
