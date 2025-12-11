// IMPORTANT: Update this IP address to match your computer's local IP
// To find your Mac's IP address, run: ifconfig | grep "inet " | grep -v 127.0.0.1
// Example: 192.168.1.100
const YOUR_COMPUTER_IP = '10.57.212.100'; // Change this to your Mac's IP (e.g., '192.168.1.100')

export const API_CONFIG = {
  BASE_URL: `http://${YOUR_COMPUTER_IP}:8080/api/v1`,
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  // Rate endpoints
  SEARCH_RATES: '/rates/search',
  GET_HOTEL_RATES: (hotelId) => `/rates/${hotelId}`,

  // Hotel data endpoints
  SEARCH_PLACES: '/hotels/places',
  GET_PLACE_DETAILS: (placeId) => `/hotels/places/${placeId}`,
  GET_REVIEWS: '/hotels/reviews',

  // Booking endpoints
  PREBOOK: '/booking/prebook',
  BOOK: '/booking/book',
  INITIATE_BOOKING: '/booking/initiate',
  SUBMIT_BOOKING: '/booking/submit',
  GET_BOOKING: (bookingId) => `/booking/${bookingId}`,
  GET_HOTEL_DETAILS: (hotelId) => `/hotels/${hotelId}`,
  LIST_BOOKINGS: '/booking/list',
};
