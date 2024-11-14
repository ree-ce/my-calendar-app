import { getWeekNumber } from './dateUtils';

export const generateColor = (index, totalEvents = 0) => {
  const hue = ((index + totalEvents) * 137.5) % 360;
  return `hsla(${hue}, 70%, 75%, 0.7)`;
};

export const splitEventIntoWeeks = (event, month) => {
  const year = event.start.getFullYear();
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);
  const firstDayOfMonth = monthStart.getDay();

  const eventStart = new Date(Math.max(event.start, monthStart));
  const eventEnd = new Date(Math.min(event.end, monthEnd));

  const segments = [];
  let currentDate = new Date(eventStart);

  while (currentDate <= eventEnd) {
    const currentWeek = getWeekNumber(currentDate, firstDayOfMonth);

    const weekEndDay = 6 - currentDate.getDay();
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(currentDate.getDate() + weekEndDay);

    const segmentEnd = new Date(Math.min(
      weekEnd.getTime(),
      eventEnd.getTime()
    ));

    segments.push({
      id: `${event.id}-week-${currentWeek}`,
      originalEventId: event.id,
      start: new Date(currentDate),
      end: new Date(segmentEnd),
      week: currentWeek,
      title: event.title,
      color: event.color,
      isFirstSegment: currentDate.getTime() === eventStart.getTime(),
      isLastSegment: segmentEnd.getTime() === eventEnd.getTime()
    });

    currentDate = new Date(weekEnd);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return segments;
};

export const calculateWeekLayout = (weekEvents) => {
  const rows = new Map();
  let maxRow = 0;

  weekEvents.sort((a, b) => {
    const startDiff = a.start.getTime() - b.start.getTime();
    if (startDiff !== 0) return startDiff;

    const aDuration = a.end.getTime() - a.start.getTime();
    const bDuration = b.end.getTime() - b.start.getTime();
    return aDuration - bDuration;
  });

  weekEvents.forEach(event => {
    let row = 0;
    while (true) {
      const hasConflict = weekEvents.some(other =>
        rows.get(other.id) === row &&
        event.id !== other.id &&
        event.start <= other.end &&
        event.end >= other.start
      );

      if (!hasConflict) {
        rows.set(event.id, row);
        maxRow = Math.max(maxRow, row);
        break;
      }
      row++;
    }
  });

  return { rows, maxRow };
};
