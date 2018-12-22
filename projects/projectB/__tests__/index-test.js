const sum = require('../index.js');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('adds 14 + 6 to equal 20', () => {
  expect(sum(14, 6)).toBe(20);
});

test('adds 30 + -120 to equal -90', () => {
  expect(sum(30, -120)).toBe(-90);
});