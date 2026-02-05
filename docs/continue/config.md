# Continue: Config and API Key

This project uses a `.continue/config.json` file to configure AI models for the Continue tooling.

**Required environment variable**
- `CONTINUE_GOOGLE_API_KEY` — Set this to your Google/AI API key. Do not commit real secrets to the repo.

Steps:
1. Add `CONTINUE_GOOGLE_API_KEY` to your local `.env` (or your CI secrets).
2. Keep `.env.example` populated with a placeholder (already added).
3. The `.continue/config.json` file now references the env var using the `ENV:` prefix. Ensure the tooling that reads this file checks env vars.

If you'd like, I can also wire up code to read the `ENV:` references automatically.

## Loader included 🔧

A small loader `lib/continueConfig.ts` was added to resolve `ENV:VAR_NAME` placeholders at runtime.

Example usage (TypeScript):

```ts
import { loadContinueConfig } from '../../lib/continueConfig';

const cfg = loadContinueConfig();
console.log(cfg.models);
```

This will throw if a required env var is missing.