import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackIconButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      aria-label="Back"
      className="rounded-full shadow p-2 mr-2 flex items-center justify-center"
      style={{ width: 44, height: 44, background: 'transparent' }}
    >
      <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#2D5033" />
        <path d="M60 50H40M50 40L40 50L50 60" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
