const test = require('node:test');
const assert = require('node:assert/strict');
const { getDayName, getSlots } = require('../src/utils/appointmentSlots');

test('respects doctor working hours rather than a fixed timetable', () => {
  assert.deepEqual(getSlots({ startTime: '10:00', endTime: '11:30' }), [
    { startTime: '10:00', endTime: '10:30' },
    { startTime: '10:30', endTime: '11:00' },
    { startTime: '11:00', endTime: '11:30' }
  ]);
});

test('removes already booked slots without changing adjacent slots', () => {
  assert.deepEqual(
    getSlots({ startTime: '09:00', endTime: '10:30' }, ['09:30']),
    [
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '10:00', endTime: '10:30' }
    ]
  );
});

test('discards incomplete and invalid work windows', () => {
  assert.deepEqual(getSlots({ startTime: '09:15', endTime: '09:40' }), []);
  assert.deepEqual(getSlots({ startTime: '17:00', endTime: '09:00' }), []);
  assert.deepEqual(getSlots({ startTime: 'invalid', endTime: '12:00' }), []);
  assert.deepEqual(getSlots(null), []);
});

test('supports non-whole-hour starts', () => {
  assert.deepEqual(getSlots({ startTime: '09:15', endTime: '10:20' }), [
    { startTime: '09:15', endTime: '09:45' },
    { startTime: '09:45', endTime: '10:15' }
  ]);
});

test('derives a stable weekday from a date-only ISO string', () => {
  assert.equal(getDayName('2026-11-18'), 'Wednesday');
  assert.equal(getDayName('not-a-date'), null);
});
