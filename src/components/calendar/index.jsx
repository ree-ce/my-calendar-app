'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import Controls from './Controls';
import BatchInput from './BatchInput';
import MonthGrid from './MonthGrid';
import EventSegment from './EventSegment';
import { parseEventInput, getSortedYearMonths } from '@/lib/calendar/dateUtils';
import { generateColor, splitEventIntoWeeks, calculateWeekLayout } from '@/lib/calendar/eventUtils';
import { getLunarDay } from '@/lib/calendar/lunarYearsData';

const STORAGE_KEY = 'calendar_events';

const MONTH_GAP = 10; // 月份間距
const BASE_CELL_WIDTH = 120; // 基礎單元格寬度
const BASE_CELL_HEIGHT = 80; // 基礎單元格高度

    // Base dimensions with adjustments for events
    const baseCellHeight = 80;
    const baseCellWidth = 120;
    const baseRowHeight = 24; // Height for each event row
    const headerHeight = 24; // Height for day numbers


const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const CalendarEventViewer = () => {
  const [events, setEvents] = useState([]);
  const [newEventInput, setNewEventInput] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showBatchInput, setShowBatchInput] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isGridView, setIsGridView] = useState(false);
  const windowSize = useWindowSize();

  const dimensions = useMemo(() => {
    return {
      cellWidth: BASE_CELL_WIDTH * zoomLevel,
      cellHeight: BASE_CELL_HEIGHT * zoomLevel,
      monthGap: MONTH_GAP * zoomLevel,
    };
  }, [zoomLevel]);

  // 計算單個月份的寬度（固定為7格）
  const monthWidth = dimensions.cellWidth * 7;

  useEffect(() => {
    setZoomLevel(layoutConfig.optimalZoom);
  }, [windowSize.width, events.length]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.3));
  };

  // Load events from localStorage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents).map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error loading saved events:', error);
      }
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const handleAddOrUpdateEvent = () => {
    const event = parseEventInput(newEventInput);
    if (event) {
      if (editingEvent) {
        setEvents(prevEvents =>
          prevEvents.map(e => e.id === editingEvent.id ? { ...event, color: editingEvent.color } : e)
        );
        setEditingEvent(null);
      } else {
        setEvents(prevEvents => [...prevEvents, { ...event, color: generateColor(prevEvents.length) }]);
      }
      setNewEventInput('');
    }
  };

  const handleProcessBatchInput = () => {
    const currentTimestamp = Date.now();
    const currentEventsCount = events.length;

    const newEvents = batchInput
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => {
        const uniqueId = currentTimestamp + index;
        const event = parseEventInput(line.trim(), uniqueId);
        if (event) {
          event.color = generateColor(index, currentEventsCount);
        }
        return event;
      })
      .filter(event => event !== null);

    if (newEvents.length > 0) {
      setEvents(prevEvents => [...prevEvents, ...newEvents]);
      setBatchInput('');
      setShowBatchInput(false);
    }
  };

  const handleStartEditing = (event) => {
    setEditingEvent(event);
    const endDateStr = event.end.getMonth() === event.start.getMonth() &&
      event.end.getDate() === event.start.getDate()
      ? ''
      : `~${(event.end.getMonth() + 1)}/${event.end.getDate()}`;
    setNewEventInput(
      `${event.start.getFullYear()}/${event.start.getMonth() + 1}/${event.start.getDate()}${endDateStr} ${event.title}`
    );
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
    if (editingEvent?.id === eventId) {
      setEditingEvent(null);
      setNewEventInput('');
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector('.calendar-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);


  const renderMonth = (month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const daysInMonth = endDate.getDate();
    const firstDayOfMonth = startDate.getDay();

    const monthEvents = events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0, 23, 59, 59);

      return eventStart <= monthEnd && eventEnd >= monthStart;
    });


    if (monthEvents.length === 0) return null;

    const allWeekSegments = monthEvents.flatMap(event =>
      splitEventIntoWeeks(event, month)
    );

    const weekGroups = new Map();
    allWeekSegments.forEach(segment => {
      const week = segment.week;
      if (!weekGroups.has(week)) {
        weekGroups.set(week, []);
      }
      weekGroups.get(week).push(segment);
    });

    const weekLayouts = new Map();
    let monthMaxRow = 0;

    weekGroups.forEach((weekEvents, week) => {
      const { rows, maxRow } = calculateWeekLayout(weekEvents);
      weekLayouts.set(week, rows);
      monthMaxRow = Math.max(monthMaxRow, maxRow);
    });

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="relative dark:bg-gray-800"
          style={{
            height: `${dimensions.cellHeight}px`,
            width: `${dimensions.cellWidth}px`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-600"
              style={{ transform: `scale(${zoomLevel})` }}></span>
          </div>
        </div>
      );
    }

    const getDateSize = () => {
      const cellSize = Math.min(dimensions.cellHeight, dimensions.cellWidth);
      return Math.floor(cellSize *.6);
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const lunarDate = getLunarDay(currentDate);

      days.push(
        <div
          key={day}
          className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          style={{
            height: `${dimensions.cellHeight}px`,
            width: `${dimensions.cellWidth}px`
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center">
            {/* 公曆日期 */}
            <div
              className="flex items-center justify-center flex-grow"
              style={{ paddingTop: '8px' }}
            >
              <span
                className="text-gray-600 dark:text-gray-500 font-light"
                style={{
                  fontSize: `${getDateSize()}px`,
                  lineHeight: 1,
                  opacity: 0.9
                }}
              >
                {day}
              </span>
            </div>
            {/* 農曆日期 */}
            {lunarDate && (
              <div
                className="text-gray-500 dark:text-gray-400 pb-1"
                style={{
                  fontSize: `${Math.min(16, getDateSize() * 0.4)}px`,
                  lineHeight: 1,
                }}
              >
                {lunarDate}
              </div>
            )}
          </div>
        </div>
      );
    }

    const eventSegments = Array.from(weekGroups.entries()).map(([week, segments]) =>
      segments.map(segment => {
        const daysInSegment = Math.floor((segment.end - segment.start) / (24 * 60 * 60 * 1000)) + 1;
        const row = weekLayouts.get(week).get(segment.id);
        const weekOffset = week * dimensions.cellHeight;

        return (
          <EventSegment
            key={segment.id}
            segment={segment}
            startOffset={segment.start.getDay()}
            daysInSegment={daysInSegment}
            row={row}
            weekOffset={weekOffset}
            zoomLevel={zoomLevel}
            onEdit={() => handleStartEditing(events.find(e => e.id === segment.originalEventId))}
            onDelete={handleDeleteEvent}
          />
        );
      })
    );

    return (
      <MonthGrid
        month={month}
        year={year}
        days={days}
        zoomLevel={zoomLevel}
        weekGroups={weekGroups}
        weekLayouts={weekLayouts}
        scaledWidth={dimensions.cellWidth * 7}
      >
        {eventSegments}
      </MonthGrid>
    );
  };

  const layoutConfig = useMemo(() => {
    if (!windowSize.width) return { gridStyle: {}, optimalZoom: 1 };

    const containerPadding = 32;
    const availableWidth = windowSize.width - (containerPadding * 2);
    const yearMonths = getSortedYearMonths(events);
    const totalMonths = yearMonths.length;

    if (totalMonths === 0) return { gridStyle: {}, optimalZoom: 1 };


    // 根據最寬月份計算每行可容納的月份數
    const maxMonthsPerRow = Math.floor((availableWidth + MONTH_GAP) / (monthWidth + MONTH_GAP));

    // 限制最多 2 列
    const optimalRows = Math.min(2, Math.ceil(totalMonths / maxMonthsPerRow));
    const monthsPerRow = Math.ceil(totalMonths / optimalRows);

    // 使用實際的月份寬度來創建 grid-template-columns
    const columnsTemplate = yearMonths
      .slice(0, monthsPerRow)
      .map((_, index) => `${monthWidth}px`)
      .join(" ");

    const marginLeft = 0;//Math.max(0, (availableWidth - monthWidth) / 2);

    // 計算最佳縮放比例
    const optimalZoom = Math.max(0.3, Math.min(availableWidth / (monthWidth * 1.1), 1.5));

    const gridStyle = isGridView ? {
      display: 'grid',
      gridTemplateColumns: columnsTemplate,
      gap: `${MONTH_GAP}px`,
      padding: '1rem',
      width: `${monthWidth}px`,
      marginLeft: `${marginLeft}px`,
      marginRight: `${marginLeft}px`
    } : {};

    return {
      gridStyle,
      optimalZoom,
      monthsPerRow,
      totalMonths
    };
  }, [windowSize.width, isGridView, events, zoomLevel]);

  return (
    <Card className="w-full bg-card text-card-foreground overflow-hidden">
      <div className="p-4">
        <Controls
          newEventInput={newEventInput}
          onEventInputChange={(e) => setNewEventInput(e.target.value)}
          onAddOrUpdate={handleAddOrUpdateEvent}
          isEditing={!!editingEvent}
          onCancelEdit={() => {
            setEditingEvent(null);
            setNewEventInput('');
          }}
          onToggleBatch={() => setShowBatchInput(!showBatchInput)}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          isGridView={isGridView}
          onToggleView={() => setIsGridView(!isGridView)}
        />

        {showBatchInput && (
          <BatchInput
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            onConfirm={handleProcessBatchInput}
            onCancel={() => {
              setBatchInput('');
              setShowBatchInput(false);
            }}
          />
        )}

        <div className="w-full overflow-x-auto">
        <div style={layoutConfig.gridStyle}>
            {events.length > 0 && getSortedYearMonths(events).map(({ year, month }, index) => (
              <div
                key={`${year}-${month}`}
                className="min-w-0"
                style={{
                  gridRow: isGridView ? Math.floor(index / layoutConfig.monthsPerRow) + 1 : 'auto'
                }}
              >
                {renderMonth(month, year)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CalendarEventViewer;