package com.travelhub.connectors.nuitee.dto.response;

public class BookingHotelInfo {

    private String hotelId;
    private String name;
    private String parentHotelId;

    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParentHotelId() {
        return parentHotelId;
    }

    public void setParentHotelId(String parentHotelId) {
        this.parentHotelId = parentHotelId;
    }
}
