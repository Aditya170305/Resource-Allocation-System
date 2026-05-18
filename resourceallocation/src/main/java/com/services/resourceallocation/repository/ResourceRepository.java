package com.services.resourceallocation.repository;

import com.services.resourceallocation.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Integer> {

    // Find all resources by type (Lab / Hall / Classroom)
    List<Resource> findByType(Resource.ResourceType type);

    // Find resource by exact name
    java.util.Optional<Resource> findByName(String name);
}