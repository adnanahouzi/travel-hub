package com.travelhub.booking.service;

import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.BookResponseDto;
import com.travelhub.booking.dto.response.BookingListResponseDto;
import com.travelhub.booking.dto.response.PrebookResponseDto;
import com.travelhub.booking.model.Booking;

public interface BookingService {

    PrebookResponseDto prebook(PrebookRequestDto request);

    Booking initiateBooking(BookingInitiationRequestDto request);

    BookResponseDto submitBooking(BookingInitiationRequestDto request);

    BookResponseDto getBooking(String bookingId);

    BookingListResponseDto listBookings();
}
