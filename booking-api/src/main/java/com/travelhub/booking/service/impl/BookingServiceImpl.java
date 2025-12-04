package com.travelhub.booking.service.impl;

import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.PrebookResponseDto;
import com.travelhub.booking.mapper.BookingMapper;
import com.travelhub.booking.service.BookingService;
import com.travelhub.connectors.nuitee.NuiteeApiClient;
import com.travelhub.connectors.nuitee.dto.request.PrebookRequest;
import com.travelhub.connectors.nuitee.dto.response.PrebookResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);
    private final NuiteeApiClient nuiteeApiClient;
    private final BookingMapper bookingMapper;

    public BookingServiceImpl(NuiteeApiClient nuiteeApiClient, BookingMapper bookingMapper) {
        this.nuiteeApiClient = nuiteeApiClient;
        this.bookingMapper = bookingMapper;
    }

    @Override
    public PrebookResponseDto prebook(PrebookRequestDto requestDto) {
        logger.info("Starting prebook process for offerId: {}", requestDto.getOfferId());
        
        // Map booking-api DTO to connector DTO
        PrebookRequest connectorRequest = bookingMapper.toPrebookRequest(requestDto);
        logger.debug("Mapped request DTO to connector request");
        
        // Call connector
        logger.info("Calling Nuitee connector prebook API");
        PrebookResponse connectorResponse = nuiteeApiClient.prebook(connectorRequest);
        logger.info("Received prebook response from connector - prebookId: {}", 
                connectorResponse.getData() != null ? connectorResponse.getData().getPrebookId() : "N/A");
        
        // Map connector response back to booking-api DTO
        PrebookResponseDto responseDto = bookingMapper.toPrebookResponseDto(connectorResponse);
        logger.debug("Mapped connector response to response DTO");
        
        return responseDto;
    }
}

