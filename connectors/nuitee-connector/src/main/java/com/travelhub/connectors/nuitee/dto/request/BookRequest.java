package com.travelhub.connectors.nuitee.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class BookRequest {

    @JsonProperty("prebookId")
    private String prebookId;

    @JsonProperty("guests")
    private List<Guest> guests;

    @JsonProperty("payment")
    private Payment payment;

    @JsonProperty("clientReference")
    private String clientReference;

    public String getPrebookId() {
        return prebookId;
    }

    public void setPrebookId(String prebookId) {
        this.prebookId = prebookId;
    }

    public List<Guest> getGuests() {
        return guests;
    }

    public void setGuests(List<Guest> guests) {
        this.guests = guests;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public String getClientReference() {
        return clientReference;
    }

    public void setClientReference(String clientReference) {
        this.clientReference = clientReference;
    }

    public static class Guest {
        @JsonProperty("occupancyNumber")
        private Integer occupancyNumber;

        @JsonProperty("remarks")
        private String remarks;

        @JsonProperty("firstName")
        private String firstName;

        @JsonProperty("lastName")
        private String lastName;

        @JsonProperty("email")
        private String email;

        @JsonProperty("phone")
        private String phone;

        public Integer getOccupancyNumber() {
            return occupancyNumber;
        }

        public void setOccupancyNumber(Integer occupancyNumber) {
            this.occupancyNumber = occupancyNumber;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }

    public static class Payment {
        @JsonProperty("method")
        private String method;

        @JsonProperty("transactionId")
        private String transactionId;

        public String getMethod() {
            return method;
        }

        public void setMethod(String method) {
            this.method = method;
        }

        public String getTransactionId() {
            return transactionId;
        }

        public void setTransactionId(String transactionId) {
            this.transactionId = transactionId;
        }
    }
}
