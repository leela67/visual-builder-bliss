import React from "react";
import infoImg from "../../assets/info.png";
import { useNavigate } from "react-router-dom";

export default function InfoIconButton({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={onClick ? onClick : () => navigate('/info')}
      aria-label="Information"
      className="rounded-full shadow p-2 mr-2 flex items-center justify-center"
      style={{ width: 44, height: 44, background: 'transparent' }}
    >
      <img
        src={infoImg}
        alt="Info"
        style={{ width: 32, height: 32, objectFit: 'contain', display: 'block', margin: 'auto' }}
      />
    </button>
  );
}
