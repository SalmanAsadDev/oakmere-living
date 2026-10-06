import { execFileSync } from 'node:child_process';

// Credentials stay in memory. This script never prints or persists tokens.
const credential = execFileSync('git', ['credential', 'fill'], {
  input: 'protocol=https\nhost=github.com\n\n',
  encoding: 'utf8', timeout: 30000,
  env: { ...process.env, GCM_INTERACTIVE: 'never', GIT_TERMINAL_PROMPT: '0' },
});
const fields = Object.fromEntries(credential.trim().split('\n').map(line => {
  const split = line.indexOf('=');
  return [line.slice(0, split), line.slice(split + 1).trim()];
}));
if (!fields.password) throw new Error('No GitHub credential available. Sign in using Git Credential Manager.');
const headers = { Authorization: `Bearer ${fields.password}`, Accept: 'application/vnd.github+json', 'User-Agent': 'oakmere-living-setup', 'X-GitHub-Api-Version': '2022-11-28' };
const request = (path, options = {}) => fetch(`https://api.github.com${path}`, { headers, ...options, signal: AbortSignal.timeout(20000) });
const profileResponse = await request('/user');
if (!profileResponse.ok) throw new Error(`GitHub authentication failed: ${profileResponse.status}`);
const profile = await profileResponse.json();
if (profile.login !== 'SalmanAsadDev') throw new Error('Saved Git credential belongs to a different account.');
const name = 'oakmere-living';
const existing = await request(`/repos/${profile.login}/${name}`);
if (existing.status !== 404) {
  if (!existing.ok) throw new Error(`Repository check failed: ${existing.status}`);
  const repo = await existing.json();
  console.log(JSON.stringify({ status: 'exists-review-before-linking', url: repo.html_url, private: repo.private }));
  process.exit(0);
}
const created = await request('/user/repos', {
  method: 'POST', body: JSON.stringify({ name, private: true, description: 'Oakmere Living — UK furniture storefront and order management', auto_init: false }),
});
if (!created.ok) throw new Error(`Repository creation failed: ${created.status}`);
const repo = await created.json();
console.log(JSON.stringify({ status: 'created', url: repo.html_url, cloneUrl: repo.clone_url, private: repo.private }));
