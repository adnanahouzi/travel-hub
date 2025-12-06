import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SearchScreen,
  HotelListScreen,
  HotelDetailsScreen,
  BookingScreen,
  RoomListScreen,
  BookingSummaryScreen,
  PaymentCheckoutScreen
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
        <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} />
        <Stack.Screen name="RoomList" component={RoomListScreen} />
        <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="PaymentCheckout" component={PaymentCheckoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
