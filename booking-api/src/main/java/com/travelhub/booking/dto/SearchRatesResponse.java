package com.travelhub.booking.dto;

import java.util.List;

public class SearchRatesResponse {
    private List<SearchResult> results;

    public List<SearchResult> getResults() { return results; }
    public void setResults(List<SearchResult> results) { this.results = results; }

    public static class SearchResult {
        private String hotelId;
        private String hotelName;
        private List<RoomOption> roomOptions;

        public String getHotelId() { return hotelId; }
        public void setHotelId(String hotelId) { this.hotelId = hotelId; }

        public String getHotelName() { return hotelName; }
        public void setHotelName(String hotelName) { this.hotelName = hotelName; }

        public List<RoomOption> getRoomOptions() { return roomOptions; }
        public void setRoomOptions(List<RoomOption> roomOptions) { this.roomOptions = roomOptions; }
    }

    public static class RoomOption {
        private String roomName;
        private List<RateOption> rates;

        public String getRoomName() { return roomName; }
        public void setRoomName(String roomName) { this.roomName = roomName; }

        public List<RateOption> getRates() { return rates; }
        public void setRates(List<RateOption> rates) { this.rates = rates; }
    }

    public static class RateOption {
        private String rateId;
        private String name;
        private Double price;
        private String currency;
        private String boardName;
        private String cancellationPolicy;

        public String getRateId() { return rateId; }
        public void setRateId(String rateId) { this.rateId = rateId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public String getBoardName() { return boardName; }
        public void setBoardName(String boardName) { this.boardName = boardName; }

        public String getCancellationPolicy() { return cancellationPolicy; }
        public void setCancellationPolicy(String cancellationPolicy) { this.cancellationPolicy = cancellationPolicy; }
    }
}

