'use client'
import React from 'react';
import { getLunarDay } from '@/lib/calendar/lunarYearsData';

const MonthGrid = ({
  month,
  year,
  days,
  children,
  zoomLevel,
  scaledWidth
}) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderDateCell = (content) => {
    if (typeof content === 'number') {
      // 如果是日期數字，渲染公曆和農曆
      const date = new Date(year, month - 1, content);
      const lunarDate = getLunarDay(date);

      return (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-2">
            {/* 公曆日期 */}
            <span
              className="text-gray-600 dark:text-gray-500 font-light"
              style={{
                fontSize: `${16 * zoomLevel}px`,
                lineHeight: 1,
                opacity: 0.9
              }}
            >
              {content}
            </span>
            {/* 農曆日期 */}
            {lunarDate && (
              <span
                className="text-gray-500 dark:text-gray-400"
                style={{
                  fontSize: `${10 * zoomLevel}px`,
                  lineHeight: 1,
                  marginTop: '2px'
                }}
              >
                {lunarDate}
              </span>
            )}
          </div>
        </div>
      );
    }
    // 如果不是日期數字（例如空白格子），直接返回原內容
    return content;
  };

  return (
    <div className="relative mb-8" style={{ width: `${scaledWidth}px` }}>
      <h2
        className="text-xl mb-2 dark:text-white font-semibold"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'left' }}
      >
        {`${monthNames[month - 1]} ${year}`}
      </h2>
      <div className="grid grid-cols-7 relative">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center mb-2 font-medium dark:text-gray-300"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center'
            }}
          >
            {day}
          </div>
        ))}
        {React.Children.map(days, child => {
          // 檢查是否是日期數字的單元格
          if (React.isValidElement(child) && child.props.children) {
            const dateContent = child.props.children;
            if (typeof dateContent === 'number') {
              // 克隆並修改單元格內容
              return React.cloneElement(child, {
                children: renderDateCell(dateContent)
              });
            }
          }
          return child;
        })}
        {children}
      </div>
    </div>
  );
};

export default MonthGrid;