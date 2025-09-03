import React from "react";
import infoImg from "../../assets/info.png";
import { useNavigate } from "react-router-dom";

export default function InfoIconButton({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={onClick ? onClick : () => navigate('/info')}
      aria-label="Information"
      className="rounded-full shadow p-2 mr-2 flex items-center justify-center touch-manipulation active:scale-95 transition-transform duration-150"
      style={{ width: 44, height: 44, background: 'transparent' }}
    >
      <img
        src={infoImg}
        alt="Info"
        className="w-6 h-6 sm:w-8 sm:h-8 object-contain block mx-auto"
      />
    </button>
  );
}
