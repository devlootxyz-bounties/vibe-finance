import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportExpensesCsv } from '../src/utils/exportExpensesCsv.ts';
const expense = {id:'1', createdAt:'2026-10-02', date:'2026-10-02', amount:1.2, category:'food', description:''};
test('exports headers, fixed decimals and quoted text', () => {
 assert.equal(exportExpensesCsv([{...expense, description:'a,"b"\nc'}]), 'date,category,amount,description\r\n"2026-10-02","food","1.20","a,""b""\nc"\r\n');
});
test('neutralizes formula-like descriptions', () => {
 for(const value of ['=1+1', '+cmd', '-1', '@SUM(A1)', '  =1+1', '\t=1+1']) assert.ok(exportExpensesCsv([{...expense,description:value}]).includes(`"'${value}"`));
});
test('empty exports retain the header', () => assert.equal(exportExpensesCsv([]), 'date,category,amount,description\r\n'));
