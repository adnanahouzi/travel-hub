package com.travelhub.connectors.nuitee.dto.common;

import java.math.BigDecimal;

public class Price {
    private BigDecimal amount;
    private String currency;
    private String source; // e.g., "providerDirect"

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
