package com.travelhub.connectors.nuitee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;

public class HotelDetailsResponse {
    private HotelData data;

    public HotelData getData() {
        return data;
    }

    public void setData(HotelData data) {
        this.data = data;
    }
}

