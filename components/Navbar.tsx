"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { CLINIC_NAME, CONTACT_INFO } from "@/lib/constants";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Despre Noi", href: "#about" },
    { name: "Servicii", href: "#services" },
    { name: "Cazuri Clinice", href: "#beforeafter" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link
          href="#"
          className={`font-primary text-xl sm:text-2xl font-bold tracking-tight shrink-0 transition-colors ${
            isScrolled ? "text-[var(--color-brand-black)]" : "text-white"
          }`}
        >
          {CLINIC_NAME}
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`${
                isScrolled ? "text-[var(--color-brand-black)]" : "text-white"
              } font-medium hover:text-[var(--color-brand-teal)] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--color-brand-teal)] hover:after:w-full after:transition-all`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div
            className={`flex items-center gap-2 font-semibold ${isScrolled ? "text-[var(--color-brand-black)]" : "text-white"}`}
          >
            <Phone className="w-5 h-5 text-[var(--color-brand-teal)]" />
            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}>{CONTACT_INFO.phone}</a>
          </div>
          <a
            href="#contact"
            className="bg-[var(--color-brand-teal)] text-white px-6 py-3 rounded-full uppercase font-semibold text-sm hover:brightness-90 transition-all"
          >
            Consultație Gratuită
          </a>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <a
            href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
            className={`flex items-center gap-1 text-xs font-semibold ${isScrolled ? "text-[var(--color-brand-black)]" : "text-white"}`}
          >
            <Phone className="w-3.5 h-3.5 text-[var(--color-brand-teal)]" />
            <span>{CONTACT_INFO.phone}</span>
          </a>
          <button
            className={`${isScrolled ? "text-[var(--color-brand-black)]" : "text-white"} p-1`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 border-t border-[var(--color-brand-muted)]">
          <div className="flex flex-col px-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[var(--color-brand-black)] font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="#contact"
              className="bg-[var(--color-brand-teal)] text-white px-6 py-3 rounded-full uppercase font-semibold text-sm text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Consultație Gratuită
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
