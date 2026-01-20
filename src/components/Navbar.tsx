'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, User, Menu, X, LogOut } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

    window.addEventListener('scroll', handleScroll);
    checkAuth();
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 60000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
              <div className="absolute right-0 mt-4 w-72 origin-top-right rounded bg-netflix-black/95 p-4 shadow-xl ring-1 ring-white/10 md:w-80">
                <div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="font-semibold text-sm">Notifications</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="py-4 text-center text-xs text-gray-400">No notifications</p>
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
                        <span className="mt-1 block text-[9px] text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <button onClick={handleLogout} className="hidden md:block">
              <LogOut className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          )}

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
}
