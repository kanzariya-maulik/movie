'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    fetchNotifications();
    
    // Refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const markAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Admin', href: '/admin' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all duration-500 lg:px-12 lg:py-6',
        isScrolled ? 'bg-netflix-black' : 'bg-transparent bg-gradient-to-b from-black/70 to-transparent'
      )}
    >
      <div className="flex items-center space-x-2 md:space-x-10">
        <Link href="/">
          <h1 className="text-2xl font-bold text-netflix-red lg:text-3xl tracking-tighter">CINEMAX</h1>
        </Link>

        <ul className="hidden space-x-4 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={cn(
                  'text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]',
                  pathname === link.href && 'font-semibold text-white'
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center space-x-4 text-sm font-light">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            placeholder="Titles, people, genres"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-0 bg-transparent py-1 pl-8 text-white outline-none transition-all duration-300 focus:w-40 focus:ring-1 focus:ring-white md:focus:w-60 lg:w-40 border-b border-transparent focus:border-white"
          />
          <Search className="absolute left-0 h-6 w-6 cursor-pointer" onClick={(e) => (e.currentTarget.previousSibling as HTMLInputElement).focus()} />
        </form>

        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) markAsRead();
            }}
            className="relative"
          >
            <Bell className="h-6 w-6 cursor-pointer" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-netflix-red text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-72 origin-top-right rounded bg-netflix-black/95 p-4 shadow-xl ring-1 ring-white/10 md:w-80">
              <div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="font-semibold">Notifications</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-gray-400">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <Link
                      key={notification._id}
                      href={notification.link}
                      onClick={() => setShowNotifications(false)}
                      className="block border-b border-gray-800 py-3 transition hover:bg-white/5"
                    >
                      <p className={cn("text-xs", !notification.read && "font-bold text-white")}>
                        {notification.message}
                      </p>
                      <span className="mt-1 block text-[10px] text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
