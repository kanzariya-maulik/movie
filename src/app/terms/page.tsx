export const metadata = {
  title: 'Terms of Service | Botad Movies',
  description: 'The standard terms and conditions for using the Botad Movies platform as a search and indexing tool.',
};

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-netflix-black pt-32 pb-20 px-4 md:px-12">
      <div className="mx-auto max-w-4xl text-gray-300">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8 border-b border-netflix-red pb-4">Effective Date: {currentDate}</p>
        
        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Nature of Service</h2>
            <p>
              Botad Movies operates as a <span className="text-white font-semibold">Search Engine and Directory</span> and does not host any video or media content. 
              We index links to files that are located on third-party servers. 
              The responsibility for the content of these links rests solely with the owners of those third-party sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Non-Hosting & DMCA</h2>
            <p className="mb-4">
              We do not upload anymore, nor do we host any video files, media files, or copyrighted material. 
              If you are a copyright owner and want to remove any content found on our site, please contact the 
              site where the file is actually hosted.
            </p>
            <p>
              However, if you wish to have a link removed from our directory, please contact us with the specific URL, and we will process your request within 48-72 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. User Responsibility & Risks</h2>
            <p>
              Accessing third-party websites carries inherent risks, including but not limited to malware, intrusive advertising, 
              and misleading content. <span className="text-white font-semibold">Users access external links at their own risk.</span> 
              We recommend using an active antivirus and ad-blockers while visiting any external sites indexed here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Limitation of Liability</h2>
            <p>
              Botad Movies acting as an aggregator shall not be held liable for the legality, accuracy, quality, or safety 
              of any content accessed via indexed links. We do not guarantee the uptime or availability of third-party sources.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Lawful Usage</h2>
            <p>
              You agree to use this site for informational purposes only. You must not use the site in any way that 
              violates local or international laws. 
            </p>
          </section>

          <p className="pt-8 text-xs italic text-gray-500">
            By continuing to browse this directory, you agree that Botad Movies is a tool for finding information 
            and that you are responsible for how you use that information.
          </p>
        </div>
      </div>
    </div>
  );
}
