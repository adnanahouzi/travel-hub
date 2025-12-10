package com.travelhub.booking.mapper;

import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.booking.dto.request.PrebookRequestDto;
import com.travelhub.booking.dto.response.*;
import com.travelhub.booking.model.Booking;
import com.travelhub.connectors.nuitee.dto.request.BookRequest;
import com.travelhub.connectors.nuitee.dto.request.PrebookRequest;
import com.travelhub.connectors.nuitee.dto.response.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BookingMapper {

    private final RateMapper rateMapper;
    private final HotelDataMapper hotelDataMapper;

    public BookingMapper(RateMapper rateMapper, HotelDataMapper hotelDataMapper) {
        this.rateMapper = rateMapper;
        this.hotelDataMapper = hotelDataMapper;
    }

    // Prebook mapping methods
    public PrebookRequest toPrebookRequest(
            PrebookRequestDto requestDto) {
        if (requestDto == null) {
            return null;
        }
        PrebookRequest request = new PrebookRequest();
        request.setOfferId(requestDto.getOfferId());
        request.setUsePaymentSdk(requestDto.getUsePaymentSdk());
        return request;
    }

    public PrebookResponseDto toPrebookResponseDto(
            PrebookResponse response) {
        if (response == null) {
            return null;
        }
        PrebookResponseDto prebookResponse = new PrebookResponseDto();
        prebookResponse.setData(toPrebookDataDto(response.getData()));
        prebookResponse.setGuestLevel(response.getGuestLevel());
        prebookResponse.setSandbox(response.getSandbox());
        return prebookResponse;
    }

    private PrebookResponseDto.PrebookDataDto toPrebookDataDto(
            PrebookResponse.PrebookData data) {
        if (data == null) {
            return null;
        }
        PrebookResponseDto.PrebookDataDto prebookData = new PrebookResponseDto.PrebookDataDto();
        prebookData.setPrebookId(data.getPrebookId());
        prebookData.setOfferId(data.getOfferId());
        prebookData.setHotelId(data.getHotelId());
        prebookData.setCurrency(data.getCurrency());
        prebookData.setTermsAndConditions(data.getTermsAndConditions());

        // Map roomTypes if present
        if (data.getRoomTypes() != null) {
            List<RoomTypeDto> roomTypeDtos = data.getRoomTypes().stream()
                    .map((RoomType roomType) -> rateMapper.mapRoomType(roomType))
                    .collect(Collectors.toList());
            prebookData.setRoomTypes(roomTypeDtos);
        }

        prebookData.setSuggestedSellingPrice(data.getSuggestedSellingPrice());
        prebookData.setIsPackageRate(data.getIsPackageRate());
        prebookData.setCommission(data.getCommission());
        prebookData.setPrice(data.getPrice());
        prebookData.setPriceType(data.getPriceType());
        prebookData.setPriceDifferencePercent(data.getPriceDifferencePercent());
        prebookData.setCancellationChanged(data.getCancellationChanged());
        prebookData.setBoardChanged(data.getBoardChanged());
        prebookData.setSupplier(data.getSupplier());
        prebookData.setSupplierId(data.getSupplierId());
        prebookData.setPaymentTypes(data.getPaymentTypes());
        prebookData.setCheckin(data.getCheckin());
        prebookData.setCheckout(data.getCheckout());

        // Calculate total included and excluded taxes
        BigDecimal totalIncludedTaxes = BigDecimal.ZERO;
        BigDecimal totalExcludedTaxes = BigDecimal.ZERO;

        if (data.getRoomTypes() != null) {
            for (RoomType roomType : data.getRoomTypes()) {
                if (roomType.getRates() != null) {
                    for (Rate rate : roomType.getRates()) {
                        if (rate.getRetailRate() != null && rate.getRetailRate().getTaxesAndFees() != null) {
                            for (TaxAndFee taxAndFee : rate.getRetailRate().getTaxesAndFees()) {
                                if (taxAndFee.getAmount() != null) {
                                    if (taxAndFee.isIncluded()) {
                                        totalIncludedTaxes = totalIncludedTaxes.add(taxAndFee.getAmount());
                                    } else {
                                        totalExcludedTaxes = totalExcludedTaxes.add(taxAndFee.getAmount());
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        prebookData.setTotalIncludedTaxes(totalIncludedTaxes);
        prebookData.setTotalExcludedTaxes(totalExcludedTaxes);

        return prebookData;
    }

    public BookRequest toBookRequest(BookingInitiationRequestDto requestDto, String prebookId, String clientReference) {
        if (requestDto == null) {
            return null;
        }

        BookRequest request = new BookRequest();
        request.setPrebookId(prebookId);
        request.setClientReference(clientReference);

        // Map Holder to Guest (single guest for now)
        BookRequest.Guest guest = new BookRequest.Guest();
        guest.setFirstName(requestDto.getHolder().getFirstName());
        guest.setLastName(requestDto.getHolder().getLastName());
        guest.setEmail(requestDto.getHolder().getEmail());
        guest.setPhone(requestDto.getHolder().getPhone());
        // Default occupancy to 1 if not specified (adjust as needed)
        guest.setOccupancyNumber(1);

        request.setGuests(java.util.Collections.singletonList(guest));

        // Map Payment
        BookRequest.Payment payment = new BookRequest.Payment();
        payment.setMethod("CREDIT");

        request.setPayment(payment);

        return request;
    }

    public BookResponseDto toBookResponseDto(BookResponse source) {
        if (source == null) {
            return null;
        }
        BookResponseDto bookResponse = new BookResponseDto();

        bookResponse.setData(toBookDataDto(source.getData()));
        return bookResponse;
    }

    private BookResponseDto.BookDataDto toBookDataDto(
            BookResponse.BookData source) {
        if (source == null) {
            return null;
        }
        BookResponseDto.BookDataDto bookData = new BookResponseDto.BookDataDto();
        bookData.setBookingId(source.getBookingId());
        bookData.setClientReference(source.getClientReference());
        bookData.setSupplierBookingId(source.getSupplierBookingId());
        bookData.setSupplierBookingName(source.getSupplierBookingName());
        bookData.setSupplier(source.getSupplier());
        bookData.setSupplierId(source.getSupplierId());
        bookData.setHotelConfirmationCode(source.getHotelConfirmationCode());
        bookData.setReference(source.getReference());
        bookData.setStatus(source.getStatus());
        bookData.setPrice(source.getPrice());
        bookData.setCurrency(source.getCurrency());
        bookData.setCheckin(source.getCheckin());
        bookData.setCheckout(source.getCheckout());
        bookData.setHotelId(source.getHotelId());
        bookData.setHotelName(source.getHotelName());
        
        // Calculate number of nights for totalPerNight calculation
        Integer numberOfNights = null;
        if (source.getCheckin() != null && source.getCheckout() != null) {
            numberOfNights = rateMapper.calculateNumberOfNights(source.getCheckin(), source.getCheckout());
        }
        bookData.setRooms(toRoomBookedDtos(source.getRooms(), numberOfNights));
        bookData.setGuest(toGuestContactDto(source.getHolder()));
        bookData.setHolder(toGuestContactDto(source.getHolder())); // holder is same as guest in connector
        bookData.setCreatedAt(source.getCreatedAt());
        bookData.setUpdatedAt(source.getUpdatedAt());
        bookData.setCancellationPolicies(rateMapper.mapCancellationPolicyDetail(source.getCancellationPolicies()));
        bookData.setSpecialRemarks(source.getSpecialRemarks());
        bookData.setOptionalFees(source.getOptionalFees());
        bookData.setMandatoryFees(source.getMandatoryFees());
        bookData.setKnowBeforeYouGo(source.getKnowBeforeYouGo());
        bookData.setCommission(source.getCommission());
        bookData.setAddonsTotalAmount(source.getAddonsTotalAmount());
        bookData.setRemarks(source.getRemarks());
        bookData.setVoucherCode(source.getVoucherCode());
        bookData.setVoucherTotalAmount(source.getVoucherTotalAmount());
        bookData.setAddons(source.getAddons());
        bookData.setGuestId(source.getGuestId());
        bookData.setDistributorCommission(source.getDistributorCommission());
        bookData.setDistributorPrice(source.getDistributorPrice());
        bookData.setTrackingId(source.getTrackingId());
        bookData.setFirstName(source.getFirstName());
        bookData.setLastName(source.getLastName());
        bookData.setAdults(source.getAdults());
        bookData.setChildren(source.getChildren());
        bookData.setChildrenCount(source.getChildrenCount());

        bookData.setPaymentStatus(source.getPaymentStatus());

        bookData.setSellingPrice(source.getSellingPrice());
        bookData.setExchangeRate(source.getExchangeRate());
        bookData.setExchangeRateUsd(source.getExchangeRateUsd());
        bookData.setEmail(source.getEmail());
        bookData.setTag(source.getTag());
        bookData.setLastFreeCancellationDate(source.getLastFreeCancellationDate());

        bookData.setNationality(source.getNationality());
        bookData.setHolderTitle(source.getHolderTitle());
        bookData.setCancelledAt(source.getCancelledAt());
        bookData.setRefundedAt(source.getRefundedAt());
        bookData.setLoyaltyGuestId(source.getLoyaltyGuestId());

        bookData.setClientCommission(source.getClientCommission());
        bookData.setVoucherId(source.getVoucherId());
        bookData.setVoucherTransationId(source.getVoucherTransationId());
        bookData.setProcessingFee(source.getProcessingFee());
        bookData.setAmountRefunded(source.getAmountRefunded());
        bookData.setRefundType(source.getRefundType());
        bookData.setPaymentScheduledAt(source.getPaymentScheduledAt());
        bookData.setAddonsRedemptions(source.getAddonsRedemptions());
        bookData.setRebookFrom(source.getRebookFrom());

        bookData.setCancelledBy(source.getCancelledBy());
        bookData.setFeed(source.getFeed());

        bookData.setHotelRemarks(source.getHotelRemarks());

        // Map hotel info if present
        if (source.getHotel() != null) {
            bookData.setHotel(hotelDataMapper.toHotelInfoDto(source.getHotel()));
        }

        return bookData;
    }

    private List<BookResponseDto.RoomBookedDto> toRoomBookedDtos(
            List<BookResponse.RoomBooked> sourceList, Integer numberOfNights) {
        if (sourceList == null) {
            return null;
        }
        return sourceList.stream().map(source -> toRoomBookedDto(source, numberOfNights)).collect(Collectors.toList());
    }

    private BookResponseDto.RoomBookedDto toRoomBookedDto(
            BookResponse.RoomBooked source, Integer numberOfNights) {
        if (source == null) {
            return null;
        }
        BookResponseDto.RoomBookedDto roomBooked = new BookResponseDto.RoomBookedDto();
        roomBooked.setRoomName(source.getRoomName());
        roomBooked.setBoardName(source.getBoardName());

        // Map enriched fields
        if (source.getRoomType() != null) {
            BookResponseDto.RoomBookedDto.RoomTypeDto roomTypeDto = new BookResponseDto.RoomBookedDto.RoomTypeDto();
            roomTypeDto.setRoomTypeId(source.getRoomType().getRoomTypeId());
            roomTypeDto.setName(source.getRoomType().getName());
            roomBooked.setRoomType(roomTypeDto);
        }
        roomBooked.setBoardType(source.getBoardType());
        roomBooked.setBoardCode(source.getBoardCode());
        roomBooked.setAdults(source.getAdults());
        roomBooked.setChildren(source.getChildren());
        roomBooked.setChildrenAges(source.getChildrenAges());
        roomBooked.setFirstName(source.getFirstName());
        roomBooked.setLastName(source.getLastName());

        roomBooked.setOccupancy_number(source.getOccupancy_number());
        roomBooked.setAmount(source.getAmount());
        roomBooked.setCurrency(source.getCurrency());
        roomBooked.setChildren_count(source.getChildren_count());
        roomBooked.setRemarks(source.getRemarks());

        // Map rate detail
        if (source.getRate() != null) {
            BookResponseDto.RoomBookedDto.RateDetailDto rateDetail = new BookResponseDto.RoomBookedDto.RateDetailDto();
            rateDetail.setRateId(source.getRate().getRateId());
            rateDetail.setMaxOccupancy(source.getRate().getMaxOccupancy());
            rateDetail.setBoardType(source.getRate().getBoardType());
            rateDetail.setBoardName(source.getRate().getBoardName());
            rateDetail.setRemarks(source.getRate().getRemarks());
            rateDetail.setPerks(source.getRate().getPerks());
            if (source.getRate().getRetailRate() != null) {
                rateDetail.setRetailRate(rateMapper.mapBookRetailRateDetail(source.getRate().getRetailRate(), numberOfNights));
            }
            if (source.getRate().getCancellationPolicies() != null) {
                rateDetail.setCancellationPolicies(
                        rateMapper.mapCancellationPolicyDetail(source.getRate().getCancellationPolicies()));
            }
            roomBooked.setRate(rateDetail);
        }

        // Map cancellation policies
        if (source.getCancellationPolicies() != null) {
            roomBooked.setCancellationPolicies(rateMapper.mapCancellationPolicyDetail(source.getCancellationPolicies()));
        }

        // Map guests
        if (source.getGuests() != null && !source.getGuests().isEmpty()) {
            List<BookResponseDto.GuestContactDto> guestDtos = source.getGuests().stream()
                    .map(this::toGuestContactDto)
                    .collect(Collectors.toList());
            roomBooked.setGuests(guestDtos);
        }

        return roomBooked;
    }

    private BookResponseDto.GuestContactDto toGuestContactDto(
            BookResponse.GuestContact source) {
        if (source == null) {
            return null;
        }
        BookResponseDto.GuestContactDto guestContact = new BookResponseDto.GuestContactDto();
        guestContact.setFirstName(source.getFirstName());
        guestContact.setLastName(source.getLastName());
        guestContact.setEmail(source.getEmail());
        guestContact.setPhone(source.getPhone());
        return guestContact;
    }

    // Booking List mapping methods
    public BookingListResponseDto toBookingListResponseDto(
            BookingListResponse response) {
        if (response == null || response.getData() == null) {
            return new BookingListResponseDto();
        }

        BookingListResponseDto bookingListResponse = new BookingListResponseDto();
        List<BookingListResponseDto.BookingDataDto> bookings = response.getData().stream()
                .map(this::toBookingDataDto)
                .collect(Collectors.toList());
        bookingListResponse.setData(bookings);
        return bookingListResponse;
    }

    private BookingListResponseDto.BookingDataDto toBookingDataDto(
            BookingListResponse.BookingData data) {
        if (data == null) {
            return null;
        }

        BookingListResponseDto.BookingDataDto bookingData = new BookingListResponseDto.BookingDataDto();
        bookingData.setBookingId(data.getBookingId());
        bookingData.setClientReference(data.getClientReference());
        bookingData.setStatus(data.getStatus());
        bookingData.setCheckin(data.getCheckin());
        bookingData.setCheckout(data.getCheckout());
        bookingData.setPrice(data.getPrice());
        bookingData.setCurrency(data.getCurrency());

        if (data.getHotel() != null) {
            BookingListResponseDto.HotelInfoDto hotelInfo = new BookingListResponseDto.HotelInfoDto();
            hotelInfo.setHotelId(data.getHotel().getHotelId());
            hotelInfo.setName(data.getHotel().getName());
            bookingData.setHotel(hotelInfo);
        }

        if (data.getRooms() != null) {
            List<BookingListResponseDto.RoomInfoDto> rooms = data.getRooms().stream()
                    .map(this::toRoomInfoDto)
                    .collect(Collectors.toList());
            bookingData.setRooms(rooms);
        }

        return bookingData;
    }

    private BookingListResponseDto.RoomInfoDto toRoomInfoDto(
            BookingListResponse.RoomInfo room) {
        if (room == null) {
            return null;
        }

        BookingListResponseDto.RoomInfoDto roomInfo = new BookingListResponseDto.RoomInfoDto();
        roomInfo.setRoomId(room.getRoomId());
        roomInfo.setAdults(room.getAdults());
        roomInfo.setAmount(room.getAmount());
        roomInfo.setCurrency(room.getCurrency());
        return roomInfo;
    }

    public BookingListResponseDto.BookingDataDto mergeBookingEntityData(
            BookingListResponseDto.BookingDataDto nuiteeDto,
            Booking bookingEntity) {
        if (nuiteeDto == null && bookingEntity == null) {
            return null;
        }

        BookingListResponseDto.BookingDataDto mergedDto;
        if (nuiteeDto != null) {
            mergedDto = nuiteeDto;
        } else {
            mergedDto = new BookingListResponseDto.BookingDataDto();
        }

        // Merge Booking entity data (takes precedence)
        if (bookingEntity != null) {
            // Set clientReference from booking entity ID
            mergedDto.setClientReference(bookingEntity.getId());

            // Override with booking entity data if available
            if (bookingEntity.getStatus() != null) {
                mergedDto.setStatus(bookingEntity.getStatus());
            }
            if (bookingEntity.getCheckin() != null) {
                mergedDto.setCheckin(bookingEntity.getCheckin());
            }
            if (bookingEntity.getCheckout() != null) {
                mergedDto.setCheckout(bookingEntity.getCheckout());
            }
            if (bookingEntity.getPrice() != null) {
                mergedDto.setPrice(bookingEntity.getPrice());
            }
            if (bookingEntity.getCurrency() != null) {
                mergedDto.setCurrency(bookingEntity.getCurrency());
            }
            if (bookingEntity.getBookingId() != null) {
                mergedDto.setBookingId(bookingEntity.getBookingId());
            }

            // Set additional Booking entity fields
            mergedDto.setHolderFirstName(bookingEntity.getHolderFirstName());
            mergedDto.setHolderLastName(bookingEntity.getHolderLastName());
            mergedDto.setHolderEmail(bookingEntity.getHolderEmail());
            mergedDto.setHolderPhone(bookingEntity.getHolderPhone());
            mergedDto.setSimulationId(bookingEntity.getSimulationId());
            mergedDto.setBankingAccount(bookingEntity.getBankingAccount());
            mergedDto.setConfirmationCode(bookingEntity.getConfirmationCode());
            mergedDto.setHotelConfirmationCode(bookingEntity.getHotelConfirmationCode());
            mergedDto.setReference(bookingEntity.getReference());
            mergedDto.setHotelId(bookingEntity.getHotelId());
            mergedDto.setHotelName(bookingEntity.getHotelName());
            mergedDto.setGuestLevel(bookingEntity.getGuestLevel());
            mergedDto.setSandbox(bookingEntity.getSandbox());
            mergedDto.setCreatedAt(bookingEntity.getCreatedAt());
            mergedDto.setUpdatedAt(bookingEntity.getUpdatedAt());

            // Update hotel info if hotelId or hotelName is available from entity
            if (bookingEntity.getHotelId() != null || bookingEntity.getHotelName() != null) {
                BookingListResponseDto.HotelInfoDto hotelDto = mergedDto.getHotel();
                if (hotelDto == null) {
                    hotelDto = new BookingListResponseDto.HotelInfoDto();
                    mergedDto.setHotel(hotelDto);
                }
                if (bookingEntity.getHotelId() != null) {
                    hotelDto.setHotelId(bookingEntity.getHotelId());
                }
                if (bookingEntity.getHotelName() != null) {
                    hotelDto.setName(bookingEntity.getHotelName());
                }
            }
        }

        return mergedDto;
    }
}
