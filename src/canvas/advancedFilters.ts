/**
 * 高级图像处理算法模块
 * 包含多种平滑、锐化和边缘检测算子
 */

/**
 * 中值滤波（用于去除椒盐噪声）
 * @param imageData 原始图像数据
 * @param radius 滤波半径
 */
export function medianFilter(imageData: ImageData, radius: number = 1): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const result = new Uint8ClampedArray(data);
  const { width, height } = imageData;
  
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      const rValues: number[] = [];
      const gValues: number[] = [];
      const bValues: number[] = [];
      
      // 收集邻域像素值
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const px = x + kx;
          const py = y + ky;
          const idx = (py * width + px) * 4;
          
          rValues.push(data[idx]);
          gValues.push(data[idx + 1]);
          bValues.push(data[idx + 2]);
        }
      }
      
      // 排序并取中值
      rValues.sort((a, b) => a - b);
      gValues.sort((a, b) => a - b);
      bValues.sort((a, b) => a - b);
      
      const mid = Math.floor(rValues.length / 2);
      const idx = (y * width + x) * 4;
      
      result[idx] = rValues[mid];
      result[idx + 1] = gValues[mid];
      result[idx + 2] = bValues[mid];
      result[idx + 3] = data[idx + 3];
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * 高斯滤波
 * @param imageData 原始图像数据
 * @param sigma 高斯标准差
 */
export function gaussianBlur(imageData: ImageData, sigma: number = 1.0): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const result = new Uint8ClampedArray(data);
  const { width, height } = imageData;
  
  // 生成高斯核
  const radius = Math.ceil(sigma * 3);
  const kernelSize = radius * 2 + 1;
  const kernel: number[][] = [];
  let sum = 0;
  
  for (let y = -radius; y <= radius; y++) {
    const row: number[] = [];
    for (let x = -radius; x <= radius; x++) {
      const value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      row.push(value);
      sum += value;
    }
    kernel.push(row);
  }
  
  // 归一化核
  for (let y = 0; y < kernelSize; y++) {
    for (let x = 0; x < kernelSize; x++) {
      kernel[y][x] /= sum;
    }
  }
  
  // 应用高斯滤波
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      let r = 0, g = 0, b = 0;
      
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const px = x + kx;
          const py = y + ky;
          const idx = (py * width + px) * 4;
          const weight = kernel[ky + radius][kx + radius];
          
          r += data[idx] * weight;
          g += data[idx + 1] * weight;
          b += data[idx + 2] * weight;
        }
      }
      
      const idx = (y * width + x) * 4;
      result[idx] = Math.round(r);
      result[idx + 1] = Math.round(g);
      result[idx + 2] = Math.round(b);
      result[idx + 3] = data[idx + 3];
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * Laplacian锐化算子
 * @param imageData 原始图像数据
 */
export function laplacianSharpen(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const result = new Uint8ClampedArray(data);
  const { width, height } = imageData;
  
  // Laplacian算子
  const kernel = [
    [0, -1, 0],
    [-1, 4, -1],
    [0, -1, 0]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0;
      
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
      // 原图 + Laplacian结果
      result[idx] = Math.max(0, Math.min(255, data[idx] + r));
      result[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + g));
      result[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + b));
      result[idx + 3] = data[idx + 3];
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * Sobel边缘检测
 * @param imageData 原始图像数据
 */
export function sobelEdgeDetection(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const result = new Uint8ClampedArray(data.length);
  const { width, height } = imageData;
  
  // Sobel算子
  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];
  
  const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;
      
      // 计算梯度
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const px = x + kx;
          const py = y + ky;
          const idx = (py * width + px) * 4;
          
          // 转换为灰度
          const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          
          gx += gray * sobelX[ky + 1][kx + 1];
          gy += gray * sobelY[ky + 1][kx + 1];
        }
      }
      
      // 计算梯度幅值
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const value = Math.min(255, magnitude);
      
      const idx = (y * width + x) * 4;
      result[idx] = value;
      result[idx + 1] = value;
      result[idx + 2] = value;
      result[idx + 3] = 255;
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * Prewitt边缘检测
 * @param imageData 原始图像数据
 */
export function prewittEdgeDetection(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const result = new Uint8ClampedArray(data.length);
  const { width, height } = imageData;
  
  // Prewitt算子
  const prewittX = [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1]
  ];
  
  const prewittY = [
    [-1, -1, -1],
    [0, 0, 0],
    [1, 1, 1]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const px = x + kx;
          const py = y + ky;
          const idx = (py * width + px) * 4;
          
          const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          
          gx += gray * prewittX[ky + 1][kx + 1];
          gy += gray * prewittY[ky + 1][kx + 1];
        }
      }
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const value = Math.min(255, magnitude);
      
      const idx = (y * width + x) * 4;
      result[idx] = value;
      result[idx + 1] = value;
      result[idx + 2] = value;
      result[idx + 3] = 255;
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * Roberts边缘检测
 * @param imageData 原始图像数据
 */
export function robertsEdgeDetection(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const result = new Uint8ClampedArray(data.length);
  const { width, height } = imageData;
  
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const idx1 = (y * width + x) * 4;
      const idx2 = (y * width + (x + 1)) * 4;
      const idx3 = ((y + 1) * width + x) * 4;
      const idx4 = ((y + 1) * width + (x + 1)) * 4;
      
      const gray1 = 0.299 * data[idx1] + 0.587 * data[idx1 + 1] + 0.114 * data[idx1 + 2];
      const gray2 = 0.299 * data[idx2] + 0.587 * data[idx2 + 1] + 0.114 * data[idx2 + 2];
      const gray3 = 0.299 * data[idx3] + 0.587 * data[idx3 + 1] + 0.114 * data[idx3 + 2];
      const gray4 = 0.299 * data[idx4] + 0.587 * data[idx4 + 1] + 0.114 * data[idx4 + 2];
      
      const gx = gray1 - gray4;
      const gy = gray2 - gray3;
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const value = Math.min(255, magnitude);
      
      const idx = (y * width + x) * 4;
      result[idx] = value;
      result[idx + 1] = value;
      result[idx + 2] = value;
      result[idx + 3] = 255;
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * 计算图像直方图
 * @param imageData 原始图像数据
 * @returns RGB三通道直方图
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
