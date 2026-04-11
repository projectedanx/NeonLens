import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-textMuted mb-1.5">{label}</label>}
      <input
        className={`w-full bg-surface border ${error ? 'border-red-500' : 'border-border'} rounded-md px-4 py-2.5 text-textMain placeholder-textMuted/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export const TextArea: React.FC<InputHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-textMuted mb-1.5">{label}</label>}
      <textarea
        className={`w-full bg-surface border ${error ? 'border-red-500' : 'border-border'} rounded-md px-4 py-2.5 text-textMain placeholder-textMuted/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all min-h-[120px] ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
