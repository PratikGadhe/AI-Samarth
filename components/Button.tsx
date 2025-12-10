import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-4 px-6 rounded-xl font-bold text-lg transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:ring-4 focus:ring-yellow-400";
  
  const variants = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-yellow-400",
    secondary: "bg-gray-700 text-white hover:bg-gray-600 border-2 border-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-500 border-2 border-red-400",
    outline: "bg-transparent text-yellow-400 border-2 border-yellow-400 hover:bg-gray-800"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;