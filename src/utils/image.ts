/**
 * 图像处理工具函数
 * 提供图像加载、缩放适配、导出等功能
 */

/**
 * 加载图像文件为ImageBitmap
 * @param file 图像文件
 * @returns Promise<ImageBitmap>
 */
export async function loadImageFile(file: File): Promise<ImageBitmap> {
  if (!file.type.startsWith('image/')) {
    throw new Error('请选择图像文件');
  }
  
  try {
    return await createImageBitmap(file);
  } catch (error) {
    throw new Error('无法加载图像文件');
  }
}

/**
 * 将ImageBitmap转换为ImageData
 * @param imageBitmap 图像位图
 * @returns ImageData
 */
export function imageBitmapToImageData(imageBitmap: ImageBitmap): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  
  ctx.drawImage(imageBitmap, 0, 0);
  
  return ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height);
}

/**
 * 计算图像在容器中的适配尺寸
 * @param containerWidth 容器宽度
 * @param containerHeight 容器高度
 * @param imageWidth 图像宽度
 * @param imageHeight 图像高度
 * @param mode 适配模式
 * @returns 适配后的尺寸和位置
 */
export function calculateFitSize(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
  mode: 'contain' | 'cover' | 'fill' = 'contain'
): {
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
} {
  let scale: number;
  let width: number, height: number;
  
  switch (mode) {
    case 'contain':
      scale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
      break;
    case 'cover':
      scale = Math.max(containerWidth / imageWidth, containerHeight / imageHeight);
      break;
    case 'fill':
      scale = 1;
      break;
    default:
      scale = 1;
  }
  
  width = imageWidth * scale;
  height = imageHeight * scale;
  
  const x = (containerWidth - width) / 2;
  const y = (containerHeight - height) / 2;
  
  return { width, height, x, y, scale };
}

/**
 * 创建下载链接
 * @param dataUrl 数据URL
 * @param filename 文件名
 */
export function downloadFile(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * 生成唯一文件名
 * @param prefix 前缀
 * @param extension 扩展名
 * @returns 文件名
 */
export function generateFilename(prefix: string = 'image', extension: string = 'png'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * 验证文件类型
 * @param file 文件
 * @returns 是否为支持的图像格式
 */
export function isValidImageFile(file: File): boolean {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return supportedTypes.includes(file.type.toLowerCase());
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 时间限制
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
