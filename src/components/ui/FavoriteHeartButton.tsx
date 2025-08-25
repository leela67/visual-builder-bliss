import React, { useState } from "react";

export default function FavoriteHeartButton() {
  const [favorited, setFavorited] = useState(false);
  return (
    <button
      type="button"
      aria-label="Favorite"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        setFavorited(f => !f);
      }}
      className="absolute top-2 right-2 z-10"
      style={{ background: 'transparent', border: 'none', padding: 0 }}
    >
      <svg
        width={32}
        height={32}
        viewBox="0 0 24 24"
        fill={favorited ? "#e63946" : "white"}
        stroke="#2D5033"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
      >
        <path d="M12 21s-6.5-5.2-8.5-8.1C2.1 10.1 3.6 7 6.5 7c1.7 0 3.1 1.1 3.8 2.7C11.4 8.1 12.8 7 14.5 7c2.9 0 4.4 3.1 3 5.9-2 2.9-8.5 8.1-8.5 8.1z" />
      </svg>
    </button>
  );
}
