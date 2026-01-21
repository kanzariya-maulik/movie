'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface MovieFormProps {
  id?: string;
}

export default function MovieForm({ id }: MovieFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    posterUrl: '',
    imdbRating: 0,
    description: '',
    screenshots: [''],
    downloadButtons: [{ text: '', link: '' }],
    genres: '',
    languages: 'English',
    size: '',
    resolution: '',
    audio: '',
    series: '',
  });

  useEffect(() => {
    if (id) {
      const fetchMovie = async () => {
        const res = await fetch(`/api/movies/admin/${id}`);
        if (!res.ok) {
           console.error('Failed to fetch movie');
           return;
        }
        const movie = await res.json();
        if (movie) {
          setFormData({
            title: movie.title,
            slug: movie.slug,
            posterUrl: movie.posterUrl,
            imdbRating: movie.imdbRating,
            description: movie.description,
            screenshots: movie.screenshots.length > 0 ? movie.screenshots : [''],
            downloadButtons: movie.downloadButtons.length > 0 ? movie.downloadButtons : [{ text: '', link: '' }],
            genres: movie.genres ? movie.genres.join(', ') : '',
            languages: movie.languages ? movie.languages.join(', ') : 'English',
            size: movie.size || '',
            resolution: movie.resolution || '',
            audio: movie.audio || '',
            series: movie.series || '',
          });
        }
      };
      fetchMovie();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'slug') {
      const slugifiedValue = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-');
      
      setFormData((prev) => ({ ...prev, [name]: slugifiedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: name === 'imdbRating' ? parseFloat(value) : value }));
    }
  };

  const handleScreenshotChange = (index: number, value: string) => {
    const newScreenshots = [...formData.screenshots];
    newScreenshots[index] = value;
    setFormData((prev) => ({ ...prev, screenshots: newScreenshots }));
  };

  const addScreenshot = () => {
    setFormData((prev) => ({ ...prev, screenshots: [...prev.screenshots, ''] }));
  };

  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const handleDownloadButtonChange = (index: number, field: string, value: string) => {
    const newButtons = [...formData.downloadButtons];
    (newButtons[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, downloadButtons: newButtons }));
  };

  const addDownloadButton = () => {
    setFormData((prev) => ({
      ...prev,
      downloadButtons: [...prev.downloadButtons, { text: '', link: '' }],
    }));
  };

  const removeDownloadButton = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      downloadButtons: prev.downloadButtons.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/movies/admin/${id}` : '/api/movies';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean),
          languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean)
        }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        alert('Failed to save movie');
      }
    } catch (error) {
      alert('Error saving movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black px-4 pt-24 text-white md:px-12 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin" className="mb-6 inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="mb-8 text-2xl font-bold md:text-3xl">{id ? 'Edit Movie' : 'Add New Movie'}</h1>

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Movie Title</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
                placeholder="e.g. Inception"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Slug (URL identifier)</label>
              <input
                required
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
                placeholder="e.g. inception-2010"
              />
              <p className="text-[10px] text-gray-500">Only lowercase letters, numbers, and hyphens (-) allowed.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Poster URL</label>
              <input
                required
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
                placeholder="https://example.com/poster.jpg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">IMDb Rating</label>
              <input
                required
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="imdbRating"
                value={formData.imdbRating}
                onChange={handleChange}
                className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
                placeholder="e.g. 8.8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              required
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
              placeholder="Movie synopsis..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Genres (Comma separated)</label>
            <input
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
              placeholder="e.g. Action, Drama, Sci-Fi"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Languages (Comma separated)</label>
            <input
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
              placeholder="e.g. Hindi, English"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">File Size</label>
              <input
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
                placeholder="e.g. 1.2 GB"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Resolution</label>
              <input
                name="resolution"
                value={formData.resolution}
                onChange={handleChange}
                className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
                placeholder="e.g. 1080p, 720p"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Audio Format</label>
              <input
                name="audio"
                value={formData.audio}
                onChange={handleChange}
                className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
                placeholder="e.g. Dual Audio (Hindi/English)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Series Name (for Clustering)</label>
              <input
                name="series"
                value={formData.series}
                onChange={handleChange}
                className="w-full rounded bg-netflix-light-grey px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-netflix-red"
                placeholder="e.g. Avengers"
              />
            </div>
          </div>

          {/* Screenshots Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-400">Screenshots (Image URLs)</label>
              <button
                type="button"
                onClick={addScreenshot}
                className="text-xs text-netflix-red hover:underline"
              >
                + Add Screenshot
              </button>
            </div>
            <div className="space-y-3">
              {formData.screenshots.map((url, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    value={url}
                    onChange={(e) => handleScreenshotChange(index, e.target.value)}
                    className="flex-1 rounded bg-netflix-light-grey px-4 py-2 outline-none ring-1 ring-white/10 focus:ring-netflix-red text-sm"
                    placeholder="https://example.com/screenshot1.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => removeScreenshot(index)}
                    className="p-2 text-gray-500 hover:text-netflix-red"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Download Buttons Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-400">Download Buttons</label>
              <button
                type="button"
                onClick={addDownloadButton}
                className="text-xs text-netflix-red hover:underline"
              >
                + Add Download Link
              </button>
            </div>
            <div className="space-y-4">
              {formData.downloadButtons.map((btn, index) => (
                <div key={index} className="flex flex-col space-y-2 rounded-lg bg-black/30 p-4 ring-1 ring-white/5 md:flex-row md:space-x-4 md:space-y-0">
                  <input
                    required
                    value={btn.text}
                    onChange={(e) => handleDownloadButtonChange(index, 'text', e.target.value)}
                    className="flex-1 rounded bg-netflix-light-grey px-4 py-2 outline-none ring-1 ring-white/10 focus:ring-netflix-red text-sm"
                    placeholder="Button Text (e.g. Download 1080p)"
                  />
                  <input
                    required
                    value={btn.link}
                    onChange={(e) => handleDownloadButtonChange(index, 'link', e.target.value)}
                    className="flex-[2] rounded bg-netflix-light-grey px-4 py-2 outline-none ring-1 ring-white/10 focus:ring-netflix-red text-sm"
                    placeholder="Download URL"
                  />
                  <button
                    type="button"
                    onClick={() => removeDownloadButton(index)}
                    className="flex items-center justify-center p-2 text-gray-500 hover:text-netflix-red"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center space-x-2 rounded bg-netflix-red px-10 py-4 font-bold transition hover:bg-red-700 disabled:opacity-50 md:w-auto"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Saving...' : 'Save Movie'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
