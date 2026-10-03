import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as service from '../src/services/expenseService.ts';
const key = 'finance-app-expenses';
const sample = {amount: 1, category: 'food', description: 'Lunch', date: '2026-10-02'};
let store = new Map();
Object.defineProperty(globalThis, 'localStorage', {configurable: true, value: {getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value)}});
test('adds cents exactly and respects category filtering', () => {
 store = new Map();
 service.createExpense({...sample, amount: 0.1}); service.createExpense({...sample, amount: 0.2});
 service.createExpense({...sample, amount: 2, category: 'transport'});
 assert.equal(service.getTotalSpending({category:'food'}), 0.3);
 assert.deepEqual(service.getCategoryTotals({category:'food'}), [{category:'food', total:0.3, count:2}]);
 assert.equal(service.getTotalSpending(), 2.3);
});
