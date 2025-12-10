package com.travelhub.booking.service.impl;

import com.travelhub.booking.dto.request.HotelRateRequestDto;
import com.travelhub.booking.dto.request.RateSearchRequestDto;
import com.travelhub.booking.dto.response.HotelRateResponseDto;
import com.travelhub.booking.dto.response.RateSearchResponseDto;
import com.travelhub.booking.mapper.RateMapper;
import com.travelhub.booking.mapper.HotelDataMapper;
import com.travelhub.booking.service.RateService;
import com.travelhub.connectors.nuitee.NuiteeApiClient;
import com.travelhub.connectors.nuitee.dto.request.HotelRatesRequest;
import com.travelhub.connectors.nuitee.dto.request.HotelsListRequest;
import com.travelhub.connectors.nuitee.dto.response.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class RateServiceImpl implements RateService {

        private static final Logger logger = LoggerFactory.getLogger(RateServiceImpl.class);
        private final NuiteeApiClient nuiteeApiClient;
        private final RateMapper rateMapper;
        private final HotelDataMapper hotelDataMapper;

        public RateServiceImpl(NuiteeApiClient nuiteeApiClient, RateMapper rateMapper, HotelDataMapper hotelDataMapper) {
                this.nuiteeApiClient = nuiteeApiClient;
                this.rateMapper = rateMapper;
                this.hotelDataMapper = hotelDataMapper;
        }

        @Override
        public RateSearchResponseDto searchRates(RateSearchRequestDto request) {
                logger.info("Searching rates - placeId: {}, checkin: {}, checkout: {}",
                                request.getPlaceId(), request.getCheckin(), request.getCheckout());

                // STEP 1: Get hotels list based on search criteria
                HotelsListRequest hotelsListRequest = new HotelsListRequest();

                // TODO use offset later
                hotelsListRequest.setPlaceId(request.getPlaceId());
               // hotelsListRequest.setLimit(request.getLimit());
               // hotelsListRequest.setOffset(request.getOffset());

                logger.debug("Fetching hotels list with placeId: {}, limit: {}, offset: {}",
                                request.getPlaceId(), request.getLimit(), request.getOffset());

               HotelsListResponse hotelsListResponse = nuiteeApiClient
                                .getHotels(hotelsListRequest);

                if (hotelsListResponse == null || hotelsListResponse.getHotelIds() == null
                                || hotelsListResponse.getHotelIds().isEmpty()) {
                        logger.warn("No hotels found for placeId: {}", request.getPlaceId());
                        return new RateSearchResponseDto(); // Return empty response
                }

                logger.info("Retrieved {} hotels from hotels list endpoint", hotelsListResponse.getHotelIds().size());

                // STEP 2: Use hotelIds array directly from response (no streaming)
                java.util.List<String> hotelIds = hotelsListResponse.getHotelIds();

                logger.debug("Using {} hotel IDs: {}", hotelIds.size(),
                                hotelIds.size() <= 5 ? hotelIds : hotelIds.subList(0, 5) + "...");

                HotelRatesRequest hotelRatesRequest = rateMapper.toHotelRatesRequest(request);
                hotelRatesRequest.setHotelIds(hotelIds); // Set the hotel IDs list directly
                hotelRatesRequest.setMaxRatesPerHotel(1);

                logger.debug("Searching rates for {} hotels", hotelIds.size());

                HotelRatesResponse hotelRatesResponse = nuiteeApiClient.retrieveHotelRates(hotelRatesRequest);
                logger.info("Retrieved {} hotel rates from connector",
                                hotelRatesResponse.getData() != null ? hotelRatesResponse.getData().size() : 0);

                RateSearchResponseDto response = rateMapper.toRateSearchResponseDto(hotelRatesResponse, hotelsListResponse, hotelDataMapper);
                logger.debug("Mapped connector response to DTO");

                return response;
        }

        @Override
        public HotelRateResponseDto getHotelRates(String hotelId, HotelRateRequestDto request) {
                logger.info("Getting hotel rates - hotelId: {}, checkin: {}, checkout: {}",
                                hotelId, request.getCheckin(), request.getCheckout());

                // Step 1: Get hotel details
                logger.debug("Fetching hotel details for hotelId: {}", hotelId);

                //Language code for response (ISO 639-1)
                HotelDetailsResponse hotelDetails = nuiteeApiClient.getHotelDetails(
                                hotelId,
                                30,
                                "fr",
                                false);
                logger.info("Hotel details retrieved for hotelId: {}", hotelId);

                // Step 2: Get hotel rates
                logger.debug("Preparing rates request for hotelId: {}", hotelId);
                HotelRatesRequest ratesRequest = new HotelRatesRequest();
                ratesRequest.setHotelIds(Collections.singletonList(hotelId));
                ratesRequest.setOccupancies(request.getOccupancies());
                ratesRequest.setCurrency("MAD");
                ratesRequest.setGuestNationality("MA");
                ratesRequest.setCheckin(request.getCheckin());
                ratesRequest.setCheckout(request.getCheckout());
                ratesRequest.setTimeout(30);
                ratesRequest.setRoomMapping(true);

                HotelRatesResponse ratesResponse = nuiteeApiClient.retrieveHotelRates(ratesRequest);
                logger.info("Hotel rates retrieved for hotelId: {}", hotelId);



                // Step 3: Extract room types for the hotel
                List<RoomType> roomTypes = null;
                if (ratesResponse != null && ratesResponse.getData() != null && !ratesResponse.getData().isEmpty()) {
                        HotelRate hotelRate = ratesResponse.getData().get(0);
                        if (hotelRate != null) {
                                roomTypes = hotelRate.getRoomTypes();
                                logger.info("Found {} room types for hotelId: {}",
                                                roomTypes != null ? roomTypes.size() : 0, hotelId);
                        }
                }

                // Step 4: Combine hotel details with rates and map room details
                logger.debug("Mapping hotel details and rates to response DTO");
                String checkinStr = request.getCheckin() != null ? request.getCheckin().toString() : null;
                String checkoutStr = request.getCheckout() != null ? request.getCheckout().toString() : null;
                HotelRateResponseDto response = hotelDataMapper.toHotelRateResponseDto(
                                hotelDetails != null ? hotelDetails.getData() : null,
                                roomTypes, rateMapper, checkinStr, checkoutStr);

                return response;
        }
}
