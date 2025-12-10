package com.travelhub.booking.service.impl;

import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.BookResponseDto;
import com.travelhub.booking.dto.response.BookingListResponseDto;
import com.travelhub.booking.dto.response.PrebookResponseDto;
import com.travelhub.booking.mapper.BookingMapper;
import com.travelhub.booking.model.Booking;
import com.travelhub.booking.model.BookingSimulation;
import com.travelhub.booking.repository.BookingRepository;
import com.travelhub.booking.repository.BookingSimulationRepository;
import com.travelhub.booking.service.BookingService;
import com.travelhub.booking.service.HotelDataService;
import com.travelhub.connectors.nuitee.NuiteeApiClient;
import com.travelhub.connectors.nuitee.dto.request.BookRequest;
import com.travelhub.connectors.nuitee.dto.request.PrebookRequest;
import com.travelhub.connectors.nuitee.dto.response.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);
    private final NuiteeApiClient nuiteeApiClient;
    private final BookingMapper bookingMapper;
    private final BookingRepository bookingRepository;
    private final BookingSimulationRepository bookingSimulationRepository;
    private final HotelDataService hotelDataService;

    public BookingServiceImpl(NuiteeApiClient nuiteeApiClient, BookingMapper bookingMapper,
            BookingRepository bookingRepository, BookingSimulationRepository bookingSimulationRepository,
            HotelDataService hotelDataService) {
        this.nuiteeApiClient = nuiteeApiClient;
        this.bookingMapper = bookingMapper;
        this.bookingRepository = bookingRepository;
        this.bookingSimulationRepository = bookingSimulationRepository;
        this.hotelDataService = hotelDataService;
    }

    @Override
    public PrebookResponseDto prebook(PrebookRequestDto requestDto) {
        logger.info("Starting prebook process for offerId: {}", requestDto.getOfferId());

        try {
            // Map booking-api DTO to connector DTO
            PrebookRequest connectorRequest = bookingMapper.toPrebookRequest(requestDto);

            // Call connector
            PrebookResponse connectorResponse = nuiteeApiClient.prebook(connectorRequest);
            logger.debug("Received prebook response from connector");

            // Map connector response back to booking-api DTO
            PrebookResponseDto responseDto = bookingMapper.toPrebookResponseDto(connectorResponse);

            // Create and save booking simulation
            BookingSimulation simulation = new BookingSimulation();

            if (responseDto.getData() != null) {
                simulation.setTotalAmount(responseDto.getData().getSuggestedSellingPrice());
                simulation.setTotalIncludedTaxes(responseDto.getData().getTotalIncludedTaxes());
                simulation.setTotalExcludedTaxes(responseDto.getData().getTotalExcludedTaxes());
                simulation.setCurrency(responseDto.getData().getCurrency());

                // Store single prebook ID
                if (responseDto.getData().getPrebookId() != null) {
                    simulation.setConnectorPrebookIds(List.of(responseDto.getData().getPrebookId()));
                }
            }

            simulation = bookingSimulationRepository.save(simulation);
            logger.info("Created booking simulation with ID: {}", simulation.getId());

            // Add simulation ID to response
            responseDto.setSimulationId(simulation.getId());

            return responseDto;

        } catch (Exception e) {
            logger.error("Error processing prebook for offerId: {}", requestDto.getOfferId(), e);
            throw new RuntimeException("Failed to prebook offer: " + requestDto.getOfferId(), e);
        }
    }

    @Override
    public Booking initiateBooking(BookingInitiationRequestDto request) {
        logger.info("Validating booking initiation for holder: {} {}",
                request.getHolder().getFirstName(), request.getHolder().getLastName());

        // Retrieve and validate simulation
        BookingSimulation simulation = bookingSimulationRepository.findById(request.getSimulationId())
                .orElseThrow(() -> new RuntimeException("Simulation not found: " + request.getSimulationId()));

        if (simulation.isExpired()) {
            throw new RuntimeException("Simulation has expired");
        }

        if (!"ACTIVE".equals(simulation.getStatus())) {
            throw new RuntimeException("Simulation is not active");
        }

        // Create booking entity for validation (NOT saved)
        Booking booking = new Booking();
        booking.setHolderFirstName(request.getHolder().getFirstName());
        booking.setHolderLastName(request.getHolder().getLastName());
        booking.setHolderEmail(request.getHolder().getEmail());
        booking.setHolderPhone(request.getHolder().getPhone());
        booking.setSimulationId(simulation.getId());
        booking.setBankingAccount(request.getBankingAccount());
        booking.setStatus("INITIATED");

        logger.info("Booking validation successful - simulation: {}", simulation.getId());
        return booking;
    }

    @Override
    public BookResponseDto submitBooking(BookingInitiationRequestDto request) {
        logger.info("Submitting booking for holder: {} {}",
                request.getHolder().getFirstName(), request.getHolder().getLastName());

        // Retrieve and validate simulation
        BookingSimulation simulation = bookingSimulationRepository.findById(request.getSimulationId())
                .orElseThrow(() -> new RuntimeException("Simulation not found: " + request.getSimulationId()));

        if (simulation.isExpired()) {
            throw new RuntimeException("Simulation has expired");
        }

        if (!"ACTIVE".equals(simulation.getStatus())) {
            throw new RuntimeException("Simulation is not active");
        }

        // Create and SAVE booking entity
        Booking booking = new Booking();
        booking.setHolderFirstName(request.getHolder().getFirstName());
        booking.setHolderLastName(request.getHolder().getLastName());
        booking.setHolderEmail(request.getHolder().getEmail());
        booking.setHolderPhone(request.getHolder().getPhone());
        booking.setSimulationId(simulation.getId());
        booking.setBankingAccount(request.getBankingAccount());
        booking.setStatus("PENDING");

        Booking savedBooking = bookingRepository.save(booking);
        logger.info("Booking entity created with ID: {}", savedBooking.getId());

        // Now call the connector to confirm the booking with the provider
        try {
            if (simulation.getConnectorPrebookIds() == null
                    || simulation.getConnectorPrebookIds().isEmpty()) {
                throw new RuntimeException("Simulation does not have prebook IDs");
            }
            String prebookId = simulation.getConnectorPrebookIds().get(0);

            // Map to connector request
            BookRequest bookRequest = bookingMapper.toBookRequest(request, prebookId, savedBooking.getId());

            // Call connector
            BookResponse connectorResponse = nuiteeApiClient.book(bookRequest);

            // Update booking with success details
            if (connectorResponse != null && connectorResponse.getData() != null
                    && "CONFIRMED".equals(connectorResponse.getData().getStatus())) {

                BookResponse.BookData data = connectorResponse.getData();
                // Set basic booking IDs and status
                savedBooking.setBookingId(data.getBookingId());
                savedBooking.setStatus(connectorResponse.getData().getStatus());
                savedBooking.setConfirmationCode(data.getStatus());

                // Set complete booking data from connector response
                savedBooking.setHotelConfirmationCode(data.getHotelConfirmationCode());
                savedBooking.setReference(data.getReference());
                savedBooking.setPrice(data.getPrice());
                savedBooking.setCurrency(data.getCurrency());
                savedBooking.setCheckin(data.getCheckin());
                savedBooking.setCheckout(data.getCheckout());
                savedBooking.setHotelId(data.getHotelId());
                savedBooking.setHotelName(data.getHotelName());

                // Set top-level metadata
                savedBooking.setGuestLevel(connectorResponse.getGuestLevel());
                savedBooking.setSandbox(connectorResponse.getSandbox());

                // Create and save room entities
                if (data.getRooms() != null && !data.getRooms().isEmpty()) {
                    for (BookResponse.RoomBooked roomData : data.getRooms()) {
                        com.travelhub.booking.model.BookingRoom room = new com.travelhub.booking.model.BookingRoom();
                        room.setBooking(savedBooking);
                        room.setRoomId(roomData.getRoomId());
                        room.setRoomName(roomData.getRoomName());
                        room.setBoardName(roomData.getBoardName());
                        room.setMappedRoomId(roomData.getMappedRoomId());
                        savedBooking.getRooms().add(room);
                    }
                }

                // Create and save guest entity
                if (data.getGuest() != null) {
                    com.travelhub.booking.model.BookingGuest guest = new com.travelhub.booking.model.BookingGuest();
                    guest.setBooking(savedBooking);
                    guest.setFirstName(data.getGuest().getFirstName());
                    guest.setLastName(data.getGuest().getLastName());
                    guest.setEmail(data.getGuest().getEmail());
                    guest.setPhone(data.getGuest().getPhone());
                    savedBooking.setGuest(guest);
                }

                logger.info("Booking confirmed with provider - BookingID: {}", savedBooking.getBookingId());

                // Save the complete booking with relationships
                bookingRepository.save(savedBooking);

                // Return the connector response as DTO and set clientReference (database ID)
                BookResponseDto responseDto = bookingMapper.toBookResponseDto(connectorResponse);
                if (responseDto != null && responseDto.getData() != null) {
                    responseDto.getData().setClientReference(savedBooking.getId());
                }
                return responseDto;
            } else if (connectorResponse != null && connectorResponse.getData() != null
                    && !"CONFIRMED".equals(connectorResponse.getData().getStatus())) {
                logger.warn("Received failed status from connector for booking: {}", savedBooking.getId());
                savedBooking.setStatus(connectorResponse.getData().getStatus());
                bookingRepository.save(savedBooking);
                throw new RuntimeException("Booking confirmation failed");
            } else {
                logger.warn("Received empty response from connector for booking: {}", savedBooking.getId());
                savedBooking.setStatus("FAILED");
                bookingRepository.save(savedBooking);
                throw new RuntimeException("Booking confirmation failed");
            }

        } catch (Exception e) {
            logger.error("Error confirming booking with provider: {}", e.getMessage(), e);
            savedBooking.setStatus("FAILED");
            bookingRepository.save(savedBooking);
            throw new RuntimeException("Error confirming booking: " + e.getMessage(), e);
        }
    }

    @Override
    public BookResponseDto getBooking(String id) {
        logger.info("Retrieving booking details for database ID: {}", id);

        // Get booking by id from database
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        logger.info("Found booking in database with bookingId: {}", booking.getBookingId());

        // Call LiteAPI with the bookingId from the database
        String liteApiBookingId = booking.getBookingId();
        BookResponse connectorResponse = null;

        if (liteApiBookingId != null) {
            try {
                logger.info("Calling LiteAPI with bookingId: {}", liteApiBookingId);
                connectorResponse = nuiteeApiClient.getBooking(liteApiBookingId);
            } catch (Exception e) {
                logger.warn("Failed to fetch booking from LiteAPI: {}", e.getMessage());
            }
        }

        // Map connector response to DTO
        BookResponseDto dto;
        if (connectorResponse != null) {
            dto = bookingMapper.toBookResponseDto(connectorResponse);
        } else {
            // If LiteAPI call failed, create DTO from database booking
            dto = new BookResponseDto();
            BookResponseDto.BookDataDto bookData = new BookResponseDto.BookDataDto();
            bookData.setBookingId(booking.getBookingId());
            bookData.setStatus(booking.getStatus());
            bookData.setClientReference(booking.getId());
            bookData.setCheckin(booking.getCheckin() != null ? booking.getCheckin().toString() : null);
            bookData.setCheckout(booking.getCheckout() != null ? booking.getCheckout().toString() : null);
            bookData.setHotelId(booking.getHotelId());
            bookData.setHotelName(booking.getHotelName());
            dto.setData(bookData);
        }

        // Fetch hotel details if we have a hotel ID
        if (dto != null && dto.getData() != null && dto.getData().getHotelId() != null) {
            try {
                String hotelId = dto.getData().getHotelId();
                logger.info("Fetching hotel details for hotelId: {}", hotelId);
                HotelDetailsResponse hotelDetailsResponse = hotelDataService.getHotelDetails(hotelId, "fr");
                if (hotelDetailsResponse != null && hotelDetailsResponse.getData() != null) {
                    HotelData hotelData = hotelDetailsResponse.getData();
                    BookResponseDto.HotelInfoDto hotelInfo = bookingMapper.toHotelInfoDto(hotelData);
                    dto.getData().setHotel(hotelInfo);
                }
            } catch (Exception e) {
                logger.warn("Failed to fetch hotel details: {}", e.getMessage());
            }
        }

        // Enhance BookResponseDto with info from Booking database entity
        if (dto != null && dto.getData() != null) {
            BookResponseDto.BookDataDto bookData = dto.getData();

            // Set booking entity fields
            bookData.setClientReference(booking.getId());

            // Override with database values if they exist (database is source of truth)
            if (booking.getStatus() != null) {
                bookData.setStatus(booking.getStatus());
            }
            if (booking.getPrice() != null) {
                bookData.setPrice(booking.getPrice());
            }
            if (booking.getCurrency() != null) {
                bookData.setCurrency(booking.getCurrency());
            }

            // Set holder info in guest DTO
            if (booking.getHolderFirstName() != null || booking.getHolderLastName() != null ||
                    booking.getHolderEmail() != null || booking.getHolderPhone() != null) {

                BookResponseDto.GuestContactDto guestDto = bookData.getGuest();
                if (guestDto == null) {
                    guestDto = new BookResponseDto.GuestContactDto();
                    bookData.setGuest(guestDto);
                }

                if (booking.getHolderFirstName() != null) {
                    guestDto.setFirstName(booking.getHolderFirstName());
                }
                if (booking.getHolderLastName() != null) {
                    guestDto.setLastName(booking.getHolderLastName());
                }
                if (booking.getHolderEmail() != null) {
                    guestDto.setEmail(booking.getHolderEmail());
                }
                if (booking.getHolderPhone() != null) {
                    guestDto.setPhone(booking.getHolderPhone());
                }
            }

            logger.debug("Enhanced booking response with database information");
        }

        return dto;
    }

    @Override
    public BookingListResponseDto listBookings() {
        logger.info("Listing bookings for connected user");

        // Search bookings in database - exclude FAILED bookings, sorted by checkin then createdAt
        List<Booking> bookings = bookingRepository.findByStatusNotOrderByCheckinAscCreatedAtAsc("FAILED");
        logger.info("Found {} bookings in database (excluding FAILED)", bookings.size());

        // Aggregate all booking data from Nuitee API
        // Note: Each clientReference returns exactly one booking from LiteAPI
        List<BookingListResponseDto.BookingDataDto> allBookingData = new ArrayList<>();

        // For each booking in database, use id as client reference to call
        // nuiteeApiClient.listBookings
        // LiteAPI returns exactly one booking per clientReference
        for (Booking booking : bookings) {
            getBooking(allBookingData, booking);
        }

        // Collect unique hotel IDs from all bookings
        List<String> uniqueHotelIds = allBookingData.stream()
                .map(BookingListResponseDto.BookingDataDto::getHotelId)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();

        logger.info("Found {} unique hotel IDs across bookings", uniqueHotelIds.size());

        // Fetch hotel details (including images) for all unique hotel IDs
        java.util.Map<String, com.travelhub.connectors.nuitee.dto.response.MinimalHotelData> hotelDataMap = new java.util.HashMap<>();

        if (!uniqueHotelIds.isEmpty()) {
            try {
                // Build hotels list request - hotelIds must be comma-separated
                com.travelhub.connectors.nuitee.dto.request.HotelsListRequest hotelsRequest = new com.travelhub.connectors.nuitee.dto.request.HotelsListRequest();
                hotelsRequest.setHotelIds(String.join(",", uniqueHotelIds));

                logger.debug("Fetching hotel details for {} hotels", uniqueHotelIds.size());
                com.travelhub.connectors.nuitee.dto.response.HotelsListResponse hotelsResponse = nuiteeApiClient
                        .getHotels(hotelsRequest);

                if (hotelsResponse != null && hotelsResponse.getData() != null) {
                    // Create a map of hotelId -> MinimalHotelData for easy lookup
                    for (com.travelhub.connectors.nuitee.dto.response.MinimalHotelData hotelData : hotelsResponse
                            .getData()) {
                        if (hotelData.getId() != null) {
                            hotelDataMap.put(hotelData.getId(), hotelData);
                        }
                    }
                    logger.info("Successfully fetched details for {} hotels", hotelDataMap.size());
                }
            } catch (Exception e) {
                logger.warn("Failed to fetch hotel details: {}", e.getMessage());
                // Continue without hotel images if API call fails
            }
        }

        // Enrich booking data with hotel images
        for (BookingListResponseDto.BookingDataDto bookingData : allBookingData) {
            if (bookingData.getHotelId() != null && hotelDataMap.containsKey(bookingData.getHotelId())) {
                com.travelhub.connectors.nuitee.dto.response.MinimalHotelData hotelData = hotelDataMap
                        .get(bookingData.getHotelId());

                // Update hotel info with images
                BookingListResponseDto.HotelInfoDto hotelDto = bookingData.getHotel();
                if (hotelDto == null) {
                    hotelDto = new BookingListResponseDto.HotelInfoDto();
                    bookingData.setHotel(hotelDto);
                }

                // Set hotel images
                if (hotelData.getMainPhoto() != null) {
                    hotelDto.setMainPhoto(hotelData.getMainPhoto());
                }
                if (hotelData.getThumbnail() != null) {
                    hotelDto.setThumbnail(hotelData.getThumbnail());
                }

                logger.debug("Enriched booking {} with hotel images", bookingData.getBookingId());
            }
        }

        // Create and return aggregated response
        BookingListResponseDto response = new BookingListResponseDto();
        response.setData(allBookingData);
        logger.info("Returning {} total bookings", allBookingData.size());

        return response;
    }


    private void getBooking(List<BookingListResponseDto.BookingDataDto> allBookingData, Booking booking) {
        try {
            String clientReference = booking.getId();
            logger.debug("Fetching booking from Nuitee for clientReference: {}", clientReference);

            BookingListResponse connectorResponse = nuiteeApiClient.listBookings(clientReference);

            BookingListResponseDto.BookingDataDto mergedDto = null;

            if (connectorResponse != null && connectorResponse.getData() != null
                    && !connectorResponse.getData().isEmpty()) {
                // Map connector response to DTO - expecting exactly one booking per
                // clientReference
                BookingListResponseDto dto = bookingMapper.toBookingListResponseDto(connectorResponse);
                if (dto != null && dto.getData() != null && !dto.getData().isEmpty()) {
                    // LiteAPI returns exactly one booking per clientReference
                    mergedDto = dto.getData().get(0);
                }
            }

            // Merge Booking entity data with Nuitee response (entity data takes precedence)
            mergedDto = bookingMapper.mergeBookingEntityData(mergedDto, booking);

            if (mergedDto != null) {
                allBookingData.add(mergedDto);
                logger.debug("Added booking for clientReference: {} (bookingId: {})",
                        clientReference,
                        mergedDto.getBookingId());
            } else {
                logger.debug("No booking data available for clientReference: {}", clientReference);
            }
        } catch (Exception e) {
            logger.warn("Failed to fetch booking from Nuitee for booking ID {}: {}", booking.getId(),
                    e.getMessage());
            // Continue with other bookings even if one fails
        }
    }
}
