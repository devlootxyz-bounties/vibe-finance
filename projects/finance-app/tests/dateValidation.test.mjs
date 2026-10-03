import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dateError} from '../src/utils/dateValidation.ts';
test('empty date is rejected', () => assert.equal(dateError(''), 'Date is required'));
test('future dates cannot be saved', () => assert.ok(dateError('2999-12-31')));
