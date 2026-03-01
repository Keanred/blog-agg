import { setUser, readConfig } from './config';
function main() {
  setUser({ dbUrl: 'postgres://example',
    currentUserName: 'gatoruser' });
  const config = readConfig();
  console.log('Current configuration:', config);
}

main();
