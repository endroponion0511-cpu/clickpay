import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LocaleProvider, useLocale } from './contexts/LocaleContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustSection } from './components/TrustSection';
import { ServicesSection } from './components/ServicesSection';
import { DirectionsSection } from './components/DirectionsSection';
import { CalculatorSection } from './components/CalculatorSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SecuritySection } from './components/SecuritySection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
import { MobileMessengerBar } from './components/MobileMessengerBar';
import { ChatWidget } from './components/ChatWidget';
import { AdminChatPage } from './pages/AdminChatPage';
import { SupabaseDiagnostic } from './pages/SupabaseDiagnostic';

function LandingPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-inter selection:bg-[#B6FF2E] selection:text-black">
      <Header />

      <main>
        <HeroSection />
        <TrustSection />
        <ServicesSection />
        <DirectionsSection />
        <CalculatorSection />
        <HowItWorksSection />
        <SecuritySection />
        <FAQSection />
        <CTASection />
      </main>

      <footer className="py-8 bg-[var(--bg-primary)] border-t border-[var(--border-color)] text-center text-[var(--text-muted)] text-sm pb-safe-footer lg:pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} ClickPay. {t.footer}</p>
          <Link
            to="/admin/chat"
            className="mt-2 inline-block text-[#B6FF2E] hover:underline text-xs"
          >
            {t.footerStaff}
          </Link>
        </div>
      </footer>

      <MobileMessengerBar />
      <ChatWidget />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/chat" element={<AdminChatPage />} />
            <Route path="/admin/diagnostic" element={<SupabaseDiagnostic />} />
          </Routes>
        </BrowserRouter>
      </LocaleProvider>
    </ThemeProvider>
  );
}