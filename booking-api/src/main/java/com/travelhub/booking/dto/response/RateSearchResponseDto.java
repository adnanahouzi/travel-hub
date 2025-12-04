package com.travelhub.booking.dto.response;

import java.util.List;

public class RateSearchResponseDto {
    private List<HotelAvailabilityDto> hotels;
    private Integer guestLevel;
    private Boolean sandbox;
    private String sessionId;

    public List<HotelAvailabilityDto> getHotels() {
        return hotels;
    }

    public void setHotels(List<HotelAvailabilityDto> hotels) {
        this.hotels = hotels;
    }

    public Integer getGuestLevel() {
        return guestLevel;
    }

    public void setGuestLevel(Integer guestLevel) {
        this.guestLevel = guestLevel;
    }

    public Boolean getSandbox() {
        return sandbox;
    }

    public void setSandbox(Boolean sandbox) {
        this.sandbox = sandbox;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}

