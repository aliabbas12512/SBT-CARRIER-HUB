import React, { useEffect, useRef } from 'react';

export const AdBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Clear any existing content
    bannerRef.current.innerHTML = '';

    // Create script for atOptions configuration
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.text = `
      atOptions = {
        'key' : 'a5345d41bd616c9f96576f9fa59261c3',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    // Create script for Adsterra invoke.js
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://undergocutlery.com/a5345d41bd616c9f96576f9fa59261c3/invoke.js';
    invokeScript.async = true;

    const container = bannerRef.current;
    container.appendChild(confScript);
    container.appendChild(invokeScript);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center my-6 overflow-hidden">
      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
        Advertisement
      </span>
      <div
        ref={bannerRef}
        className="w-[300px] h-[250px] min-h-[250px] bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-center overflow-hidden text-center text-xs text-slate-500 shadow-inner"
      >
        {/* Adsterra iframe renders here */}
      </div>
    </div>
  );
};
