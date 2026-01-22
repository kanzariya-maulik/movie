'use client';

import { useEffect, useRef } from 'react';

interface EzMobAdProps {
  zoneId?: string;
  size?: string;
  subId?: string;
  className?: string;
}

export default function EzMobAd({ 
  zoneId = '323987', 
  size = '300x250', 
  subId = '', 
  className = '' 
}: EzMobAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Clear previous content to prevent duplicates on re-renders
    adRef.current.innerHTML = '';

    // EZMob logic to generate 'j' parameter
    const getJParameter = () => {
      try {
        let b: any = 0;
        let a: any = window;
        // eslint-disable-next-line
        while (a != a.parent) {
          ++b;
          a = a.parent;
        }
        
        // eslint-disable-next-line
        if (a = (window.parent == window ? document.URL : document.referrer)) {
          let c = a.indexOf("://");
          // eslint-disable-next-line
          if (0 <= c) a = a.substring(c + 3);
          c = a.indexOf("/");
          // eslint-disable-next-line
          if (0 <= c) a = a.substring(0, c);
        }

        const params: any = {
          pu: a,
          "if": b,
          rn: Math.floor(99999999 * Math.random()) + 1
        };
        
        const arr = [];
        for (const d in params) {
          arr.push(d + "=" + encodeURIComponent(params[d]));
        }
        
        return encodeURIComponent(arr.join("&"));
      } catch (e) {
        console.error("Error generating EZMob j-param", e);
        return "";
      }
    };

    const jParam = getJParameter();
    const scriptUrl = `//cpm.ezmob.com/tag?zone_id=${zoneId}&size=${size}&subid=${subId}&j=${jParam}`;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptUrl;
    script.async = true;

    adRef.current.appendChild(script);

    // Cleanup function
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [zoneId, size, subId]);

  return (
    <div 
      ref={adRef} 
      className={`flex items-center justify-center ${className}`}
      aria-label="Advertisement"
    />
  );
}
