
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "px-4 py-3 rounded-2xl font-black uppercase text-xs tracking-tight transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "app-bg-primary text-white shadow-lg shadow-indigo-500/10",
    secondary: "app-surface app-text border app-border hover:brightness-95",
    danger: "bg-red-500 text-white shadow-lg shadow-red-500/10",
    ghost: "bg-transparent hover:bg-black/5"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
