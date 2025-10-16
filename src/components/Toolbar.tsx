/**
 * 工具栏组件
 * 包含导入、导出、撤销、重做等操作按钮
 */

import React from 'react';
import { Button } from './Button';

export interface ToolbarProps {
  onImport: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasImage: boolean;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onImport,
  onExport,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
  hasImage,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* 导入导出区域 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">文件操作</h3>
        <div className="space-y-2">
          <Button
            onClick={onImport}
            variant="primary"
            className="w-full"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            }
          >
            导入图片
          </Button>
          
          <Button
            onClick={onExport}
            variant="secondary"
            className="w-full"
            disabled={!hasImage}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            导出图片
          </Button>
        </div>
      </div>

      {/* 历史操作区域 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">历史记录</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onUndo}
            variant="ghost"
            size="sm"
            disabled={!canUndo}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            }
          >
            撤销
          </Button>
          
          <Button
            onClick={onRedo}
            variant="ghost"
            size="sm"
            disabled={!canRedo}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            }
          >
            重做
          </Button>
        </div>
        
        <Button
          onClick={onReset}
          variant="danger"
          size="sm"
          className="w-full"
          disabled={!hasImage}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        >
          重置
        </Button>
      </div>
    </div>
  );
};
