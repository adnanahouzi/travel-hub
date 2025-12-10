package com.travelhub.booking.repository;

import com.travelhub.booking.model.BookingSimulation;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class BookingSimulationRepositoryTest {

    @Autowired
    private BookingSimulationRepository bookingSimulationRepository;

    @Test
    public void testSaveAndFindBookingSimulation() {
        BookingSimulation simulation = new BookingSimulation();
        simulation.setTotalAmount(new BigDecimal("200.00"));
        simulation.setTotalIncludedTaxes(new BigDecimal("20.00"));
        simulation.setTotalExcludedTaxes(new BigDecimal("10.00"));
        simulation.setCurrency("USD");
        simulation.setStatus("ACTIVE");

        BookingSimulation savedSimulation = bookingSimulationRepository.save(simulation);

        assertThat(savedSimulation.getId()).isNotNull().isNotEmpty();
        assertThat(savedSimulation.getStatus()).isEqualTo("ACTIVE");

        Optional<BookingSimulation> foundSimulation = bookingSimulationRepository.findById(savedSimulation.getId());
        assertThat(foundSimulation).isPresent();
        assertThat(foundSimulation.get().getTotalAmount()).isEqualByComparingTo(new BigDecimal("200.00"));
        assertThat(foundSimulation.get().getCurrency()).isEqualTo("USD");
    }

    @Test
    public void testExpiredSimulation() {
        BookingSimulation simulation = new BookingSimulation();
        simulation.setTotalAmount(new BigDecimal("100.00"));
        simulation.setTotalIncludedTaxes(new BigDecimal("10.00"));
        simulation.setTotalExcludedTaxes(new BigDecimal("5.00"));
        simulation.setCurrency("EUR");
        simulation.setStatus("ACTIVE");

        BookingSimulation savedSimulation = bookingSimulationRepository.save(simulation);

        // Should not be expired immediately upon creation (expiresAt is set to now +
        // 30m)
        assertThat(savedSimulation.isExpired()).isFalse();

        // Verify expiresAt is set
        assertThat(savedSimulation.getExpiresAt()).isNotNull();
        assertThat(savedSimulation.getCreatedAt()).isNotNull();
    }
}
