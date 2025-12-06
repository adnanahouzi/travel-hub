import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    occupancies: [{ adults: 2, children: 0, childrenAges: [] }],
    currency: 'MAD',
    guestNationality: 'MA',
    checkin: null,
    checkout: null,
    placeId: null,
    placeName: null,
    searchLocation: null, // { latitude, longitude, description }
  });

  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const updateSearchParams = (params) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
  };

  const clearSearchResults = () => {
    setSearchResults([]);
    setTotalResults(0);
    setSelectedHotel(null);
  };

  const appendSearchResults = (newResults) => {
    setSearchResults((prev) => {
      // Create a Set of existing hotel IDs for efficient lookup
      const existingIds = new Set(prev.map(h => h.hotelId));

      // Filter out duplicates within newResults itself and against existingIds
      const uniqueNewResults = [];
      const newIds = new Set();

      for (const hotel of newResults) {
        if (!existingIds.has(hotel.hotelId) && !newIds.has(hotel.hotelId)) {
          uniqueNewResults.push(hotel);
          newIds.add(hotel.hotelId);
        }
      }

      return [...prev, ...uniqueNewResults];
    });
  };

  const value = {
    searchParams,
    updateSearchParams,
    searchResults,
    setSearchResults,
    totalResults,
    setTotalResults,
    appendSearchResults,
    selectedHotel,
    setSelectedHotel,
    loading,
    setLoading,
    loadingMore,
    setLoadingMore,
    error,
    setError,
    clearSearchResults,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
