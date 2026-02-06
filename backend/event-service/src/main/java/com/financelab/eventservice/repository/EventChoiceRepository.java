package com.financelab.eventservice.repository;

import com.financelab.eventservice.entity.EventChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventChoiceRepository extends JpaRepository<EventChoice, Long> {

    List<EventChoice> findByEventIdAndActiveTrue(Long eventId);
}
