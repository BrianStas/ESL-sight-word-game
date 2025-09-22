import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  className = '',
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white',
    success: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  };
  
  const sizes = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-3 px-6 text-base',
    large: 'py-4 px-8 text-xl'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;