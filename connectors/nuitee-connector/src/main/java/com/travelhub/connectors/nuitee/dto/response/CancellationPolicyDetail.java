package com.travelhub.connectors.nuitee.dto.response;

import java.util.List;

public class CancellationPolicyDetail {
    private List<CancellationPolicyInfo> cancelPolicyInfos;
    private List<String> hotelRemarks;
    private String refundableTag;

    public List<CancellationPolicyInfo> getCancelPolicyInfos() {
        return cancelPolicyInfos;
    }

    public void setCancelPolicyInfos(List<CancellationPolicyInfo> cancelPolicyInfos) {
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

