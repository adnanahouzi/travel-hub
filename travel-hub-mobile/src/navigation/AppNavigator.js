import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SearchScreen,
  HotelListScreen,
  HotelMapScreen,
  HotelDetailsScreen,
  BookingScreen,
  RoomListScreen,
  BookingSummaryScreen,
  PaymentCheckoutScreen,
  OtpVerificationScreen,
  BookingSuccessScreen,
  BookingDetailsScreen,
  MyBookingsScreen,
  RoomRateSelectionScreen
} from '../screens';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="HotelList" component={HotelListScreen} />
        <Stack.Screen name="HotelMap" component={HotelMapScreen} />
        <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} />
        <Stack.Screen name="RoomList" component={RoomListScreen} />
        <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="PaymentCheckout" component={PaymentCheckoutScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
        <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
        <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
        <Stack.Screen name="RoomRateSelection" component={RoomRateSelectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
