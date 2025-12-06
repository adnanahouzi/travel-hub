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
import java.util.Objects;

import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.booking.model.Booking;
import com.travelhub.booking.model.BookingSimulation;
import com.travelhub.booking.repository.BookingRepository;
import com.travelhub.booking.repository.BookingSimulationRepository;

@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);
    private final NuiteeApiClient nuiteeApiClient;
    private final BookingMapper bookingMapper;
    private final BookingRepository bookingRepository;
    private final BookingSimulationRepository bookingSimulationRepository;

    public BookingServiceImpl(NuiteeApiClient nuiteeApiClient, BookingMapper bookingMapper,
            BookingRepository bookingRepository, BookingSimulationRepository bookingSimulationRepository) {
        this.nuiteeApiClient = nuiteeApiClient;
        this.bookingMapper = bookingMapper;
        this.bookingRepository = bookingRepository;
        this.bookingSimulationRepository = bookingSimulationRepository;
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

        // Create and save booking simulation
        BookingSimulation simulation = new BookingSimulation();
        simulation.setTotalAmount(totalAmount);
        simulation.setTotalIncludedTaxes(totalIncludedTaxes);
        simulation.setTotalExcludedTaxes(totalExcludedTaxes);
        simulation.setCurrency(currency);

        // Extract connector prebook IDs from responses
        List<String> connectorPrebookIds = responses.stream()
                .map(r -> r.getData() != null ? r.getData().getPrebookId() : null)
                .filter(Objects::nonNull)
                .toList();
        simulation.setConnectorPrebookIds(connectorPrebookIds);

        simulation = bookingSimulationRepository.save(simulation);
        logger.info("Created booking simulation with ID: {}", simulation.getId());

        BatchPrebookResponseDto batchResponse = new BatchPrebookResponseDto();
        batchResponse.setSimulationId(simulation.getId());
        batchResponse.setResponses(responses);
        batchResponse.setTotalAmount(totalAmount);
        batchResponse.setTotalIncludedTaxes(totalIncludedTaxes);
        batchResponse.setTotalExcludedTaxes(totalExcludedTaxes);
        batchResponse.setCurrency(currency);

        return batchResponse;
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
    public Booking submitBooking(BookingInitiationRequestDto request) {
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
        booking.setStatus("SUBMITTED");

        Booking savedBooking = bookingRepository.save(booking);
        logger.info("Booking saved successfully - ID: {}, simulation: {}",
                savedBooking.getId(), simulation.getId());

        return savedBooking;
    }
}
