package com.travelhub.booking.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class BatchPrebookResponseDto {
    private String simulationId;
    private List<PrebookResponseDto> responses;
    private BigDecimal totalAmount;
    private BigDecimal totalIncludedTaxes;
    private BigDecimal totalExcludedTaxes;
    private String currency;

    public String getSimulationId() {
        return simulationId;
    }

    public void setSimulationId(String simulationId) {
        this.simulationId = simulationId;
    }

    public List<PrebookResponseDto> getResponses() {
        return responses;
    }

    public void setResponses(List<PrebookResponseDto> responses) {
        this.responses = responses;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getTotalIncludedTaxes() {
        return totalIncludedTaxes;
    }

    public void setTotalIncludedTaxes(BigDecimal totalIncludedTaxes) {
        this.totalIncludedTaxes = totalIncludedTaxes;
    }

    public BigDecimal getTotalExcludedTaxes() {
        return totalExcludedTaxes;
    }

    public void setTotalExcludedTaxes(BigDecimal totalExcludedTaxes) {
        this.totalExcludedTaxes = totalExcludedTaxes;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
