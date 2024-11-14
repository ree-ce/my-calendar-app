'use client'
import React from 'react';
import { Trash2 } from 'lucide-react';

export const EventSegment = ({
  segment,
  startOffset,
  daysInSegment,
  row,
  weekOffset,
  zoomLevel,
  onEdit,
  onDelete
}) => {
  const rowHeight = 28;
  const verticalPosition = weekOffset + (row * rowHeight * zoomLevel) + 32; // 減小基礎位置
  const eventHeight = Math.min(28 * zoomLevel, rowHeight * zoomLevel - 4); // 限制最大高度

  return (
    <div
      className="absolute rounded-sm cursor-pointer hover:brightness-95 dark:hover:brightness-110"
      style={{
        left: `calc(${startOffset * (100 / 7)}% + 1px)`,
        width: `calc(${daysInSegment * (100 / 7)}% - 2px)`,
        top: `${verticalPosition}px`,
        height: `${eventHeight}px`,
        backgroundColor: segment.color,
        zIndex: 10,
        // 移除 transform scale
        overflow: 'hidden', // 防止內容溢出
      }}
      onClick={onEdit}
    >
      <div
        className="flex justify-between items-center h-full px-0.5"
        style={{
          // 根據 zoomLevel 調整字體大小
          fontSize: `${Math.min(12 * zoomLevel, 14)}px`,
        }}
      >
        {segment.isFirstSegment && (
          <>
            <span className="truncate font-medium dark:text-gray-900 flex-grow pr-0.5">
              {segment.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(segment.originalEventId);
              }}
              className="opacity-0 hover:opacity-100 p-0.5 flex-shrink-0"
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Trash2
                size={Math.min(10 * zoomLevel, eventHeight - 4)}
                className="dark:text-gray-800"
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventSegment;