import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "flex items-center justify-center w-full px-4 py-3 font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]";

  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-500 focus:ring-green-500 disabled:bg-green-600',
    secondary: 'bg-gray-600 text-gray-200 hover:bg-gray-500 focus:ring-gray-500 disabled:bg-gray-600',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};