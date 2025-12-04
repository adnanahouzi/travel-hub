# TravelHub Mobile - React Native Hotel Booking App

A modern React Native mobile application for booking hotels using the TravelHub Booking API backend.

## Features

- **Hotel Search**: Search hotels by location with flexible filters
- **Place Search**: Smart location search with autocomplete
- **Hotel Details**: View comprehensive hotel information with photos and amenities
- **Rate Comparison**: Compare different room types and rates
- **Reviews**: Read guest reviews with sentiment analysis
- **Booking**: Complete booking process with guest information

## Tech Stack

- **React Native** with Expo
- **React Navigation** for navigation
- **Axios** for API calls
- **Context API** for state management
- **Expo Vector Icons** for icons

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Java Backend API running on `http://localhost:8080`

## Installation

1. Install dependencies:
```bash
cd travel-hub-mobile
npm install
```

2. Update API configuration (if needed):
Edit `src/config/api.config.js` to point to your backend URL.

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api/v1',  // Change this if needed
  TIMEOUT: 30000,
};
```

## Running the App

### Start the development server:
```bash
npm start
```

### Run on iOS Simulator:
```bash
npm run ios
```

### Run on Android Emulator:
```bash
npm run android
```

### Run on physical device:
1. Install Expo Go app on your device
2. Scan the QR code displayed in the terminal

## Project Structure

```
travel-hub-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── HotelCard.js
│   │   ├── RateCard.js
│   │   ├── ReviewCard.js
│   │   ├── SearchBar.js
│   │   ├── Button.js
│   │   └── LoadingSpinner.js
│   ├── screens/             # App screens
│   │   ├── SearchScreen.js
│   │   ├── HotelListScreen.js
│   │   ├── HotelDetailsScreen.js
│   │   └── BookingScreen.js
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js
│   ├── context/            # Context providers
│   │   └── BookingContext.js
│   ├── services/           # API services
│   │   └── api.service.js
│   └── config/             # Configuration files
│       └── api.config.js
├── App.js                  # Main app entry
└── package.json
```

## API Integration

The app integrates with the following backend endpoints:

### Rate Endpoints
- `POST /api/v1/rates/search` - Search for hotel rates
- `POST /api/v1/rates/{hotelId}` - Get rates for a specific hotel

### Hotel Data Endpoints
- `POST /api/v1/hotels/places` - Search for places
- `GET /api/v1/hotels/reviews` - Get hotel reviews

## Usage

1. **Search for Hotels**:
   - Enter a destination (e.g., "Paris")
   - Select from suggested places
   - Choose check-in and check-out dates
   - Select number of guests
   - Tap "Search Hotels"

2. **Browse Results**:
   - View list of available hotels
   - See pricing, ratings, and basic info
   - Tap on a hotel to view details

3. **View Hotel Details**:
   - Switch between Rates, Details, and Reviews tabs
   - View room options with pricing
   - Read guest reviews
   - Select a rate to book

4. **Complete Booking**:
   - Review booking summary
   - Enter guest information
   - Review cancellation policy
   - Confirm booking

## Configuration

### API Base URL
For local development with iOS simulator or Android emulator:
- iOS: `http://localhost:8080`
- Android: `http://10.0.2.2:8080` (Android emulator)
- Physical device: Use your computer's local IP (e.g., `http://192.168.1.100:8080`)

Update in `src/config/api.config.js`:
```javascript
const API_CONFIG = {
  BASE_URL: Platform.select({
    ios: 'http://localhost:8080/api/v1',
    android: 'http://10.0.2.2:8080/api/v1',
    default: 'http://localhost:8080/api/v1',
  }),
};
```

## Development Notes

- Make sure your backend API is running before starting the mobile app
- The app uses demo/sandbox mode for testing
- Date inputs use simple text fields (consider using DateTimePicker for production)
- Payment integration is not implemented (displays confirmation only)

## Troubleshooting

**Network request failed**:
- Ensure backend API is running
- Check API_CONFIG.BASE_URL matches your backend
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For physical device, use your computer's local IP

**Module not found**:
```bash
npm install
expo start -c  # Clear cache
```

**Navigation errors**:
```bash
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

## Future Enhancements

- Add date picker component
- Implement payment integration
- Add booking history
- Add favorites/wishlist
- Implement filters (price range, star rating, facilities)
- Add map view for hotel locations
- Implement push notifications for booking updates
- Add multi-language support

## License

MIT

