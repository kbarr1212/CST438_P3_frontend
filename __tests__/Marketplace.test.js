const fs = require('fs');
const path = require('path');

describe('Marketplace file smoke check', () => {
  test('marketplace file exists and exports MarketplaceScreen', () => {
    const filePath = path.resolve(__dirname, '../app/(tabs)/marketplace.tsx');
    const exists = fs.existsSync(filePath);
    expect(exists).toBe(true);

    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toMatch(/export default function\s+MarketplaceScreen/);
  });
});
