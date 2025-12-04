package com.travelhub.booking.service;

import com.travelhub.booking.dto.request.PlaceSearchRequestDto;
import com.travelhub.booking.dto.response.HotelReviewsResponseDto;
import com.travelhub.booking.dto.response.PlaceSearchResponseDto;

public interface HotelDataService {
    
    /**
     * Search for places based on text query
     * 
     * @param request the place search request
     * @return the place search response containing matching places
     */
    PlaceSearchResponseDto searchPlaces(PlaceSearchRequestDto request);

    /**
     * Get reviews for a specific hotel
     * 
     * @param hotelId the hotel ID
     * @param limit max number of reviews to return
     * @param offset offset for pagination
     * @param timeout timeout in milliseconds
     * @param getSentiment whether to include sentiment analysis
     * @return the hotel reviews response
     */
    HotelReviewsResponseDto getHotelReviews(String hotelId, Integer limit, Integer offset, Integer timeout, Boolean getSentiment);
}

