package com.travelhub.booking.service;

import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.BatchPrebookResponseDto;
import com.travelhub.booking.dto.response.BookResponseDto;
import com.travelhub.booking.model.Booking;

import java.util.List;

public interface BookingService {

    /**
     * Create prebook sessions for hotel reservations
     * 
     * @param requests List of prebook requests with offer IDs
     * @return Batch prebook response with total amount and list of responses
     */
    BatchPrebookResponseDto prebook(List<PrebookRequestDto> requests);

    Booking initiateBooking(BookingInitiationRequestDto request);

    BookResponseDto submitBooking(BookingInitiationRequestDto request);

    com.travelhub.booking.dto.response.BookResponseDto getBooking(String bookingId);

    /**
     * List bookings for a guest or client reference
     *
     * @param guestId         the guest ID
     * @param clientReference the client reference
     * @return the list of bookings
     */
    com.travelhub.booking.dto.response.BookingListResponseDto listBookings(String guestId, String clientReference);
}
