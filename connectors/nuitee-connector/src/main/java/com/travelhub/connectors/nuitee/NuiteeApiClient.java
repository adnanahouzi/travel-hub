package com.travelhub.connectors.nuitee;

import java.util.List;
import com.travelhub.connectors.nuitee.dto.request.BookRequest;
import com.travelhub.connectors.nuitee.dto.request.HotelRatesRequest;
import com.travelhub.connectors.nuitee.dto.request.PrebookRequest;
import com.travelhub.connectors.nuitee.dto.response.BookResponse;
import com.travelhub.connectors.nuitee.dto.response.HotelDetailsResponse;
import com.travelhub.connectors.nuitee.dto.response.HotelRatesResponse;
import com.travelhub.connectors.nuitee.dto.response.HotelReviewsResponse;
import com.travelhub.connectors.nuitee.dto.response.PlaceResponse;
import com.travelhub.connectors.nuitee.dto.response.PrebookResponse;

import com.travelhub.connectors.nuitee.dto.response.HotelListResponse;

public interface NuiteeApiClient {
    HotelListResponse getHotels(String countryCode, String city, Integer limit, Integer offset, Double latitude,
            Double longitude, Integer distance, List<String> hotelIds, Integer minStars, Integer maxStars,
            String placeId);

    HotelRatesResponse retrieveHotelRates(HotelRatesRequest request);

    PlaceResponse searchPlaces(String textQuery, String language, String clientIP);

    HotelDetailsResponse getHotelDetails(String hotelId, Integer timeout, String language,
            Boolean advancedAccessibilityOnly);

    HotelReviewsResponse getHotelReviews(String hotelId, Integer limit, Integer offset, Integer timeout,
            Boolean getSentiment);

    PrebookResponse prebook(PrebookRequest request);

    BookResponse book(BookRequest request);
}
