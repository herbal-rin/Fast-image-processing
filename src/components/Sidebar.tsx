/**
 * 侧边栏组件
 * 包含所有图像处理控件
 */

import React, { useState } from 'react';
import { Button } from './Button';
import { Slider } from './Slider';
import { Toolbar } from './Toolbar';
import { Histogram, HistogramData } from './Histogram';

export interface SidebarProps {
  hasImage: boolean;
  onImport: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onFilterChange: (type: string, value?: number, extraParams?: { r?: number; g?: number; b?: number; strength?: number; mode?: 'luminance' | 'rgb'; sigma?: number; radius?: number }) => void;
  onRotate: (angle: number) => void;
  onFlip: (horizontal: boolean) => void;
  onCropStart: () => void;
  onViewModeChange: (mode: 'fit' | '1:1' | 'fill') => void;
  histogramData?: HistogramData | null;
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
  histogramData,
  className = ''
}) => {
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [blurRadius, setBlurRadius] = useState(0);
  const [rgbR, setRgbR] = useState(0);
  const [rgbG, setRgbG] = useState(0);
  const [rgbB, setRgbB] = useState(0);
  const [histEqStrength, setHistEqStrength] = useState(0);
  const [histEqMode, setHistEqMode] = useState<'luminance' | 'rgb'>('luminance');
  const [showHistogram, setShowHistogram] = useState(false);
  const [viewMode, setViewMode] = useState<'fit' | '1:1' | 'fill'>('fit');
  
  // 高级滤镜参数
  const [medianRadius, setMedianRadius] = useState(0);
  const [gaussianSigma, setGaussianSigma] = useState(0);
  const [sharpenStrength, setSharpenStrength] = useState(0);

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
    onFilterChange('blur', value, { radius: value } as any);
  };

  const handleRGBChange = (channel: 'r' | 'g' | 'b', value: number) => {
    if (channel === 'r') setRgbR(value);
    else if (channel === 'g') setRgbG(value);
    else setRgbB(value);
    
    // 获取当前所有RGB值
    const currentR = channel === 'r' ? value : rgbR;
    const currentG = channel === 'g' ? value : rgbG;
    const currentB = channel === 'b' ? value : rgbB;
    
    // 调用onFilterChange，传递所有RGB参数
    onFilterChange('adjustRGB', undefined, { r: currentR, g: currentG, b: currentB });
  };

  const handleViewModeChange = (mode: 'fit' | '1:1' | 'fill') => {
    setViewMode(mode);
    onViewModeChange(mode);
  };

  const handleHistEqStrengthChange = (value: number) => {
    setHistEqStrength(value);
    onFilterChange('histogramEqualization', undefined, { strength: value, mode: histEqMode });
  };

  const handleHistEqModeChange = (mode: 'luminance' | 'rgb') => {
    setHistEqMode(mode);
    onFilterChange('histogramEqualization', undefined, { strength: histEqStrength, mode });
  };

  // 高级滤镜处理函数
  const handleMedianFilterChange = (value: number) => {
    setMedianRadius(value);
    onFilterChange('medianFilter', value);
  };

  const handleGaussianBlurChange = (value: number) => {
    setGaussianSigma(value);
    onFilterChange('gaussianBlur', undefined, { sigma: value } as any);
  };

  const handleSharpenChange = (value: number) => {
    setSharpenStrength(value);
    onFilterChange('sharpen', value);
  };

  // 重置滑块状态
  const resetSliders = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setBlurRadius(0);
    setRgbR(0);
    setRgbG(0);
    setRgbB(0);
    setHistEqStrength(0);
    setHistEqMode('luminance');
    setMedianRadius(0);
    setGaussianSigma(0);
    setSharpenStrength(0);
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

      {/* RGB通道调节 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">RGB通道调节</h3>
        
        <Slider
          value={rgbR}
          min={-100}
          max={100}
          onChange={(value) => handleRGBChange('r', value)}
          label="红色(R)"
          unit="%"
          disabled={!hasImage}
        />
        
        <Slider
          value={rgbG}
          min={-100}
          max={100}
          onChange={(value) => handleRGBChange('g', value)}
          label="绿色(G)"
          unit="%"
          disabled={!hasImage}
        />
        
        <Slider
          value={rgbB}
          min={-100}
          max={100}
          onChange={(value) => handleRGBChange('b', value)}
          label="蓝色(B)"
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
          min={0}
          max={10}
          step={0.5}
          onChange={handleBlurChange}
          label="模糊"
          unit="px"
          disabled={!hasImage}
        />
        
        <Slider
          value={sharpenStrength}
          min={0}
          max={100}
          step={1}
          onChange={handleSharpenChange}
          label="锐化"
          unit="%"
          disabled={!hasImage}
        />
      </div>

      {/* 直方图均衡 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-900">直方图均衡</h3>
          <Button
            onClick={() => setShowHistogram(!showHistogram)}
            variant="ghost"
            size="sm"
            disabled={!hasImage}
          >
            {showHistogram ? '隐藏' : '显示'}直方图
          </Button>
        </div>

        {showHistogram && histogramData && (
          <Histogram
            data={histogramData}
            width={256}
            height={120}
            showRGB={true}
            showGray={true}
          />
        )}

        <Slider
          value={histEqStrength}
          min={0}
          max={100}
          onChange={handleHistEqStrengthChange}
          label="均衡强度"
          unit="%"
          disabled={!hasImage}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">均衡模式</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handleHistEqModeChange('luminance')}
              variant={histEqMode === 'luminance' ? 'primary' : 'secondary'}
              size="sm"
              disabled={!hasImage}
            >
              亮度模式
            </Button>
            <Button
              onClick={() => handleHistEqModeChange('rgb')}
              variant={histEqMode === 'rgb' ? 'primary' : 'secondary'}
              size="sm"
              disabled={!hasImage}
            >
              RGB模式
            </Button>
          </div>
        </div>
      </div>

      {/* 高级滤镜 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">高级滤镜</h3>
        
        {/* 平滑算子 */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-600">平滑算子</h4>
          
          <Slider
            value={medianRadius}
            min={0}
            max={3}
            step={1}
            onChange={handleMedianFilterChange}
            label="中值滤波"
            unit="px"
            disabled={!hasImage}
          />
          
          <Slider
            value={gaussianSigma}
            min={0}
            max={3}
            step={0.1}
            onChange={handleGaussianBlurChange}
            label="高斯模糊"
            unit="σ"
            disabled={!hasImage}
          />
        </div>

        {/* 锐化算子 */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600">锐化算子</h4>
          <Button
            onClick={() => onFilterChange('laplacianSharpen')}
            variant="secondary"
            size="sm"
            className="w-full"
            disabled={!hasImage}
          >
            Laplacian锐化
          </Button>
        </div>

        {/* 边缘检测算子 */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600">边缘检测</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onFilterChange('sobelEdge')}
              variant="secondary"
              size="sm"
              disabled={!hasImage}
            >
              Sobel
            </Button>
            <Button
              onClick={() => onFilterChange('prewittEdge')}
              variant="secondary"
              size="sm"
              disabled={!hasImage}
            >
              Prewitt
            </Button>
          </div>
          <Button
            onClick={() => onFilterChange('robertsEdge')}
            variant="secondary"
            size="sm"
            className="w-full"
            disabled={!hasImage}
          >
            Roberts
          </Button>
        </div>
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
