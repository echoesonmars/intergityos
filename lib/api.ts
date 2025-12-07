/**
 * API Client for IntegrityOS Backend
 * Handles all communication with the FastAPI backend
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

export interface ApiError {
  error: string;
  detail?: string;
}

// Type definitions
export interface DefectDetails {
  type?: string;
  severity?: string;
  parameters?: {
    length_mm?: number;
    width_mm?: number;
    depth_mm?: number;
    depth_percent?: number;
    wall_thickness_nominal_mm?: number;
  };
  location?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    timestamp?: string;
  };
  surface_location?: string;
  distance_to_weld_m?: number;
  erf_b31g_code?: number;
}

export interface Defect {
  defect_id?: string;
  segment_number?: number;
  measurement_distance_m?: number;
  pipeline_id?: string;
  severity?: string;
  details?: DefectDetails;
}

export interface DefectsResponse {
  total: number;
  defects: Defect[];
  filters_applied?: Record<string, unknown>;
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.error || errorData.detail || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}

/**
 * Authenticated API request with JWT token
 */
async function authenticatedRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

/**
 * Defects API
 */
export const defectsApi = {
  /**
   * Get all defects with optional filters
   */
  getAll: async (params?: {
    defect_type?: string;
    segment?: number;
    limit?: number;
    skip?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.defect_type) queryParams.append('defect_type', params.defect_type);
    if (params?.segment) queryParams.append('segment', params.segment.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());

    const query = queryParams.toString();
    return apiRequest<DefectsResponse>(`/defects${query ? `?${query}` : ''}`);
  },

  /**
   * Get defect by ID
   */
  getById: async (defectId: string) => {
    return apiRequest<Defect>(`/defects/${defectId}`);
  },

  /**
   * Search defects
   */
  search: async (params: {
    defect_type?: string;
    segment?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.defect_type) queryParams.append('defect_type', params.defect_type);
    if (params.segment) queryParams.append('segment', params.segment.toString());

    const query = queryParams.toString();
    return apiRequest<Defect[]>(`/defects/search${query ? `?${query}` : ''}`);
  },

  /**
   * Get defects by type
   */
  getByType: async (defectType: string) => {
    return apiRequest<DefectsResponse>(`/defects/type/${defectType}`);
  },

  /**
   * Get defects by segment
   */
  getBySegment: async (segmentId: number) => {
    return apiRequest<DefectsResponse>(`/defects/segment/${segmentId}`);
  },
};

/**
 * Statistics API
 */
export const statisticsApi = {
  /**
   * Get statistics
   */
  get: async () => {
    return apiRequest<{
      total_defects: number;
      defects_by_type: Record<string, number>;
      defects_by_severity: Record<string, number>;
      total_segments: number;
      average_depth_percent: number;
    }>('/statistics');
  },
};

/**
 * ML API
 */
export const mlApi = {
  /**
   * Predict defect severity
   */
  predict: async (data: Record<string, unknown>) => {
    return apiRequest<{
      severity: string;
      probability: number;
      probabilities: Record<string, number>;
      model_type: string;
      prediction_timestamp: string;
    }>('/ml/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get model info
   */
  getModelInfo: async () => {
    return apiRequest<{
      status: string;
      model_type?: string;
      is_loaded?: boolean;
      model_path?: string;
      features_count?: number;
      training_date?: string;
      version?: string;
      message?: string;
    }>('/ml/model/info');
  },

  /**
   * Get model metrics
   */
  getModelMetrics: async () => {
    return apiRequest<{
      accuracy: number;
      precision: number;
      recall: number;
      f1_score: number;
      classification_report: string;
    }>('/ml/model/metrics');
  },
};

/**
 * Auth API
 */
export const authApi = {
  /**
   * Login and get JWT token
   */
  login: async (username: string, password: string) => {
    return apiRequest<{
      access_token: string;
      token_type: string;
      expires_in: number;
      role: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * Get current user info
   */
  getMe: async (token: string) => {
    return authenticatedRequest<{
      username: string;
      role: string;
    }>('/auth/me', token);
  },
};

/**
 * Health check
 */
export const healthApi = {
  check: async () => {
    return apiRequest<{
      status: string;
      timestamp?: string;
      version?: string;
      database?: string;
      defects_count?: number;
    }>('/health');
  },

  /**
   * Get root endpoint info
   */
  root: async () => {
    return apiRequest<{
      service: string;
      version: string;
      status: string;
      docs: string;
    }>('/');
  },

  /**
   * Get system information
   */
  getInfo: async () => {
    return apiRequest<{
      application: string;
      version: string;
      database_mode: string;
      total_defects: number;
      ml_available: boolean;
      statistics: Record<string, unknown>;
      available_endpoints: Record<string, string>;
    }>('/info');
  },
};

/**
 * Export API
 */
export const exportApi = {
  /**
   * Export defects to JSON
   */
  exportJson: async (token: string) => {
    return authenticatedRequest<Blob>('/export/json', token, {
      method: 'GET',
    });
  },
};

/**
 * Admin API (requires authentication)
 */
export const adminApi = {
  /**
   * Create defect (admin only)
   */
  createDefect: async (token: string, data: Record<string, unknown>) => {
    return authenticatedRequest<Defect>('/admin/defects', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update defect (admin only)
   */
  updateDefect: async (token: string, defectId: string, data: Record<string, unknown>) => {
    return authenticatedRequest<Defect>(`/admin/defects/${defectId}`, token, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete defect (admin only)
   */
  deleteDefect: async (token: string, defectId: string) => {
    return authenticatedRequest<void>(`/admin/defects/${defectId}`, token, {
      method: 'DELETE',
    });
  },

  /**
   * Update all severities using ML (admin only)
   */
  updateAllSeverities: async (token: string) => {
    return authenticatedRequest<{
      total_defects: number;
      updated: number;
      failed: number;
      errors: string[];
    }>('/admin/defects/update-all-severities', token, {
      method: 'POST',
    });
  },

  /**
   * Reload data from CSV (admin only)
   */
  reload: async (token: string) => {
    return authenticatedRequest<{
      status: string;
      message: string;
      inserted: number;
      errors: number;
      error_log?: string;
    }>('/reload', token, {
      method: 'POST',
    });
  },

  /**
   * Clear all defects (admin only)
   */
  clear: async (token: string) => {
    return authenticatedRequest<void>('/clear', token, {
      method: 'DELETE',
    });
  },
};

