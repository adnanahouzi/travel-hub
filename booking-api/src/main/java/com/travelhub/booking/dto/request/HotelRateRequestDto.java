package com.travelhub.booking.dto.request;

import com.travelhub.connectors.nuitee.dto.common.Occupancy;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

@Schema(description = "Request to get rates for a specific hotel")
public class HotelRateRequestDto {

    @Schema(description = "Guest occupancy information", required = true)
    private List<Occupancy> occupancies;


    @Schema(description = "Check-in date", example = "2024-12-25", required = true)
    private LocalDate checkin;

    @Schema(description = "Check-out date", example = "2024-12-27", required = true)
    private LocalDate checkout;


    public List<Occupancy> getOccupancies() {
        return occupancies;
    }

    public void setOccupancies(List<Occupancy> occupancies) {
        this.occupancies = occupancies;
    }


    public LocalDate getCheckin() {
        return checkin;
    }

    public void setCheckin(LocalDate checkin) {
        this.checkin = checkin;
    }

    public LocalDate getCheckout() {
        return checkout;
    }

    public void setCheckout(LocalDate checkout) {
        this.checkout = checkout;
    }

}

