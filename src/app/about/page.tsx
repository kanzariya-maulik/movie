import Link from 'next/link';

export const metadata = {
  title: 'About Us | Botad Movies',
  description: 'Botad Movies is a premium movie search engine and link aggregator designed to simplify your entertainment search.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-netflix-black pt-32 pb-20 px-4 md:px-12">
      <div className="mx-auto max-w-4xl text-gray-300">
        <h1 className="text-4xl font-bold text-white mb-8 border-b border-netflix-red pb-4 inline-block">About Our Platform</h1>
        
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            <span className="text-netflix-red font-bold">Botad Movies</span> is an advanced <span className="text-white font-semibold">Movie Indexing & Search Engine</span>. 
            In an era where movie links are scattered across thousands of websites and cloud servers, we act as a centralized hub to simplify your search.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Our Technology</h2>
          <p>
            We don't just "have" movies; we find them for you. Our platform uses automated and manual discovery to collect 
            detailed movie information, technical specifications, and the best available download links from across the internet. 
            By organizing all this data on a single page, we save our users hours of searching through multiple, often confusing, sources.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Why Botad Movies?</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="text-white font-semibold">Centralized Hub:</span> No more jumping from site to site. Every detail—from cast to resolution—is right here.</li>
            <li><span className="text-white font-semibold">Verified Discovery:</span> We verify external links to ensure they lead to the correct content.</li>
            <li><span className="text-white font-semibold">SEO Driven:</span> Our platform is built to help you find specific versions of movies (Dual Audio, 4K, etc.) with ease.</li>
            <li><span className="text-white font-semibold">Purely Informational:</span> We provide the data and the destination; you choose the source.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Disclaimer of Content</h2>
          <p className="bg-white/5 p-4 rounded-lg border border-white/10 text-sm italic">
            Please note: Botad Movies is an index of content that is already publicly available on the web. 
            <span className="text-white font-semibold"> We do not host, store, or upload any video, media files, or copyrighted material on our servers.</span> 
            Our service is strictly limited to indexing and organizing information for ease of access.
          </p>
          
          <div className="pt-10 flex justify-center">
             <Link href="/" className="bg-netflix-red text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition">
                Explore Our Collection
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
