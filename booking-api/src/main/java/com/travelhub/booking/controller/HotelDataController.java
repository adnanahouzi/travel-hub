package com.travelhub.booking.controller;

import com.travelhub.booking.dto.request.PlaceSearchRequestDto;
import com.travelhub.booking.dto.response.HotelReviewsResponseDto;
import com.travelhub.booking.dto.response.PlaceSearchResponseDto;
import com.travelhub.booking.service.HotelDataService;
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
@RequestMapping("/api/v1/hotels")
@Tag(name = "Hotel Data", description = "API for retrieving hotel-related data (places, details, reviews)")
public class HotelDataController {

        private static final Logger logger = LoggerFactory.getLogger(HotelDataController.class);
        private final HotelDataService hotelDataService;

        public HotelDataController(HotelDataService hotelDataService) {
                this.hotelDataService = hotelDataService;
        }

        @PostMapping("/places")
        @Operation(summary = "Search for places", description = "Search for places (cities, regions, etc.) by text query. This can be used to get place IDs for hotel searches.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved matching places", content = @Content(schema = @Schema(implementation = PlaceSearchResponseDto.class))),
                        @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<PlaceSearchResponseDto> searchPlaces(
                        @Parameter(description = "Place search request with text query and optional parameters") @RequestBody PlaceSearchRequestDto request) {
                logger.info("Received place search request - textQuery: {}", request.getTextQuery());

                PlaceSearchResponseDto response = hotelDataService.searchPlaces(request);

                logger.info("Place search completed - found {} places",
                                response.getPlaces() != null ? response.getPlaces().size() : 0);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/places/{placeId}")
        @Operation(summary = "Get place details", description = "Get details for a specific place including location coordinates")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved place details", content = @Content(schema = @Schema(implementation = com.travelhub.booking.dto.response.PlaceDetailsDto.class))),
                        @ApiResponse(responseCode = "404", description = "Place not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<com.travelhub.booking.dto.response.PlaceDetailsDto> getPlaceDetails(
                        @Parameter(description = "Place ID", required = true, example = "ChIJUZ4Xlo3urw0RuK2HT1O2UFk") @PathVariable String placeId,
                        @Parameter(description = "Language code", example = "fr") @RequestParam(required = false, defaultValue = "fr") String language) {
                logger.info("Received place details request - placeId: {}, language: {}", placeId, language);

                com.travelhub.booking.dto.response.PlaceDetailsDto response = hotelDataService.getPlaceDetails(placeId,
                                language);

                logger.info("Place details request completed - placeId: {}", placeId);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/reviews")
        @Operation(summary = "Get hotel reviews", description = "Get reviews for a specific hotel, optionally with sentiment analysis.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved hotel reviews", content = @Content(schema = @Schema(implementation = HotelReviewsResponseDto.class))),
                        @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<HotelReviewsResponseDto> getHotelReviews(
                        @Parameter(description = "Hotel ID", required = true, example = "lp1a92f") @RequestParam String hotelId,
                        @Parameter(description = "Max number of reviews to return", example = "10") @RequestParam(required = false) Integer limit,
                        @Parameter(description = "Offset for pagination", example = "0") @RequestParam(required = false) Integer offset,
                        @Parameter(description = "Request timeout in milliseconds", example = "5000") @RequestParam(required = false) Integer timeout,
                        @Parameter(description = "Include sentiment analysis", example = "true") @RequestParam(required = false) Boolean getSentiment) {
                logger.info("Received hotel reviews request - hotelId: {}, limit: {}, getSentiment: {}",
                                hotelId, limit, getSentiment);

                HotelReviewsResponseDto response = hotelDataService.getHotelReviews(hotelId, limit, offset, timeout,
                                getSentiment);

                logger.info("Hotel reviews request completed - hotelId: {}, reviews found: {}",
                                hotelId, response.getData() != null ? response.getData().size() : 0);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/{hotelId}")
        @Operation(summary = "Get hotel details", description = "Get comprehensive details about a specific hotel")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved hotel details", content = @Content(schema = @Schema(implementation = com.travelhub.connectors.nuitee.dto.response.HotelDetailsResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Hotel not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<com.travelhub.connectors.nuitee.dto.response.HotelDetailsResponse> getHotelDetails(
                        @Parameter(description = "Hotel ID", required = true, example = "lp1a92f") @PathVariable String hotelId,
                        @Parameter(description = "Language code", example = "fr") @RequestParam(required = false, defaultValue = "fr") String language) {
                logger.info("Received hotel details request - hotelId: {}, language: {}", hotelId, language);

                com.travelhub.connectors.nuitee.dto.response.HotelDetailsResponse response = hotelDataService
                                .getHotelDetails(hotelId, language);

                logger.info("Hotel details request completed - hotelId: {}", hotelId);

                return ResponseEntity.ok(response);
        }
}
