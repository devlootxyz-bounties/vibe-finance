import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as service from '../src/services/expenseService.ts';
const key = 'finance-app-expenses';
const sample = {amount: 1, category: 'food', description: 'Lunch', date: '2026-10-02'};
let store = new Map();
Object.defineProperty(globalThis, 'localStorage', {configurable: true, value: {getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value)}});
test('mutations preserve unreadable datasets', () => {
 for (const raw of ['{broken', '{}', '[{"id":"bad"}]']) {
  store = new Map([[key, raw]]);
  for (const mutate of [() => service.createExpense(sample), () => service.updateExpense('x', sample), () => service.deleteExpense('x')]) {
   assert.throws(mutate, /Stored expenses/); assert.equal(store.get(key), raw);
  }
 }
});
test('valid records still round trip', () => { store = new Map(); const saved = service.createExpense(sample); assert.equal(service.getExpense(saved.id).description, 'Lunch'); });
