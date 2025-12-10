import 'dotenv/config';
import { execSync } from 'child_process';

if (!process.env.IP_ADDRESS) {
  console.error(' IP_ADDRESS is not defined');
  process.exit(1);
}

const inputUrl = `http://${process.env.IP_ADDRESS}:3000/api-json`;
execSync(
  `npx openapi-typescript-codegen --input ${inputUrl} --output src/api/generate --client axios`,
  { stdio: 'inherit' }
);

execSync('node src/api/generate-hooks.js', { stdio: 'inherit' });