/**
 * 切换开关组件
 * 用于布尔值切换
 */

import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
    lg: 'w-12 h-6'
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0',
    md: checked ? 'translate-x-5' : 'translate-x-0',
    lg: checked ? 'translate-x-6' : 'translate-x-0'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            ${sizeClasses[size]}
            ${checked ? 'bg-blue-600' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            rounded-full transition-colors duration-200 ease-in-out
          `}
          onClick={() => !disabled && onChange(!checked)}
        >
          <div
            className={`
              ${thumbSizeClasses[size]}
              ${translateClasses[size]}
              bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out
            `}
          />
        </div>
      </div>
      
      {label && (
        <label className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
    </div>
  );
};
