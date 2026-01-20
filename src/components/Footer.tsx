import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

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
            <p className="hover:underline cursor-pointer">Audio Description</p>
            <p className="hover:underline cursor-pointer">Investor Relations</p>
            <p className="hover:underline cursor-pointer">Legal Notices</p>
          </div>
          <div className="space-y-3">
            <p className="hover:underline cursor-pointer">Help Center</p>
            <p className="hover:underline cursor-pointer">Jobs</p>
            <p className="hover:underline cursor-pointer">Cookie Preferences</p>
          </div>
          <div className="space-y-3">
            <p className="hover:underline cursor-pointer">Gift Cards</p>
            <p className="hover:underline cursor-pointer">Terms of Use</p>
            <p className="hover:underline cursor-pointer">Corporate Information</p>
          </div>
          <div className="space-y-3">
            <p className="hover:underline cursor-pointer">Media Center</p>
            <p className="hover:underline cursor-pointer">Privacy</p>
            <p className="hover:underline cursor-pointer">Contact Us</p>
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
