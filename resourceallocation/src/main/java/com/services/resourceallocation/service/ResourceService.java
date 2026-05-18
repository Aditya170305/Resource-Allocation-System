package com.services.resourceallocation.service;

import com.services.resourceallocation.dto.ResourceDTO;
import com.services.resourceallocation.dto.TimetableEntryDTO;
import com.services.resourceallocation.model.Resource;
import com.services.resourceallocation.model.TimetableEntry;
import com.services.resourceallocation.repository.ResourceRepository;
import com.services.resourceallocation.repository.TimetableEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private TimetableEntryRepository timetableEntryRepository;

    // ── Map lecture slot enum → 0-based index ─────────────────────
   private static final Map<String, Integer> SLOT_INDEX = Map.of(
    "1st Lecture", 0,
    "2nd Lecture", 1,
    "3rd Lecture", 2,
    "4th Lecture", 3,
    "5th Lecture", 4,
    "6th Lecture", 5
);

    // ── Convert Resource entity → DTO ─────────────────────────────
    private ResourceDTO toResourceDTO(Resource r) {
        return new ResourceDTO(
                r.getResourceId(),
                r.getName(),
                r.getType().name(),          // "Lab" / "Hall" / "Classroom"
                r.getDepartment(),
                r.getCapacity(),
                r.getLocation(),
                r.getAmenities()
        );
    }

    // ── Convert TimetableEntry entity → DTO ──────────────────────
    private TimetableEntryDTO toTimetableDTO(TimetableEntry t) {
        TimetableEntryDTO dto = new TimetableEntryDTO();
        dto.setId(t.getId());
        dto.setResourceId(t.getResource().getResourceId());
        dto.setResourceName(t.getResource().getName());
        dto.setFacultyName(t.getFacultyName());
        dto.setStartTime(t.getStartTime().toString());   // "HH:mm"
        dto.setEndTime(t.getEndTime().toString());
        dto.setClassType(t.getClassType());
        dto.setLectureSlot(t.getLectureSlot().getDbValue());
        dto.setLectureIndex(SLOT_INDEX.getOrDefault(t.getLectureSlot(), 0));
        return dto;
    }

    // ─────────────────────────────────────────────────────────────
    //  PUBLIC METHODS
    // ─────────────────────────────────────────────────────────────

    /** All resources (used for seeding / admin) */
    public List<ResourceDTO> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::toResourceDTO)
                .collect(Collectors.toList());
    }

    /** Resources filtered by category string ("Labs", "Halls", "Classrooms") */
    /** Resources filtered by category string ("Labs", "Halls", "Classrooms") */
    public List<ResourceDTO> getResourcesByCategory(String category) {
        Resource.ResourceType type = mapCategoryToType(category);
        return resourceRepository.findByType(type)
            .stream()
            .map(this::toResourceDTO)
            .collect(Collectors.toList());
    }

    /** Timetable entries for a given resource ID */
    public List<TimetableEntryDTO> getTimetableByResourceId(Integer resourceId) {
        return timetableEntryRepository.findByResourceIdEager(resourceId)
                .stream()
                .map(this::toTimetableDTO)
                .collect(Collectors.toList());
    }

    /** Timetable entries by resource name (convenience for frontend) */
    public List<TimetableEntryDTO> getTimetableByResourceName(String resourceName) {
        return resourceRepository.findByName(resourceName)
                .map(r -> getTimetableByResourceId(r.getResourceId()))
                .orElse(List.of());
    }

    // ─────────────────────────────────────────────────────────────
    //  SEED helper: Save a resource directly
    // ─────────────────────────────────────────────────────────────
    public ResourceDTO saveResource(Resource resource) {
        return toResourceDTO(resourceRepository.save(resource));
    }

    // ─────────────────────────────────────────────────────────────
    //  PRIVATE UTIL
    // ─────────────────────────────────────────────────────────────

    /**
     * Maps frontend category label → DB enum value.
     *  "Labs"       → Lab
     *  "Halls"      → Hall
     *  "Classrooms" → Classroom
     */
    private Resource.ResourceType mapCategoryToType(String category) {
        return switch (category.toLowerCase()) {
            case "labs"       -> Resource.ResourceType.Lab;
            case "halls"      -> Resource.ResourceType.Hall;
            case "classrooms" -> Resource.ResourceType.Classroom;
            default           -> Resource.ResourceType.Lab;
        };
    }
}