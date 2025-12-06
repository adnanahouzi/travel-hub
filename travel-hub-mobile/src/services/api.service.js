import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '../config/api.config';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const ApiService = {
  // Search for places
  searchPlaces: async (params) => {
    // Support both object param (new) and positional arguments (old)
    if (typeof params === 'string') {
      return apiClient.post(ENDPOINTS.SEARCH_PLACES, {
        textQuery: params,
        language: arguments[1] || 'en',
        clientIP: arguments[2] || null,
      });
    }
    return apiClient.post(ENDPOINTS.SEARCH_PLACES, params);
  },

  // Search for hotel rates
  searchRates: async (searchParams) => {
    return apiClient.post(ENDPOINTS.SEARCH_RATES, searchParams);
  },

  // Get rates for a specific hotel
  getHotelRates: async (hotelId, searchParams) => {
    return apiClient.post(ENDPOINTS.GET_HOTEL_RATES(hotelId), searchParams);
  },

  // Get hotel reviews
  getHotelReviews: async (hotelId, params = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append('hotelId', hotelId);

    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.timeout) queryParams.append('timeout', params.timeout);
    if (params.getSentiment !== undefined) queryParams.append('getSentiment', params.getSentiment);

    return apiClient.get(`${ENDPOINTS.GET_REVIEWS}?${queryParams.toString()}`);
  },

  // Booking operations
  prebook: async (requests) => {
    // requests should be an array of { offerId, usePaymentSdk }
    return apiClient.post(ENDPOINTS.PREBOOK, requests);
  },

  book: async (bookingData) => {
    return apiClient.post(ENDPOINTS.BOOK, bookingData);
  },
};

export default apiClient;

