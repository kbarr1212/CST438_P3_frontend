const fs = require('fs');
const path = require('path');

describe('Cart file smoke check', () => {
  test('cart file exists and exports CartScreen', () => {
    const filePath = path.resolve(__dirname, '../app/(tabs)/cart.tsx');
    const exists = fs.existsSync(filePath);
    expect(exists).toBe(true);

    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toMatch(/export default function\s+CartScreen/);
  });
});
