import { readFileSync } from 'node:fs';
import { auditCatalogue } from '../lib/domain/catalogue-core.mjs';
const source = JSON.parse(readFileSync(new URL('../sofa-catalogue-for-codex.json', import.meta.url), 'utf8'));
const report = auditCatalogue(source);
console.log(JSON.stringify(report, null, 2));
if (report.duplicateKeys.length || report.records !== 108) process.exitCode = 1;
