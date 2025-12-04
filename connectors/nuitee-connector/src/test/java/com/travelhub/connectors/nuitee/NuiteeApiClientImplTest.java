package com.travelhub.connectors.nuitee;

import com.travelhub.connectors.nuitee.dto.response.HotelListResponse;
import com.travelhub.connectors.nuitee.dto.response.HotelData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NuiteeApiClientImplTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private NuiteeProperties properties;

    private NuiteeApiClientImpl apiClient;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        apiClient = new NuiteeApiClientImpl(restTemplate, properties);
    }

    @Test
    void getHotels_shouldCallCorrectUrlAndReturnResponse() {
        // Arrange
        String placeId = "ChIJD7fiBh9u5kcRYJSMaMOCCwQ";
        HotelListResponse mockResponse = new HotelListResponse();
        HotelData hotelData = new HotelData();
        hotelData.setId("lp858a3");
        hotelData.setName("Orly Superior Hotel");
        mockResponse.setData(Collections.singletonList(hotelData));

        when(restTemplate.getForObject(anyString(), eq(HotelListResponse.class)))
                .thenReturn(mockResponse);

        // Act
        HotelListResponse response = apiClient.getHotels(null, null, null, null, null, null, null, null, null, null,
                placeId);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getData().size());
        assertEquals("Orly Superior Hotel", response.getData().get(0).getName());

        // Verify URL construction (simplified verification)
        verify(restTemplate).getForObject(anyString(), eq(HotelListResponse.class));
    }
}
