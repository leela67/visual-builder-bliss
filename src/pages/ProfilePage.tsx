
import React from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import BackIconButton from "../components/ui/BackIconButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import LoginIconButton from "../components/ui/LoginIconButton";
import BottomNavigation from "@/components/BottomNavigation";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col" style={{ position: "relative" }}>
      <header className="bg-card shadow-card border-b border-border w-full">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Profile</h1>
            <div className="flex ml-auto gap-2">
              <InfoIconButton />
              <LoginIconButton />
            </div>
          </div>
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
      <BottomNavigation />
    </div>
  );
}
