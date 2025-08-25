import React from "react";

export default function InfoButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Information"
      className="absolute top-4 right-4 z-50 bg-white rounded-full shadow p-2 hover:bg-gray-100"
      style={{ lineHeight: 0 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#2D5033" strokeWidth="2" fill="white" />
        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#2D5033" fontFamily="Arial" fontWeight="bold">i</text>
      </svg>
    </button>
  );
}
