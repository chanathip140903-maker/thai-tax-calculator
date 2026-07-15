import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none cursor-pointer border-2 ${
        theme === 'light'
          ? 'bg-white border-black'
          : 'bg-black border-white'
      }`}
      title={theme === 'light' ? 'เปลี่ยนเป็นโหมดมืด' : 'เปลี่ยนเป็นโหมดสว่าง'}
    >
      {/* Background Icons (visible when knob is on the opposite side) */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Moon className={`w-3.5 h-3.5 transition-opacity duration-300 ${theme === 'light' ? 'opacity-40 text-black' : 'opacity-0'}`} />
        <Sun className={`w-3.5 h-3.5 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-40 text-white' : 'opacity-0'}`} />
      </div>

      {/* Sliding Knob containing active icon */}
      <span
        className={`absolute top-[2px] left-[2px] w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${
          theme === 'light'
            ? 'translate-x-[28px] bg-black text-white'
            : 'translate-x-0 bg-black border-2 border-white text-white'
        }`}
      >
        {theme === 'light' ? (
          <Sun className="w-3.5 h-3.5 fill-white text-white animate-spin-slow" />
        ) : (
          <Moon className="w-3.5 h-3.5 fill-white text-white" />
        )}
      </span>
    </button>
  );
}
