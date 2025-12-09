package com.travelhub.booking.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Request to initiate a booking")
public class BookingInitiationRequestDto {

    @Schema(description = "Simulation ID from the prebook step")
    @NotNull(message = "Simulation ID is required")
    private String simulationId;

    @Schema(description = "Information about the booking holder")
    @NotNull(message = "Holder information is required")
    @Valid
    private HolderDto holder;

    @Schema(description = "Banking account number (16 characters)")
    @NotNull(message = "Banking account is required")
    @Pattern(regexp = "^[0-9]{16}$", message = "Banking account must be exactly 16 digits")
    private String bankingAccount;

    public String getSimulationId() {
        return simulationId;
    }

    public void setSimulationId(String simulationId) {
        this.simulationId = simulationId;
    }

    public HolderDto getHolder() {
        return holder;
    }

    public void setHolder(HolderDto holder) {
        this.holder = holder;
    }

    public String getBankingAccount() {
        return bankingAccount;
    }

    public void setBankingAccount(String bankingAccount) {
        this.bankingAccount = bankingAccount;
    }
}
