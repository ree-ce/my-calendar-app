export const parseEventInput = (input, customId = null, currentYear = new Date().getFullYear()) => {
  const regex = /(?:(\d{4})?\/)?(\d{1,2}\/\d{1,2})(?:[-~](?:(\d{4})?\/)?(\d{1,2}\/\d{1,2}))?\s+(.+)/;
  const match = input.trim().match(regex);

  if (match) {
    const [_, startYear, startDate, endYear, endDate, title] = match;

    const startFullDate = `${startYear || currentYear}/${startDate}`;
    const start = new Date(startFullDate);

    let end;
    if (endDate) {
      const endFullDate = `${endYear || startYear || currentYear}/${endDate}`;
      end = new Date(endFullDate);
      end.setHours(23, 59, 59);
    } else {
      end = new Date(start);
      end.setHours(23, 59, 59);
    }

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error('Invalid date parsing result');
      return null;
    }

    return {
      id: customId || Date.now() + Math.random(),
      start,
      end,
      title: title.trim()
    };
  }
  return null;
};

export const getWeekNumber = (date, firstDayOfMonth) => {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekStart = new Date(monthStart);
  firstWeekStart.setDate(1 - firstDayOfMonth);

  const diffTime = date.getTime() - firstWeekStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

export const getSortedYearMonths = (events) => {
  const yearMonths = new Set();

  events.forEach(event => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const lastDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (currentDate <= lastDate) {
      yearMonths.add(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  });

  return Array.from(yearMonths)
    .map(ym => {
      const [year, month] = ym.split('-').map(Number);
      return { year, month };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
};
