const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
} as const;

const levelConfig: Record<string, { color: string; label: string }> = {
  INFO: { color: colors.green, label: 'INFO' },
  DEBUG: { color: colors.magenta, label: 'DEBUG' },
  WARN: { color: colors.yellow, label: 'WARN' },
  ERROR: { color: colors.red, label: 'ERROR' },
};

export function httpLog(
  level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR',
  data: Record<string, unknown>,
): void {
  const config = levelConfig[level];
  const timestamp = new Date().toISOString();

  const logEntry = { timestamp, level, ...data };
  const json = JSON.stringify(logEntry);

  const coloredOutput = `${colors.gray}${timestamp}${colors.reset} ${config.color}[${config.label}]${colors.reset} ${json}`;

  if (level === 'ERROR') {
    console.error(coloredOutput);
  } else {
    console.log(coloredOutput);
  }
}
