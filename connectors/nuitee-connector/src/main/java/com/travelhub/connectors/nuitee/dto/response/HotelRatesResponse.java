package com.travelhub.connectors.nuitee.dto.response;

import java.util.List;

public class HotelRatesResponse {
    private List<HotelRate> data;
    private Integer guestLevel;
    private List<HotelInfo> hotels;
    private Boolean sandbox;
    private String sessionId; // Often returned but maybe not in this specific snippet, keeping just in case

    public List<HotelRate> getData() {
        return data;
    }

    public void setData(List<HotelRate> data) {
        this.data = data;
    }

    public Integer getGuestLevel() {
        return guestLevel;
    }

    public void setGuestLevel(Integer guestLevel) {
        this.guestLevel = guestLevel;
    }

    public List<HotelInfo> getHotels() {
        return hotels;
    }

    public void setHotels(List<HotelInfo> hotels) {
        this.hotels = hotels;
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
