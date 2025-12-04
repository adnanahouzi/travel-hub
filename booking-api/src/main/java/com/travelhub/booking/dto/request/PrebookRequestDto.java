package com.travelhub.booking.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request to create a prebook session for a hotel reservation")
public class PrebookRequestDto {

    @Schema(description = "Offer ID from the rate search", example = "3gAVonJzkYykc3J...", required = true)
    private String offerId;

    @Schema(description = "Whether to use payment SDK", example = "false")
    private Boolean usePaymentSdk;

    // Getters and Setters

    public String getOfferId() {
        return offerId;
    }

    public void setOfferId(String offerId) {
        this.offerId = offerId;
    }

    public Boolean getUsePaymentSdk() {
        return usePaymentSdk;
    }

    public void setUsePaymentSdk(Boolean usePaymentSdk) {
        this.usePaymentSdk = usePaymentSdk;
    }
}

