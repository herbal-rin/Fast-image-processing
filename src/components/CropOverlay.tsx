/**
 * 裁剪覆盖层组件
 * 在预览画布上显示裁剪区域选择
 */

import React, { useState, useRef, useEffect } from 'react';

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropOverlayProps {
  visible: boolean;
  cropRect: CropRect | null;
  onCropChange: (rect: CropRect | null) => void;
  onConfirm: () => void;
  onCancel: () => void;
  imageSize: { width: number; height: number } | null;
  canvasSize: { width: number; height: number };
  className?: string;
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  visible,
  cropRect,
  onCropChange,
  onConfirm,
  onCancel,
  imageSize,
  canvasSize,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // 计算图像在canvas中的显示区域
  const getImageDisplayArea = () => {
    if (!imageSize) return null;
    
    const { width: canvasWidth, height: canvasHeight } = canvasSize;
    const { width: imageWidth, height: imageHeight } = imageSize;
    
    const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);
    const displayWidth = imageWidth * scale;
    const displayHeight = imageHeight * scale;
    const x = (canvasWidth - displayWidth) / 2;
    const y = (canvasHeight - displayHeight) / 2;
    
    return { x, y, width: displayWidth, height: displayHeight, scale };
  };

  // 开始拖拽
  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
    if (!visible || !cropRect) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragHandle(handle || null);
  };

  // 拖拽中
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !cropRect || !imageSize) return;
    
    const imageArea = getImageDisplayArea();
    if (!imageArea) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    let newRect = { ...cropRect };
    
    if (dragHandle) {
      // 调整裁剪框大小
      const scale = imageArea.scale;
      const scaledDeltaX = deltaX / scale;
      const scaledDeltaY = deltaY / scale;
      
      switch (dragHandle) {
        case 'nw':
          newRect.x += scaledDeltaX;
          newRect.y += scaledDeltaY;
          newRect.width -= scaledDeltaX;
          newRect.height -= scaledDeltaY;
          break;
        case 'ne':
          newRect.y += scaledDeltaY;
          newRect.width += scaledDeltaX;
          newRect.height -= scaledDeltaY;
          break;
        case 'sw':
          newRect.x += scaledDeltaX;
          newRect.width -= scaledDeltaX;
          newRect.height += scaledDeltaY;
          break;
        case 'se':
          newRect.width += scaledDeltaX;
          newRect.height += scaledDeltaY;
          break;
      }
    } else {
      // 移动整个裁剪框
      const scale = imageArea.scale;
      newRect.x += deltaX / scale;
      newRect.y += deltaY / scale;
    }
    
    // 确保裁剪框在图像范围内
    newRect.x = Math.max(0, Math.min(newRect.x, imageSize.width - newRect.width));
    newRect.y = Math.max(0, Math.min(newRect.y, imageSize.height - newRect.height));
    newRect.width = Math.max(10, Math.min(newRect.width, imageSize.width - newRect.x));
    newRect.height = Math.max(10, Math.min(newRect.height, imageSize.height - newRect.y));
    
    onCropChange(newRect);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // 结束拖拽
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragHandle(null);
  };

  // 开始创建裁剪框
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!visible || !imageSize) return;
    
    const imageArea = getImageDisplayArea();
    if (!imageArea) return;
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left - imageArea.x;
    const y = e.clientY - rect.top - imageArea.y;
    
    if (x >= 0 && x <= imageArea.width && y >= 0 && y <= imageArea.height) {
      const scale = imageArea.scale;
      const startX = x / scale;
      const startY = y / scale;
      
      const newRect: CropRect = {
        x: startX,
        y: startY,
        width: 0,
        height: 0
      };
      
      onCropChange(newRect);
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragHandle('se');
    }
  };

  // 创建裁剪框
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !cropRect || !imageSize) return;
    
    const imageArea = getImageDisplayArea();
    if (!imageArea) return;
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left - imageArea.x;
    const y = e.clientY - rect.top - imageArea.y;
    
    if (x >= 0 && x <= imageArea.width && y >= 0 && y <= imageArea.height) {
      const scale = imageArea.scale;
      const currentX = x / scale;
      const currentY = y / scale;
      
      const newRect: CropRect = {
        x: Math.min(cropRect.x, currentX),
        y: Math.min(cropRect.y, currentY),
        width: Math.abs(currentX - cropRect.x),
        height: Math.abs(currentY - cropRect.y)
      };
      
      onCropChange(newRect);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragHandle(null);
    };
    
    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  if (!visible || !cropRect || !imageSize) return null;

  const imageArea = getImageDisplayArea();
  if (!imageArea) return null;

  const scale = imageArea.scale;
  const overlayX = imageArea.x + cropRect.x * scale;
  const overlayY = imageArea.y + cropRect.y * scale;
  const overlayWidth = cropRect.width * scale;
  const overlayHeight = cropRect.height * scale;

  return (
    <div
      ref={overlayRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 半透明遮罩 */}
      <div
        className="absolute bg-black bg-opacity-50"
        style={{
          left: imageArea.x,
          top: imageArea.y,
          width: imageArea.width,
          height: imageArea.height
        }}
      />
      
      {/* 裁剪区域 */}
      <div
        className="absolute border-2 border-blue-500 bg-transparent"
        style={{
          left: overlayX,
          top: overlayY,
          width: overlayWidth,
          height: overlayHeight
        }}
        onMouseDown={(e) => handleMouseDown(e)}
      >
        {/* 控制点 */}
        {['nw', 'ne', 'sw', 'se'].map((handle) => (
          <div
            key={handle}
            className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-pointer"
            style={{
              left: handle.includes('w') ? '-6px' : 'auto',
              right: handle.includes('e') ? '-6px' : 'auto',
              top: handle.includes('n') ? '-6px' : 'auto',
              bottom: handle.includes('s') ? '-6px' : 'auto'
            }}
            onMouseDown={(e) => handleMouseDown(e, handle)}
          />
        ))}
      </div>
      
      {/* 操作按钮 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          确认裁剪
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  );
};
