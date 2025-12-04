package com.travelhub.booking.service.impl;

import com.travelhub.booking.dto.request.HotelRateRequestDto;
import com.travelhub.booking.dto.request.RateSearchRequestDto;
import com.travelhub.booking.dto.response.HotelRateResponseDto;
import com.travelhub.booking.dto.response.RateSearchResponseDto;
import com.travelhub.booking.mapper.BookingMapper;
import com.travelhub.booking.service.RateService;
import com.travelhub.connectors.nuitee.NuiteeApiClient;
import com.travelhub.connectors.nuitee.dto.request.HotelRatesRequest;
import com.travelhub.connectors.nuitee.dto.response.HotelDetailsResponse;
import com.travelhub.connectors.nuitee.dto.response.HotelRate;
import com.travelhub.connectors.nuitee.dto.response.HotelRatesResponse;
import com.travelhub.connectors.nuitee.dto.response.RoomType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class RateServiceImpl implements RateService {

    private static final Logger logger = LoggerFactory.getLogger(RateServiceImpl.class);
    private final NuiteeApiClient nuiteeApiClient;
    private final BookingMapper bookingMapper;

    public RateServiceImpl(NuiteeApiClient nuiteeApiClient, BookingMapper bookingMapper) {
        this.nuiteeApiClient = nuiteeApiClient;
        this.bookingMapper = bookingMapper;
    }

    @Override
    public RateSearchResponseDto searchRates(RateSearchRequestDto request) {
        logger.info("Searching rates - placeId: {}, checkin: {}, checkout: {}", 
                request.getPlaceId(), request.getCheckin(), request.getCheckout());
        
        HotelRatesRequest hotelRatesRequest = bookingMapper.toHotelRatesRequest(request);
        
        // Force maxRatesPerHotel to 1
        hotelRatesRequest.setMaxRatesPerHotel(1);
        logger.debug("Mapped request DTO, maxRatesPerHotel set to 1");
        
        HotelRatesResponse hotelRatesResponse = nuiteeApiClient.retrieveHotelRates(hotelRatesRequest);
        logger.info("Retrieved {} hotel rates from connector", 
                hotelRatesResponse.getData() != null ? hotelRatesResponse.getData().size() : 0);
        
        RateSearchResponseDto response = bookingMapper.toRateSearchResponseDto(hotelRatesResponse);
        logger.debug("Mapped connector response to DTO");
        
        return response;
    }

    @Override
    public HotelRateResponseDto getHotelRates(String hotelId, HotelRateRequestDto request) {
        logger.info("Getting hotel rates - hotelId: {}, checkin: {}, checkout: {}", 
                hotelId, request.getCheckin(), request.getCheckout());
        
        // Step 1: Get hotel details
        logger.debug("Fetching hotel details for hotelId: {}", hotelId);
        HotelDetailsResponse hotelDetails = nuiteeApiClient.getHotelDetails(
                hotelId,
                request.getTimeout(),
                request.getLanguage(),
                request.getAdvancedAccessibilityOnly()
        );
        logger.info("Hotel details retrieved for hotelId: {}", hotelId);

        // Step 2: Get hotel rates
        logger.debug("Preparing rates request for hotelId: {}", hotelId);
        HotelRatesRequest ratesRequest = new HotelRatesRequest();
        ratesRequest.setHotelIds(Collections.singletonList(hotelId));
        ratesRequest.setOccupancies(request.getOccupancies());
        ratesRequest.setCurrency(request.getCurrency());
        ratesRequest.setGuestNationality(request.getGuestNationality());
        ratesRequest.setCheckin(request.getCheckin());
        ratesRequest.setCheckout(request.getCheckout());
        ratesRequest.setTimeout(request.getTimeout());
        ratesRequest.setRoomMapping(request.getRoomMapping());

        HotelRatesResponse ratesResponse = nuiteeApiClient.retrieveHotelRates(ratesRequest);
        logger.info("Hotel rates retrieved for hotelId: {}", hotelId);

        // Step 3: Extract room types for the hotel
        List<RoomType> roomTypes = null;
        if (ratesResponse != null && ratesResponse.getData() != null && !ratesResponse.getData().isEmpty()) {
            HotelRate hotelRate = ratesResponse.getData().get(0);
            if (hotelRate != null) {
                roomTypes = hotelRate.getRoomTypes();
                logger.debug("Found {} room types for hotelId: {}", 
                        roomTypes != null ? roomTypes.size() : 0, hotelId);
            }
        }

        // Step 4: Combine hotel details with rates and map room details
        logger.debug("Mapping hotel details and rates to response DTO");
        HotelRateResponseDto response = bookingMapper.toHotelRateResponseDto(
                hotelDetails != null ? hotelDetails.getData() : null,
                roomTypes
        );
        
        return response;
    }
}

