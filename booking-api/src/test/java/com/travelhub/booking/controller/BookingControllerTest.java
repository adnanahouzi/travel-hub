package com.travelhub.booking.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.booking.dto.request.HolderDto;
import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.BookResponseDto;
import com.travelhub.booking.dto.response.PrebookResponseDto;
import com.travelhub.booking.model.Booking;
import com.travelhub.booking.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
public class BookingControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private BookingService bookingService;

        @Autowired
        private ObjectMapper objectMapper;

        private PrebookRequestDto prebookRequest;
        private BookingInitiationRequestDto bookingRequest;

        @BeforeEach
        public void setUp() {
                prebookRequest = new PrebookRequestDto();
                prebookRequest.setOfferId("offer_123");

                bookingRequest = new BookingInitiationRequestDto();
                bookingRequest.setSimulationId("sim_001");
                bookingRequest.setBankingAccount("1234567890123456");

                HolderDto holder = new HolderDto();
                holder.setFirstName("John");
                holder.setLastName("Doe");
                holder.setEmail("john.doe@example.com");
                holder.setPhone("1234567890");
                bookingRequest.setHolder(holder);
        }

        @Test
        public void testPrebook() throws Exception {
                PrebookResponseDto responseDto = new PrebookResponseDto();
                responseDto.setSimulationId("sim_001");
                PrebookResponseDto.PrebookDataDto dataDto = new PrebookResponseDto.PrebookDataDto();
                dataDto.setPrebookId("prebook_ABC");
                responseDto.setData(dataDto);

                when(bookingService.prebook(any(PrebookRequestDto.class))).thenReturn(responseDto);

                mockMvc.perform(post("/api/bookings/prebook")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(prebookRequest)))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.simulationId").value("sim_001"))
                                .andExpect(jsonPath("$.data.prebookId").value("prebook_ABC"));

                ArgumentCaptor<PrebookRequestDto> requestCaptor = ArgumentCaptor.forClass(PrebookRequestDto.class);
                verify(bookingService).prebook(requestCaptor.capture());

                assertThat(requestCaptor.getValue().getOfferId()).isEqualTo("offer_123");
        }

        @Test
        public void testSubmitBooking() throws Exception {
                BookResponseDto responseDto = new BookResponseDto();
                BookResponseDto.BookDataDto dataDto = new BookResponseDto.BookDataDto();
                dataDto.setBookingId("LITE123456");
                dataDto.setStatus("CONFIRMED");
                dataDto.setClientReference("db_id_123");
                responseDto.setData(dataDto);

                when(bookingService.submitBooking(any(BookingInitiationRequestDto.class))).thenReturn(responseDto);

                mockMvc.perform(post("/api/bookings/submit")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(bookingRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data").exists())
                                .andExpect(jsonPath("$.data.bookingId").value("LITE123456"))
                                .andExpect(jsonPath("$.data.status").value("CONFIRMED"))
                                .andExpect(jsonPath("$.data.clientReference").value("db_id_123"));

                ArgumentCaptor<BookingInitiationRequestDto> requestCaptor = ArgumentCaptor
                                .forClass(BookingInitiationRequestDto.class);
                verify(bookingService).submitBooking(requestCaptor.capture());

                BookingInitiationRequestDto capturedRequest = requestCaptor.getValue();
                assertThat(capturedRequest.getHolder().getFirstName()).isEqualTo("John");
                assertThat(capturedRequest.getHolder().getLastName()).isEqualTo("Doe");
                assertThat(capturedRequest.getHolder().getEmail()).isEqualTo("john.doe@example.com");
        }

        @Test
        public void testInitiateBooking() throws Exception {
                Booking booking = new Booking();
                booking.setId("temp_id");
                booking.setStatus("INITIATED");
                booking.setHolderFirstName("John");

                when(bookingService.initiateBooking(any(BookingInitiationRequestDto.class))).thenReturn(booking);

                mockMvc.perform(post("/api/bookings/initiate")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(bookingRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.status").value("INITIATED"))
                                .andExpect(jsonPath("$.holderFirstName").value("John"));
        }

        @Test
        public void testGetBooking() throws Exception {
                String bookingId = "db_id_123";
                BookResponseDto responseDto = new BookResponseDto();
                BookResponseDto.BookDataDto dataDto = new BookResponseDto.BookDataDto();
                dataDto.setClientReference(bookingId);
                dataDto.setBookingId("LITE_123");
                dataDto.setStatus("CONFIRMED");
                responseDto.setData(dataDto);

                when(bookingService.getBooking(bookingId)).thenReturn(responseDto);

                mockMvc.perform(get("/api/bookings/{id}", bookingId))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data.clientReference").value(bookingId))
                                .andExpect(jsonPath("$.data.bookingId").value("LITE_123"));
        }
}
