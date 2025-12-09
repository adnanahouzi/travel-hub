package com.travelhub.booking.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "booking_simulations")
public class BookingSimulation {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @ElementCollection
    @CollectionTable(name = "simulation_prebook_ids", joinColumns = @JoinColumn(name = "simulation_id"))
    @Column(name = "prebook_id")
    private List<String> connectorPrebookIds;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalIncludedTaxes;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalExcludedTaxes;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        expiresAt = LocalDateTime.now().plusMinutes(30);
        if (status == null) {
            status = "ACTIVE";
        }
    }

    // Helper method to check if simulation is expired
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getConnectorPrebookIds() {
        return connectorPrebookIds;
    }

    public void setConnectorPrebookIds(List<String> connectorPrebookIds) {
        this.connectorPrebookIds = connectorPrebookIds;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}
