package com.travelhub.connectors.nuitee;

import com.travelhub.connectors.nuitee.dto.request.BookRequest;
import com.travelhub.connectors.nuitee.dto.request.PrebookRequest;
import com.travelhub.connectors.nuitee.dto.response.BookResponse;
import com.travelhub.connectors.nuitee.dto.response.PrebookResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class NuiteeApiClientImplTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private NuiteeProperties properties;

    @InjectMocks
    private NuiteeApiClientImpl apiClient;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        when(properties.getBookingBaseUrl()).thenReturn("http://api.nuitee.com");
    }

    @Test
    public void testPrebook_Success() {
        // Arrange
        PrebookRequest request = new PrebookRequest();
        request.setOfferId("offer_123");

        PrebookResponse response = new PrebookResponse();
        PrebookResponse.PrebookData data = new PrebookResponse.PrebookData();
        data.setPrebookId("prebook_abc");
        response.setData(data);

        when(restTemplate.postForObject(eq("http://api.nuitee.com/rates/prebook"), any(PrebookRequest.class),
                eq(PrebookResponse.class)))
                .thenReturn(response);

        // Act
        PrebookResponse result = apiClient.prebook(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getData().getPrebookId()).isEqualTo("prebook_abc");
        verify(restTemplate).postForObject(eq("http://api.nuitee.com/rates/prebook"), eq(request),
                eq(PrebookResponse.class));
    }

    @Test
    public void testBook_Success() {
        // Arrange
        BookRequest request = new BookRequest();
        request.setPrebookId("prebook_abc");

        BookResponse response = new BookResponse();
        BookResponse.BookData data = new BookResponse.BookData();
        data.setBookingId("booking_123");
        response.setData(data);

        when(restTemplate.postForObject(eq("http://api.nuitee.com/rates/book"), any(BookRequest.class),
                eq(BookResponse.class)))
                .thenReturn(response);

        // Act
        BookResponse result = apiClient.book(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getData().getBookingId()).isEqualTo("booking_123");
        verify(restTemplate).postForObject(eq("http://api.nuitee.com/rates/book"), eq(request), eq(BookResponse.class));
    }

    @Test
    public void testGetBooking_Success() {
        // Arrange
        String bookingId = "booking_123";
        BookResponse response = new BookResponse();
        BookResponse.BookData data = new BookResponse.BookData();
        data.setBookingId(bookingId);
        response.setData(data);

        when(restTemplate.getForObject(eq("http://api.nuitee.com/bookings/" + bookingId), eq(BookResponse.class)))
                .thenReturn(response);

        // Act
        BookResponse result = apiClient.getBooking(bookingId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getData().getBookingId()).isEqualTo(bookingId);
        verify(restTemplate).getForObject(eq("http://api.nuitee.com/bookings/" + bookingId), eq(BookResponse.class));
    }
}
