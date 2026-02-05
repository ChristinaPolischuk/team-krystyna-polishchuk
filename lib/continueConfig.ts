import fs from 'fs';
import path from 'path';

export type ModelConfig = {
  title: string;
  provider: string;
  model: string;
  apiKey: string; // may be a resolved value
  [k: string]: any;
};

export type ContinueConfig = {
  models: ModelConfig[];
  [k: string]: any;
};

function resolveEnvValues(value: any): any {
  if (typeof value === 'string') {
    if (value.startsWith('ENV:')) {
      const varName = value.slice(4);
      const envValue = process.env[varName];
      if (envValue === undefined) {
        throw new Error(
          `Missing required environment variable for config: ${varName}`
        );
      }
      return envValue;
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(resolveEnvValues);
  }

  if (value && typeof value === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolveEnvValues(v);
    }
    return out;
  }

  return value;
}

export function loadContinueConfig(): ContinueConfig {
  const cfgPath = path.resolve(process.cwd(), '.continue', 'config.json');
  if (!fs.existsSync(cfgPath)) {
    throw new Error(`Continue config not found at ${cfgPath}`);
  }

  const raw = fs.readFileSync(cfgPath, 'utf8');
  const parsed = JSON.parse(raw) as ContinueConfig;
  return resolveEnvValues(parsed) as ContinueConfig;
}
