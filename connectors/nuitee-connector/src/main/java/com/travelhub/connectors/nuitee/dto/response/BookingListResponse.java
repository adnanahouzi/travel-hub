package com.travelhub.connectors.nuitee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;

public class BookingListResponse {

    private List<BookingData> data;

    public List<BookingData> getData() {
        return data;
    }

    public void setData(List<BookingData> data) {
        this.data = data;
    }

    public static class BookingData {
        @JsonProperty("bookingId")
        private String bookingId;
        
        @JsonProperty("clientReference")
        private String clientReference;
        private String status;
        private String checkin;
        private String checkout;
        private HotelInfo hotel;
        private BigDecimal price;
        private String currency;
        private List<RoomInfo> rooms;

        public String getBookingId() {
            return bookingId;
        }

        public void setBookingId(String bookingId) {
            this.bookingId = bookingId;
        }

        public String getClientReference() {
            return clientReference;
        }

        public void setClientReference(String clientReference) {
            this.clientReference = clientReference;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getCheckin() {
            return checkin;
        }

        public void setCheckin(String checkin) {
            this.checkin = checkin;
        }

        public String getCheckout() {
            return checkout;
        }

        public void setCheckout(String checkout) {
            this.checkout = checkout;
        }

        public HotelInfo getHotel() {
            return hotel;
        }

        public void setHotel(HotelInfo hotel) {
            this.hotel = hotel;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public List<RoomInfo> getRooms() {
            return rooms;
        }

        public void setRooms(List<RoomInfo> rooms) {
            this.rooms = rooms;
        }
    }

    public static class HotelInfo {
        private String hotelId;
        private String name;

        public String getHotelId() {
            return hotelId;
        }

        public void setHotelId(String hotelId) {
            this.hotelId = hotelId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static class RoomInfo {
        @JsonProperty("room_id")
        private String roomId;
        private String roomName; // Note: JSON doesn't explicitly show roomName in the example, but it might be
                                 // there or we use description.
        // The example shows "adults", "children", "amount", "currency", "remarks",
        // "guests".
        // Let's add what's in the example.

        private Integer adults;
        private BigDecimal amount;
        private String currency;

        public String getRoomId() {
            return roomId;
        }

        public void setRoomId(String roomId) {
            this.roomId = roomId;
        }

        public Integer getAdults() {
            return adults;
        }

        public void setAdults(Integer adults) {
            this.adults = adults;
        }

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
    }
}
