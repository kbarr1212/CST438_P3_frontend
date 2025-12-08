const fs = require('fs');
const path = require('path');

describe('Profile file smoke check', () => {
  test('profile file exists and exports ProfileScreen', () => {
    const filePath = path.resolve(__dirname, '../app/(tabs)/profile.tsx');
    const exists = fs.existsSync(filePath);
    expect(exists).toBe(true);

    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toMatch(/export default function\s+ProfileScreen/);
  });
});
