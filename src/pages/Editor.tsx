/**
 * 主编辑器页面
 * 整合所有组件，提供完整的图像编辑功能
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { CropOverlay } from '../components/CropOverlay';
import { CanvasManager } from '../canvas/useCanvas';
import { generateFilename, debounce } from '../utils/image';

export const Editor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasManagerRef = useRef<CanvasManager | null>(null);
  
  const [hasImage, setHasImage] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [historyInfo, setHistoryInfo] = useState({ canUndo: false, canRedo: false });
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [histogramData, setHistogramData] = useState<{ r: number[]; g: number[]; b: number[]; gray: number[] } | null>(null);
  const [compareMode, setCompareMode] = useState<'processed' | 'original' | 'split'>('processed');

  // 初始化Canvas管理器
  useEffect(() => {
    if (canvasRef.current && !canvasManagerRef.current) {
      canvasManagerRef.current = new CanvasManager(canvasRef.current);
    }
  }, []);

  // 监听对比模式变化
  useEffect(() => {
    if (canvasManagerRef.current && hasImage) {
      canvasManagerRef.current.updatePreview(compareMode);
    }
  }, [compareMode, hasImage]);

  // 更新历史记录信息
  const updateHistoryInfo = useCallback(() => {
    if (canvasManagerRef.current) {
      const info = canvasManagerRef.current.getHistoryInfo();
      setHistoryInfo({
        canUndo: info.canUndo,
        canRedo: info.canRedo
      });
    }
  }, []);

  // 更新直方图数据
  const updateHistogramData = useCallback(() => {
    try {
      if (canvasManagerRef.current) {
        const data = canvasManagerRef.current.getHistogramData();
        setHistogramData(data);
      }
    } catch (error) {
      console.error('更新直方图数据失败:', error);
      // 不抛出错误，避免影响图像导入
    }
  }, []);

  // 防抖的滤镜应用函数
  const debouncedApplyFilter = useCallback(
    debounce((type: string, value?: number, extraParams?: { r?: number; g?: number; b?: number; strength?: number; mode?: 'luminance' | 'rgb'; sigma?: number; radius?: number }, currentCompareMode?: 'processed' | 'original' | 'split') => {
      if (canvasManagerRef.current) {
        canvasManagerRef.current.applyFilter({ type, value, ...extraParams });
        // 应用滤镜后，根据当前对比模式更新预览
        if (currentCompareMode) {
          canvasManagerRef.current.updatePreview(currentCompareMode);
        }
        updateHistoryInfo();
        updateHistogramData();
      }
    }, 200),
    [updateHistoryInfo, updateHistogramData]
  );

  // 处理文件导入
  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 处理文件选择
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvasManagerRef.current) return;

    try {
      await canvasManagerRef.current.loadImage(file);
      setHasImage(true);
      setImageSize(canvasManagerRef.current.getImageSize());
      updateHistoryInfo();
      
      // 更新直方图数据（延迟执行，确保图像已完全加载）
      setTimeout(() => {
        updateHistogramData();
      }, 100);
    } catch (error) {
      console.error('导入图片失败:', error);
      alert('导入图片失败，请检查文件格式');
    }
  }, [updateHistoryInfo, updateHistogramData]);

  // 处理拖拽
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile && canvasManagerRef.current) {
      try {
        await canvasManagerRef.current.loadImage(imageFile);
        setHasImage(true);
        setImageSize(canvasManagerRef.current.getImageSize());
        updateHistoryInfo();
        
        // 更新直方图数据（延迟执行，确保图像已完全加载）
        setTimeout(() => {
          updateHistogramData();
        }, 100);
      } catch (error) {
        console.error('导入图片失败:', error);
        alert('导入图片失败，请检查文件格式');
      }
    }
  }, [updateHistoryInfo, updateHistogramData]);

  // 导出图片
  const handleExport = useCallback(() => {
    if (!canvasManagerRef.current || !hasImage) return;

    try {
      const filename = generateFilename('edited_image', 'png');
      canvasManagerRef.current.downloadImage(filename, 'png', 0.9);
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出图片失败');
    }
  }, [hasImage]);

  // 撤销操作
  const handleUndo = useCallback(() => {
    if (canvasManagerRef.current) {
      const success = canvasManagerRef.current.undo();
      if (success) {
        updateHistoryInfo();
      }
    }
  }, [updateHistoryInfo]);

  // 重做操作
  const handleRedo = useCallback(() => {
    if (canvasManagerRef.current) {
      const success = canvasManagerRef.current.redo();
      if (success) {
        updateHistoryInfo();
      }
    }
  }, [updateHistoryInfo]);

  // 重置操作
  const handleReset = useCallback(() => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.reset();
      setImageSize(canvasManagerRef.current.getImageSize());
      updateHistoryInfo();
    }
  }, [updateHistoryInfo]);

  // 滤镜变化
  const handleFilterChange = useCallback((type: string, value?: number, extraParams?: { r?: number; g?: number; b?: number; strength?: number; mode?: 'luminance' | 'rgb'; sigma?: number; radius?: number }) => {
    debouncedApplyFilter(type, value, extraParams, compareMode);
  }, [debouncedApplyFilter, compareMode]);

  // 旋转操作
  const handleRotate = useCallback((angle: number) => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.rotate(angle);
      setImageSize(canvasManagerRef.current.getImageSize());
      updateHistoryInfo();
    }
  }, [updateHistoryInfo]);

  // 翻转操作
  const handleFlip = useCallback((horizontal: boolean) => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.flip(horizontal);
      updateHistoryInfo();
    }
  }, [updateHistoryInfo]);

  // 开始裁剪
  const handleCropStart = useCallback(() => {
    setIsCropping(true);
    if (canvasManagerRef.current && imageSize) {
      // 设置默认裁剪区域为图像中心区域
      const centerX = imageSize.width * 0.25;
      const centerY = imageSize.height * 0.25;
      const centerWidth = imageSize.width * 0.5;
      const centerHeight = imageSize.height * 0.5;
      
      const rect = {
        x: centerX,
        y: centerY,
        width: centerWidth,
        height: centerHeight
      };
      
      setCropRect(rect);
      canvasManagerRef.current.setCropRect(rect);
    }
  }, [imageSize]);

  // 裁剪变化
  const handleCropChange = useCallback((rect: typeof cropRect) => {
    setCropRect(rect);
    if (canvasManagerRef.current) {
      canvasManagerRef.current.setCropRect(rect);
    }
  }, []);

  // 确认裁剪
  const handleCropConfirm = useCallback(() => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.confirmCrop();
      setImageSize(canvasManagerRef.current.getImageSize());
      setIsCropping(false);
      setCropRect(null);
      updateHistoryInfo();
    }
  }, [updateHistoryInfo]);

  // 取消裁剪
  const handleCropCancel = useCallback(() => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.cancelCrop();
      setIsCropping(false);
      setCropRect(null);
    }
  }, []);

  // 视图模式变化
  const handleViewModeChange = useCallback((mode: 'fit' | '1:1' | 'fill') => {
    if (canvasManagerRef.current) {
      canvasManagerRef.current.setViewMode({ type: mode, scale: 1 });
    }
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              handleRedo();
            } else {
              e.preventDefault();
              handleUndo();
            }
            break;
          case 's':
            e.preventDefault();
            handleExport();
            break;
          case 'r':
            e.preventDefault();
            handleReset();
            break;
        }
      }
      
      if (e.key === 'Escape' && isCropping) {
        handleCropCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleExport, handleReset, isCropping, handleCropCancel]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <Sidebar
        hasImage={hasImage}
        onImport={handleImport}
        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        canUndo={historyInfo.canUndo}
        canRedo={historyInfo.canRedo}
        onFilterChange={handleFilterChange}
        onRotate={handleRotate}
        onFlip={handleFlip}
        onCropStart={handleCropStart}
        onViewModeChange={handleViewModeChange}
        histogramData={histogramData}
      />

      {/* 主画布区域 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="max-w-full max-h-full shadow-lg"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          
          {/* 裁剪覆盖层 */}
          <CropOverlay
            visible={isCropping}
            cropRect={cropRect}
            onCropChange={handleCropChange}
            onConfirm={handleCropConfirm}
            onCancel={handleCropCancel}
            imageSize={imageSize}
            canvasSize={{ width: 800, height: 600 }}
          />
        </div>

        {/* 对比模式按钮 */}
        {hasImage && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setCompareMode('processed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                compareMode === 'processed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              处理后
            </button>
            <button
              onClick={() => setCompareMode('original')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                compareMode === 'original'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              原图
            </button>
            <button
              onClick={() => setCompareMode('split')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                compareMode === 'split'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              对比
            </button>
          </div>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
