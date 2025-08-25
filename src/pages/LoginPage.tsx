import React, { useState } from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import BackIconButton from "../components/ui/BackIconButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            <h1 className="text-xl font-semibold text-foreground">Login</h1>
            <div className="flex ml-auto gap-2">
              <InfoIconButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center w-full px-4 py-8">
        <div className="bg-white rounded-xl shadow p-6 sm:p-8 w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
          <form className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded mb-2 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded mb-2 focus:outline-none"
            />
            <div className="text-right text-sm text-muted-foreground mb-4">
              <a href="#" className="hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded bg-[#2D5033] text-white font-semibold text-lg"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            New user?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
