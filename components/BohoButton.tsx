
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BohoButtonProps {
  label: string;
  icon: string;
  variant?: 'primary' | 'secondary';
  to?: string;
  onClick?: () => void;
  className?: string;
}

const BohoButton: React.FC<BohoButtonProps> = ({ 
  label, 
  icon, 
  variant = 'secondary', 
  to, 
  onClick,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    if (onClick) onClick();
  };

  const baseStyles = "group relative flex items-center justify-center w-full h-14 rounded-xl shadow-md transition-all duration-200 active:scale-95";
  const variants = {
    primary: "bg-primary text-white shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5",
    secondary: "bg-[#f2efe9] text-[#2c1810] border-2 border-[#e6e1d6] hover:border-primary hover:text-primary"
  };

  return (
    <button onClick={handleClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      <span className="material-symbols-outlined mr-3 text-[22px]">{icon}</span>
      <span className="text-base font-bold tracking-wide">{label}</span>
    </button>
  );
};

export default BohoButton;
