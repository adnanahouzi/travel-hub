# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd travel-hub-mobile
npm install
```

### 2. Configure Backend URL
The app is pre-configured to connect to `http://localhost:8080/api/v1`.

**For Android Emulator**, update `src/config/api.config.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:8080/api/v1',  // Android emulator
  // ...
};
```

**For Physical Device**, use your computer's local IP:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.XXX:8080/api/v1',  // Replace XXX with your IP
  // ...
};
```

### 3. Start the App
```bash
npm start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## First Test

1. Make sure your Java backend is running
2. In the app, search for "Paris"
3. Select a destination from the dropdown
4. Enter dates (format: YYYY-MM-DD, e.g., 2024-12-25)
5. Select number of guests
6. Tap "Search Hotels"
7. Browse results and tap on a hotel
8. View rates and details
9. Select a rate to book

## Common Issues

**"Network request failed"**
- Backend not running → Start your Java Spring Boot app
- Wrong URL → Check `src/config/api.config.js`
- Android emulator → Use `10.0.2.2` instead of `localhost`

**App won't start**
```bash
npm install
rm -rf node_modules package-lock.json
npm install
expo start -c
```

## Next Steps

- Customize the UI colors and branding
- Add date picker library for better UX
- Implement actual payment integration
- Add error boundaries and retry logic
- Implement booking history feature

