export const metadata = {
  title: 'Privacy Policy | Botad Movies',
  description: 'Learn how Botad Movies handles your information as an aggregator and how third-party links may affect your privacy.',
};

export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-netflix-black pt-32 pb-20 px-4 md:px-12">
      <div className="mx-auto max-w-4xl text-gray-300">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy & Links Policy</h1>
        <p className="text-sm text-gray-500 mb-8 border-b border-netflix-red pb-4">Last Updated: {currentDate}</p>
        
        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Data Aggregation Notice</h2>
            <p>
              Botad Movies is a directory that collects and indexes information about movies. 
              We do not store the media files themselves. Our data collection primarily focuses on public metadata 
              (titles, ratings, cast) and the storage location of that metadata.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Third-Party Web Tracking</h2>
            <p className="mb-4 text-netflix-red font-semibold">CRITICAL PRIVACY WARNING:</p>
            <p>
              When you click on a download link, you are leaving Botad Movies and entering a third-party website. 
              These websites have their own privacy policies, tracking cookies, and data collection habits which are 
              completely independent and <span className="text-white font-semibold">NOT under our control</span>. 
              We are not responsible for how these third parties handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Log Files</h2>
            <p>
              Like many other Web sites, we make use of log files. The information inside the log files includes 
              internet protocol (IP) addresses, type of browser, Internet Service Provider (ISP), date/time stamp, 
              referring/exit pages, and number of clicks to analyze trends and administer the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Advertising and Cookies</h2>
            <p>
              We use cookies to enhance your experience. Some of our advertising partners (such as Google AdSense) 
              may use cookies and web beacons on our site. These third-party ad servers automatically receive 
              your IP address when this happens.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Information Security</h2>
            <p>
              While we protect the information you provide us (like emails for movie requests), the secondary risk 
              comes from the external download mirrors. We advise all users to use virtual private networks (VPNs) 
              to maximize their privacy when accessing third-party indexed links.
            </p>
          </section>

          <p className="pt-8 text-xs italic text-gray-500">
            For further privacy concerns, please contact our privacy compliance officer at privacy@botadmovies.com.
          </p>
        </div>
      </div>
    </div>
  );
}
