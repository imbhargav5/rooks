import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { findUpSync } from 'find-up';

const contributorsConfigPath = findUpSync('.all-contributorsrc');

if (!contributorsConfigPath) {
    throw new Error('.all-contributorsrc file not found');
}

const fileToWritePath = join(__dirname, 'src/components/contributors-list-data.ts');

const contributorsData = JSON.parse(readFileSync(contributorsConfigPath, 'utf-8'));

writeFileSync(fileToWritePath, `export const contributorsListData = ${JSON.stringify(contributorsData, null, 2)}`);


