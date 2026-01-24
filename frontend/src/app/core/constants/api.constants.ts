import { environment } from '../../../environments/environment';

/**
 * API Constants
 * Centralized API endpoints and configuration
 */
export const API_CONFIG = {
  BASE_URL: environment.apiUrl,
  VERSION: environment.apiVersion,
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    BY_ID: (id: number) => `/users/${id}`,
    UPDATE_PASSWORD: '/users/change-password',
  },
  
  // Workspaces
  WORKSPACES: {
    BASE: '/workspaces',
    BY_ID: (id: number) => `/workspaces/${id}`,
    MEMBERS: (id: number) => `/workspaces/${id}/members`,
    BOARDS: (id: number) => `/workspaces/${id}/boards`,
  },
  
  // Boards
  BOARDS: {
    BASE: '/boards',
    BY_ID: (id: number) => `/boards/${id}`,
    COLUMNS: (id: number) => `/boards/${id}/columns`,
    MEMBERS: (id: number) => `/boards/${id}/members`,
    LABELS: (id: number) => `/boards/${id}/labels`,
    ACTIVITIES: (id: number) => `/boards/${id}/activities`,
  },
  
  // Columns
  COLUMNS: {
    BASE: '/columns',
    BY_ID: (id: number) => `/columns/${id}`,
    CARDS: (id: number) => `/columns/${id}/cards`,
    REORDER: (id: number) => `/columns/${id}/reorder`,
  },
  
  // Cards
  CARDS: {
    BASE: '/cards',
    BY_ID: (id: number) => `/cards/${id}`,
    COMMENTS: (id: number) => `/cards/${id}/comments`,
    ATTACHMENTS: (id: number) => `/cards/${id}/attachments`,
    MEMBERS: (id: number) => `/cards/${id}/members`,
    LABELS: (id: number) => `/cards/${id}/labels`,
    MOVE: (id: number) => `/cards/${id}/move`,
  },
  
  // Comments
  COMMENTS: {
    BASE: '/comments',
    BY_ID: (id: number) => `/comments/${id}`,
  },
  
  // Attachments
  ATTACHMENTS: {
    BASE: '/attachments',
    BY_ID: (id: number) => `/attachments/${id}`,
    UPLOAD: '/attachments/upload',
  },
  
  // Labels
  LABELS: {
    BASE: '/labels',
    BY_ID: (id: number) => `/labels/${id}`,
  },
} as const;

/**
 * HTTP Headers
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE_JSON: 'application/json',
  AUTHORIZATION: 'Authorization',
  BEARER_PREFIX: 'Bearer ',
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;
