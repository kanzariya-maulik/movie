'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, MessageSquare, LogOut, Film, Search, Mail } from 'lucide-react';
import Link from 'next/link';
import Toast from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

interface Movie {
  _id: string;
  title: string;
  posterUrl: string;
  imdbRating: number;
  slug: string;
  genres: string[];
}

interface Recommendation {
  _id: string;
  movieName: string;
  email?: string;
  status: 'pending' | 'added';
  createdAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState<'movies' | 'recommendations' | 'contacts'>('movies');
  const [loading, setLoading] = useState(true);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const router = useRouter();

  // Notification & Modal State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    id: string; 
    type: 'movie' | 'recommendation' | 'contact';
    title: string;
  }>({ isOpen: false, id: '', type: 'movie', title: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, recsRes, contactsRes] = await Promise.all([
          fetch('/api/movies?limit=1000'),
          fetch('/api/recommendations'),
          fetch('/api/contact/admin')
        ]);

        if (moviesRes.status === 401) {
          router.push('/admin/login');
          return;
        }

        const moviesData = await moviesRes.json();
        const recsData = await recsRes.json();
        const contactsData = await contactsRes.json();

        setMovies(moviesData.movies || []);
        setRecommendations(recsData || []);
        setContacts(contactsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const confirmDelete = (id: string, type: 'movie' | 'recommendation' | 'contact', title: string) => {
    setDeleteModal({ isOpen: true, id, type, title });
  };

  const handleDeleteExecute = async () => {
    const { id, type } = deleteModal;
    setIsDeleting(true);
    try {
      let url = '';
      if (type === 'movie') url = `/api/movies/admin/${id}`;
      else if (type === 'recommendation') url = `/api/recommendations/admin/${id}`;
      else if (type === 'contact') url = `/api/contact/admin/${id}`;

      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        if (type === 'movie') setMovies(movies.filter(m => m._id !== id));
        else if (type === 'recommendation') setRecommendations(recommendations.filter(r => r._id !== id));
        else if (type === 'contact') setContacts(contacts.filter(c => c._id !== id));
        
        showToast('Successfully deleted!', 'success');
      } else {
        showToast('Action failed. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Something went wrong', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ ...deleteModal, isOpen: false });
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
        setRecommendations(recommendations.map((r: Recommendation) => 
          r._id === id ? { ...r, status: 'added' } : r
        ));
        showToast('Marked as added!', 'success');
      } else {
        showToast('Update failed', 'error');
      }
    } catch (error) {
      showToast('Error connecting to server', 'error');
    }
  };

  const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

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
    <div className="min-h-screen bg-netflix-black px-4 pt-20 pb-10 text-white md:px-8 lg:px-12 md:pt-28 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl text-white">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Platform content control center
            </p>
          </div>
          <div className="flex flex-row gap-2 w-full md:w-auto">
            <Link
              href="/admin/movie/new"
              className="group flex flex-1 items-center justify-center space-x-2 rounded-lg bg-netflix-red px-4 py-2.5 text-xs font-bold transition hover:bg-red-700 active:scale-95 md:flex-none md:text-sm lg:text-base lg:px-6"
            >
              <Plus className="h-4 w-4 transition group-hover:rotate-90 lg:h-5 lg:w-5" />
              <span>Add Movie</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-bold transition hover:bg-white/10 active:scale-95 md:flex-none md:text-sm lg:text-base lg:px-6"
            >
              <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs Grid */}
        <div className="mb-8 grid grid-cols-3 gap-1 border-b border-white/10 bg-white/5 p-1 rounded-xl md:flex md:space-x-1 lg:p-1.5 overflow-hidden">
            {[
              { id: 'movies', label: 'Movies', icon: Film, count: movies.length },
              { id: 'recommendations', label: 'Requests', icon: MessageSquare, count: recommendations.length },
              { id: 'contacts', label: 'Inquiries', icon: Mail, count: contacts.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 rounded-lg py-2 text-[9px] font-bold transition-all outline-none md:flex-row md:space-y-0 md:space-x-2 md:px-5 md:py-2.5 md:text-sm lg:text-base",
                  activeTab === tab.id 
                    ? "bg-netflix-red text-white shadow-lg shadow-netflix-red/20" 
                    : "text-gray-400 hover:bg-white/5"
                )}
              >
                <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="truncate">{tab.label}</span>
                <span className={cn(
                  "flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[8px] font-black md:h-5 md:min-w-[20px] md:px-1.5 md:text-[10px]",
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/10 text-gray-500"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
        </div>

        {/* Contextual Actions (Search) */}
        {activeTab === 'movies' && (
          <div className="mb-6">
            <div className="relative group max-w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-netflix-red sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search by title or slug..."
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-netflix-dark-grey py-2.5 pl-10 pr-4 text-xs text-white outline-none transition-all placeholder:text-gray-600 focus:border-netflix-red sm:py-3 sm:pl-11 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'movies' ? (
            <>
              {/* Table View (Desktop) */}
              <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/10 bg-netflix-dark-grey shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-black/40">
                    <tr className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-white/5">
                      <th className="px-6 py-4">Poster</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4">Slug</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {movies
                      .filter((m: Movie) => 
                        m.title.toLowerCase().includes(adminSearchQuery.toLowerCase()) || 
                        m.slug.toLowerCase().includes(adminSearchQuery.toLowerCase())
                      )
                      .map((movie: Movie) => (
                      <tr key={movie._id} className="transition hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <div className="h-14 w-10 overflow-hidden rounded shadow-lg ring-1 ring-white/10">
                            <img src={movie.posterUrl} alt="" className="h-full w-full object-cover" />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-200">{movie.title}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-yellow-500 font-bold">
                            <span className="mr-1">★</span>
                            {movie.imdbRating}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{movie.slug}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/admin/movie/${movie._id}`}
                              className="group rounded-md bg-white/5 p-2 text-blue-400 transition hover:bg-blue-500 hover:text-white"
                              title="Edit Movie"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => confirmDelete(movie._id, 'movie', movie.title)}
                              className="group rounded-md bg-white/5 p-2 text-netflix-red transition hover:bg-netflix-red hover:text-white"
                              title="Delete Movie"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grid View (Tablet/Mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 pb-10">
                {movies
                  .filter((m: Movie) => 
                    m.title.toLowerCase().includes(adminSearchQuery.toLowerCase()) || 
                    m.slug.toLowerCase().includes(adminSearchQuery.toLowerCase())
                  )
                  .map((movie: Movie) => (
                  <div key={movie._id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-netflix-dark-grey p-4 transition-all hover:bg-white/[0.02]">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-black shadow-lg ring-1 ring-white/10">
                        <img src={movie.posterUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-bold text-base text-white">{movie.title}</h3>
                        <div className="mt-1 flex items-center space-x-3 text-xs">
                          <div className="flex items-center text-yellow-500 font-bold">
                            <span className="mr-1">★</span>
                            {movie.imdbRating}
                          </div>
                        </div>
                        <p className="mt-1 truncate font-mono text-[10px] text-gray-600">{movie.slug}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex border-t border-white/5 pt-3 gap-2">
                      <Link
                        href={`/admin/movie/${movie._id}`}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-500/10 py-2.5 text-xs font-bold text-blue-400 transition hover:bg-blue-500 hover:text-white"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => confirmDelete(movie._id, 'movie', movie.title)}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-netflix-red/10 py-2.5 text-xs font-bold text-netflix-red transition hover:bg-netflix-red hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : activeTab === 'recommendations' ? (
            <>
              {/* Recommendations Table (Desktop) */}
              <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/10 bg-netflix-dark-grey shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-black/40">
                    <tr className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-white/5">
                      <th className="px-6 py-4">Movie Name</th>
                      <th className="px-6 py-4">Requester</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Submitted</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recommendations.map((rec: Recommendation) => (
                      <tr key={rec._id} className="transition hover:bg-white/[0.02]">
                        <td className="px-6 py-4 font-bold text-gray-200">{rec.movieName}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{rec.email || 'Anonymous'}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1",
                            rec.status === 'added' 
                              ? "bg-green-500/10 text-green-400 ring-green-500/20" 
                              : "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
                          )}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(rec.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            {rec.status === 'pending' && (
                              <button
                                onClick={() => handleMarkAsAdded(rec._id, rec.movieName)}
                                className="rounded-md bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-green-600 active:scale-95"
                              >
                                Fulfill
                              </button>
                            )}
                            <button
                              onClick={() => confirmDelete(rec._id, 'recommendation', rec.movieName)}
                              className="rounded-md bg-white/5 p-2 text-netflix-red transition hover:bg-netflix-red hover:text-white"
                              title="Delete Request"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recommendations Mobile View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 pb-10">
                {recommendations.map((rec: Recommendation) => (
                  <div key={rec._id} className="relative overflow-hidden rounded-xl border border-white/10 bg-netflix-dark-grey p-5 transition hover:bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-3 text-[10px]">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 font-extrabold uppercase tracking-widest ring-1",
                        rec.status === 'added' ? "bg-green-500/10 text-green-400 ring-green-500/20" : "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
                      )}>
                        {rec.status}
                      </span>
                      <span className="font-bold text-gray-600">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white leading-tight">{rec.movieName}</h3>
                    <p className="mt-1 text-[11px] text-gray-500 truncate">{rec.email || 'Anonymous Request'}</p>
                    
                    <div className="mt-5 flex gap-2">
                    {rec.status === 'pending' ? (
                      <button
                        onClick={() => handleMarkAsAdded(rec._id, rec.movieName)}
                        className="flex-1 rounded-lg bg-green-500 py-3 text-xs font-bold text-white transition hover:bg-green-600 active:scale-95"
                      >
                        Add Movie
                      </button>
                    ) : null}
                    <button
                      onClick={() => confirmDelete(rec._id, 'recommendation', rec.movieName)}
                      className={cn(
                        "flex items-center justify-center rounded-lg py-3 text-xs font-bold transition",
                        rec.status === 'added' ? "flex-1 bg-netflix-red/10 text-netflix-red hover:bg-netflix-red hover:text-white" : "w-12 bg-white/5 text-gray-400 hover:bg-netflix-red hover:text-white"
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                      {rec.status === 'added' && <span className="ml-2">Clear Request</span>}
                    </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Inquiries Table (Desktop) */}
              <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/10 bg-netflix-dark-grey shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-black/40">
                    <tr className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-white/5">
                      <th className="px-6 py-4">From</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Message Preview</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {contacts.map((contact: Contact) => (
                      <tr key={contact._id} className="transition hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-200">{contact.name}</div>
                          <div className="text-[10px] font-mono text-gray-600">{contact.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] font-bold text-gray-500 border border-white/5">
                            {contact.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="line-clamp-2 max-w-sm text-sm text-gray-400 leading-relaxed italic">
                            "{contact.message}"
                          </p>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => confirmDelete(contact._id, 'contact', contact.name)}
                            className="rounded-md bg-white/5 p-2 text-netflix-red transition hover:bg-netflix-red hover:text-white"
                            title="Delete Message"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {contacts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 bg-black/20">
                     <Mail className="h-12 w-12 text-gray-800 mb-4" />
                     <p className="text-gray-600 font-bold">No new inquiry messages</p>
                  </div>
                )}
              </div>

              {/* Inquiries Mobile View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 pb-10">
                {contacts.map((contact: Contact) => (
                  <div key={contact._id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-netflix-dark-grey p-5 transition hover:bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="rounded-md bg-netflix-red/10 border border-netflix-red/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter text-netflix-red">
                        {contact.subject}
                      </span>
                      <span className="text-[10px] font-bold text-gray-700 italic">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white leading-tight truncate">{contact.name}</h3>
                      <p className="mt-0.5 text-[10px] font-mono text-gray-600 break-all">{contact.email}</p>
                    </div>
                    <div className="mt-4 bg-black/40 p-4 rounded-xl ring-1 ring-white/5 overflow-hidden">
                      <p className="text-[13px] font-medium text-gray-400 leading-relaxed line-clamp-4 break-words">
                        {contact.message}
                      </p>
                    </div>
                    <button
                      onClick={() => confirmDelete(contact._id, 'contact', contact.name)}
                      className="mt-5 flex w-full items-center justify-center space-x-2 rounded-xl bg-netflix-red/10 py-3.5 text-xs font-black text-netflix-red transition hover:bg-netflix-red hover:text-white active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Archive Message</span>
                    </button>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <div className="py-12 text-center text-gray-700 border-2 border-dashed border-white/5 rounded-2xl col-span-full">
                     <p className="font-bold">Inbox is empty</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Global Modals */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={`Delete ${deleteModal.type === 'movie' ? 'Movie' : deleteModal.type === 'recommendation' ? 'Request' : 'Message'}`}
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDeleteExecute}
        onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
      />
    </div>
  );
}
