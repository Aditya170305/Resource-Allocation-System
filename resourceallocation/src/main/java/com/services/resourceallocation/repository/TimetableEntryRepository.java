package com.services.resourceallocation.repository;

import com.services.resourceallocation.model.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, Integer> {

    // All timetable entries for a specific resource
    List<TimetableEntry> findByResource_ResourceId(Integer resourceId);

    // All timetable entries for a resource filtered by lecture slot
    List<TimetableEntry> findByResource_ResourceIdAndLectureSlot(
            Integer resourceId,
            TimetableEntry.LectureSlot lectureSlot
    );

    // JPQL: fetch entries with resource eagerly to avoid N+1
    @Query("SELECT t FROM TimetableEntry t JOIN FETCH t.resource r WHERE r.resourceId = :resourceId")
    List<TimetableEntry> findByResourceIdEager(@Param("resourceId") Integer resourceId);
}