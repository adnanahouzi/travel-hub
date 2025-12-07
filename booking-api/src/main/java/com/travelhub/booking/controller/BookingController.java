package com.travelhub.booking.controller;

import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.BatchPrebookResponseDto;
import com.travelhub.booking.dto.response.BookResponseDto;
import com.travelhub.booking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.booking.model.Booking;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        @Operation(summary = "Create prebook session", description = "Creates a prebook session for a hotel reservation. This is step 1 of 2 in the booking flow. "
                        +
                        "The prebook session validates the availability and locks the rate before final payment.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Prebook session created successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
                        @ApiResponse(responseCode = "404", description = "Offer not found or no longer available"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<BatchPrebookResponseDto> prebook(
                        @Parameter(description = "List of prebook requests containing offer IDs", required = true) @RequestBody List<PrebookRequestDto> requests) {
                logger.info("Received batch prebook request - count: {}", requests.size());

                BatchPrebookResponseDto response = bookingService.prebook(requests);

                logger.info("Batch prebook successful - count: {}, total: {} {}",
                                response.getResponses().size(), response.getTotalAmount(), response.getCurrency());

                return ResponseEntity.ok(response);
        }

        @PostMapping("/initiate")
        @Operation(summary = "Initiate a booking", description = "Initiates a booking process with the provided holder information and prebook IDs.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Booking initiated successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<Booking> initiateBooking(
                        @Parameter(description = "Booking initiation request", required = true) @Valid @RequestBody BookingInitiationRequestDto request) {
                logger.info("Received booking initiation request");
                Booking booking = bookingService.initiateBooking(request);
                return ResponseEntity.ok(booking);
        }

        @PostMapping("/submit")
        @Operation(summary = "Submit a booking", description = "Validates and saves a booking with the provided holder information and simulation ID.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Booking submitted successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<BookResponseDto> submitBooking(
                        @Parameter(description = "Booking submission request", required = true) @Valid @RequestBody BookingInitiationRequestDto request) {
                logger.info("Received booking submission request");
                BookResponseDto booking = bookingService.submitBooking(request);
                return ResponseEntity.ok(booking);
        }

        @GetMapping("/{bookingId}")
        public ResponseEntity<com.travelhub.booking.dto.response.BookResponseDto> getBooking(
                        @PathVariable String bookingId) {
                return ResponseEntity.ok(bookingService.getBooking(bookingId));
        }

        @GetMapping("/list")
        @Operation(summary = "List bookings", description = "List bookings for a guest or client reference")
        public ResponseEntity<com.travelhub.booking.dto.response.BookingListResponseDto> listBookings(
                        @RequestParam(required = false) String guestId,
                        @RequestParam(required = false) String clientReference) {
                logger.info("Received list bookings request - guestId: {}, clientReference: {}", guestId,
                                clientReference);
                com.travelhub.booking.dto.response.BookingListResponseDto response = bookingService
                                .listBookings(guestId, clientReference);
                logger.info("List bookings request completed - bookings found: {}",
                                response != null && response.getData() != null ? response.getData().size() : 0);
                return ResponseEntity.ok(response);
        }
}
