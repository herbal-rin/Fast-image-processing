/**
 * Canvas管理和图像处理核心功能
 * 提供图像加载、处理、预览和导出功能
 */

import { applyFilter, rotateImage, flipImage, FilterParams } from './filters';
import { HistoryManager } from './history';

export interface ViewMode {
  type: 'fit' | '1:1' | 'fill';
  scale: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private originalImageData: ImageData | null = null;
  private currentImageData: ImageData | null = null;
  private historyManager: HistoryManager;
  private viewMode: ViewMode = { type: 'fit', scale: 1 };
  private cropRect: CropRect | null = null;
  private isProcessing: boolean = false;
  
  // 当前调整参数
  private currentAdjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    grayscale: boolean;
    invert: boolean;
    sharpen: boolean;
  } = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 1,
    grayscale: false,
    invert: false,
    sharpen: false
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    // 创建离屏canvas用于图像处理
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d')!;
    
    this.historyManager = new HistoryManager();
    
    // 设置canvas样式
    this.setupCanvas();
  }

  /**
   * 设置canvas基本样式
   */
  private setupCanvas(): void {
    this.canvas.style.border = '1px solid #e5e7eb';
    this.canvas.style.borderRadius = '8px';
    this.canvas.style.backgroundColor = '#f9fafb';
  }

  /**
   * 加载图像
   * @param file 图像文件
   */
  async loadImage(file: File): Promise<void> {
    try {
      const imageBitmap = await createImageBitmap(file);
      
      // 设置离屏canvas尺寸
      this.offscreenCanvas.width = imageBitmap.width;
      this.offscreenCanvas.height = imageBitmap.height;
      
      // 绘制图像到离屏canvas
      this.offscreenCtx.drawImage(imageBitmap, 0, 0);
      
      // 获取原始图像数据
      this.originalImageData = this.offscreenCtx.getImageData(
        0, 0, 
        imageBitmap.width, 
        imageBitmap.height
      );
      
      this.currentImageData = this.cloneImageData(this.originalImageData);
      
      // 清空历史记录并添加初始状态
      this.historyManager.clear();
      this.historyManager.addState(this.currentImageData);
      
      // 更新预览
      this.updatePreview();
      
    } catch (error) {
      console.error('加载图像失败:', error);
      throw new Error('无法加载图像文件');
    }
  }

  /**
   * 应用滤镜
   * @param params 滤镜参数
   */
  applyFilter(params: FilterParams): void {
    if (!this.originalImageData || this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      // 更新当前调整参数
      this.updateAdjustments(params);
      
      // 基于原始图像应用所有调整
      this.currentImageData = this.applyAllAdjustments();
      
      // 更新预览
      this.updatePreview();
      
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 更新调整参数
   */
  private updateAdjustments(params: FilterParams): void {
    const { type, value = 0, radius = 1 } = params;
    
    switch (type) {
      case 'brightness':
        this.currentAdjustments.brightness = value;
        break;
      case 'contrast':
        this.currentAdjustments.contrast = value;
        break;
      case 'saturation':
        this.currentAdjustments.saturation = value;
        break;
      case 'blur':
        this.currentAdjustments.blur = radius;
        break;
      case 'grayscale':
        this.currentAdjustments.grayscale = !this.currentAdjustments.grayscale;
        break;
      case 'invert':
        this.currentAdjustments.invert = !this.currentAdjustments.invert;
        break;
      case 'sharpen':
        this.currentAdjustments.sharpen = !this.currentAdjustments.sharpen;
        break;
    }
  }

  /**
   * 基于原始图像应用所有调整
   */
  private applyAllAdjustments(): ImageData {
    if (!this.originalImageData) return this.originalImageData;
    
    let result = this.cloneImageData(this.originalImageData);
    
    // 应用基础调整（基于原始图像）
    if (this.currentAdjustments.brightness !== 0) {
      result = applyFilter(result, { type: 'brightness', value: this.currentAdjustments.brightness });
    }
    
    if (this.currentAdjustments.contrast !== 0) {
      result = applyFilter(result, { type: 'contrast', value: this.currentAdjustments.contrast });
    }
    
    if (this.currentAdjustments.saturation !== 0) {
      result = applyFilter(result, { type: 'saturation', value: this.currentAdjustments.saturation });
    }
    
    // 应用滤镜效果
    if (this.currentAdjustments.grayscale) {
      result = applyFilter(result, { type: 'grayscale' });
    }
    
    if (this.currentAdjustments.invert) {
      result = applyFilter(result, { type: 'invert' });
    }
    
    if (this.currentAdjustments.blur > 1) {
      result = applyFilter(result, { type: 'blur', radius: this.currentAdjustments.blur });
    }
    
    if (this.currentAdjustments.sharpen) {
      result = applyFilter(result, { type: 'sharpen' });
    }
    
    return result;
  }

  /**
   * 烘焙当前状态（保存到历史记录）
   */
  bake(): void {
    if (this.currentImageData) {
      this.historyManager.addState(this.currentImageData);
    }
  }

  /**
   * 重置到原始状态
   */
  reset(): void {
    if (this.originalImageData) {
      // 重置所有调整参数
      this.currentAdjustments = {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        blur: 1,
        grayscale: false,
        invert: false,
        sharpen: false
      };
      
      this.currentImageData = this.cloneImageData(this.originalImageData);
      this.cropRect = null;
      this.updatePreview();
      this.historyManager.clear();
      this.historyManager.addState(this.currentImageData);
    }
  }

  /**
   * 撤销操作
   */
  undo(): boolean {
    const previousState = this.historyManager.undo();
    if (previousState) {
      this.currentImageData = previousState;
      this.updatePreview();
      return true;
    }
    return false;
  }

  /**
   * 重做操作
   */
  redo(): boolean {
    const nextState = this.historyManager.redo();
    if (nextState) {
      this.currentImageData = nextState;
      this.updatePreview();
      return true;
    }
    return false;
  }

  /**
   * 旋转图像
   * @param angle 旋转角度（90, 180, 270）
   */
  rotate(angle: number): void {
    if (!this.currentImageData) return;
    
    const rotatedData = rotateImage(this.currentImageData, angle);
    this.currentImageData = rotatedData;
    
    // 更新离屏canvas尺寸
    this.offscreenCanvas.width = rotatedData.width;
    this.offscreenCanvas.height = rotatedData.height;
    
    this.updatePreview();
  }

  /**
   * 翻转图像
   * @param horizontal 是否水平翻转
   */
  flip(horizontal: boolean): void {
    if (!this.currentImageData) return;
    
    const flippedData = flipImage(this.currentImageData, horizontal);
    this.currentImageData = flippedData;
    
    this.updatePreview();
  }

  /**
   * 设置裁剪区域
   * @param rect 裁剪区域
   */
  setCropRect(rect: CropRect | null): void {
    this.cropRect = rect;
    this.updatePreview();
  }

  /**
   * 确认裁剪
   */
  confirmCrop(): void {
    if (this.cropRect && this.currentImageData) {
      const croppedData = applyFilter(this.currentImageData, {
        type: 'crop',
        cropRect: this.cropRect
      });
      
      this.currentImageData = croppedData;
      this.offscreenCanvas.width = croppedData.width;
      this.offscreenCanvas.height = croppedData.height;
      this.cropRect = null;
      
      this.updatePreview();
    }
  }

  /**
   * 取消裁剪
   */
  cancelCrop(): void {
    this.cropRect = null;
    this.updatePreview();
  }

  /**
   * 设置视图模式
   * @param mode 视图模式
   */
  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.updatePreview();
  }

  /**
   * 更新预览
   */
  private updatePreview(): void {
    if (!this.currentImageData) {
      this.clearCanvas();
      return;
    }

    // 将当前图像数据绘制到离屏canvas
    this.offscreenCtx.putImageData(this.currentImageData, 0, 0);
    
    // 计算预览尺寸
    const { width: canvasWidth, height: canvasHeight } = this.canvas;
    const { width: imageWidth, height: imageHeight } = this.currentImageData;
    
    let { scale, x, y, width, height } = this.calculatePreviewSize(
      canvasWidth, canvasHeight, imageWidth, imageHeight
    );
    
    // 清空canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制图像
    this.ctx.drawImage(this.offscreenCanvas, x, y, width, height);
    
    // 绘制裁剪框
    if (this.cropRect) {
      this.drawCropOverlay();
    }
  }

  /**
   * 计算预览尺寸
   */
  private calculatePreviewSize(
    canvasWidth: number, 
    canvasHeight: number, 
    imageWidth: number, 
    imageHeight: number
  ): { scale: number; x: number; y: number; width: number; height: number } {
    let scale: number;
    let x: number, y: number, width: number, height: number;
    
    switch (this.viewMode.type) {
      case 'fit':
        scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);
        width = imageWidth * scale;
        height = imageHeight * scale;
        x = (canvasWidth - width) / 2;
        y = (canvasHeight - height) / 2;
        break;
        
      case '1:1':
        scale = 1;
        width = imageWidth;
        height = imageHeight;
        x = (canvasWidth - width) / 2;
        y = (canvasHeight - height) / 2;
        break;
        
      case 'fill':
        scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
        width = imageWidth * scale;
        height = imageHeight * scale;
        x = (canvasWidth - width) / 2;
        y = (canvasHeight - height) / 2;
        break;
        
      default:
        scale = 1;
        width = imageWidth;
        height = imageHeight;
        x = 0;
        y = 0;
    }
    
    return { scale, x, y, width, height };
  }

  /**
   * 绘制裁剪框覆盖层
   */
  private drawCropOverlay(): void {
    if (!this.cropRect || !this.currentImageData) return;
    
    const { width: canvasWidth, height: canvasHeight } = this.canvas;
    const { width: imageWidth, height: imageHeight } = this.currentImageData;
    
    // 计算图像在canvas中的位置和尺寸
    const { x: imageX, y: imageY, width: imageDisplayWidth, height: imageDisplayHeight } = 
      this.calculatePreviewSize(canvasWidth, canvasHeight, imageWidth, imageHeight);
    
    // 计算裁剪框在canvas中的位置
    const scaleX = imageDisplayWidth / imageWidth;
    const scaleY = imageDisplayHeight / imageHeight;
    
    const cropX = imageX + this.cropRect.x * scaleX;
    const cropY = imageY + this.cropRect.y * scaleY;
    const cropWidth = this.cropRect.width * scaleX;
    const cropHeight = this.cropRect.height * scaleY;
    
    // 保存当前状态
    this.ctx.save();
    
    // 绘制半透明遮罩
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(imageX, imageY, imageDisplayWidth, imageDisplayHeight);
    
    // 清除裁剪区域
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillRect(cropX, cropY, cropWidth, cropHeight);
    
    // 恢复合成模式
    this.ctx.globalCompositeOperation = 'source-over';
    
    // 绘制裁剪框边框
    this.ctx.strokeStyle = '#3b82f6';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);
    
    // 绘制控制点
    const handleSize = 8;
    this.ctx.fillStyle = '#3b82f6';
    
    // 四个角点
    this.ctx.fillRect(cropX - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
    this.ctx.fillRect(cropX + cropWidth - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
    this.ctx.fillRect(cropX - handleSize/2, cropY + cropHeight - handleSize/2, handleSize, handleSize);
    this.ctx.fillRect(cropX + cropWidth - handleSize/2, cropY + cropHeight - handleSize/2, handleSize, handleSize);
    
    // 恢复状态
    this.ctx.restore();
  }

  /**
   * 清空canvas
   */
  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制占位提示
    this.ctx.save();
    this.ctx.fillStyle = '#9ca3af';
    this.ctx.font = '16px system-ui';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      '拖拽图片到此处或点击左侧按钮导入',
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.ctx.restore();
  }

  /**
   * 导出图像
   * @param format 导出格式 ('png' | 'jpeg')
   * @param quality JPEG质量 (0-1)
   */
  exportImage(format: 'png' | 'jpeg' = 'png', quality: number = 0.9): string {
    if (!this.currentImageData) {
      throw new Error('没有图像可导出');
    }
    
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return this.offscreenCanvas.toDataURL(mimeType, quality);
  }

  /**
   * 下载图像
   * @param filename 文件名
   * @param format 导出格式
   * @param quality JPEG质量
   */
  downloadImage(filename: string, format: 'png' | 'jpeg' = 'png', quality: number = 0.9): void {
    const dataUrl = this.exportImage(format, quality);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }

  /**
   * 克隆ImageData
   */
  private cloneImageData(imageData: ImageData): ImageData {
    const clonedData = new Uint8ClampedArray(imageData.data);
    return new ImageData(clonedData, imageData.width, imageData.height);
  }

  /**
   * 获取历史记录信息
   */
  getHistoryInfo() {
    return this.historyManager.getHistoryInfo();
  }

  /**
   * 检查是否有图像
   */
  hasImage(): boolean {
    return this.currentImageData !== null;
  }

  /**
   * 获取当前图像尺寸
   */
  getImageSize(): { width: number; height: number } | null {
    if (!this.currentImageData) return null;
    return {
      width: this.currentImageData.width,
      height: this.currentImageData.height
    };
  }

  /**
   * 获取裁剪区域
   */
  getCropRect(): CropRect | null {
    return this.cropRect;
  }
}
