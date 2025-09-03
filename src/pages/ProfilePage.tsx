
import React from "react";
import BackIconButton from "../components/ui/BackIconButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import InfoIconButton from "../components/ui/InfoIconButton";
import beingHomeLogo from "/beinghomelogo.jpeg";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col" style={{ position: "relative" }}>
      <header className="bg-card shadow-card border-b border-border w-full">
        <div className="px-4 py-4">
          {/* Logo and Info Button Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Being Home Logo - Extreme Left */}
            <img 
              src={beingHomeLogo}
              alt="Being Home Logo" 
              className="h-10 sm:h-12 md:h-15 w-auto object-contain max-w-[140px] sm:max-w-[180px] md:max-w-[220px]"
              style={{ 
                transform: 'scale(1.8, 1.4)',
                transformOrigin: 'left center'
              }}
              onError={(e) => {
                console.error('Logo failed to load from:', beingHomeLogo);
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Info Button - Extreme Right */}
            <InfoIconButton />
          </div>
          
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center w-full px-4 py-8">
        <div className="bg-white rounded-xl shadow p-6 sm:p-8 w-full max-w-sm flex flex-col items-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: "#2D5033" }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="white" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="white" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">John Doe</h2>
          <div className="w-full text-left mb-6">
            <div className="mb-2">
              <span className="font-semibold">Name</span><br />
              <span className="text-muted-foreground">John Doe</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Phone Number</span><br />
              <span className="text-muted-foreground">1123456678</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Email</span><br />
              <span className="text-muted-foreground">john@example.com</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Language</span><br />
              <span className="text-muted-foreground">English</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Address</span><br />
              <span className="text-muted-foreground">123 Main St, Boston</span>
            </div>
          </div>
          <button className="w-full py-3 rounded bg-[#2D5033] text-white font-semibold text-lg mt-2">
            Logout
          </button>
        </div>
      </main>
      
      {/* Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <BottomNavigation />
      </div>
    </div>
  );
}
