"use client";

import Footer from "../components/layout/Footer";
import NavbarLanding from "../components/layout/navbarlanding";
import { ChatBotButton } from "../components/chatbot/ChatBotButton";
import HeroSection from "../components/landing/HeroSection";
import KeyMetricsSection from "../components/landing/KeyMetricsSection";
import BenefitsSection from "../components/landing/BenefitsSection";
import ProcessSection from "../components/landing/ProcessSection";
import FaqAndContactSection from "../components/landing/FaqAndContactSection";
import CTASection from "../components/landing/CTASection";
import ContactSection from "../components/landing/ContactSection";

export default function Home() {
  return (
    <>
      <NavbarLanding />
      <HeroSection />
      <KeyMetricsSection />
      <div className="flex-1 w-full flex flex-col items-center max-w-6xl mx-auto px-4 md:px-6 bg-gray-50">
        <BenefitsSection />
        <ProcessSection />
        <FaqAndContactSection />
        <CTASection />
      </div>
      <ContactSection />
      <ChatBotButton />
      <Footer />
    </>
  );
}
