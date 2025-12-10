package com.travelhub.booking.service.impl;

import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.BookResponseDto;
import com.travelhub.booking.dto.response.BookingListResponseDto;
import com.travelhub.booking.dto.response.PrebookResponseDto;
import com.travelhub.booking.mapper.BookingMapper;
import com.travelhub.booking.mapper.HotelDataMapper;
import com.travelhub.booking.model.Booking;
import com.travelhub.booking.model.BookingGuest;
import com.travelhub.booking.model.BookingRoom;
import com.travelhub.booking.model.BookingSimulation;
import com.travelhub.booking.repository.BookingRepository;
import com.travelhub.booking.repository.BookingSimulationRepository;
import com.travelhub.booking.service.BookingService;
import com.travelhub.booking.service.HotelDataService;
import com.travelhub.connectors.nuitee.NuiteeApiClient;
import com.travelhub.connectors.nuitee.dto.request.BookRequest;
import com.travelhub.connectors.nuitee.dto.request.HotelsListRequest;
import com.travelhub.connectors.nuitee.dto.request.PrebookRequest;
import com.travelhub.connectors.nuitee.dto.response.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);
    private final NuiteeApiClient nuiteeApiClient;
    private final BookingMapper bookingMapper;
    private final BookingRepository bookingRepository;
    private final BookingSimulationRepository bookingSimulationRepository;
    private final HotelDataService hotelDataService;
    private final HotelDataMapper hotelDataMapper;

    public BookingServiceImpl(NuiteeApiClient nuiteeApiClient, BookingMapper bookingMapper,
            BookingRepository bookingRepository, BookingSimulationRepository bookingSimulationRepository,
            HotelDataService hotelDataService, HotelDataMapper hotelDataMapper) {
        this.nuiteeApiClient = nuiteeApiClient;
        this.bookingMapper = bookingMapper;
        this.bookingRepository = bookingRepository;
        this.bookingSimulationRepository = bookingSimulationRepository;
        this.hotelDataService = hotelDataService;
        this.hotelDataMapper = hotelDataMapper;
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
                        BookingRoom room = new BookingRoom();
                        room.setBooking(savedBooking);
                        room.setRoomName(roomData.getRoomName());
                        room.setBoardName(roomData.getBoardName());
                        savedBooking.getRooms().add(room);
                    }
                }

                // Create and save guest entity
                if (data.getHolder() != null) {
                    BookingGuest guest = new BookingGuest();
                    guest.setBooking(savedBooking);
                    guest.setFirstName(data.getHolder().getFirstName());
                    guest.setLastName(data.getHolder().getLastName());
                    guest.setEmail(data.getHolder().getEmail());
                    guest.setPhone(data.getHolder().getPhone());
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

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        logger.info("Found booking in database with bookingId: {}", booking.getBookingId());

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

        BookResponseDto bookResponse;
        if (connectorResponse != null) {
            bookResponse = bookingMapper.toBookResponseDto(connectorResponse);
        } else {
            // TODO use a mapper here
            bookResponse = new BookResponseDto();
            BookResponseDto.BookDataDto bookData = new BookResponseDto.BookDataDto();
            bookData.setBookingId(booking.getBookingId());
            bookData.setStatus(booking.getStatus());
            bookData.setClientReference(booking.getId());
            bookData.setCheckin(booking.getCheckin() != null ? booking.getCheckin() : null);
            bookData.setCheckout(booking.getCheckout() != null ? booking.getCheckout() : null);
            bookData.setHotelId(booking.getHotelId());
            bookData.setHotelName(booking.getHotelName());
            bookResponse.setData(bookData);
        }

        if (bookResponse != null && bookResponse.getData() != null && bookResponse.getData().getHotelId() != null) {
            try {
                String hotelId = bookResponse.getData().getHotelId();
                logger.info("Fetching hotel details for hotelId: {}", hotelId);
                HotelDetailsResponse hotelDetailsResponse = hotelDataService.getHotelDetails(hotelId, "fr");
                if (hotelDetailsResponse != null && hotelDetailsResponse.getData() != null) {
                    HotelData hotelData = hotelDetailsResponse.getData();
                    BookResponseDto.HotelInfoDto hotelInfo = hotelDataMapper.toHotelInfoDto(hotelData);
                    bookResponse.getData().setHotel(hotelInfo);
                }
            } catch (Exception e) {
                logger.warn("Failed to fetch hotel details: {}", e.getMessage());
            }
        }

        return bookResponse;
    }

    @Override
    public BookingListResponseDto listBookings() {
        logger.info("Listing bookings for connected user");

        List<Booking> bookings = bookingRepository.findByStatusNotOrderByCheckinAscCreatedAtAsc("FAILED");
        logger.info("Found {} bookings in database (excluding FAILED)", bookings.size());

        List<BookingListResponseDto.BookingDataDto> allBookingData = new ArrayList<>();

        for (Booking booking : bookings) {
            getBooking(allBookingData, booking);
        }

        List<String> uniqueHotelIds = allBookingData.stream()
                .map(BookingListResponseDto.BookingDataDto::getHotelId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        logger.info("Found {} unique hotel IDs across bookings", uniqueHotelIds.size());

        Map<String, MinimalHotelData> hotelDataMap = new HashMap<>();

        if (!uniqueHotelIds.isEmpty()) {
            try {
                HotelsListRequest hotelsRequest = new HotelsListRequest();
                hotelsRequest.setHotelIds(String.join(",", uniqueHotelIds));

                logger.debug("Fetching hotel details for {} hotels", uniqueHotelIds.size());
                HotelsListResponse hotelsResponse = nuiteeApiClient
                        .getHotels(hotelsRequest);

                if (hotelsResponse != null && hotelsResponse.getData() != null) {
                    for (MinimalHotelData hotelData : hotelsResponse
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

        for (BookingListResponseDto.BookingDataDto bookingData : allBookingData) {
            if (bookingData.getHotelId() != null && hotelDataMap.containsKey(bookingData.getHotelId())) {
                MinimalHotelData hotelData = hotelDataMap
                        .get(bookingData.getHotelId());

                BookingListResponseDto.HotelInfoDto hotelDto = bookingData.getHotel();
                if (hotelDto == null) {
                    hotelDto = new BookingListResponseDto.HotelInfoDto();
                    bookingData.setHotel(hotelDto);
                }

                if (hotelData.getMainPhoto() != null) {
                    hotelDto.setMainPhoto(hotelData.getMainPhoto());
                }
                if (hotelData.getThumbnail() != null) {
                    hotelDto.setThumbnail(hotelData.getThumbnail());
                }

                logger.debug("Enriched booking {} with hotel images", bookingData.getBookingId());
            }
        }

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
                BookingListResponseDto bookingListResponse = bookingMapper.toBookingListResponseDto(connectorResponse);
                if (bookingListResponse != null && bookingListResponse.getData() != null && !bookingListResponse.getData().isEmpty()) {
                    // LiteAPI returns exactly one booking per clientReference
                    mergedDto = bookingListResponse.getData().get(0);
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
