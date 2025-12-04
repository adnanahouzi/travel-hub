package com.travelhub.connectors.nuitee.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PrebookRequest {

    @JsonProperty("offerId")
    private String offerId;

    @JsonProperty("usePaymentSdk")
    private Boolean usePaymentSdk;

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

