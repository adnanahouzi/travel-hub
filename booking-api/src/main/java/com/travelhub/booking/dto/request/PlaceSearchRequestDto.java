package com.travelhub.booking.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request to search for places (cities, regions, etc.)")
public class PlaceSearchRequestDto {

    @Schema(description = "Text query to search for places (e.g., city name, region)", example = "Paris", required = true)
    private String textQuery;

    @Schema(description = "Language code for the response (ISO 639-1)", example = "en", defaultValue = "en")
    private String language;

    @Schema(description = "Client IP address for geolocation", example = "192.168.1.1")
    private String clientIP;

    public String getTextQuery() {
        return textQuery;
    }

    public void setTextQuery(String textQuery) {
        this.textQuery = textQuery;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getClientIP() {
        return clientIP;
    }

    public void setClientIP(String clientIP) {
        this.clientIP = clientIP;
    }
}

