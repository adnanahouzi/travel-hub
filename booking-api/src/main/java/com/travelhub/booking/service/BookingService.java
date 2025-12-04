package com.travelhub.booking.service;

import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.PrebookResponseDto;

public interface BookingService {
    
    /**
     * Create a prebook session for a hotel reservation
     * @param request Prebook request with offer ID
     * @return Prebook response with prebookId and booking details
     */
    PrebookResponseDto prebook(PrebookRequestDto request);
}

