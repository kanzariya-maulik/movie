import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-netflix-black px-4 py-10 text-gray-500 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex space-x-6 mb-8 text-white">
          <Facebook className="h-6 w-6 cursor-pointer hover:text-gray-400" aria-label="Facebook" />
          <Instagram className="h-6 w-6 cursor-pointer hover:text-gray-400" aria-label="Instagram" />
          <Twitter className="h-6 w-6 cursor-pointer hover:text-gray-400" aria-label="Twitter" />
          <Youtube className="h-6 w-6 cursor-pointer hover:text-gray-400" aria-label="Youtube" />
        </div>
        
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-8 text-sm">
          <div className="space-y-3">
            <h4 className="font-bold text-gray-300">Browse</h4>
            <Link href="/" className="block hover:underline">Home</Link>
            <Link href="/movies/page/2" className="block hover:underline">Latest Movies</Link>
            <Link href="/favorites" className="block hover:underline">My Favorites</Link>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-300">Genres</h4>
            <Link href="/genre/action" className="block hover:underline">Action</Link>
            <Link href="/genre/comedy" className="block hover:underline">Comedy</Link>
            <Link href="/genre/drama" className="block hover:underline">Drama</Link>
            <Link href="/genre/horror" className="block hover:underline">Horror</Link>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-300">Release Years</h4>
            <Link href="/year/2025" className="block hover:underline">2025 Movies</Link>
            <Link href="/year/2024" className="block hover:underline">2024 Movies</Link>
            <Link href="/year/2023" className="block hover:underline">2023 Movies</Link>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-300">Support</h4>
            <Link href="/about" className="block hover:underline">About Us</Link>
            <Link href="/contact" className="block hover:underline">Contact Us</Link>
            <Link href="/terms" className="block hover:underline">Terms of Use</Link>
            <Link href="/privacy" className="block hover:underline">Privacy Policy</Link>
            <Link href="/admin/login" className="block hover:underline text-gray-700">Admin Login</Link>
          </div>
        </div>

        <div className="mb-4">
          <button className="border border-gray-600 px-2 py-1 text-sm hover:text-white transition">
            Service Code
          </button>
        </div>

        <p className="text-xs">© 1997-2024 Botad Movies, Inc.</p>
      </div>
    </footer>
  );
}
