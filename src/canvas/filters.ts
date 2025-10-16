/**
 * 图像滤镜处理模块
 * 提供各种图像处理滤镜算法，基于ImageData进行像素级操作
 */

export interface FilterParams {
  type: string;
  value?: number;
  radius?: number;
  cropRect?: { x: number; y: number; width: number; height: number };
}

/**
 * 应用滤镜到ImageData
 * @param imageData 原始图像数据
 * @param params 滤镜参数
 * @returns 处理后的ImageData
 */
export function applyFilter(imageData: ImageData, params: FilterParams): ImageData {
  const { type, value = 0, radius = 1, cropRect } = params;
  
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
    case 'blur':
      return blur(imageData, radius);
    case 'sharpen':
      return sharpen(imageData);
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
 * 锐化滤镜 - 使用3x3锐化卷积核
 */
function sharpen(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const result = new Uint8ClampedArray(data);
  const { width, height } = imageData;
  
  // 锐化卷积核
  const kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
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
