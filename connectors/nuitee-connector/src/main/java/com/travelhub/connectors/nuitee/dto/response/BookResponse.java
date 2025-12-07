package com.travelhub.connectors.nuitee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;

public class BookResponse {

    private BookData data;
    private Integer guestLevel;
    private Boolean sandbox;

    public BookData getData() {
        return data;
    }

    public void setData(BookData data) {
        this.data = data;
    }

    public Integer getGuestLevel() {
        return guestLevel;
    }

    public void setGuestLevel(Integer guestLevel) {
        this.guestLevel = guestLevel;
    }

    public Boolean getSandbox() {
        return sandbox;
    }

    public void setSandbox(Boolean sandbox) {
        this.sandbox = sandbox;
    }

    public static class BookData {
        private String bookingId;
        private String hotelConfirmationCode;
        private String reference;
        private String status;
        private BigDecimal price;
        private String currency;
        private String checkin;
        private String checkout;
        private String hotelId;
        private String hotelName;
        
        @JsonProperty("bookedRooms")
        private List<RoomBooked> rooms;
        
        @JsonProperty("holder")
        private GuestContact guest;

        public String getBookingId() {
            return bookingId;
        }

        public void setBookingId(String bookingId) {
            this.bookingId = bookingId;
        }

        public String getHotelConfirmationCode() {
            return hotelConfirmationCode;
        }

        public void setHotelConfirmationCode(String hotelConfirmationCode) {
            this.hotelConfirmationCode = hotelConfirmationCode;
        }

        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
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

        public String getHotelId() {
            return hotelId;
        }

        public void setHotelId(String hotelId) {
            this.hotelId = hotelId;
        }

        public String getHotelName() {
            return hotelName;
        }

        public void setHotelName(String hotelName) {
            this.hotelName = hotelName;
        }

        public List<RoomBooked> getRooms() {
            return rooms;
        }

        public void setRooms(List<RoomBooked> rooms) {
            this.rooms = rooms;
        }

        public GuestContact getGuest() {
            return guest;
        }

        public void setGuest(GuestContact guest) {
            this.guest = guest;
        }
    }

    public static class RoomBooked {
        private String roomName;
        
        @JsonProperty("boardName")
        private String boardName;
        
        @JsonProperty("mappedRoomId")
        private Long mappedRoomId;
        
        // Nested structure for roomType
        private RoomType roomType;

        public String getRoomId() {
            // Get roomId from roomType.roomTypeId
            return roomType != null ? roomType.getRoomTypeId() : null;
        }

        public void setRoomId(String roomId) {
            // If roomType doesn't exist, create it
            if (roomType == null) {
                roomType = new RoomType();
            }
            roomType.setRoomTypeId(roomId);
        }

        public String getRoomName() {
            if (roomName != null) {
                return roomName;
            }
            // Fallback to roomType.name if roomName is not directly available
            return roomType != null ? roomType.getName() : null;
        }

        public void setRoomName(String roomName) {
            this.roomName = roomName;
        }

        public String getBoardName() {
            return boardName;
        }

        public void setBoardName(String boardName) {
            this.boardName = boardName;
        }
        
        public Long getMappedRoomId() {
            return mappedRoomId;
        }
        
        public void setMappedRoomId(Long mappedRoomId) {
            this.mappedRoomId = mappedRoomId;
        }
        
        public RoomType getRoomType() {
            return roomType;
        }
        
        public void setRoomType(RoomType roomType) {
            this.roomType = roomType;
        }
        
        public static class RoomType {
            @JsonProperty("roomTypeId")
            private String roomTypeId;
            
            private String name;
            
            public String getRoomTypeId() {
                return roomTypeId;
            }
            
            public void setRoomTypeId(String roomTypeId) {
                this.roomTypeId = roomTypeId;
            }
            
            public String getName() {
                return name;
            }
            
            public void setName(String name) {
                this.name = name;
            }
        }
    }

    public static class GuestContact {
        private String firstName;
        private String lastName;
        private String email;
        private String phone;

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
}
