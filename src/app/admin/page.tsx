'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, MessageSquare, LogOut, Film } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState<'movies' | 'recommendations'>('movies');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, recsRes] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/recommendations'),
        ]);

        if (moviesRes.status === 401) {
          router.push('/admin/login');
          return;
        }

        const moviesData = await moviesRes.json();
        const recsData = await recsRes.json();

        setMovies(moviesData);
        setRecommendations(recsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDeleteMovie = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    try {
      const res = await fetch(`/api/movies/admin/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMovies(movies.filter((m: any) => m._id !== id));
      }
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleMarkAsAdded = async (id: string, movieName: string) => {
    const movieSlug = prompt(`Enter the slug of the movie added for "${movieName}":`);
    if (!movieSlug) return;

    try {
      const res = await fetch(`/api/recommendations/admin/${id}/added`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieSlug }),
      });

      if (res.ok) {
        setRecommendations(recommendations.map((r: any) => 
          r._id === id ? { ...r, status: 'added' } : r
        ));
        alert('Marked as added and email notification sent!');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to mark as added');
      }
    } catch (error) {
      alert('Error marking as added');
    }
  };

  function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-netflix-black text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-netflix-red border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black px-4 pt-24 text-white md:px-12 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your platform content</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/admin/movie/new"
              className="flex items-center space-x-2 rounded bg-netflix-red px-6 py-2 font-semibold transition hover:bg-red-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add Movie</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 rounded bg-netflix-light-grey px-6 py-2 font-semibold transition hover:bg-gray-700"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center space-x-2 px-6 py-4 font-semibold transition ${
              activeTab === 'movies' ? 'border-b-2 border-netflix-red text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Film className="h-5 w-5" />
            <span>Movies</span>
            <span className="ml-2 rounded-full bg-gray-800 px-2 py-0.5 text-xs">{movies.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex items-center space-x-2 px-6 py-4 font-semibold transition ${
              activeTab === 'recommendations' ? 'border-b-2 border-netflix-red text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Recommendations</span>
            <span className="ml-2 rounded-full bg-gray-800 px-2 py-0.5 text-xs">{recommendations.length}</span>
          </button>
        </div>

        {activeTab === 'movies' ? (
          <div className="overflow-x-auto rounded-lg bg-netflix-dark-grey shadow-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-sm uppercase text-gray-400">
                  <th className="px-6 py-4 font-medium">Poster</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {movies.map((movie: any) => (
                  <tr key={movie._id} className="transition hover:bg-black/20">
                    <td className="px-6 py-4">
                      <div className="h-16 w-12 overflow-hidden rounded bg-gray-800">
                        <img src={movie.posterUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{movie.title}</td>
                    <td className="px-6 py-4 text-yellow-400">★ {movie.imdbRating}</td>
                    <td className="px-6 py-4 text-gray-400">{movie.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-3">
                        <Link
                          href={`/admin/movie/${movie._id}`}
                          className="rounded p-2 text-blue-400 transition hover:bg-blue-400/10 hover:text-blue-300"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteMovie(movie._id)}
                          className="rounded p-2 text-netflix-red transition hover:bg-netflix-red/10 hover:text-red-400"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-netflix-dark-grey shadow-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-sm uppercase text-gray-400">
                  <th className="px-6 py-4 font-medium">Movie Name</th>
                  <th className="px-6 py-4 font-medium">User Email</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date Submitted</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recommendations.map((rec: any) => (
                  <tr key={rec._id} className="transition hover:bg-black/20">
                    <td className="px-6 py-4 font-medium">{rec.movieName}</td>
                    <td className="px-6 py-4 text-gray-400">{rec.email || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "rounded-full px-2 py-1 text-xs font-semibold",
                        rec.status === 'added' ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {rec.status === 'pending' && (
                        <button
                          onClick={() => handleMarkAsAdded(rec._id, rec.movieName)}
                          className="rounded bg-green-600 px-3 py-1 text-xs font-bold transition hover:bg-green-700"
                        >
                          Mark as Added
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
