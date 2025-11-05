/**
 * 图像滤镜处理模块
 * 提供各种图像处理滤镜算法，基于ImageData进行像素级操作
 */

import * as advancedFilters from './advancedFilters';

export interface FilterParams {
  type: string;
  value?: number;
  radius?: number;
  cropRect?: { x: number; y: number; width: number; height: number };
  r?: number;
  g?: number;
  b?: number;
  strength?: number; // 直方图均衡强度
  mode?: 'luminance' | 'rgb'; // 直方图均衡模式
  sigma?: number; // 高斯模糊的标准差
}

/**
 * 应用滤镜到ImageData
 * @param imageData 原始图像数据
 * @param params 滤镜参数
 * @returns 处理后的ImageData
 */
export function applyFilter(imageData: ImageData, params: FilterParams): ImageData {
  const { type, value = 0, radius = 1, cropRect, r = 0, g = 0, b = 0, strength = 100, mode = 'luminance', sigma = 1.0 } = params;
  
  switch (type) {
    case 'grayscale':
      return grayscale(imageData);
    case 'invert':
      return invert(imageData);
    case 'brightness':
      return brightness(imageData, value);
    case 'contrast':
      return contrast(imageData, value);
    case 'saturation':
      return saturation(imageData, value);
    case 'adjustRGB':
      return adjustRGB(imageData, r, g, b);
    case 'blur':
      return blur(imageData, radius);
    case 'sharpen':
      return sharpen(imageData);
    case 'histogramEqualization':
      return histogramEqualization(imageData, strength, mode);
    // 高级滤镜
    case 'medianFilter':
      return advancedFilters.medianFilter(imageData, radius);
    case 'gaussianBlur':
      return advancedFilters.gaussianBlur(imageData, sigma);
    case 'laplacianSharpen':
      return advancedFilters.laplacianSharpen(imageData);
    case 'sobelEdge':
      return advancedFilters.sobelEdgeDetection(imageData);
    case 'prewittEdge':
      return advancedFilters.prewittEdgeDetection(imageData);
    case 'robertsEdge':
      return advancedFilters.robertsEdgeDetection(imageData);
    case 'crop':
      return cropRect ? crop(imageData, cropRect) : imageData;
    default:
      return imageData;
  }
}

/**
 * 灰度滤镜
 * 使用加权平均法：0.299*R + 0.587*G + 0.114*B
 */
function grayscale(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // 计算灰度值
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    
    data[i] = gray;     // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
    // Alpha通道保持不变
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * 反相滤镜
 * 将每个像素的RGB值反转
 */
function invert(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];         // R
    data[i + 1] = 255 - data[i + 1]; // G
    data[i + 2] = 255 - data[i + 2]; // B
    // Alpha通道保持不变
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * 亮度调整
 * @param value 亮度值 (-100 到 100)
 */
function brightness(imageData: ImageData, value: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const factor = value / 100; // 转换为-1到1的范围
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + factor * 255));         // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + factor * 255)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + factor * 255)); // B
    // Alpha通道保持不变
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * 对比度调整
 * @param value 对比度值 (-100 到 100)
 */
function contrast(imageData: ImageData, value: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const factor = (value + 100) / 100; // 转换为0到2的范围
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, (data[i] - 128) * factor + 128));         // R
    data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] - 128) * factor + 128)); // G
    data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] - 128) * factor + 128)); // B
    // Alpha通道保持不变
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * 饱和度调整
 * @param value 饱和度值 (-100 到 100)
 */
function saturation(imageData: ImageData, value: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const factor = (value + 100) / 100; // 转换为0到2的范围
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // 计算灰度值
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // 应用饱和度调整
    data[i] = Math.max(0, Math.min(255, gray + (r - gray) * factor));         // R
    data[i + 1] = Math.max(0, Math.min(255, gray + (g - gray) * factor));     // G
    data[i + 2] = Math.max(0, Math.min(255, gray + (b - gray) * factor));     // B
    // Alpha通道保持不变
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * RGB通道独立调整
 * @param imageData 原始图像数据
 * @param r R通道调整值 (-100 到 100)
 * @param g G通道调整值 (-100 到 100)
 * @param b B通道调整值 (-100 到 100)
 */
function adjustRGB(imageData: ImageData, r: number, g: number, b: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const rFactor = r / 100;
  const gFactor = g / 100;
  const bFactor = b / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + rFactor * 255));         // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + gFactor * 255)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + bFactor * 255)); // B
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * RGB转HSI
 */
function rgbToHsi(r: number, g: number, b: number): { h: number; s: number; i: number } {
  r = r / 255;
  g = g / 255;
  b = b / 255;
  
  const i = (r + g + b) / 3;
  const min = Math.min(r, g, b);
  const s = i === 0 ? 0 : 1 - min / i;
  
  let h = 0;
  if (s !== 0) {
    const num = 0.5 * ((r - g) + (r - b));
    const den = Math.sqrt((r - g) * (r - g) + (r - b) * (g - b));
    const theta = Math.acos(num / (den + 0.0001));
    h = b <= g ? theta : (2 * Math.PI - theta);
  }
  
  return { h: h * 180 / Math.PI, s, i };
}

/**
 * HSI转RGB
 */
function hsiToRgb(h: number, s: number, i: number): { r: number; g: number; b: number } {
  h = h * Math.PI / 180;
  let r, g, b;
  
  if (h < 2 * Math.PI / 3) {
    b = i * (1 - s);
    r = i * (1 + s * Math.cos(h) / Math.cos(Math.PI / 3 - h));
    g = 3 * i - (r + b);
  } else if (h < 4 * Math.PI / 3) {
    h = h - 2 * Math.PI / 3;
    r = i * (1 - s);
    g = i * (1 + s * Math.cos(h) / Math.cos(Math.PI / 3 - h));
    b = 3 * i - (r + g);
  } else {
    h = h - 4 * Math.PI / 3;
    g = i * (1 - s);
    b = i * (1 + s * Math.cos(h) / Math.cos(Math.PI / 3 - h));
    r = 3 * i - (g + b);
  }
  
  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b * 255)))
  };
}

/**
 * HSI色彩空间调整
 * @param imageData 原始图像数据
 * @param h 色调调整值 (-180 到 180)
 * @param s 饱和度调整值 (-100 到 100)
 * @param i 亮度调整值 (-100 到 100)
 */
function adjustHSI(imageData: ImageData, h: number, s: number, i: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const hShift = h;
  const sFactor = (s + 100) / 100;
  const iFactor = (i + 100) / 100;
  
  for (let idx = 0; idx < data.length; idx += 4) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    
    // 转换到HSI空间
    let hsi = rgbToHsi(r, g, b);
    
    // 调整HSI值
    hsi.h = (hsi.h + hShift + 360) % 360;
    hsi.s = Math.max(0, Math.min(1, hsi.s * sFactor));
    hsi.i = Math.max(0, Math.min(1, hsi.i * iFactor));
    
    // 转换回RGB
    const rgb = hsiToRgb(hsi.h, hsi.s, hsi.i);
    
    data[idx] = rgb.r;
    data[idx + 1] = rgb.g;
    data[idx + 2] = rgb.b;
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * 模糊滤镜 - 使用简单的盒式模糊
 * @param radius 模糊半径
 */
function blur(imageData: ImageData, radius: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const result = new Uint8ClampedArray(data);
  const { width, height } = imageData;
  
  // 盒式模糊核
  const kernelSize = Math.max(1, Math.floor(radius * 2) + 1);
  const halfKernel = Math.floor(kernelSize / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      let count = 0;
      
      // 计算核内像素的平均值
      for (let ky = -halfKernel; ky <= halfKernel; ky++) {
        for (let kx = -halfKernel; kx <= halfKernel; kx++) {
          const px = Math.max(0, Math.min(width - 1, x + kx));
          const py = Math.max(0, Math.min(height - 1, y + ky));
          const idx = (py * width + px) * 4;
          
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          a += data[idx + 3];
          count++;
        }
      }
      
      const idx = (y * width + x) * 4;
      result[idx] = Math.round(r / count);
      result[idx + 1] = Math.round(g / count);
      result[idx + 2] = Math.round(b / count);
      result[idx + 3] = Math.round(a / count);
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * 直方图均衡化
 * 通过重新分布像素值来增强图像对比度
 * @param imageData 原始图像数据
 * @param strength 均衡强度 (0-100)，0表示不均衡，100表示完全均衡
 * @param mode 均衡模式：'luminance'(亮度) 或 'rgb'(RGB通道独立)
 */
function histogramEqualization(
  imageData: ImageData, 
  strength: number = 100,
  mode: 'luminance' | 'rgb' = 'luminance'
): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const { width, height } = imageData;
  const totalPixels = width * height;
  const alpha = strength / 100; // 归一化强度到0-1

  if (mode === 'rgb') {
    // RGB通道独立均衡
    return histogramEqualizationRGB(imageData, strength);
  }

  // 亮度均衡模式
  // 计算灰度直方图
  const histogram = new Array(256).fill(0);
  const grayValues: number[] = [];
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // 计算灰度值
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    grayValues.push(gray);
    histogram[gray]++;
  }
  
  // 计算累积分布函数（CDF）
  const cdf = new Array(256);
  cdf[0] = histogram[0];
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }
  
  // 找到CDF的最小非零值
  let cdfMin = 0;
  for (let i = 0; i < 256; i++) {
    if (cdf[i] > 0) {
      cdfMin = cdf[i];
      break;
    }
  }
  
  // 归一化CDF到0-255范围（改进的公式）
  const normalizedCdf = new Array(256);
  for (let i = 0; i < 256; i++) {
    if (cdf[i] === 0) {
      normalizedCdf[i] = 0;
    } else {
      normalizedCdf[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
    }
  }
  
  // 应用直方图均衡化
  let pixelIndex = 0;
  for (let i = 0; i < grayValues.length; i++) {
    const originalGray = grayValues[i];
    const equalizedGray = normalizedCdf[originalGray];
    
    // 根据强度混合原始值和均衡值
    const newGray = Math.round(originalGray * (1 - alpha) + equalizedGray * alpha);
    
    // 保持原始颜色比例，但调整亮度
    if (originalGray === 0) {
      // 避免除零
      data[pixelIndex] = newGray;
      data[pixelIndex + 1] = newGray;
      data[pixelIndex + 2] = newGray;
    } else {
      const ratio = newGray / originalGray;
      data[pixelIndex] = Math.min(255, Math.max(0, Math.round(data[pixelIndex] * ratio)));
      data[pixelIndex + 1] = Math.min(255, Math.max(0, Math.round(data[pixelIndex + 1] * ratio)));
      data[pixelIndex + 2] = Math.min(255, Math.max(0, Math.round(data[pixelIndex + 2] * ratio)));
    }
    
    pixelIndex += 4;
  }
  
  return new ImageData(data, width, height);
}

/**
 * RGB通道独立直方图均衡
 * 对R、G、B三个通道分别进行直方图均衡
 */
function histogramEqualizationRGB(imageData: ImageData, strength: number = 100): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const { width, height } = imageData;
  const totalPixels = width * height;
  const alpha = strength / 100;

  // 对每个通道分别处理
  for (let channel = 0; channel < 3; channel++) {
    // 计算该通道的直方图
    const histogram = new Array(256).fill(0);
    for (let i = channel; i < data.length; i += 4) {
      histogram[data[i]]++;
    }

    // 计算CDF
    const cdf = new Array(256);
    cdf[0] = histogram[0];
    for (let i = 1; i < 256; i++) {
      cdf[i] = cdf[i - 1] + histogram[i];
    }

    // 找到CDF的最小非零值
    let cdfMin = 0;
    for (let i = 0; i < 256; i++) {
      if (cdf[i] > 0) {
        cdfMin = cdf[i];
        break;
      }
    }

    // 归一化CDF
    const normalizedCdf = new Array(256);
    for (let i = 0; i < 256; i++) {
      if (cdf[i] === 0) {
        normalizedCdf[i] = 0;
      } else {
        normalizedCdf[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
      }
    }

    // 应用均衡化到该通道
    for (let i = channel; i < data.length; i += 4) {
      const original = data[i];
      const equalized = normalizedCdf[original];
      // 根据强度混合
      data[i] = Math.round(original * (1 - alpha) + equalized * alpha);
    }
  }

  return new ImageData(data, width, height);
}

/**
 * 锐化滤镜 - 使用3x3锐化卷积核
 * @param strength 锐化强度 (0-100)，0表示无锐化，100表示完全锐化
 */
function sharpen(imageData: ImageData, strength: number = 100): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const result = new Uint8ClampedArray(data);
  const { width, height } = imageData;
  
  // 根据强度调整卷积核的中心值
  // 强度0: [0,0,0; 0,1,0; 0,0,0] (无效果)
  // 强度100: [0,-1,0; -1,5,-1; 0,-1,0] (完全锐化)
  const alpha = strength / 100;
  const center = 1 + 4 * alpha;
  const edge = -1 * alpha;
  
  const kernel = [
    [0, edge, 0],
    [edge, center, edge],
    [0, edge, 0]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0;
      
      // 应用卷积核
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const px = x + kx;
          const py = y + ky;
          const idx = (py * width + px) * 4;
          const weight = kernel[ky + 1][kx + 1];
          
          r += data[idx] * weight;
          g += data[idx + 1] * weight;
          b += data[idx + 2] * weight;
        }
      }
      
      const idx = (y * width + x) * 4;
      result[idx] = Math.max(0, Math.min(255, r));
      result[idx + 1] = Math.max(0, Math.min(255, g));
      result[idx + 2] = Math.max(0, Math.min(255, b));
      result[idx + 3] = data[idx + 3]; // Alpha通道保持不变
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * 裁剪图像
 * @param cropRect 裁剪区域
 */
function crop(imageData: ImageData, cropRect: { x: number; y: number; width: number; height: number }): ImageData {
  const { x, y, width, height } = cropRect;
  const { width: originalWidth, height: originalHeight } = imageData;
  
  // 确保裁剪区域在图像范围内
  const cropX = Math.max(0, Math.min(x, originalWidth));
  const cropY = Math.max(0, Math.min(y, originalHeight));
  const cropWidth = Math.max(1, Math.min(width, originalWidth - cropX));
  const cropHeight = Math.max(1, Math.min(height, originalHeight - cropY));
  
  const result = new Uint8ClampedArray(cropWidth * cropHeight * 4);
  
  for (let py = 0; py < cropHeight; py++) {
    for (let px = 0; px < cropWidth; px++) {
      const srcIdx = ((cropY + py) * originalWidth + (cropX + px)) * 4;
      const dstIdx = (py * cropWidth + px) * 4;
      
      result[dstIdx] = imageData.data[srcIdx];
      result[dstIdx + 1] = imageData.data[srcIdx + 1];
      result[dstIdx + 2] = imageData.data[srcIdx + 2];
      result[dstIdx + 3] = imageData.data[srcIdx + 3];
    }
  }
  
  return new ImageData(result, cropWidth, cropHeight);
}

/**
 * 旋转图像（90度步进）
 * @param imageData 原始图像数据
 * @param angle 旋转角度（90, 180, 270）
 */
export function rotateImage(imageData: ImageData, angle: number): ImageData {
  const { width, height } = imageData;
  const data = imageData.data;
  
  let newWidth = width;
  let newHeight = height;
  
  // 90度和270度需要交换宽高
  if (angle === 90 || angle === 270) {
    newWidth = height;
    newHeight = width;
  }
  
  const result = new Uint8ClampedArray(newWidth * newHeight * 4);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      let dstX = x, dstY = y;
      
      // 根据角度计算目标位置
      switch (angle) {
        case 90:
          dstX = height - 1 - y;
          dstY = x;
          break;
        case 180:
          dstX = width - 1 - x;
          dstY = height - 1 - y;
          break;
        case 270:
          dstX = y;
          dstY = width - 1 - x;
          break;
      }
      
      const dstIdx = (dstY * newWidth + dstX) * 4;
      
      result[dstIdx] = data[srcIdx];
      result[dstIdx + 1] = data[srcIdx + 1];
      result[dstIdx + 2] = data[srcIdx + 2];
      result[dstIdx + 3] = data[srcIdx + 3];
    }
  }
  
  return new ImageData(result, newWidth, newHeight);
}

/**
 * 翻转图像
 * @param imageData 原始图像数据
 * @param horizontal 是否水平翻转
 */
export function flipImage(imageData: ImageData, horizontal: boolean): ImageData {
  const { width, height } = imageData;
  const data = imageData.data;
  const result = new Uint8ClampedArray(data);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      let dstX = x, dstY = y;
      
      if (horizontal) {
        dstX = width - 1 - x;
      } else {
        dstY = height - 1 - y;
      }
      
      const dstIdx = (dstY * width + dstX) * 4;
      
      result[dstIdx] = data[srcIdx];
      result[dstIdx + 1] = data[srcIdx + 1];
      result[dstIdx + 2] = data[srcIdx + 2];
      result[dstIdx + 3] = data[srcIdx + 3];
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * 计算图像直方图
 * @param imageData 原始图像数据
 * @returns RGB三通道和灰度直方图
 */
export function calculateHistogram(imageData: ImageData): {
  r: number[];
  g: number[];
  b: number[];
  gray: number[];
} {
  const data = imageData.data;
  const histR = new Array(256).fill(0);
  const histG = new Array(256).fill(0);
  const histB = new Array(256).fill(0);
  const histGray = new Array(256).fill(0);
  
  for (let i = 0; i < data.length; i += 4) {
    histR[data[i]]++;
    histG[data[i + 1]]++;
    histB[data[i + 2]]++;
    
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    histGray[gray]++;
  }
  
  return { r: histR, g: histG, b: histB, gray: histGray };
}
