package com.financelab.eventservice.repository;

import com.financelab.eventservice.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByActiveTrue();

    List<Event> findByCategory(String category);

    List<Event> findByTypeAndActiveTrue(com.financelab.eventservice.entity.EventType type);

    @Query("SELECT e FROM Event e WHERE e.active = true AND e.severity = :severity")
    List<Event> findActiveBySeverity(com.financelab.eventservice.entity.EventSeverity severity);

    @Query("SELECT e FROM Event e WHERE e.active = true AND e.probability >= :minProbability")
    List<Event> findActiveByMinProbability(Integer minProbability);
}
