package com.travelhub.booking.service.impl;

import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.BatchPrebookResponseDto;
import com.travelhub.booking.dto.response.PrebookResponseDto;
import com.travelhub.booking.mapper.BookingMapper;
import com.travelhub.booking.service.BookingService;
import com.travelhub.connectors.nuitee.NuiteeApiClient;
import com.travelhub.connectors.nuitee.dto.request.PrebookRequest;
import com.travelhub.connectors.nuitee.dto.response.PrebookResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
    public BatchPrebookResponseDto prebook(List<PrebookRequestDto> requestDtos) {
        logger.info("Starting batch prebook process for {} requests", requestDtos.size());

        List<PrebookResponseDto> responses = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalIncludedTaxes = BigDecimal.ZERO;
        BigDecimal totalExcludedTaxes = BigDecimal.ZERO;
        String currency = "MAD"; // Default, will be updated from response

        for (PrebookRequestDto requestDto : requestDtos) {
            try {
                logger.info("Processing prebook for offerId: {}", requestDto.getOfferId());

                // Map booking-api DTO to connector DTO
                PrebookRequest connectorRequest = bookingMapper.toPrebookRequest(requestDto);

                // Call connector
                PrebookResponse connectorResponse = nuiteeApiClient.prebook(connectorRequest);
                logger.debug("Received prebook response from connector");

                // Map connector response back to booking-api DTO
                PrebookResponseDto responseDto = bookingMapper.toPrebookResponseDto(connectorResponse);
                responses.add(responseDto);

                // Accumulate total amount
                if (responseDto.getData() != null) {
                    BigDecimal price = responseDto.getData().getPrice();
                    if (price != null) {
                        totalAmount = totalAmount.add(price);
                    }
                    if (responseDto.getData().getCurrency() != null) {
                        currency = responseDto.getData().getCurrency();
                    }
                    if (responseDto.getData().getTotalIncludedTaxes() != null) {
                        totalIncludedTaxes = totalIncludedTaxes.add(responseDto.getData().getTotalIncludedTaxes());
                    }
                    if (responseDto.getData().getTotalExcludedTaxes() != null) {
                        totalExcludedTaxes = totalExcludedTaxes.add(responseDto.getData().getTotalExcludedTaxes());
                    }
                }

            } catch (Exception e) {
                logger.error("Error processing prebook for offerId: {}", requestDto.getOfferId(), e);
                throw new RuntimeException("Failed to prebook offer: " + requestDto.getOfferId(), e);
            }
        }

        BatchPrebookResponseDto batchResponse = new BatchPrebookResponseDto();
        batchResponse.setResponses(responses);
        batchResponse.setTotalAmount(totalAmount);
        batchResponse.setTotalIncludedTaxes(totalIncludedTaxes);
        batchResponse.setTotalExcludedTaxes(totalExcludedTaxes);
        batchResponse.setCurrency(currency);

        return batchResponse;
    }
}
