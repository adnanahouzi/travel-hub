package com.travelhub.booking.mapper;

import com.travelhub.booking.dto.request.RateSearchRequestDto;
import com.travelhub.booking.dto.response.*;
import com.travelhub.connectors.nuitee.dto.common.Price;
import com.travelhub.connectors.nuitee.dto.request.HotelRatesRequest;
import com.travelhub.connectors.nuitee.dto.response.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class RateMapper {

    public HotelRatesRequest toHotelRatesRequest(RateSearchRequestDto request) {
        if (request == null) {
            return null;
        }
        HotelRatesRequest hotelRatesRequest = new HotelRatesRequest();
        hotelRatesRequest.setOccupancies(request.getOccupancies());
        hotelRatesRequest.setCurrency(request.getCurrency());
        hotelRatesRequest.setGuestNationality(request.getGuestNationality());
        hotelRatesRequest.setCheckin(request.getCheckin());
        hotelRatesRequest.setCheckout(request.getCheckout());
        hotelRatesRequest.setHotelIds(request.getHotelIds());
        hotelRatesRequest.setCountryCode(request.getCountryCode());
        hotelRatesRequest.setCityName(request.getCityName());
        hotelRatesRequest.setLatitude(request.getLatitude());
        hotelRatesRequest.setLongitude(request.getLongitude());
        hotelRatesRequest.setRadius(request.getRadius());
        hotelRatesRequest.setIataCode(request.getIataCode());
        hotelRatesRequest.setPlaceId(request.getPlaceId());
        hotelRatesRequest.setAiSearch(request.getAiSearch());
        hotelRatesRequest.setTimeout(request.getTimeout());
        hotelRatesRequest.setRoomMapping(request.getRoomMapping());
        hotelRatesRequest.setWeatherInfo(request.getWeatherInfo());
        hotelRatesRequest.setStream(request.getStream());
        hotelRatesRequest.setHotelName(request.getHotelName());
        hotelRatesRequest.setMinReviewsCount(request.getMinReviewsCount());
        hotelRatesRequest.setMinRating(request.getMinRating());
        hotelRatesRequest.setZip(request.getZip());
        hotelRatesRequest.setStarRating(request.getStarRating());
        hotelRatesRequest.setFacilities(request.getFacilities());
        hotelRatesRequest.setStrictFacilityFiltering(request.getStrictFacilityFiltering());
        hotelRatesRequest.setSort(mapSortCriteria(request.getSort()));
        return hotelRatesRequest;
    }

    private List<com.travelhub.connectors.nuitee.dto.common.SortCriteria> mapSortCriteria(
            List<com.travelhub.booking.dto.common.SortCriteriaDto> sortDtos) {
        if (sortDtos == null) {
            return null;
        }
        return sortDtos.stream()
                .map(dto -> new com.travelhub.connectors.nuitee.dto.common.SortCriteria(dto.getField(),
                        dto.getDirection()))
                .collect(Collectors.toList());
    }

    public RateSearchResponseDto toRateSearchResponseDto(HotelRatesResponse response, 
            HotelsListResponse hotelsListResponse, HotelDataMapper hotelDataMapper) {
        if (response == null) {
            return null;
        }
        RateSearchResponseDto rateSearchResponse = new RateSearchResponseDto();
        rateSearchResponse.setHotels(mergeHotelData(response.getData(), hotelsListResponse.getData(), 
                hotelsListResponse.getPlace(), hotelDataMapper));
        rateSearchResponse.setGuestLevel(response.getGuestLevel());
        rateSearchResponse.setSandbox(response.getSandbox());
        rateSearchResponse.setSessionId(response.getSessionId());
        return rateSearchResponse;
    }

    private List<HotelAvailabilityDto> mergeHotelData(List<HotelRate> hotelRates, 
            List<MinimalHotelData> hotelInfos, Place place, HotelDataMapper hotelDataMapper) {
        if (hotelRates == null) {
            return null;
        }

        // Create a map of hotel info by hotel id for quick lookup
        java.util.Map<String, MinimalHotelData> hotelInfoMap = new java.util.HashMap<>();
        if (hotelInfos != null) {
            for (MinimalHotelData info : hotelInfos) {
                hotelInfoMap.put(info.getId(), info);
            }
        }

        return hotelRates.stream()
                .map(rate -> mergeHotelAvailability(rate, hotelInfoMap.get(rate.getHotelId()), place, hotelDataMapper))
                .collect(Collectors.toList());
    }

    private HotelAvailabilityDto mergeHotelAvailability(HotelRate hotelRate, MinimalHotelData hotelInfo, 
            Place place, HotelDataMapper hotelDataMapper) {
        if (hotelRate == null) {
            return null;
        }

        HotelAvailabilityDto hotelAvailability = new HotelAvailabilityDto();

        // Set data from HotelRate
        hotelAvailability.setHotelId(hotelRate.getHotelId());
        hotelAvailability.setRoomTypes(mapRoomTypes(hotelRate.getRoomTypes()));
        hotelAvailability.setEt(hotelRate.getEt());

        // Set data from HotelInfo if available
        if (hotelInfo != null) {
            hotelAvailability.setName(hotelInfo.getName());
            hotelAvailability.setMainPhoto(hotelInfo.getMainPhoto());
            hotelAvailability.setAddress(hotelInfo.getAddress());
            hotelAvailability.setRating(hotelInfo.getRating() != null ? BigDecimal.valueOf(hotelInfo.getRating()) : null);
            hotelAvailability.setReviewCount(hotelInfo.getReviewCount());
            hotelAvailability.setStars(hotelInfo.getStars());
            hotelAvailability.setLocation(hotelDataMapper.toLocationDto(hotelInfo.getLongitude(), hotelInfo.getLatitude()));
            
            // Calculate distance from place if both locations are available
            if (place != null && place.getLocation() != null && hotelInfo.getLatitude() != null && hotelInfo.getLongitude() != null) {
                BigDecimal placeLat = place.getLocation().getLatitude();
                BigDecimal placeLon = place.getLocation().getLongitude();
                BigDecimal hotelLat = hotelInfo.getLatitude();
                BigDecimal hotelLon = hotelInfo.getLongitude();
                
                if (placeLat != null && placeLon != null && hotelLat != null && hotelLon != null) {
                    BigDecimal distance = hotelDataMapper.calculateDistance(placeLat, placeLon, hotelLat, hotelLon);
                    hotelAvailability.setDistance(distance);
                }
            }
        }

        return hotelAvailability;
    }

    private List<RoomTypeDto> mapRoomTypes(List<RoomType> roomTypes) {
        if (roomTypes == null) {
            return null;
        }
        return roomTypes.stream()
                .map(this::mapRoomType)
                .collect(Collectors.toList());
    }

    public RoomTypeDto mapRoomType(RoomType roomType) {
        if (roomType == null) {
            return null;
        }
        RoomTypeDto roomTypeDto = new RoomTypeDto();
        roomTypeDto.setRoomTypeId(roomType.getRoomTypeId());
        roomTypeDto.setOfferId(roomType.getOfferId());
        roomTypeDto.setSupplier(roomType.getSupplier());
        roomTypeDto.setSupplierId(roomType.getSupplierId());
        roomTypeDto.setRates(mapRates(roomType.getRates(), roomType.getOfferId()));
        roomTypeDto.setOfferRetailRate(mapPrice(roomType.getOfferRetailRate()));
        roomTypeDto.setSuggestedSellingPrice(mapPrice(roomType.getSuggestedSellingPrice()));
        roomTypeDto.setOfferInitialPrice(mapPrice(roomType.getOfferInitialPrice()));
        roomTypeDto.setPriceType(roomType.getPriceType());
        roomTypeDto.setRateType(roomType.getRateType());
        roomTypeDto.setPaymentTypes(roomType.getPaymentTypes());
        return roomTypeDto;
    }

    private List<RateDto> mapRates(List<Rate> rates, String offerId) {
        if (rates == null) {
            return null;
        }
        return rates.stream()
                .map(rate -> {
                    RateDto rateDto = toRateDto(rate);
                    if (rateDto != null) {
                        rateDto.setOfferId(offerId);
                    }
                    return rateDto;
                })
                .collect(Collectors.toList());
    }

    public RateDto toRateDto(Rate rate) {
        if (rate == null) {
            return null;
        }
        RateDto rateDto = new RateDto();
        rateDto.setRateId(rate.getRateId());
        rateDto.setOccupancyNumber(rate.getOccupancyNumber());
        rateDto.setName(rate.getName());
        rateDto.setMaxOccupancy(rate.getMaxOccupancy());
        rateDto.setAdultCount(rate.getAdultCount());
        rateDto.setChildCount(rate.getChildCount());
        rateDto.setChildrenAges(rate.getChildrenAges());
        rateDto.setBoardType(rate.getBoardType());
        rateDto.setBoardName(rate.getBoardName());
        rateDto.setRemarks(rate.getRemarks());
        rateDto.setPriceType(rate.getPriceType());
        rateDto.setCommission(mapPrices(rate.getCommission()));
        rateDto.setRetailRate(mapRetailRateDetail(rate.getRetailRate()));
        rateDto.setCancellationPolicies(mapCancellationPolicyDetail(rate.getCancellationPolicies()));
        rateDto.setMappedRoomId(rate.getMappedRoomId());
        rateDto.setPaymentTypes(rate.getPaymentTypes());
        rateDto.setProviderCommission(mapPrice(rate.getProviderCommission()));
        rateDto.setPerks(rate.getPerks());
        return rateDto;
    }

    private List<PriceDto> mapPrices(List<Price> prices) {
        if (prices == null) {
            return null;
        }
        return prices.stream()
                .map(this::mapPrice)
                .collect(Collectors.toList());
    }

    public PriceDto mapPrice(Price price) {
        if (price == null) {
            return null;
        }
        PriceDto priceDto = new PriceDto();
        priceDto.setAmount(price.getAmount());
        priceDto.setCurrency(price.getCurrency());
        priceDto.setSource(price.getSource());
        return priceDto;
    }

    private RetailRateDetailDto mapRetailRateDetail(RetailRateDetail retailRateDetail) {
        if (retailRateDetail == null) {
            return null;
        }
        RetailRateDetailDto retailRateDetailDto = new RetailRateDetailDto();
        retailRateDetailDto.setTotal(mapPrices(retailRateDetail.getTotal()));
        retailRateDetailDto.setSuggestedSellingPrice(mapPrices(retailRateDetail.getSuggestedSellingPrice()));
        retailRateDetailDto.setInitialPrice(mapPrices(retailRateDetail.getInitialPrice()));
        retailRateDetailDto.setTaxesAndFees(mapTaxesAndFees(retailRateDetail.getTaxesAndFees()));
        return retailRateDetailDto;
    }

    private List<TaxAndFeeDto> mapTaxesAndFees(List<TaxAndFee> taxesAndFees) {
        if (taxesAndFees == null) {
            return null;
        }
        return taxesAndFees.stream()
                .map(this::mapTaxAndFee)
                .collect(Collectors.toList());
    }

    private TaxAndFeeDto mapTaxAndFee(TaxAndFee taxAndFee) {
        if (taxAndFee == null) {
            return null;
        }
        TaxAndFeeDto taxAndFeeDto = new TaxAndFeeDto();
        taxAndFeeDto.setIncluded(taxAndFee.isIncluded());
        taxAndFeeDto.setDescription(taxAndFee.getDescription());
        taxAndFeeDto.setAmount(taxAndFee.getAmount());
        taxAndFeeDto.setCurrency(taxAndFee.getCurrency());
        return taxAndFeeDto;
    }

    public CancellationPolicyDetailDto mapCancellationPolicyDetail(CancellationPolicyDetail cancellationPolicyDetail) {
        if (cancellationPolicyDetail == null) {
            return null;
        }
        CancellationPolicyDetailDto cancellationPolicyDetailDto = new CancellationPolicyDetailDto();
        cancellationPolicyDetailDto.setCancelPolicyInfos(mapCancellationPolicyInfos(cancellationPolicyDetail.getCancelPolicyInfos()));
        cancellationPolicyDetailDto.setHotelRemarks(cancellationPolicyDetail.getHotelRemarks());
        cancellationPolicyDetailDto.setRefundableTag(cancellationPolicyDetail.getRefundableTag());
        return cancellationPolicyDetailDto;
    }

    private List<CancellationPolicyInfoDto> mapCancellationPolicyInfos(List<CancellationPolicyInfo> infos) {
        if (infos == null) {
            return null;
        }
        return infos.stream()
                .map(this::mapCancellationPolicyInfo)
                .collect(Collectors.toList());
    }

    private CancellationPolicyInfoDto mapCancellationPolicyInfo(CancellationPolicyInfo info) {
        if (info == null) {
            return null;
        }
        CancellationPolicyInfoDto cancellationPolicyInfoDto = new CancellationPolicyInfoDto();
        cancellationPolicyInfoDto.setCancelTime(info.getCancelTime());
        cancellationPolicyInfoDto.setAmount(info.getAmount());
        cancellationPolicyInfoDto.setCurrency(info.getCurrency());
        cancellationPolicyInfoDto.setType(info.getType());
        cancellationPolicyInfoDto.setTimezone(info.getTimezone());
        return cancellationPolicyInfoDto;
    }

    /**
     * Groups rates by offerId, creating a room breakdown with counts for each offer.
     * Each RoomType (offer) becomes a GroupedRateDto with its rooms aggregated.
     */
    public List<GroupedRateDto> groupByOffer(
            List<com.travelhub.connectors.nuitee.dto.response.RoomType> roomTypes, List<Room> hotelRooms) {
        if (roomTypes == null) {
            return null;
        }

        return roomTypes.stream()
                .map(roomType -> {
                    GroupedRateDto grouped = new GroupedRateDto();
                    grouped.setOfferId(roomType.getOfferId());

                    // Get rates for this offer
                    List<Rate> rates = roomType.getRates();
                    if (rates == null || rates.isEmpty()) {
                        grouped.setRoomBreakdown(new java.util.ArrayList<>());
                        return grouped;
                    }

                    // Use first rate for offer-level properties
                    Rate firstRate = rates.get(0);
                    grouped.setBoardType(firstRate.getBoardType());
                    grouped.setBoardName(firstRate.getBoardName());
                    grouped.setPerks(firstRate.getPerks());
                    grouped.setPaymentTypes(firstRate.getPaymentTypes());
                    grouped.setCancellationPolicies(mapCancellationPolicyDetail(firstRate.getCancellationPolicies()));

                    // Use offer-level retail rate
                    grouped.setRetailRate(mapOfferPricesToRetailRateDetail(roomType));

                    // Group rates by mappedRoomId to create room breakdown
                    java.util.Map<Long, List<RateDto>> ratesByRoom = new java.util.LinkedHashMap<>();
                    for (Rate rate : rates) {
                        RateDto rateDto = toRateDto(rate);
                        if (rateDto != null) {
                            rateDto.setOfferId(roomType.getOfferId());

                            // Enrich with room details
                            if (hotelRooms != null && rate.getMappedRoomId() != null) {
                                Room matchingRoom = hotelRooms.stream()
                                        .filter(room -> rate.getMappedRoomId().equals(room.getId().longValue()))
                                        .findFirst()
                                        .orElse(null);
                                if (matchingRoom != null) {
                                    enrichRateWithRoomDetails(rateDto, matchingRoom);
                                }
                            }

                            Long roomKey = rate.getMappedRoomId() != null ? rate.getMappedRoomId() : 0L;
                            ratesByRoom.computeIfAbsent(roomKey, key -> new java.util.ArrayList<>()).add(rateDto);
                        }
                    }

                    // Convert to room breakdown
                    List<RoomBreakdownDto> roomBreakdown = ratesByRoom.entrySet().stream()
                            .map(entry -> {
                                List<RateDto> roomRates = entry.getValue();
                                RateDto firstRoomRate = roomRates.get(0);

                                RoomBreakdownDto breakdown = new RoomBreakdownDto();
                                breakdown.setMappedRoomId(entry.getKey() != 0L ? entry.getKey() : null);
                                breakdown.setName(firstRoomRate.getName());
                                breakdown.setCount(roomRates.size());
                                breakdown.setAdultCount(firstRoomRate.getAdultCount());
                                breakdown.setChildCount(firstRoomRate.getChildCount());
                                breakdown.setRoomSize(firstRoomRate.getRoomSize());
                                breakdown.setRoomSizeUnit(firstRoomRate.getRoomSizeUnit());
                                breakdown.setRoomPhotos(firstRoomRate.getRoomPhotos());
                                breakdown.setRates(roomRates);

                                return breakdown;
                            })
                            .collect(Collectors.toList());

                    grouped.setRoomBreakdown(roomBreakdown);
                    return grouped;
                })
                .collect(Collectors.toList());
    }

    /**
     * Groups offers by unique room configuration (name and count).
     */
    public List<RoomConfigurationGroupDto> groupRatesByConfiguration(List<GroupedRateDto> offers) {
        if (offers == null || offers.isEmpty()) {
            return new java.util.ArrayList<>();
        }

        java.util.Map<String, List<GroupedRateDto>> groupedByConfig = new java.util.HashMap<>();

        for (GroupedRateDto offer : offers) {
            String key = getRoomConfigKey(offer);
            groupedByConfig.computeIfAbsent(key, configKey -> new java.util.ArrayList<>()).add(offer);
        }

        return groupedByConfig.values().stream()
                .map(this::mapToConfigurationGroup)
                .sorted(java.util.Comparator.comparing(configurationGroup -> {
                    RoomConfigurationGroupDto group = configurationGroup;
                    if (group.getStartingPrice() != null && group.getStartingPrice().getTotal() != null
                            && !group.getStartingPrice().getTotal().isEmpty()) {
                        return group.getStartingPrice().getTotal().get(0).getAmount();
                    }
                    return BigDecimal.ZERO;
                }))
                .collect(Collectors.toList());
    }

    private String getRoomConfigKey(GroupedRateDto offer) {
        if (offer.getRoomBreakdown() == null) {
            return "unknown";
        }
        // Sort specifically to ensure consistent key (e.g. "Twin + Double" == "Double + Twin")
        return offer.getRoomBreakdown().stream()
                .sorted(java.util.Comparator.comparing(RoomBreakdownDto::getMappedRoomId,
                        java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder())))
                .map(roomBreakdown -> roomBreakdown.getCount() + "x" + (roomBreakdown.getMappedRoomId() != null ? roomBreakdown.getMappedRoomId() : "0"))
                .collect(Collectors.joining("|"));
    }

    private RoomConfigurationGroupDto mapToConfigurationGroup(List<GroupedRateDto> groupOffers) {
        if (groupOffers == null || groupOffers.isEmpty()) {
            return null;
        }

        // Sort offers by price to find "starting from"
        groupOffers.sort((firstOffer, secondOffer) -> {
            BigDecimal firstOfferPrice = (firstOffer.getRetailRate() != null && firstOffer.getRetailRate().getTotal() != null
                    && !firstOffer.getRetailRate().getTotal().isEmpty())
                            ? firstOffer.getRetailRate().getTotal().get(0).getAmount()
                            : null;

            BigDecimal secondOfferPrice = (secondOffer.getRetailRate() != null && secondOffer.getRetailRate().getTotal() != null
                    && !secondOffer.getRetailRate().getTotal().isEmpty())
                            ? secondOffer.getRetailRate().getTotal().get(0).getAmount()
                            : null;

            if (firstOfferPrice == null && secondOfferPrice == null)
                return 0;
            if (firstOfferPrice == null)
                return 1;
            if (secondOfferPrice == null)
                return -1;
            return firstOfferPrice.compareTo(secondOfferPrice);
        });

        GroupedRateDto bestOffer = groupOffers.get(0);
        RoomConfigurationGroupDto configurationGroup = new RoomConfigurationGroupDto();

        configurationGroup.setConfigurationKey(getRoomConfigKey(bestOffer));
        configurationGroup.setName(getOfferDisplayName(bestOffer));
        configurationGroup.setRoomBreakdown(bestOffer.getRoomBreakdown());
        configurationGroup.setStartingPrice(bestOffer.getRetailRate());
        configurationGroup.setOffers(groupOffers);

        return configurationGroup;
    }

    private String getOfferDisplayName(GroupedRateDto offer) {
        if (offer.getRoomBreakdown() != null && !offer.getRoomBreakdown().isEmpty()) {
            if (offer.getRoomBreakdown().size() == 1 && offer.getRoomBreakdown().get(0).getCount() == 1) {
                return offer.getRoomBreakdown().get(0).getName();
            }
            return offer.getRoomBreakdown().stream()
                    .map(breakdown -> breakdown.getCount() + " x " + breakdown.getName())
                    .collect(Collectors.joining(" + "));
        }
        return "Offre de chambre";
    }

    /**
     * Maps offer-level prices to RetailRateDetailDto.
     */
    private RetailRateDetailDto mapOfferPricesToRetailRateDetail(
            com.travelhub.connectors.nuitee.dto.response.RoomType roomType) {
        if (roomType == null) {
            return null;
        }

        RetailRateDetailDto retailRateDetail = new RetailRateDetailDto();
        if (roomType.getOfferRetailRate() != null) {
            retailRateDetail.setTotal(java.util.Collections.singletonList(mapPrice(roomType.getOfferRetailRate())));
        }
        if (roomType.getSuggestedSellingPrice() != null) {
            retailRateDetail.setSuggestedSellingPrice(
                    java.util.Collections.singletonList(mapPrice(roomType.getSuggestedSellingPrice())));
        }
        if (roomType.getOfferInitialPrice() != null) {
            retailRateDetail.setInitialPrice(java.util.Collections.singletonList(mapPrice(roomType.getOfferInitialPrice())));
        }
        // Taxes are not explicitly available at offer level in simple Price object,
        // but Total includes them if the connector logic works as expected.
        return retailRateDetail;
    }

    private void enrichRateWithRoomDetails(RateDto rateDto, Room room) {
        if (rateDto == null || room == null) {
            return;
        }
        // Add detailed room information from hotel details to the rate
        rateDto.setName(room.getRoomName()); // Use room name from hotel details, not from rate
        rateDto.setRoomDescription(room.getDescription());
        rateDto.setRoomSize(room.getRoomSizeSquare());
        rateDto.setRoomSizeUnit(room.getRoomSizeUnit());
        rateDto.setMaxAdults(room.getMaxAdults());
        rateDto.setMaxChildren(room.getMaxChildren());
        rateDto.setMaxOccupancy(room.getMaxOccupancy());
        rateDto.setRoomPhotos(mapRoomPhotos(room.getPhotos()));
    }

    private List<RoomPhotoDto> mapRoomPhotos(List<com.travelhub.connectors.nuitee.dto.response.RoomPhoto> photos) {
        if (photos == null) {
            return null;
        }
        return photos.stream()
                .map(this::mapRoomPhoto)
                .collect(Collectors.toList());
    }

    private RoomPhotoDto mapRoomPhoto(com.travelhub.connectors.nuitee.dto.response.RoomPhoto photo) {
        if (photo == null) {
            return null;
        }
        RoomPhotoDto roomPhoto = new RoomPhotoDto();
        roomPhoto.setUrl(photo.getUrl());
        roomPhoto.setHdUrl(photo.getHdUrl());
        roomPhoto.setImageDescription(photo.getImageDescription());
        roomPhoto.setMainPhoto(photo.getMainPhoto());
        return roomPhoto;
    }

    public RetailRateDetailDto mapBookRetailRateDetail(
            com.travelhub.connectors.nuitee.dto.response.BookResponse.RoomBooked.BookRetailRateDetail bookRetailRateDetail) {
        if (bookRetailRateDetail == null) {
            return null;
        }
        RetailRateDetailDto bookRetailRateDetailDto = new RetailRateDetailDto();
        // Convert single Price objects to lists
        if (bookRetailRateDetail.getTotal() != null) {
            bookRetailRateDetailDto.setTotal(java.util.Collections.singletonList(mapPrice(bookRetailRateDetail.getTotal())));
        }
        if (bookRetailRateDetail.getSuggestedSellingPrice() != null) {
            bookRetailRateDetailDto.setSuggestedSellingPrice(java.util.Collections.singletonList(mapPrice(bookRetailRateDetail.getSuggestedSellingPrice())));
        }
        // initialPrice is not present in BookRetailRateDetail
        bookRetailRateDetailDto.setTaxesAndFees(mapTaxesAndFees(bookRetailRateDetail.getTaxesAndFees()));
        return bookRetailRateDetailDto;
    }
}

