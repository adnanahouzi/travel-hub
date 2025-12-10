package com.travelhub.booking.repository;

import com.travelhub.booking.model.Booking;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@DisplayName("BookingRepository Tests")
class BookingRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private BookingRepository bookingRepository;

    private Booking testBooking;

    @BeforeEach
    void setUp() {
        testBooking = new Booking();
        testBooking.setBookingId("LITE123456");
        testBooking.setStatus("CONFIRMED");
        testBooking.setHotelId("hotel_001");
        testBooking.setHotelName("Radisson Blu");
        testBooking.setCheckin("2024-12-07"); // Changed to String
        testBooking.setCheckout("2024-12-13"); // Changed to String
        testBooking.setPrice(BigDecimal.valueOf(4359.00));
        testBooking.setCurrency("DH");
        testBooking.setHolderFirstName("John");
        testBooking.setHolderLastName("Doe");
        testBooking.setHolderEmail("john.doe@example.com");
        testBooking.setHolderPhone("+212600000000");
        testBooking.setBankingAccount("1234567890123456");
    }

    @Test
    @DisplayName("Should save booking successfully")
    void shouldSaveBooking() {
        // When
        Booking savedBooking = bookingRepository.save(testBooking);

        // Then - Validate ID generation and timestamps
        assertThat(savedBooking).isNotNull();
        assertThat(savedBooking.getId()).isNotNull().isNotEmpty();
        assertThat(savedBooking.getCreatedAt()).isNotNull();
        assertThat(savedBooking.getUpdatedAt()).isNotNull();

        // Validate all business fields are persisted correctly
        assertThat(savedBooking.getBookingId()).isEqualTo("LITE123456");
        assertThat(savedBooking.getStatus()).isEqualTo("CONFIRMED");
        assertThat(savedBooking.getHotelId()).isEqualTo("hotel_001");
        assertThat(savedBooking.getHotelName()).isEqualTo("Radisson Blu");

        // Validate dates
        assertThat(savedBooking.getCheckin()).isEqualTo("2024-12-07"); // Changed to String
        assertThat(savedBooking.getCheckout()).isEqualTo("2024-12-13"); // Changed to String

        // Validate price
        assertThat(savedBooking.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(4359.00));
        assertThat(savedBooking.getCurrency()).isEqualTo("DH");

        // Validate holder information
        assertThat(savedBooking.getHolderFirstName()).isEqualTo("John");
        assertThat(savedBooking.getHolderLastName()).isEqualTo("Doe");
        assertThat(savedBooking.getHolderEmail()).isEqualTo("john.doe@example.com");
        assertThat(savedBooking.getHolderPhone()).isEqualTo("+212600000000");
        assertThat(savedBooking.getBankingAccount()).isEqualTo("1234567890123456");
    }

    @Test
    @DisplayName("Should find booking by ID")
    void shouldFindBookingById() {
        // Given
        Booking savedBooking = entityManager.persistAndFlush(testBooking);
        String bookingId = savedBooking.getId();

        // When
        Optional<Booking> foundBooking = bookingRepository.findById(bookingId);

        // Then - Validate presence and ID match
        assertThat(foundBooking).isPresent();
        assertThat(foundBooking.get().getId()).isEqualTo(bookingId);

        // Validate all fields are correctly retrieved
        Booking retrieved = foundBooking.get();
        assertThat(retrieved.getBookingId()).isEqualTo("LITE123456");
        assertThat(retrieved.getStatus()).isEqualTo("CONFIRMED");
        assertThat(retrieved.getHotelId()).isEqualTo("hotel_001");
        assertThat(retrieved.getHotelName()).isEqualTo("Radisson Blu");
        assertThat(retrieved.getCheckin()).isEqualTo("2024-12-07"); // Changed to String
        assertThat(retrieved.getCheckout()).isEqualTo("2024-12-13"); // Changed to String
        assertThat(retrieved.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(4359.00));
        assertThat(retrieved.getCurrency()).isEqualTo("DH");
        assertThat(retrieved.getHolderFirstName()).isEqualTo("John");
        assertThat(retrieved.getHolderLastName()).isEqualTo("Doe");
        assertThat(retrieved.getHolderEmail()).isEqualTo("john.doe@example.com");
        assertThat(retrieved.getCreatedAt()).isNotNull();
        assertThat(retrieved.getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should return empty when booking not found")
    void shouldReturnEmptyWhenBookingNotFound() {
        // When
        Optional<Booking> foundBooking = bookingRepository.findById("non-existent-id");

        // Then
        assertThat(foundBooking).isEmpty();
    }

    @Test
    @DisplayName("Should find all bookings")
    void shouldFindAllBookings() {
        // Given
        Booking booking1 = testBooking;
        Booking booking2 = new Booking();
        booking2.setBookingId("LITE789012");
        booking2.setStatus("PENDING");
        booking2.setHotelId("hotel_002");
        booking2.setHotelName("Marriott");
        booking2.setCheckin(LocalDate.of(2024, 12, 10));
        booking2.setCheckout(LocalDate.of(2024, 12, 15));
        booking2.setPrice(BigDecimal.valueOf(5000.00));
        booking2.setCurrency("DH");

        entityManager.persist(booking1);
        entityManager.persist(booking2);
        entityManager.flush();

        // When
        List<Booking> allBookings = bookingRepository.findAll();

        // Then
        assertThat(allBookings).hasSize(2);
        assertThat(allBookings)
                .extracting(Booking::getBookingId)
                .containsExactlyInAnyOrder("LITE123456", "LITE789012");
    }

    @Test
    @DisplayName("Should delete booking")
    void shouldDeleteBooking() {
        // Given
        Booking savedBooking = entityManager.persistAndFlush(testBooking);
        String bookingId = savedBooking.getId();

        // When
        bookingRepository.deleteById(bookingId);
        entityManager.flush();

        // Then
        Optional<Booking> deletedBooking = bookingRepository.findById(bookingId);
        assertThat(deletedBooking).isEmpty();
    }

    @Test
    @DisplayName("Should update booking status")
    void shouldUpdateBookingStatus() {
        // Given
        Booking savedBooking = entityManager.persistAndFlush(testBooking);
        String bookingId = savedBooking.getId();

        // When
        savedBooking.setStatus("CANCELLED");
        bookingRepository.save(savedBooking);
        entityManager.flush();

        // Then
        Optional<Booking> updatedBooking = bookingRepository.findById(bookingId);
        assertThat(updatedBooking).isPresent();
        assertThat(updatedBooking.get().getStatus()).isEqualTo("CANCELLED");
    }

    @Test
    @DisplayName("Should generate unique IDs for multiple bookings")
    void shouldGenerateUniqueIds() {
        // Given & When
        Booking booking1 = bookingRepository.save(testBooking);

        Booking booking2 = new Booking();
        booking2.setBookingId("LITE999999");
        booking2.setStatus("CONFIRMED");
        booking2.setHotelId("hotel_003");
        booking2.setHotelName("Hilton");
        Booking savedBooking2 = bookingRepository.save(booking2);

        // Then
        assertThat(booking1.getId()).isNotNull();
        assertThat(savedBooking2.getId()).isNotNull();
        assertThat(booking1.getId()).isNotEqualTo(savedBooking2.getId());
    }
}
