# 调试指南

## 问题1：导入图片失败提示

### 症状
导入jpg或png图片时会提示"导入图片失败，请检查文件格式"，但实际图片能导入。

### 已修复
- ✅ 修改了 `useCanvas.ts` 中的 `getHistogramData()` 方法，使用正确的ES6导入
- ✅ 在 `Editor.tsx` 中添加了错误处理，防止直方图计算错误影响图片导入
- ✅ 添加了100ms延迟，确保图像完全加载后再计算直方图

### 测试步骤
1. 打开浏览器控制台（F12）
2. 导入一张图片
3. 检查控制台是否有错误信息
4. 如果没有错误提示框，说明问题已解决

## 问题2：点击显示直方图无反应

### 可能原因
1. 直方图数据未正确计算
2. Histogram组件渲染问题
3. 状态更新问题

### 调试步骤

#### 步骤1：检查直方图数据
打开浏览器控制台，运行：
```javascript
// 在导入图片后，检查直方图数据
console.log('Histogram data:', window.histogramData);
```

#### 步骤2：检查组件渲染
在 `Sidebar.tsx` 中，直方图显示的条件是：
```typescript
{showHistogram && histogramData && (
  <Histogram ... />
)}
```

检查：
- `showHistogram` 是否为 `true`
- `histogramData` 是否不为 `null`

#### 步骤3：手动测试
1. 导入图片
2. 打开浏览器控制台
3. 输入以下代码测试：
```javascript
// 检查Canvas管理器
console.log('Canvas Manager:', window.canvasManagerRef);

// 检查直方图数据
if (window.canvasManagerRef && window.canvasManagerRef.current) {
  const data = window.canvasManagerRef.current.getHistogramData();
  console.log('Histogram data:', data);
}
```

### 已修复的内容
- ✅ 修改了 `calculateHistogram` 的导入方式（从 `require` 改为 ES6 `import`）
- ✅ 添加了错误处理，防止计算失败
- ✅ 添加了延迟加载，确保图像数据准备好

## 验证修复

### 完整测试流程

1. **清除缓存并重启开发服务器**
   ```bash
   cd /Users/herbal/code/src/image-editor
   rm -rf node_modules/.vite
   pnpm dev
   ```

2. **导入图片测试**
   - 准备一张jpg或png图片
   - 点击"导入图片"按钮
   - 选择图片
   - ✅ 应该**不会**显示错误提示
   - ✅ 图片应该正常显示在画布上

3. **直方图显示测试**
   - 导入图片后
   - 滚动到"直方图均衡"部分
   - 点击"显示直方图"按钮
   - ✅ 应该看到RGB和灰度直方图
   - ✅ 直方图应该显示彩色的曲线

4. **直方图更新测试**
   - 显示直方图后
   - 调节"均衡强度"滑块
   - ✅ 直方图应该实时更新
   - ✅ 图像效果应该实时变化

## 如果问题仍然存在

### 检查控制台错误
打开浏览器控制台（F12），查看是否有以下错误：

1. **模块导入错误**
   ```
   Error: Cannot find module './filters'
   ```
   解决：确保 `filters.ts` 文件存在且导出了 `calculateHistogram`

2. **类型错误**
   ```
   TypeError: calculateHistogram is not a function
   ```
   解决：检查 `filters.ts` 中是否正确导出了函数

3. **数据错误**
   ```
   TypeError: Cannot read property 'data' of null
   ```
   解决：确保图像已完全加载

### 手动验证calculateHistogram函数

在浏览器控制台运行：
```javascript
// 创建测试图像数据
const testCanvas = document.createElement('canvas');
testCanvas.width = 100;
testCanvas.height = 100;
const ctx = testCanvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 50, 50);
ctx.fillStyle = 'blue';
ctx.fillRect(50, 0, 50, 50);
const imageData = ctx.getImageData(0, 0, 100, 100);

// 测试calculateHistogram
// 注意：这需要在React组件内部测试，或者导出函数到window对象
```

## 常见问题

### Q: 为什么需要延迟100ms？
A: 确保图像数据完全加载到Canvas后再计算直方图，避免读取空数据。

### Q: 为什么使用ES6 import而不是require？
A: Vite构建工具更好地支持ES6模块，require在某些情况下可能导致运行时错误。

### Q: 直方图显示空白怎么办？
A: 检查：
1. 图像是否成功导入
2. 控制台是否有错误
3. histogramData是否为null
4. Histogram组件的canvas是否正确渲染

## 联系信息

如果问题仍未解决，请提供：
1. 浏览器控制台的完整错误信息
2. 使用的图片格式和大小
3. 浏览器版本
4. 操作系统版本

---

**最后更新**: 2025-11-05
**版本**: v0.3.1

