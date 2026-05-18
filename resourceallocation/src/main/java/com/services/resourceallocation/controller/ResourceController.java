package com.services.resourceallocation.controller;

import com.services.resourceallocation.dto.ResourceDTO;
import com.services.resourceallocation.dto.TimetableEntryDTO;
import com.services.resourceallocation.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")   // allow Vite dev server (localhost:5173)
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // ── GET /api/resources
    //    Returns all resources (no filter)
    @GetMapping
    public ResponseEntity<List<ResourceDTO>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // ── GET /api/resources/category?name=Labs
    //    Returns resources for a given category (Labs / Halls / Classrooms)
    @GetMapping("/category")
    public ResponseEntity<List<ResourceDTO>> getByCategory(
            @RequestParam("name") String categoryName) {
        return ResponseEntity.ok(resourceService.getResourcesByCategory(categoryName));
    }

    // ── GET /api/resources/{id}/timetable
    //    Returns timetable entries for the resource with the given ID
    @GetMapping("/{id}/timetable")
    public ResponseEntity<List<TimetableEntryDTO>> getTimetableById(
            @PathVariable("id") Integer resourceId) {
        return ResponseEntity.ok(resourceService.getTimetableByResourceId(resourceId));
    }

    // ── GET /api/resources/timetable?resourceName=Computer+Lab+1
    //    Returns timetable entries looked up by resource name
    @GetMapping("/timetable")
    public ResponseEntity<List<TimetableEntryDTO>> getTimetableByName(
            @RequestParam("resourceName") String resourceName) {
        return ResponseEntity.ok(resourceService.getTimetableByResourceName(resourceName));
    }
}