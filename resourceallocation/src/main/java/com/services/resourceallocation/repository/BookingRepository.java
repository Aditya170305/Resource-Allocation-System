package com.services.resourceallocation.repository;

import com.services.resourceallocation.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByFacultyId(Integer facultyId);

    List<Booking> findByResourceName(String resourceName);

    List<Booking> findByStatus(String status);
}