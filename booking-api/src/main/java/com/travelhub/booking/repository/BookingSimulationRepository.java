package com.travelhub.booking.repository;

import com.travelhub.booking.model.BookingSimulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingSimulationRepository extends JpaRepository<BookingSimulation, String> {
}
