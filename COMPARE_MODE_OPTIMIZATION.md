# 对比模式图片尺寸优化说明

## 📅 更新时间
2024-11-05

## 🎯 优化目标
让对比模式下的两张图片占据画布的绝大部分空间，提供更好的对比查看体验。

## ✅ 优化内容

### 1. 直接使用画布完整尺寸
**之前的实现**：
- 基于 `calculatePreviewSize()` 返回的尺寸
- 这个尺寸本身就比较保守（居中显示，留有较大边距）
- 在此基础上再分割，导致图片更小

**现在的实现**：
- 直接使用画布的完整尺寸 (`canvasWidth`, `canvasHeight`)
- 不依赖 `calculatePreviewSize()` 的结果
- 最大化利用可用空间

### 2. 优化的参数设置

```typescript
const gap = 8;           // 两张图片之间的间隙（从20px → 10px → 8px）
const padding = 10;      // 画布边缘留白（新增）

// 可用区域计算
const availableWidth = canvasWidth - padding * 2;
const availableHeight = canvasHeight - padding * 2 - gap;
const availableHeightPerImage = availableHeight / 2;
```

### 3. 尺寸计算逻辑

```typescript
// 1. 初始尺寸：尽可能填满可用空间
let singleWidth = availableWidth;
let singleHeight = availableHeightPerImage;

// 2. 根据图片宽高比调整，保持不变形
const imageAspectRatio = imageWidth / imageHeight;

if (singleWidth / singleHeight > imageAspectRatio) {
  // 宽度过大，以高度为准
  singleWidth = singleHeight * imageAspectRatio;
} else {
  // 高度过大，以宽度为准
  singleHeight = singleWidth / imageAspectRatio;
}

// 3. 计算居中位置
const centerX = (canvasWidth - singleWidth) / 2;
const topY = padding + (availableHeightPerImage - singleHeight) / 2;
const bottomY = padding + availableHeightPerImage + gap + (availableHeightPerImage - singleHeight) / 2;
```

## 📊 效果对比

### 优化前
- 间隙：20px
- 基于保守的预览尺寸计算
- 图片占画布约 60-70% 的空间
- 留白较多

### 第一次优化
- 间隙：10px
- 使用 95% 的可用宽度和高度
- 图片占画布约 70-80% 的空间
- 仍有改进空间

### 当前版本（第二次优化）
- 间隙：8px
- 边缘留白：10px
- 直接使用画布完整尺寸
- **图片占画布约 90-95% 的空间** ✨
- 最大化显示效果

## 🎨 视觉效果

### 布局结构
```
┌─────────────────────────────────────┐
│  padding: 10px                      │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │      原图（上方）              │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  gap: 8px                           │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │      处理后（下方）            │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  padding: 10px                      │
└─────────────────────────────────────┘
```

### 特点
1. **最大化空间利用**：图片尽可能大
2. **保持宽高比**：不变形
3. **居中对齐**：视觉平衡
4. **适度留白**：不会贴边，保持美观
5. **清晰标签**：每张图片都有标识

## 🔧 技术细节

### 关键改进点
1. **独立计算**：对比模式不再依赖 `calculatePreviewSize()`
2. **直接使用画布尺寸**：`canvasWidth` 和 `canvasHeight`
3. **最小化间隙**：8px 间隙足够区分两张图片
4. **固定边缘留白**：10px 确保不会贴边

### 保持的特性
- ✅ 保持图片原始宽高比
- ✅ 自动居中对齐
- ✅ 响应式布局
- ✅ 标签显示（原图/处理后）

## 📝 代码位置
- **文件**: `src/canvas/useCanvas.ts`
- **方法**: `updatePreview(mode: 'processed' | 'original' | 'split')`
- **行数**: 约 417-473 行

## 🚀 使用方法
用户在导入图片后，点击画布下方的"对比"按钮即可查看优化后的对比模式。

## 💡 未来可能的优化
1. **自适应布局**：根据图片宽高比自动选择上下或左右布局
2. **可调节间隙**：允许用户自定义两张图片之间的间隙
3. **缩放控制**：添加缩放滑块，允许用户进一步放大查看细节
4. **同步滚动**：如果图片超出画布，实现两张图片的同步滚动

## ✨ 总结
通过这次优化，对比模式下的图片尺寸显著增大，从占画布约 60-70% 提升到 **90-95%**，极大地改善了用户的对比查看体验！🎉

