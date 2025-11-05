/**
 * 滑块组件
 * 用于调整数值参数，支持滑块拖动和数值输入
 */

import React, { useState, useEffect } from 'react';

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  unit = '',
  disabled = false,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  // 当外部value变化时，更新inputValue（仅在未聚焦时）
  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString());
    }
  }, [value, isFocused]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    let newValue = parseFloat(inputValue);
    
    // 验证输入值
    if (isNaN(newValue)) {
      newValue = value; // 如果输入无效，恢复原值
    } else {
      // 限制在min和max范围内
      newValue = Math.max(min, Math.min(max, newValue));
      // 根据step进行舍入
      if (step !== 1) {
        newValue = Math.round(newValue / step) * step;
      }
    }
    
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // 按Enter时失去焦点，触发handleInputBlur
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = Math.min(max, value + step);
      onChange(newValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(min, value - step);
      onChange(newValue);
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className="w-16 px-2 py-0.5 text-sm text-right text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            />
            <span className="text-sm text-gray-500 min-w-[20px]">
              {unit}
            </span>
          </div>
        </div>
      )}
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
      </div>
    </div>
  );
};
