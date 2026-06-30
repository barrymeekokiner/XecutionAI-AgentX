export interface MetricsData {
  estimatedTokens?: number;
  latencyMs?: number;
}

/**
 * Safely formats a numeric value to a localized string with a fallback.
 */
export const formatMetric = (value: number | undefined, fallback: string = '0'): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return fallback;
  }
  return value.toLocaleString();
};

/**
 * Safely calculates a percentage based on value and limit.
 */
export const calculatePercent = (value: number | undefined, limit: number): number => {
  if (!value || !limit) return 0;
  return Math.min((value / limit) * 100, 100);
};

/**
 * Validates and sanitizes metrics data.
 */
export const validateMetrics = (data: any): MetricsData => {
  return {
    estimatedTokens: typeof data?.estimatedTokens === 'number' ? data.estimatedTokens : 0,
    latencyMs: typeof data?.latencyMs === 'number' ? data.latencyMs : 0,
  };
};
