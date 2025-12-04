package com.travelhub.booking.service;

import com.travelhub.booking.dto.request.HotelRateRequestDto;
import com.travelhub.booking.dto.request.RateSearchRequestDto;
import com.travelhub.booking.dto.response.HotelRateResponseDto;
import com.travelhub.booking.dto.response.RateSearchResponseDto;

public interface RateService {
    RateSearchResponseDto searchRates(RateSearchRequestDto request);
    
    HotelRateResponseDto getHotelRates(String hotelId, HotelRateRequestDto request);
}

