import React from "react";
import infoImg from "../assets/info.png";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col items-center" style={{ position: "relative" }}>
      <header className="bg-card shadow-card border-b border-border w-full">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mx-auto">About Us</h1>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center w-full px-4 py-8 flex-1">
        <img src={infoImg} alt="Info" className="w-24 h-24 mb-8 mx-auto" style={{ objectFit: 'contain' }} />
        <div className="max-w-xl w-full text-center mx-auto">
          <p className="text-lg mb-8">
            This is a recipes application. Anyone can submit their recipes. App helps in finding best recipes based on ingredients available.
          </p>
          <p className="text-lg mb-2">
            For any queries if you want to sell anything thru us contact us on
          </p>
          <p className="text-lg font-medium text-[#2D5033]">john@example.com</p>
          <p className="text-lg font-medium text-[#2D5033]">1123456678</p>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
