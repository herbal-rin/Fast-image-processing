/**
 * 撤销/重做历史管理模块
 * 使用快照方式存储历史状态，支持撤销和重做操作
 */

export interface HistoryState {
  imageData: ImageData;
  timestamp: number;
}

export class HistoryManager {
  private history: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50; // 最大历史记录数量

  /**
   * 添加新的历史状态
   * @param imageData 图像数据
   */
  addState(imageData: ImageData): void {
    // 如果当前不在历史末尾，删除后面的记录
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // 添加新状态
    const newState: HistoryState = {
      imageData: this.cloneImageData(imageData),
      timestamp: Date.now()
    };

    this.history.push(newState);
    this.currentIndex = this.history.length - 1;

    // 限制历史记录数量
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  /**
   * 撤销操作
   * @returns 撤销后的图像数据，如果没有可撤销的则返回null
   */
  undo(): ImageData | null {
    if (this.canUndo()) {
      this.currentIndex--;
      return this.cloneImageData(this.history[this.currentIndex].imageData);
    }
    return null;
  }

  /**
   * 重做操作
   * @returns 重做后的图像数据，如果没有可重做的则返回null
   */
  redo(): ImageData | null {
    if (this.canRedo()) {
      this.currentIndex++;
      return this.cloneImageData(this.history[this.currentIndex].imageData);
    }
    return null;
  }

  /**
   * 检查是否可以撤销
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * 检查是否可以重做
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * 获取当前状态
   * @returns 当前图像数据
   */
  getCurrentState(): ImageData | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.cloneImageData(this.history[this.currentIndex].imageData);
    }
    return null;
  }

  /**
   * 清空历史记录
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * 获取历史记录信息
   */
  getHistoryInfo(): { total: number; current: number; canUndo: boolean; canRedo: boolean } {
    return {
      total: this.history.length,
      current: this.currentIndex + 1,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }

  /**
   * 克隆ImageData对象
   * @param imageData 原始图像数据
   * @returns 克隆的图像数据
   */
  private cloneImageData(imageData: ImageData): ImageData {
    const clonedData = new Uint8ClampedArray(imageData.data);
    return new ImageData(clonedData, imageData.width, imageData.height);
  }

  /**
   * 设置最大历史记录数量
   * @param size 最大数量
   */
  setMaxHistorySize(size: number): void {
    this.maxHistorySize = Math.max(1, size);
    
    // 如果当前历史记录超过新限制，删除多余的记录
    if (this.history.length > this.maxHistorySize) {
      const removeCount = this.history.length - this.maxHistorySize;
      this.history = this.history.slice(removeCount);
      this.currentIndex = Math.max(0, this.currentIndex - removeCount);
    }
  }
}
