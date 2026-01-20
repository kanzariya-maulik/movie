'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, User, Menu, X, LogOut, Languages, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
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

    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLanguages(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    checkAuth();
    fetchNotifications();
    
    // Check initial language from cookie if possible
    const checkLang = () => {
      const cookies = document.cookie.split('; ');
      const transCookie = cookies.find(row => row.startsWith('googtrans='));
      if (transCookie) {
        if (transCookie.includes('/en/gu')) setCurrentLang('ગુજરાતી');
        else if (transCookie.includes('/en/hi')) setCurrentLang('हिंदी');
        else setCurrentLang('English');
      }
    };
    checkLang();
    
    const interval = setInterval(fetchNotifications, 60000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Admin', href: isAuthenticated ? '/admin' : '/admin/login' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 flex w-full flex-col transition-all duration-500',
        isScrolled || isMobileMenuOpen ? 'bg-netflix-black' : 'bg-transparent bg-gradient-to-b from-black/70 to-transparent'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:h-20 lg:px-12">
        <div className="flex items-center space-x-2 md:space-x-10">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <h1 className="text-xl font-bold text-netflix-red md:text-2xl lg:text-3xl tracking-tighter">BOTAD MOVIES</h1>
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

        <div className="flex items-center space-x-3 md:space-x-4">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-24 bg-transparent py-1 pl-7 text-white outline-none transition-all duration-300 focus:w-32 md:w-0 md:focus:w-60 lg:w-40 border-b border-transparent focus:border-white text-xs md:text-sm"
              aria-label="Search movies"
            />
            <Search className="absolute left-0 h-4 w-4 cursor-pointer md:h-5 md:w-5" onClick={(e) => (e.currentTarget.previousSibling as HTMLInputElement).focus()} />
          </form>

          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) markAsRead();
              }}
              className="relative pt-1"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5 cursor-pointer md:h-6 md:w-6" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 top-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-netflix-red text-[8px] font-bold text-white md:h-4 md:w-4 md:text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                {/* Mobile Overlay Backdrop */}
                <div 
                  className="fixed inset-0 z-[-1] bg-black/50 backdrop-blur-sm md:hidden" 
                  onClick={() => setShowNotifications(false)}
                />
                <div className="fixed left-4 right-4 top-16 mt-2 z-50 origin-top rounded-2xl bg-netflix-black border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:absolute md:left-auto md:right-0 md:top-full md:mt-4 md:w-96 md:rounded-xl backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-netflix-red" />
                      <span className="font-black text-sm uppercase tracking-wider text-white">Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-netflix-red/10 px-2 py-0.5 text-[10px] font-black text-netflix-red ring-1 ring-netflix-red/20">
                        {unreadCount} NEW
                      </span>
                    )}
                  </div>
                  
                  <div className="max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 rounded-full bg-white/5 p-4">
                          <Bell className="h-8 w-8 text-gray-600" />
                        </div>
                        <p className="text-sm font-bold text-gray-400">All clear!</p>
                        <p className="mt-1 text-xs text-gray-600">No new updates right now.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((notification) => (
                          <Link
                            key={notification._id}
                            href={notification.link}
                            onClick={() => setShowNotifications(false)}
                            className={cn(
                              "group block rounded-xl border border-white/5 p-4 transition-all hover:bg-white/5 active:scale-[0.98]",
                              !notification.read ? "bg-white/[0.03] ring-1 ring-white/10" : "opacity-70"
                            )}
                          >
                            <p className={cn(
                              "text-xs leading-relaxed break-words",
                              !notification.read ? "font-bold text-white" : "text-gray-400"
                            )}>
                              {notification.message}
                            </p>
                            <div className="mt-2 flex items-center space-x-2 text-[10px] font-medium text-gray-600">
                              <span>{new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                              <span>•</span>
                              <span>{new Date(notification.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {isAuthenticated && (
            <button onClick={handleLogout} className="hidden md:block">
              <LogOut className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          )}

          {/* Premium Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="flex items-center space-x-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white md:px-3 md:py-1.5 md:text-sm"
              aria-label="Change language"
            >
              <Languages className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">{currentLang}</span>
            </button>

            {showLanguages && (
              <div className="absolute right-0 mt-3 w-40 origin-top-right overflow-hidden rounded-md bg-netflix-dark-grey shadow-2xl ring-1 ring-white/10">
                <div className="py-1">
                  {[
                    { label: 'English', code: 'en' },
                    { label: 'ગુજરાતી', code: 'gu' },
                    { label: 'हिंदी', code: 'hi' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code, lang.label)}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-white/5",
                        currentLang === lang.label ? "text-netflix-red" : "text-gray-300"
                      )}
                    >
                      <span>{lang.label}</span>
                      {currentLang === lang.label && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hidden Original Widget for Logic */}
          <div id="google_translate_element" className="hidden" />

          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="flex flex-col space-y-4 border-t border-white/5 bg-netflix-black px-4 py-6 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'text-lg font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]',
                pathname === link.href && 'font-semibold text-white'
              )}
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-lg font-light text-netflix-red"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-light text-[#e5e5e5]"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );

  async function markAsRead() {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }

  function handleLanguageChange(code: string, label: string) {
    if (code === 'en') {
      // Clear all possible googtrans cookies for a fresh English state
      const domains = [
        window.location.hostname,
        '.' + window.location.hostname,
        'botad-movie.vercel.app',
        '.botad-movie.vercel.app'
      ];
      
      domains.forEach(domain => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      // Force reload to completely reset the translation engine
      window.location.reload();
      return;
    }
    
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
      setCurrentLang(label);
    } else {
      // Fallback: set cookie and reload
      document.cookie = `googtrans=/en/${code}; path=/;`;
      window.location.reload();
    }
    setShowLanguages(false);
  }
}
