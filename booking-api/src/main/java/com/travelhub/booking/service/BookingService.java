package com.travelhub.booking.service;

import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.BatchPrebookResponseDto;

import java.util.List;

public interface BookingService {

    /**
     * Create prebook sessions for hotel reservations
     * 
     * @param requests List of prebook requests with offer IDs
     * @return Batch prebook response with total amount and list of responses
     */
    BatchPrebookResponseDto prebook(List<PrebookRequestDto> requests);
}
