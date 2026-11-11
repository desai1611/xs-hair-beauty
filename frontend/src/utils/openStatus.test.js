import { describe, it, expect } from 'vitest';
import { openStatus } from './openStatus';
import { DEFAULT_HOURS } from '../config/salon';

// Auckland is UTC+13 in November (daylight saving).
describe('openStatus', () => {
  it('says open during opening hours', () => {
    const thu10am = new Date('2026-11-11T21:00:00Z'); // Thursday 10:00 NZDT
    expect(openStatus(DEFAULT_HOURS, thu10am)).toEqual({ open: true, text: 'Open now · until 6:00 PM' });
  });

  it('says when it opens later today', () => {
    const thu8am = new Date('2026-11-11T19:00:00Z'); // Thursday 08:00 NZDT
    expect(openStatus(DEFAULT_HOURS, thu8am).text).toBe('Closed · opens today 9:30 AM');
  });

  it('points to the next open day after closing time', () => {
    const sat7pm = new Date('2026-11-14T06:00:00Z'); // Saturday 19:00 NZDT
    expect(openStatus(DEFAULT_HOURS, sat7pm).text).toBe('Closed · opens Sun 10:00 AM');
  });

  it('skips a closed day', () => {
    const sun7pm = new Date('2026-11-15T06:00:00Z'); // Sunday 19:00 NZDT, Monday is closed
    expect(openStatus(DEFAULT_HOURS, sun7pm).text).toBe('Closed · opens Tue 9:30 AM');
  });

  it('returns null when the hours text is not understood', () => {
    expect(openStatus(['Come any time!'])).toBeNull();
  });
});
