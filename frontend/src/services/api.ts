import { ApiResponse, HealthStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Enterprise API client wrapper with standardized error handling and typing.
 */
export async function fetchHealthStatus(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Health check probe failed with status ${response.status}`);
  }

  const result: ApiResponse<HealthStatus> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.message || 'Failed to retrieve system health');
  }

  return result.data;
}

