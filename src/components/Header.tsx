import React, { useEffect, useState } from 'react';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { Button } from './ui/Button';
import { useLocale } from '../contexts/LocaleContext';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.services, href: '#services' },
    { name: t.nav.directions, href: '#directions' },
    { name: t.nav.calculator, href: '#calculator' },
    { name: t.nav.howItWorks, href: '#how-it-works' },
    { name: t.nav.faq, href: '#faq' },
  ];

  const headerBg = isScrolled ? 'bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] py-3' : 'bg-transparent py-5';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="font-sora text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Click<span className="text-[#B6FF2E]">Pay</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[#B6FF2E] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setLocale(locale === 'ru' ? 'en' : 'ru')}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[#B6FF2E] hover:bg-[#B6FF2E]/10 transition-colors"
              title={locale === 'ru' ? 'English' : 'Русский'}
              aria-label="Switch language"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[#B6FF2E] hover:bg-[#B6FF2E]/10 transition-colors"
              title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Button
              size="sm"
              onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.cta}
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setLocale(locale === 'ru' ? 'en' : 'ru')}
              className="p-2.5 touch-target text-[var(--text-primary)] -mr-1"
              aria-label="Switch language"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2.5 touch-target text-[var(--text-primary)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[var(--text-primary)] hover:text-[#B6FF2E] p-2.5 touch-target"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] p-4 shadow-2xl">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-[var(--text-primary)] hover:text-[#B6FF2E] py-2 border-b border-[var(--border-color)]/50"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <Button
                fullWidth
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t.cta}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
