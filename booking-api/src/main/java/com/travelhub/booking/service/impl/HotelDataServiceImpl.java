package com.travelhub.booking.service.impl;

import com.travelhub.booking.dto.request.PlaceSearchRequestDto;
import com.travelhub.booking.dto.response.PlaceSearchResponseDto;
import com.travelhub.booking.mapper.HotelDataMapper;
import com.travelhub.booking.service.HotelDataService;
import com.travelhub.connectors.nuitee.NuiteeApiClient;
import com.travelhub.connectors.nuitee.dto.response.PlaceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class HotelDataServiceImpl implements HotelDataService {

        private static final Logger logger = LoggerFactory.getLogger(HotelDataServiceImpl.class);
        private final NuiteeApiClient nuiteeApiClient;
        private final HotelDataMapper hotelDataMapper;

        public HotelDataServiceImpl(NuiteeApiClient nuiteeApiClient, HotelDataMapper hotelDataMapper) {
                this.nuiteeApiClient = nuiteeApiClient;
                this.hotelDataMapper = hotelDataMapper;
        }

        @Override
        public PlaceSearchResponseDto searchPlaces(PlaceSearchRequestDto request) {
                logger.info("Searching places - textQuery: {}", request.getTextQuery());

                // Call the connector
                PlaceResponse connectorResponse = nuiteeApiClient.searchPlaces(
                                request.getTextQuery(),
                                request.getLanguage(),
                                request.getClientIP());
                logger.info("Place search completed - found {} places",
                                connectorResponse.getData() != null ? connectorResponse.getData().size() : 0);

                // Map the connector response to booking API response
                PlaceSearchResponseDto response = hotelDataMapper.toPlaceSearchResponseDto(connectorResponse);
                logger.debug("Mapped connector response to DTO");

                return response;
        }

        @Override
        public com.travelhub.booking.dto.response.PlaceDetailsDto getPlaceDetails(String placeId, String language) {
                logger.info("Fetching place details - placeId: {}", placeId);

                com.travelhub.connectors.nuitee.dto.response.PlaceDetailsResponse connectorResponse = nuiteeApiClient
                                .getPlaceDetails(
                                                placeId,
                                                language);
                logger.info("Place details fetched - placeId: {}", placeId);

                com.travelhub.booking.dto.response.PlaceDetailsDto response = hotelDataMapper
                                .toPlaceDetailsDto(connectorResponse);
                logger.debug("Mapped connector response to DTO");

                return response;
        }

        @Override
        public com.travelhub.booking.dto.response.HotelReviewsResponseDto getHotelReviews(String hotelId, Integer limit,
                        Integer offset, Integer timeout, Boolean getSentiment) {
                logger.info("Fetching hotel reviews - hotelId: {}, limit: {}, getSentiment: {}",
                                hotelId, limit, getSentiment);

                com.travelhub.connectors.nuitee.dto.response.HotelReviewsResponse connectorResponse = nuiteeApiClient
                                .getHotelReviews(
                                                hotelId,
                                                limit,
                                                offset,
                                                timeout,
                                                getSentiment);
                logger.info("Hotel reviews fetched - hotelId: {}, reviews count: {}",
                                hotelId, connectorResponse.getData() != null ? connectorResponse.getData().size() : 0);

                com.travelhub.booking.dto.response.HotelReviewsResponseDto response = hotelDataMapper
                                .toHotelReviewsResponseDto(connectorResponse);
                logger.debug("Mapped connector response to DTO");

                return response;
        }

        @Override
        public com.travelhub.connectors.nuitee.dto.response.HotelDetailsResponse getHotelDetails(String hotelId,
                        String language) {
                logger.info("Fetching hotel details - hotelId: {}, language: {}", hotelId, language);
                return nuiteeApiClient.getHotelDetails(hotelId, null, language, null);
        }
}
