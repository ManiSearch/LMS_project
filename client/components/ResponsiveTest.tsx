import { useEffect, useState } from 'react';

export function ResponsiveTest() {
  const [screenSize, setScreenSize] = useState('');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize(`Mobile (${width}px)`);
      } else if (width < 768) {
        setScreenSize(`Small Tablet (${width}px)`);
      } else if (width < 1024) {
        setScreenSize(`Tablet (${width}px)`);
      } else if (width < 1280) {
        setScreenSize(`Laptop (${width}px)`);
      } else if (width < 1536) {
        setScreenSize(`Desktop (${width}px)`);
      } else {
        setScreenSize(`Large Desktop (${width}px)`);
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono z-50 sm:hidden lg:block">
      {screenSize}
    </div>
  );
}
