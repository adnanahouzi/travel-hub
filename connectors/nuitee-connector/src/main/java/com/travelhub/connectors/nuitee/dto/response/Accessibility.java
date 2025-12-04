package com.travelhub.connectors.nuitee.dto.response;

public class Accessibility {
    private String certificateId;
    private String certificateUrl;
    private String certificateHtml;
    private AccessibilityAttributes attributes;
    private Integer totalDisabilityScore;
    // Simplified for brevity, can add detailed disability objects if needed

    public String getCertificateId() { return certificateId; }
    public void setCertificateId(String certificateId) { this.certificateId = certificateId; }

    public String getCertificateUrl() { return certificateUrl; }
    public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }

    public String getCertificateHtml() { return certificateHtml; }
    public void setCertificateHtml(String certificateHtml) { this.certificateHtml = certificateHtml; }

    public AccessibilityAttributes getAttributes() { return attributes; }
    public void setAttributes(AccessibilityAttributes attributes) { this.attributes = attributes; }

    public Integer getTotalDisabilityScore() { return totalDisabilityScore; }
    public void setTotalDisabilityScore(Integer totalDisabilityScore) { this.totalDisabilityScore = totalDisabilityScore; }
}

