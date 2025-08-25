import React from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/login.png";

export default function LoginIconButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/login')}
      aria-label="Login"
      className="rounded-full shadow p-2 flex items-center justify-center"
      style={{ width: 44, height: 44, background: 'transparent' }}
    >
      <img
        src={loginImg}
        alt="Login"
        style={{ width: 32, height: 32, objectFit: 'contain', display: 'block', margin: 'auto' }}
      />
    </button>
  );
}
