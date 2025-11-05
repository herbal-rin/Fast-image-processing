/**
 * 直方图显示组件
 * 显示RGB和灰度直方图
 */

import React, { useRef, useEffect } from 'react';

export interface HistogramData {
  r: number[];
  g: number[];
  b: number[];
  gray: number[];
}

export interface HistogramProps {
  data: HistogramData | null;
  width?: number;
  height?: number;
  showRGB?: boolean;
  showGray?: boolean;
  className?: string;
}

export const Histogram: React.FC<HistogramProps> = ({
  data,
  width = 256,
  height = 150,
  showRGB = true,
  showGray = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);

    // 找到最大值用于归一化
    const maxR = Math.max(...data.r);
    const maxG = Math.max(...data.g);
    const maxB = Math.max(...data.b);
    const maxGray = Math.max(...data.gray);
    const maxValue = Math.max(maxR, maxG, maxB, maxGray);

    if (maxValue === 0) return;

    // 绘制网格线
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // 水平网格线
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 垂直网格线
    for (let i = 0; i <= 4; i++) {
      const x = (width / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 绘制直方图的函数
    const drawHistogram = (histData: number[], color: string, alpha: number = 0.6) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * width;
        const normalizedValue = histData[i] / maxValue;
        const y = height - (normalizedValue * height);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // 绘制轮廓线
      ctx.globalAlpha = 1;
      ctx.beginPath();
      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * width;
        const normalizedValue = histData[i] / maxValue;
        const y = height - (normalizedValue * height);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    // 绘制RGB直方图
    if (showRGB) {
      drawHistogram(data.r, '#ef4444', 0.3); // 红色
      drawHistogram(data.g, '#22c55e', 0.3); // 绿色
      drawHistogram(data.b, '#3b82f6', 0.3); // 蓝色
    }

    // 绘制灰度直方图
    if (showGray) {
      drawHistogram(data.gray, '#6b7280', 0.5); // 灰色
    }

    // 重置透明度
    ctx.globalAlpha = 1;

  }, [data, width, height, showRGB, showGray]);

  return (
    <div className={`${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded bg-gray-50"
      />
      {showRGB && (
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">红色</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">绿色</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">蓝色</span>
          </div>
          {showGray && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span className="text-gray-600">灰度</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

