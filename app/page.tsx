"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Handshake,
  TrendingUp,
  Zap,
  UserPlus,
  ClipboardCheck,
  HomeIcon,
  Mail,
  MessageCircle,
  Phone,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import NavbarLanding from "@/components/layout/navbarlanding";
import { ChatBotButton } from "@/components/chatbot/ChatBotButton";
import ContactSection from "@/components/landing/ContactSection";

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
