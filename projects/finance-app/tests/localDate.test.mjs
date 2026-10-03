import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localDateValue } from '../src/utils/localDate.ts';
test('uses local dates on either side of UTC midnight', () => {
 const previous = process.env.TZ;
 try {
  process.env.TZ = 'America/Vancouver';
  assert.equal(localDateValue(new Date('2026-10-03T01:30:00Z')), '2026-10-02');
  process.env.TZ = 'Asia/Tokyo';
  assert.equal(localDateValue(new Date('2026-10-03T01:30:00Z')), '2026-10-03');
 } finally { if(previous === undefined) delete process.env.TZ; else process.env.TZ = previous; }
});
