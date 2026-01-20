'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Support Inquiry',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'Support Inquiry', message: '' });
      } else {
        const data = await res.json();
        setErrorMessage(data.message || 'Something went wrong');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('Failed to send message. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-32 pb-20 px-4 md:px-12">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400">
            Have a question or feedback? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
          {status === 'success' ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Message Sent!</h2>
              <p className="text-gray-400">Thank you for reaching out. We have received your message.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-6 text-netflix-red hover:underline font-semibold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-netflix-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-netflix-red outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-netflix-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-netflix-red outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-netflix-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-netflix-red outline-none transition appearance-none"
                >
                  <option>Support Inquiry</option>
                  <option>Bug Report</option>
                  <option>Movie Request</option>
                  <option>Business/DMCA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-netflix-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-netflix-red outline-none transition resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}

              <button 
                disabled={status === 'loading'}
                className="w-full bg-netflix-red text-white py-3.5 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
