import React, { useEffect, useRef } from 'react';

interface AdNativeProps {
  id?: string;
  className?: string;
}

export const AdNative: React.FC<AdNativeProps> = ({
  id = 'container-45f9ec742643229727e4e14a7092ea0f',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const currentContainer = containerRef.current;
    currentContainer.innerHTML = '';

    // Create target container div with unique id
    const adTargetDiv = document.createElement('div');
    adTargetDiv.id = id;
    currentContainer.appendChild(adTargetDiv);

    // Create script tag
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://undergocutlery.com/45f9ec742643229727e4e14a7092ea0f/invoke.js';
    script.onerror = (e) => {
      console.warn('Adsterra native script failed to load or was blocked:', e);
    };

    currentContainer.appendChild(script);

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [id]);

  return (
    <div className={`w-full my-6 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
        Advertisement
      </span>
      <div
        ref={containerRef}
        className="w-full min-h-[100px] bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-center text-center text-xs text-slate-500 shadow-inner overflow-hidden"
      >
        {/* Adsterra native banner renders here */}
      </div>
    </div>
  );
};
