package com.travelhub.booking.controller;

import com.travelhub.booking.dto.request.HotelRateRequestDto;
import com.travelhub.booking.dto.request.RateSearchRequestDto;
import com.travelhub.booking.dto.response.HotelRateResponseDto;
import com.travelhub.booking.dto.response.RateSearchResponseDto;
import com.travelhub.booking.service.RateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/rates")
@Tag(name = "Hotel Rates", description = "APIs for searching hotel rates and availability")
public class RateController {

    private static final Logger logger = LoggerFactory.getLogger(RateController.class);
    private final RateService rateService;

    public RateController(RateService rateService) {
        this.rateService = rateService;
    }

    @PostMapping("/search")
    @Operation(
            summary = "Search hotel rates",
            description = "Search for available hotel rates based on various criteria including location, dates, and guest information"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved hotel rates",
                    content = @Content(schema = @Schema(implementation = RateSearchResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request parameters"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    public ResponseEntity<RateSearchResponseDto> searchRates(
            @Parameter(description = "Hotel search criteria including dates, location, and guest information")
            @RequestBody RateSearchRequestDto request) {
        logger.info("Received rate search request - placeId: {}, checkin: {}, checkout: {}, occupancies: {}", 
                request.getPlaceId(), request.getCheckin(), request.getCheckout(), 
                request.getOccupancies() != null ? request.getOccupancies().size() : 0);
        
        RateSearchResponseDto response = rateService.searchRates(request);
        
        logger.info("Rate search completed - found {} hotels", 
                response.getHotels() != null ? response.getHotels().size() : 0);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{hotelId}")
    @Operation(
            summary = "Get rates for a specific hotel",
            description = "Retrieves detailed hotel information combined with available rates. " +
                    "This endpoint combines hotel details (GET /data/hotel) with hotel rates (POST /hotels/rates) " +
                    "and enriches room information by mapping room details from hotel data to the rates."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved hotel details with rates",
                    content = @Content(schema = @Schema(implementation = HotelRateResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request parameters"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Hotel not found"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    public ResponseEntity<HotelRateResponseDto> getHotelRates(
            @Parameter(description = "Hotel ID", required = true, example = "lp1a92f")
            @PathVariable String hotelId,
            @Parameter(description = "Rate search criteria including dates, occupancy, and guest information")
            @RequestBody HotelRateRequestDto request) {
        logger.info("Received hotel rate request - hotelId: {}, checkin: {}, checkout: {}", 
                hotelId, request.getCheckin(), request.getCheckout());
        
        HotelRateResponseDto response = rateService.getHotelRates(hotelId, request);
        
        logger.info("Hotel rate request completed - hotelId: {}, rates found: {}", 
                hotelId, response.getRates() != null ? response.getRates().size() : 0);
        
        return ResponseEntity.ok(response);
    }
}

