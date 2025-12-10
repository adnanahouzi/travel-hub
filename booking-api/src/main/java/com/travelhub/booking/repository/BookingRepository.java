package com.travelhub.booking.repository;

import com.travelhub.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    /**
     * Find all bookings where status is not 'FAILED'
     */
    List<Booking> findByStatusNotOrderByCheckinAscCreatedAtAsc(String status);
}
