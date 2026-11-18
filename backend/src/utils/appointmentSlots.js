const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDayName(date) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : DAY_NAMES[parsed.getUTCDay()];
}

function toMinutes(value) {
  if (typeof value !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return null;
  }
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function formatTime(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Return contiguous 30-minute appointments within a doctor's configured hours.
 * Booked slots are excluded by start time. Times are local clinic HH:mm values.
 */
function getSlots(availability, bookedStartTimes = []) {
  if (!availability) return [];

  const start = toMinutes(availability.startTime);
  const end = toMinutes(availability.endTime);
  if (start === null || end === null || start >= end) return [];

  const booked = new Set(bookedStartTimes);
  const slots = [];

  for (let time = start; time + 30 <= end; time += 30) {
    const startTime = formatTime(time);
    if (!booked.has(startTime)) {
      slots.push({ startTime, endTime: formatTime(time + 30) });
    }
  }
  return slots;
}

module.exports = { getDayName, getSlots };
