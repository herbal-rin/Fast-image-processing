/**
 * Canvas管理和图像处理核心功能
 * 提供图像加载、处理、预览和导出功能
 */

import { applyFilter, rotateImage, flipImage, FilterParams, calculateHistogram } from './filters';
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
    rgbR: number;
    rgbG: number;
    rgbB: number;
    histogramEqualizationStrength: number;
    histogramEqualizationMode: 'luminance' | 'rgb';
    medianFilterRadius: number;
    gaussianBlurSigma: number;
    sharpenStrength: number;
    laplacianSharpen: boolean;
    grayscale: boolean;
    invert: boolean;
  } = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    rgbR: 0,
    rgbG: 0,
    rgbB: 0,
    histogramEqualizationStrength: 0,
    histogramEqualizationMode: 'luminance',
    medianFilterRadius: 0,
    gaussianBlurSigma: 0,
    sharpenStrength: 0,
    laplacianSharpen: false,
    grayscale: false,
    invert: false
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
    const { type, value = 0, radius = 1, r = 0, g = 0, b = 0, strength = 0, mode = 'luminance', sigma = 0 } = params;
    
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
      case 'adjustRGB':
        this.currentAdjustments.rgbR = r;
        this.currentAdjustments.rgbG = g;
        this.currentAdjustments.rgbB = b;
        break;
      case 'histogramEqualization':
        this.currentAdjustments.histogramEqualizationStrength = strength;
        this.currentAdjustments.histogramEqualizationMode = mode;
        break;
      case 'medianFilter':
        this.currentAdjustments.medianFilterRadius = value;
        break;
      case 'gaussianBlur':
        this.currentAdjustments.gaussianBlurSigma = sigma;
        break;
      case 'sharpen':
        this.currentAdjustments.sharpenStrength = value;
        break;
      case 'laplacianSharpen':
        this.currentAdjustments.laplacianSharpen = !this.currentAdjustments.laplacianSharpen;
        break;
      case 'grayscale':
        this.currentAdjustments.grayscale = !this.currentAdjustments.grayscale;
        break;
      case 'invert':
        this.currentAdjustments.invert = !this.currentAdjustments.invert;
        break;
    }
  }

  /**
   * 基于原始图像应用所有调整
   */
  private applyAllAdjustments(): ImageData {
    if (!this.originalImageData) {
      throw new Error('No original image data');
    }
    
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
    
    // 应用RGB调节
    if (this.currentAdjustments.rgbR !== 0 || this.currentAdjustments.rgbG !== 0 || this.currentAdjustments.rgbB !== 0) {
      result = applyFilter(result, { 
        type: 'adjustRGB', 
        r: this.currentAdjustments.rgbR,
        g: this.currentAdjustments.rgbG,
        b: this.currentAdjustments.rgbB
      });
    }
    
    // 应用滤镜效果
    if (this.currentAdjustments.grayscale) {
      result = applyFilter(result, { type: 'grayscale' });
    }
    
    if (this.currentAdjustments.invert) {
      result = applyFilter(result, { type: 'invert' });
    }
    
    if (this.currentAdjustments.blur > 0) {
      result = applyFilter(result, { type: 'blur', radius: this.currentAdjustments.blur });
    }
    
    if (this.currentAdjustments.sharpenStrength > 0) {
      result = applyFilter(result, { type: 'sharpen', value: this.currentAdjustments.sharpenStrength });
    }
    
    // 应用直方图均衡（只有强度大于0时才应用）
    if (this.currentAdjustments.histogramEqualizationStrength > 0) {
      result = applyFilter(result, { 
        type: 'histogramEqualization',
        strength: this.currentAdjustments.histogramEqualizationStrength,
        mode: this.currentAdjustments.histogramEqualizationMode
      });
    }
    
    // 应用高级滤镜
    if (this.currentAdjustments.medianFilterRadius > 0) {
      result = applyFilter(result, { 
        type: 'medianFilter', 
        radius: this.currentAdjustments.medianFilterRadius 
      });
    }
    
    if (this.currentAdjustments.gaussianBlurSigma > 0) {
      result = applyFilter(result, { 
        type: 'gaussianBlur', 
        sigma: this.currentAdjustments.gaussianBlurSigma 
      });
    }
    
    if (this.currentAdjustments.laplacianSharpen) {
      result = applyFilter(result, { type: 'laplacianSharpen' });
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
        blur: 0,
        rgbR: 0,
        rgbG: 0,
        rgbB: 0,
        histogramEqualizationStrength: 0,
        histogramEqualizationMode: 'luminance',
        medianFilterRadius: 0,
        gaussianBlurSigma: 0,
        sharpenStrength: 0,
        laplacianSharpen: false,
        grayscale: false,
        invert: false
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
   * @param mode 显示模式：'processed'(处理后), 'original'(原图), 'split'(对比)
   */
  updatePreview(mode: 'processed' | 'original' | 'split' = 'processed'): void {
    if (!this.currentImageData) {
      this.clearCanvas();
      return;
    }

    const { width: canvasWidth, height: canvasHeight } = this.canvas;
    const { width: imageWidth, height: imageHeight } = this.currentImageData;
    
    let { x, y, width, height } = this.calculatePreviewSize(
      canvasWidth, canvasHeight, imageWidth, imageHeight
    );
    
    // 清空canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    if (mode === 'original') {
      // 显示原图
      if (this.originalImageData) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.originalImageData.width;
        tempCanvas.height = this.originalImageData.height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(this.originalImageData, 0, 0);
        this.ctx.drawImage(tempCanvas, x, y, width, height);
      }
    } else if (mode === 'split') {
      // 对比模式：上下并排显示两张完整图片，保持宽高比
      // 直接使用画布的完整尺寸，而不是基于calculatePreviewSize的结果
      const gap = 8; // 进一步减小间隙
      const padding = 10; // 边缘留白
      
      // 可用区域（去除边缘留白）
      const availableWidth = canvasWidth - padding * 2;
      const availableHeight = canvasHeight - padding * 2 - gap;
      const availableHeightPerImage = availableHeight / 2;
      
      // 计算每张图片的实际显示尺寸（保持宽高比）
      const imageAspectRatio = imageWidth / imageHeight;
      
      // 尽可能填满可用空间
      let singleWidth = availableWidth;
      let singleHeight = availableHeightPerImage;
      
      // 根据宽高比调整尺寸，尽可能填满空间
      if (singleWidth / singleHeight > imageAspectRatio) {
        // 宽度过大，以高度为准
        singleWidth = singleHeight * imageAspectRatio;
      } else {
        // 高度过大，以宽度为准
        singleHeight = singleWidth / imageAspectRatio;
      }
      
      // 计算居中位置
      const centerX = (canvasWidth - singleWidth) / 2;
      const topY = padding + (availableHeightPerImage - singleHeight) / 2;
      const bottomY = padding + availableHeightPerImage + gap + (availableHeightPerImage - singleHeight) / 2;
      
      // 绘制原图（上方）
      if (this.originalImageData) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.originalImageData.width;
        tempCanvas.height = this.originalImageData.height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(this.originalImageData, 0, 0);
        this.ctx.drawImage(tempCanvas, centerX, topY, singleWidth, singleHeight);
        
        // 添加原图标签
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(centerX, topY, 60, 30);
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 14px sans-serif';
        this.ctx.fillText('原图', centerX + 15, topY + 20);
        this.ctx.restore();
      }
      
      // 绘制处理后图像（下方）
      this.offscreenCtx.putImageData(this.currentImageData, 0, 0);
      this.ctx.drawImage(this.offscreenCanvas, centerX, bottomY, singleWidth, singleHeight);
      
      // 添加处理后标签
      this.ctx.save();
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(centerX, bottomY, 80, 30);
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 14px sans-serif';
      this.ctx.fillText('处理后', centerX + 10, bottomY + 20);
      this.ctx.restore();
    } else {
      // 默认显示处理后的图像
      this.offscreenCtx.putImageData(this.currentImageData, 0, 0);
      this.ctx.drawImage(this.offscreenCanvas, x, y, width, height);
    }
    
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
   * 获取当前图像的直方图数据
   */
  getHistogramData(): { r: number[]; g: number[]; b: number[]; gray: number[] } | null {
    if (!this.currentImageData) return null;
    return calculateHistogram(this.currentImageData);
  }

  /**
   * 获取裁剪区域
   */
  getCropRect(): CropRect | null {
    return this.cropRect;
  }
}
