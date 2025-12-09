package com.travelhub.connectors.nuitee.dto.response;

import java.util.List;

public class HotelsListResponse {

    private List<MinimalHotelData> data;
    private List<String> hotelIds;
    private Place place;
    private Integer total;

    public List<MinimalHotelData> getData() {
        return data;
    }

    public void setData(List<MinimalHotelData> data) {
        this.data = data;
    }

    public List<String> getHotelIds() {
        return hotelIds;
    }

    public void setHotelIds(List<String> hotelIds) {
        this.hotelIds = hotelIds;
    }

    public Place getPlace() {
        return place;
    }

    public void setPlace(Place place) {
        this.place = place;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }




}
