"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-card border border-border/50 shadow-2xl rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold">Cookie Consent</h3>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          We use cookies to enhance your experience, analyze site traffic, and support our community. 
          By clicking "Accept All", you consent to our use of cookies. Read our{" "}
          <Link href="/legal/cookies" className="text-primary hover:underline">
            Cookie Policy
          </Link>{" "}
          to learn more.
        </p>
        <div className="flex gap-3">
          <Button onClick={acceptCookies} className="flex-1 bg-purple-600 hover:bg-purple-700">
            Accept All
          </Button>
          <Button onClick={declineCookies} variant="outline" className="flex-1">
            Reject Non-Essential
          </Button>
        </div>
      </div>
    </div>
  );
}
