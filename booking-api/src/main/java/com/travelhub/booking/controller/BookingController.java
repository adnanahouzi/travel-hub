package com.travelhub.booking.controller;

import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.PrebookResponseDto;
import com.travelhub.booking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/booking")
@Tag(name = "Booking", description = "Hotel booking operations")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/prebook")
    @Operation(
            summary = "Create prebook session",
            description = "Creates a prebook session for a hotel reservation. This is step 1 of 2 in the booking flow. " +
                    "The prebook session validates the availability and locks the rate before final payment."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Prebook session created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "404", description = "Offer not found or no longer available"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PrebookResponseDto> prebook(
            @Parameter(description = "Prebook request containing offer ID", required = true)
            @RequestBody PrebookRequestDto request
    ) {
        logger.info("Received prebook request - offerId: {}, usePaymentSdk: {}", 
                request.getOfferId(), request.getUsePaymentSdk());
        
        PrebookResponseDto response = bookingService.prebook(request);
        
        logger.info("Prebook successful - prebookId: {}, hotelId: {}, price: {}", 
                response.getData() != null ? response.getData().getPrebookId() : "N/A",
                response.getData() != null ? response.getData().getHotelId() : "N/A",
                response.getData() != null ? response.getData().getPrice() : "N/A");
        
        return ResponseEntity.ok(response);
    }
}

