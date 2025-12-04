package com.travelhub.connectors.nuitee;

import com.travelhub.connectors.nuitee.dto.request.BookRequest;
import com.travelhub.connectors.nuitee.dto.request.HotelRatesRequest;
import com.travelhub.connectors.nuitee.dto.request.PrebookRequest;
import com.travelhub.connectors.nuitee.dto.response.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class NuiteeApiClientImpl implements NuiteeApiClient {

    private static final Logger logger = LoggerFactory.getLogger(NuiteeApiClientImpl.class);
    private final RestTemplate restTemplate;
    private final NuiteeProperties properties;
    private static final String RATES_ENDPOINT = "/hotels/rates";
    private static final String PLACES_ENDPOINT = "/data/places";
    private static final String HOTEL_DETAILS_ENDPOINT = "/data/hotel";
    private static final String HOTEL_REVIEWS_ENDPOINT = "/data/reviews";
    private static final String PREBOOK_ENDPOINT = "/rates/prebook";
    private static final String BOOK_ENDPOINT = "/rates/book";

    private static final String HOTELS_ENDPOINT = "/data/hotels";

    public NuiteeApiClientImpl(RestTemplate nuiteeRestTemplate, NuiteeProperties properties) {
        this.restTemplate = nuiteeRestTemplate;
        this.properties = properties;
    }

    @Override
    public HotelListResponse getHotels(String countryCode, String city,
                                       Integer limit, Integer offset, Double latitude, Double longitude, Integer distance,
                                       java.util.List<String> hotelIds, Integer minStars, Integer maxStars, String placeId) {
        logger.info("Calling Nuitee hotels API - city: {}, country: {}, placeId: {}", city, countryCode, placeId);

        UriComponentsBuilder builder = UriComponentsBuilder.fromPath(HOTELS_ENDPOINT);

        if (countryCode != null)
            builder.queryParam("countryCode", countryCode);
        if (city != null)
            builder.queryParam("city", city);
        if (limit != null)
            builder.queryParam("limit", limit);
        if (offset != null)
            builder.queryParam("offset", offset);
        if (latitude != null)
            builder.queryParam("latitude", latitude);
        if (longitude != null)
            builder.queryParam("longitude", longitude);
        if (distance != null)
            builder.queryParam("distance", distance);
        if (hotelIds != null && !hotelIds.isEmpty())
            builder.queryParam("hotelIds", String.join(",", hotelIds));
        if (minStars != null)
            builder.queryParam("minStars", minStars);
        if (maxStars != null)
            builder.queryParam("maxStars", maxStars);
        if (placeId != null)
            builder.queryParam("placeId", placeId);

        String url = builder.build().toUriString();
        com.travelhub.connectors.nuitee.dto.response.HotelListResponse response = restTemplate.getForObject(url,
                com.travelhub.connectors.nuitee.dto.response.HotelListResponse.class);

        logger.info("Nuitee hotels response received - hotels found: {}",
                response != null && response.getData() != null ? response.getData().size() : 0);

        return response;
    }

    @Override
    public HotelRatesResponse retrieveHotelRates(HotelRatesRequest request) {
        logger.info("Calling Nuitee rates API - checkin: {}, checkout: {}, hotelIds: {}",
                request.getCheckin(), request.getCheckout(),
                request.getHotelIds() != null ? request.getHotelIds().size() : 0);

        HotelRatesResponse response = restTemplate.postForObject(RATES_ENDPOINT, request, HotelRatesResponse.class);

        logger.info("Nuitee rates response received - hotels found: {}",
                response != null && response.getData() != null ? response.getData().size() : 0);

        return response;
    }

    @Override
    public PlaceResponse searchPlaces(String textQuery, String language, String clientIP) {
        logger.info("Calling Nuitee places API - textQuery: {}", textQuery);

        String url = UriComponentsBuilder.fromPath(PLACES_ENDPOINT)
                .queryParam("textQuery", textQuery)
                .queryParam("language", language)
                .queryParam("clientIP", clientIP)
                .build()
                .toUriString();

        PlaceResponse response = restTemplate.getForObject(url, PlaceResponse.class);

        logger.info("Nuitee places response received - places found: {}",
                response != null && response.getData() != null ? response.getData().size() : 0);

        return response;
    }

    @Override
    public HotelDetailsResponse getHotelDetails(String hotelId, Integer timeout, String language,
            Boolean advancedAccessibilityOnly) {
        logger.info("Calling Nuitee hotel details API - hotelId: {}", hotelId);

        UriComponentsBuilder builder = UriComponentsBuilder.fromPath(HOTEL_DETAILS_ENDPOINT)
                .queryParam("hotelId", hotelId);

        if (timeout != null) {
            builder.queryParam("timeout", timeout);
        }
        if (language != null) {
            builder.queryParam("language", language);
        }
        if (advancedAccessibilityOnly != null) {
            builder.queryParam("advancedAccessibilityOnly", advancedAccessibilityOnly);
        }

        String url = builder.build().toUriString();
        HotelDetailsResponse response = restTemplate.getForObject(url, HotelDetailsResponse.class);

        logger.info("Nuitee hotel details response received - hotelId: {}", hotelId);

        return response;
    }

    @Override
    public HotelReviewsResponse getHotelReviews(String hotelId, Integer limit, Integer offset, Integer timeout,
            Boolean getSentiment) {
        logger.info("Calling Nuitee hotel reviews API - hotelId: {}, limit: {}", hotelId, limit);

        UriComponentsBuilder builder = UriComponentsBuilder.fromPath(HOTEL_REVIEWS_ENDPOINT)
                .queryParam("hotelId", hotelId);

        if (limit != null) {
            builder.queryParam("limit", limit);
        }
        if (offset != null) {
            builder.queryParam("offset", offset);
        }
        if (timeout != null) {
            builder.queryParam("timeout", timeout);
        }
        if (getSentiment != null) {
            builder.queryParam("getSentiment", getSentiment);
        }

        String url = builder.build().toUriString();
        HotelReviewsResponse response = restTemplate.getForObject(url, HotelReviewsResponse.class);

        logger.info("Nuitee hotel reviews response received - hotelId: {}, reviews count: {}",
                hotelId, response != null && response.getData() != null ? response.getData().size() : 0);

        return response;
    }

    @Override
    public PrebookResponse prebook(PrebookRequest request) {
        String url = properties.getBookingBaseUrl() + PREBOOK_ENDPOINT;
        logger.info("Calling Nuitee prebook API - URL: {}, offerId: {}", url, request.getOfferId());

        PrebookResponse response = restTemplate.postForObject(url, request, PrebookResponse.class);

        logger.info("Nuitee prebook response received - prebookId: {}, sandbox: {}",
                response != null && response.getData() != null ? response.getData().getPrebookId() : "N/A",
                response != null ? response.getSandbox() : "N/A");

        return response;
    }

    @Override
    public BookResponse book(BookRequest request) {
        String url = properties.getBookingBaseUrl() + BOOK_ENDPOINT;
        logger.info("Calling Nuitee book API - URL: {}, prebookId: {}", url, request.getPrebookId());

        BookResponse response = restTemplate.postForObject(url, request, BookResponse.class);

        logger.info("Nuitee book response received - bookingId: {}",
                response != null && response.getData() != null ? response.getData().getBookingId() : "N/A");

        return response;
    }
}
