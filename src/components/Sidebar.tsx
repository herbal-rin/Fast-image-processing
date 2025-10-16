/**
 * 侧边栏组件
 * 包含所有图像处理控件
 */

import React, { useState } from 'react';
import { Button } from './Button';
import { Slider } from './Slider';
import { Toggle } from './Toggle';
import { Toolbar } from './Toolbar';

export interface SidebarProps {
  hasImage: boolean;
  onImport: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onFilterChange: (type: string, value?: number) => void;
  onRotate: (angle: number) => void;
  onFlip: (horizontal: boolean) => void;
  onCropStart: () => void;
  onViewModeChange: (mode: 'fit' | '1:1' | 'fill') => void;
  onResetSliders?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  hasImage,
  onImport,
  onExport,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
  onFilterChange,
  onRotate,
  onFlip,
  onCropStart,
  onViewModeChange,
  onResetSliders,
  className = ''
}) => {
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [blurRadius, setBlurRadius] = useState(1);
  const [viewMode, setViewMode] = useState<'fit' | '1:1' | 'fill'>('fit');

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    onFilterChange('brightness', value);
  };

  const handleContrastChange = (value: number) => {
    setContrast(value);
    onFilterChange('contrast', value);
  };

  const handleSaturationChange = (value: number) => {
    setSaturation(value);
    onFilterChange('saturation', value);
  };

  const handleBlurChange = (value: number) => {
    setBlurRadius(value);
    onFilterChange('blur', value);
  };

  const handleViewModeChange = (mode: 'fit' | '1:1' | 'fill') => {
    setViewMode(mode);
    onViewModeChange(mode);
  };

  // 重置滑块状态
  const resetSliders = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setBlurRadius(1);
  };

  // 当重置按钮被点击时，同时重置滑块状态
  const handleReset = () => {
    resetSliders();
    onReset();
  };

  return (
    <div className={`w-80 bg-white border-r border-gray-200 p-6 space-y-6 overflow-y-auto ${className}`}>
      {/* 工具栏 */}
      <Toolbar
        onImport={onImport}
        onExport={onExport}
        onUndo={onUndo}
        onRedo={onRedo}
        onReset={handleReset}
        canUndo={canUndo}
        canRedo={canRedo}
        hasImage={hasImage}
      />

      {/* 视图模式 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">视图模式</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => handleViewModeChange('fit')}
            variant={viewMode === 'fit' ? 'primary' : 'ghost'}
            size="sm"
            disabled={!hasImage}
          >
            适配
          </Button>
          <Button
            onClick={() => handleViewModeChange('1:1')}
            variant={viewMode === '1:1' ? 'primary' : 'ghost'}
            size="sm"
            disabled={!hasImage}
          >
            1:1
          </Button>
          <Button
            onClick={() => handleViewModeChange('fill')}
            variant={viewMode === 'fill' ? 'primary' : 'ghost'}
            size="sm"
            disabled={!hasImage}
          >
            填充
          </Button>
        </div>
      </div>

      {/* 基础调整 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">基础调整</h3>
        
        <Slider
          value={brightness}
          min={-100}
          max={100}
          onChange={handleBrightnessChange}
          label="亮度"
          unit="%"
          disabled={!hasImage}
        />
        
        <Slider
          value={contrast}
          min={-100}
          max={100}
          onChange={handleContrastChange}
          label="对比度"
          unit="%"
          disabled={!hasImage}
        />
        
        <Slider
          value={saturation}
          min={-100}
          max={100}
          onChange={handleSaturationChange}
          label="饱和度"
          unit="%"
          disabled={!hasImage}
        />
      </div>

      {/* 滤镜效果 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">滤镜效果</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onFilterChange('grayscale')}
            variant="secondary"
            size="sm"
            disabled={!hasImage}
          >
            灰度
          </Button>
          <Button
            onClick={() => onFilterChange('invert')}
            variant="secondary"
            size="sm"
            disabled={!hasImage}
          >
            反相
          </Button>
        </div>
        
        <Slider
          value={blurRadius}
          min={1}
          max={10}
          step={0.5}
          onChange={handleBlurChange}
          label="模糊"
          unit="px"
          disabled={!hasImage}
        />
        
        <Button
          onClick={() => onFilterChange('sharpen')}
          variant="secondary"
          size="sm"
          className="w-full"
          disabled={!hasImage}
        >
          锐化
        </Button>
      </div>

      {/* 变换操作 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">变换操作</h3>
        
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => onRotate(90)}
              variant="secondary"
              size="sm"
              disabled={!hasImage}
            >
              90°
            </Button>
            <Button
              onClick={() => onRotate(180)}
              variant="secondary"
              size="sm"
              disabled={!hasImage}
            >
              180°
            </Button>
            <Button
              onClick={() => onRotate(270)}
              variant="secondary"
              size="sm"
              disabled={!hasImage}
            >
              270°
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onFlip(true)}
              variant="secondary"
              size="sm"
              disabled={!hasImage}
            >
              水平翻转
            </Button>
            <Button
              onClick={() => onFlip(false)}
              variant="secondary"
              size="sm"
              disabled={!hasImage}
            >
              垂直翻转
            </Button>
          </div>
          
          <Button
            onClick={onCropStart}
            variant="secondary"
            size="sm"
            className="w-full"
            disabled={!hasImage}
          >
            裁剪
          </Button>
        </div>
      </div>
    </div>
  );
};
