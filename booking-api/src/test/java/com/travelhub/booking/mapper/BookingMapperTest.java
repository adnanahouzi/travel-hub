package com.travelhub.booking.mapper;

import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.booking.dto.request.HolderDto;
import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.BookResponseDto;
import com.travelhub.booking.dto.response.BookingListResponseDto;
import com.travelhub.booking.model.Booking;
import com.travelhub.connectors.nuitee.dto.request.BookRequest;
import com.travelhub.connectors.nuitee.dto.request.PrebookRequest;
import com.travelhub.connectors.nuitee.dto.response.BookResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

public class BookingMapperTest {

    private BookingMapper bookingMapper;

    @BeforeEach
    public void setUp() {
        bookingMapper = new BookingMapper();
    }

    @Test
    public void testToPrebookRequest() {
        PrebookRequestDto requestDto = new PrebookRequestDto();
        requestDto.setOfferId("offer_123");
        requestDto.setUsePaymentSdk(true);

        PrebookRequest result = bookingMapper.toPrebookRequest(requestDto);

        assertThat(result).isNotNull();
        assertThat(result.getOfferId()).isEqualTo("offer_123");
        assertThat(result.getUsePaymentSdk()).isTrue();
    }

    @Test
    public void testToBookRequest() {
        BookingInitiationRequestDto requestDto = new BookingInitiationRequestDto();
        HolderDto holder = new HolderDto();
        holder.setFirstName("John");
        holder.setLastName("Doe");
        holder.setEmail("john.doe@example.com");
        holder.setPhone("1234567890");
        requestDto.setHolder(holder);

        BookRequest result = bookingMapper.toBookRequest(requestDto, "prebook_123", "client_ref_1");

        assertThat(result).isNotNull();
        assertThat(result.getPrebookId()).isEqualTo("prebook_123");
        assertThat(result.getClientReference()).isEqualTo("client_ref_1");
        assertThat(result.getGuests()).hasSize(1);
        assertThat(result.getGuests().get(0).getFirstName()).isEqualTo("John");
        assertThat(result.getGuests().get(0).getEmail()).isEqualTo("john.doe@example.com");
    }

    @Test
    public void testToBookResponseDto() {
        BookResponse source = new BookResponse();
        BookResponse.BookData data = new BookResponse.BookData();
        data.setBookingId("LITE_123");
        data.setStatus("CONFIRMED");
        data.setPrice(new BigDecimal("100.00"));
        data.setCurrency("USD");
        data.setPrebookId("pre_123");
        data.setOfferId("off_456");
        data.setSuggestedSellingPrice(new BigDecimal("90.00"));
        data.setSupplierBookingId("SUP_789");
        data.setSupplierBookingName("Supplier Name");
        data.setCreatedAt("2023-10-01");

        // Setup BookedRoom
        BookResponse.BookedRoom bookedRoom = new BookResponse.BookedRoom();
        bookedRoom.setRoomId("ROOM_001");
        bookedRoom.setRoomName("Deluxe Room");
        BookResponse.RoomTypeNested roomTypeNested = new BookResponse.RoomTypeNested();
        roomTypeNested.setRoomTypeId("RT_001");
        roomTypeNested.setName("Deluxe King");
        bookedRoom.setRoomType(roomTypeNested);

        // Setup Guest
        BookResponse.Guest guest = new BookResponse.Guest();
        guest.setFirstName("Jane");
        guest.setLastName("Doe");
        bookedRoom.setGuests(java.util.Collections.singletonList(guest));

        data.setBookedRooms(java.util.Collections.singletonList(bookedRoom));

        // Setup Holder
        BookResponse.GuestContact holder = new BookResponse.GuestContact();
        holder.setFirstName("John");
        holder.setLastName("Smith");
        data.setHolder(holder);

        source.setData(data);
        source.setGuestLevel(1);

        BookResponseDto result = bookingMapper.toBookResponseDto(source);

        assertThat(result).isNotNull();
        assertThat(result.getData()).isNotNull();
        assertThat(result.getData().getBookingId()).isEqualTo("LITE_123");
        assertThat(result.getData().getStatus()).isEqualTo("CONFIRMED");
        assertThat(result.getData().getPrice()).isEqualByComparingTo(new BigDecimal("100.00"));
        assertThat(result.getGuestLevel()).isEqualTo(1);

        assertThat(result.getData().getPrebookId()).isEqualTo("pre_123");
        assertThat(result.getData().getOfferId()).isEqualTo("off_456");
        assertThat(result.getData().getSuggestedSellingPrice()).isEqualByComparingTo(new BigDecimal("90.00"));
        assertThat(result.getData().getSupplierBookingId()).isEqualTo("SUP_789");

        // Verify Holder
        assertThat(result.getData().getHolder()).isNotNull();
        assertThat(result.getData().getHolder().getFirstName()).isEqualTo("John");

        // Verify BookedRoom
        assertThat(result.getData().getBookedRooms()).hasSize(1);
        BookResponseDto.BookedRoomDto roomDto = result.getData().getBookedRooms().get(0);
        assertThat(roomDto.getRoomId()).isEqualTo("ROOM_001");
        assertThat(roomDto.getRoomName()).isEqualTo("Deluxe Room");
        assertThat(roomDto.getRoomType().getRoomTypeId()).isEqualTo("RT_001");

        // Verify Guest in Room
        assertThat(roomDto.getGuests()).hasSize(1);
        assertThat(roomDto.getGuests().get(0).getFirstName()).isEqualTo("Jane");
    }

    @Test
    public void testMergeBookingEntityData() {
        BookingListResponseDto.BookingDataDto nuiteeDto = new BookingListResponseDto.BookingDataDto();
        nuiteeDto.setBookingId("LITE_123");
        nuiteeDto.setStatus("CONFIRMED");

        Booking booking = new Booking();
        booking.setId("db_id_1");
        booking.setBookingId("LITE_123");
        booking.setHolderFirstName("John");
        booking.setStatus("CANCELLED"); // DB status differs

        BookingListResponseDto.BookingDataDto result = bookingMapper.mergeBookingEntityData(nuiteeDto, booking);

        assertThat(result).isNotNull();
        assertThat(result.getClientReference()).isEqualTo("db_id_1");
        assertThat(result.getStatus()).isEqualTo("CANCELLED"); // DB takes precedence
        assertThat(result.getHolderFirstName()).isEqualTo("John");
        assertThat(result.getBookingId()).isEqualTo("LITE_123");
    }
}
