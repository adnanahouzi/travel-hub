package com.travelhub.booking.dto.response;

import java.util.List;

public class CancellationPolicyDetailDto {
    private List<CancellationPolicyInfoDto> cancelPolicyInfos;
    private List<String> hotelRemarks;
    private String refundableTag;

    public List<CancellationPolicyInfoDto> getCancelPolicyInfos() {
        return cancelPolicyInfos;
    }

    public void setCancelPolicyInfos(List<CancellationPolicyInfoDto> cancelPolicyInfos) {
        this.cancelPolicyInfos = cancelPolicyInfos;
    }

    public List<String> getHotelRemarks() {
        return hotelRemarks;
    }

    public void setHotelRemarks(List<String> hotelRemarks) {
        this.hotelRemarks = hotelRemarks;
    }

    public String getRefundableTag() {
        return refundableTag;
    }

    public void setRefundableTag(String refundableTag) {
        this.refundableTag = refundableTag;
    }
}

