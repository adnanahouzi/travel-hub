package com.travelhub.booking.service.impl;

import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.booking.dto.request.HolderDto;
import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.BookResponseDto;
import com.travelhub.booking.dto.response.PrebookResponseDto;
import com.travelhub.booking.mapper.BookingMapper;
import com.travelhub.booking.model.Booking;
import com.travelhub.booking.model.BookingSimulation;
import com.travelhub.booking.repository.BookingRepository;
import com.travelhub.booking.repository.BookingSimulationRepository;
import com.travelhub.booking.service.HotelDataService;
import com.travelhub.connectors.nuitee.NuiteeApiClient;
import com.travelhub.connectors.nuitee.dto.request.BookRequest;
import com.travelhub.connectors.nuitee.dto.request.PrebookRequest;
import com.travelhub.connectors.nuitee.dto.response.BookResponse;
import com.travelhub.connectors.nuitee.dto.response.PrebookResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class BookingServiceImplTest {

    @Mock
    private NuiteeApiClient nuiteeApiClient;

    @Mock
    private BookingMapper bookingMapper;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingSimulationRepository bookingSimulationRepository;

    @Mock
    private HotelDataService hotelDataService;

    @InjectMocks
    private BookingServiceImpl bookingService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testPrebook_Success() {
        // Arrange
        PrebookRequestDto requestDto = new PrebookRequestDto();
        requestDto.setOfferId("offer_123");

        PrebookRequest connectorRequest = new PrebookRequest();

        PrebookResponse connectorResponse = new PrebookResponse();
        PrebookResponse.PrebookData prebookData = new PrebookResponse.PrebookData();
        prebookData.setPrebookId("prebook_ABC");
        prebookData.setSuggestedSellingPrice(new BigDecimal("100.00"));
        prebookData.setTotalIncludedTaxes(new BigDecimal("10.00"));
        prebookData.setTotalExcludedTaxes(new BigDecimal("5.00"));
        prebookData.setCurrency("USD");
        connectorResponse.setData(prebookData);
        connectorResponse.setGuestLevel(1);
        connectorResponse.setSandbox(true);

        PrebookResponseDto responseDto = new PrebookResponseDto();
        PrebookResponseDto.PrebookDataDto dataDto = new PrebookResponseDto.PrebookDataDto();
        dataDto.setPrebookId("prebook_ABC");
        dataDto.setSuggestedSellingPrice(new BigDecimal("100.00"));
        dataDto.setTotalIncludedTaxes(new BigDecimal("10.00"));
        dataDto.setTotalExcludedTaxes(new BigDecimal("5.00"));
        dataDto.setCurrency("USD");
        responseDto.setData(dataDto);
        responseDto.setGuestLevel(1);
        responseDto.setSandbox(true);

        BookingSimulation savedSimulation = new BookingSimulation();
        savedSimulation.setId("sim_001");
        savedSimulation.setTotalAmount(new BigDecimal("100.00"));
        savedSimulation.setStatus("ACTIVE");

        when(bookingMapper.toPrebookRequest(requestDto)).thenReturn(connectorRequest);
        when(nuiteeApiClient.prebook(connectorRequest)).thenReturn(connectorResponse);
        when(bookingMapper.toPrebookResponseDto(connectorResponse)).thenReturn(responseDto);
        when(bookingSimulationRepository.save(any(BookingSimulation.class))).thenReturn(savedSimulation);

        // Act
        PrebookResponseDto result = bookingService.prebook(requestDto);

        // Assert
        assertThat(result).isNotNull();
        // prebook response doesn't have sessionId directly in this implementation based
        // on reviewed code
        assertThat(result.getSimulationId()).isEqualTo("sim_001");
        assertThat(result.getData()).isNotNull();
        assertThat(result.getData().getPrebookId()).isEqualTo("prebook_ABC");
        assertThat(result.getData().getSuggestedSellingPrice()).isEqualByComparingTo(new BigDecimal("100.00"));

        verify(bookingMapper).toPrebookRequest(requestDto);
        verify(nuiteeApiClient).prebook(connectorRequest);
        verify(bookingMapper).toPrebookResponseDto(connectorResponse);

        ArgumentCaptor<BookingSimulation> simulationCaptor = ArgumentCaptor.forClass(BookingSimulation.class);
        verify(bookingSimulationRepository).save(simulationCaptor.capture());
        BookingSimulation capturedSimulation = simulationCaptor.getValue();
        assertThat(capturedSimulation.getTotalAmount()).isEqualByComparingTo(new BigDecimal("100.00"));
        assertThat(capturedSimulation.getCurrency()).isEqualTo("USD");
        assertThat(capturedSimulation.getConnectorPrebookIds()).containsExactly("prebook_ABC");
    }

    @Test
    public void testInitiateBooking_Success() {
        // Arrange
        BookingInitiationRequestDto requestDto = new BookingInitiationRequestDto();
        requestDto.setSimulationId("sim_001");
        requestDto.setBankingAccount("1234567890123456");

        HolderDto holder = new HolderDto();
        holder.setFirstName("John");
        holder.setLastName("Doe");
        holder.setEmail("john.doe@example.com");
        holder.setPhone("1234567890");
        requestDto.setHolder(holder);

        BookingSimulation simulation = new BookingSimulation();
        simulation.setId("sim_001");
        simulation.setStatus("ACTIVE");
        simulation.setExpiresAt(LocalDateTime.now().plusMinutes(15));

        when(bookingSimulationRepository.findById("sim_001")).thenReturn(Optional.of(simulation));

        // Act
        Booking result = bookingService.initiateBooking(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getHolderFirstName()).isEqualTo("John");
        assertThat(result.getHolderLastName()).isEqualTo("Doe");
        assertThat(result.getSimulationId()).isEqualTo("sim_001");
        assertThat(result.getStatus()).isEqualTo("INITIATED");
        // Verify it was NOT saved
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    public void testSubmitBooking_Success() {
        // Arrange
        BookingInitiationRequestDto requestDto = new BookingInitiationRequestDto();
        requestDto.setSimulationId("sim_001");
        requestDto.setBankingAccount("1234567890123456");
        HolderDto holder = new HolderDto();
        holder.setFirstName("John");
        holder.setLastName("Doe");
        holder.setEmail("john@example.com");
        holder.setPhone("1234567890");
        requestDto.setHolder(holder);

        BookingSimulation simulation = new BookingSimulation();
        simulation.setId("sim_001");
        simulation.setStatus("ACTIVE");
        simulation.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        simulation.setConnectorPrebookIds(List.of("prebook_123"));

        Booking initialBooking = new Booking();
        initialBooking.setId("db_id_123");
        initialBooking.setSimulationId("sim_001");

        BookRequest connectorRequest = new BookRequest();

        BookResponse connectorResponse = new BookResponse();
        connectorResponse.setGuestLevel(1);
        connectorResponse.setSandbox(false);
        BookResponse.BookData bookData = new BookResponse.BookData();
        bookData.setBookingId("LITE_123");
        bookData.setStatus("CONFIRMED");
        bookData.setPrice(new BigDecimal("200.00"));
        bookData.setCurrency("USD");
        connectorResponse.setData(bookData);

        BookResponseDto responseDto = new BookResponseDto();
        BookResponseDto.BookDataDto responseData = new BookResponseDto.BookDataDto();
        responseData.setBookingId("LITE_123");
        responseData.setStatus("CONFIRMED");
        responseDto.setData(responseData);

        when(bookingSimulationRepository.findById("sim_001")).thenReturn(Optional.of(simulation));
        when(bookingRepository.save(any(Booking.class))).thenReturn(initialBooking); // First save
        when(bookingMapper.toBookRequest(eq(requestDto), eq("prebook_123"), eq("db_id_123")))
                .thenReturn(connectorRequest);
        when(nuiteeApiClient.book(connectorRequest)).thenReturn(connectorResponse);
        when(bookingMapper.toBookResponseDto(connectorResponse)).thenReturn(responseDto);

        // Act
        BookResponseDto result = bookingService.submitBooking(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getData().getClientReference()).isEqualTo("db_id_123");

        verify(bookingSimulationRepository).findById("sim_001");
        // Should be saved twice: once initially (PENDING), once after connector
        // response (CONFIRMED)
        verify(bookingRepository, times(2)).save(any(Booking.class));
        verify(nuiteeApiClient).book(connectorRequest);
    }

    @Test
    public void testGetBooking_Success() {
        // Arrange
        String dbId = "db_id_123";
        Booking booking = new Booking();
        booking.setId(dbId);
        booking.setBookingId("LITE_123");
        booking.setStatus("CONFIRMED");
        booking.setHolderFirstName("John");
        booking.setHolderLastName("Doe");
        booking.setHotelId("hotel_123");
        booking.setHotelName("Grand Hotel");
        booking.setPrice(new BigDecimal("150.00"));
        booking.setCurrency("EUR");

        BookResponse connectorResponse = new BookResponse();
        BookResponse.BookData data = new BookResponse.BookData();
        data.setBookingId("LITE_123");
        data.setStatus("CONFIRMED");
        data.setHotelId("hotel_123");
        connectorResponse.setData(data);

        BookResponseDto responseDto = new BookResponseDto();
        BookResponseDto.BookDataDto dataDto = new BookResponseDto.BookDataDto();
        dataDto.setBookingId("LITE_123");
        dataDto.setHotelId("hotel_123");
        // Initial values before enrichment
        dataDto.setStatus("CONFIRMED");
        responseDto.setData(dataDto);

        when(bookingRepository.findById(dbId)).thenReturn(Optional.of(booking));
        when(nuiteeApiClient.getBooking("LITE_123")).thenReturn(connectorResponse);
        when(bookingMapper.toBookResponseDto(connectorResponse)).thenReturn(responseDto);

        // Act
        BookResponseDto result = bookingService.getBooking(dbId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getData()).isNotNull();
        // Check data enrichment from DB
        assertThat(result.getData().getClientReference()).isEqualTo(dbId);
        assertThat(result.getData().getHotelName()).isEqualTo("Grand Hotel");
        assertThat(result.getData().getPrice()).isEqualByComparingTo(new BigDecimal("150.00"));
        assertThat(result.getData().getCurrency()).isEqualTo("EUR");
        assertThat(result.getData().getGuest().getFirstName()).isEqualTo("John");

        verify(bookingRepository).findById(dbId);
        verify(nuiteeApiClient).getBooking("LITE_123");
        verify(hotelDataService).getHotelDetails("hotel_123", "fr");
    }
}
