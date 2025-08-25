import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/login')}
      className="absolute top-4 right-4 z-50 bg-[#2D5033] text-white rounded px-4 py-2 shadow hover:bg-[#244026]"
      style={{ lineHeight: 0 }}
    >
      Login
    </button>
  );
}
