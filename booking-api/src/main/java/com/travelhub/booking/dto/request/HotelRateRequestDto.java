package com.travelhub.booking.dto.request;

import com.travelhub.connectors.nuitee.dto.common.Occupancy;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

@Schema(description = "Request to get rates for a specific hotel")
public class HotelRateRequestDto {

    @Schema(description = "Guest occupancy information", required = true)
    private List<Occupancy> occupancies;

    @Schema(description = "Currency code (ISO 4217)", example = "USD", required = true)
    private String currency;

    @Schema(description = "Guest nationality (ISO 3166-1 alpha-2)", example = "US", required = true)
    private String guestNationality;

    @Schema(description = "Check-in date", example = "2024-12-25", required = true)
    private LocalDate checkin;

    @Schema(description = "Check-out date", example = "2024-12-27", required = true)
    private LocalDate checkout;

    @Schema(description = "Request timeout in milliseconds", example = "5000")
    private Integer timeout;

    @Schema(description = "Enable room mapping to get detailed room information", example = "true")
    private Boolean roomMapping;

    @Schema(description = "Language code for response (ISO 639-1)", example = "en")
    private String language;

    @Schema(description = "Return only advanced accessibility information", example = "false")
    private Boolean advancedAccessibilityOnly;

    // Getters and Setters

    public List<Occupancy> getOccupancies() {
        return occupancies;
    }

    public void setOccupancies(List<Occupancy> occupancies) {
        this.occupancies = occupancies;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getGuestNationality() {
        return guestNationality;
    }

    public void setGuestNationality(String guestNationality) {
        this.guestNationality = guestNationality;
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

    public Integer getTimeout() {
        return timeout;
    }

    public void setTimeout(Integer timeout) {
        this.timeout = timeout;
    }

    public Boolean getRoomMapping() {
        return roomMapping;
    }

    public void setRoomMapping(Boolean roomMapping) {
        this.roomMapping = roomMapping;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Boolean getAdvancedAccessibilityOnly() {
        return advancedAccessibilityOnly;
    }

    public void setAdvancedAccessibilityOnly(Boolean advancedAccessibilityOnly) {
        this.advancedAccessibilityOnly = advancedAccessibilityOnly;
    }
}

