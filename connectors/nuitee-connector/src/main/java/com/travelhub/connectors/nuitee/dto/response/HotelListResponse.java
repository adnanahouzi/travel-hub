package com.travelhub.connectors.nuitee.dto.response;

import java.util.List;

public class HotelListResponse {
    private List<HotelData> data;

    public List<HotelData> getData() {
        return data;
    }

    public void setData(List<HotelData> data) {
        this.data = data;
    }
}
