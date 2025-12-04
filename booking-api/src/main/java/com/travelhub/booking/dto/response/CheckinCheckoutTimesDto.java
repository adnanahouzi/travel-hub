package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Check-in and check-out time information")
public class CheckinCheckoutTimesDto {

    @Schema(description = "Check-in start time", example = "14:00")
    private String checkinFrom;

    @Schema(description = "Check-in end time", example = "23:00")
    private String checkinTo;

    @Schema(description = "Check-out time", example = "11:00")
    private String checkout;

    public String getCheckinFrom() {
        return checkinFrom;
    }

    public void setCheckinFrom(String checkinFrom) {
        this.checkinFrom = checkinFrom;
    }

    public String getCheckinTo() {
        return checkinTo;
    }

    public void setCheckinTo(String checkinTo) {
        this.checkinTo = checkinTo;
    }

    public String getCheckout() {
        return checkout;
    }

    public void setCheckout(String checkout) {
        this.checkout = checkout;
    }
}

