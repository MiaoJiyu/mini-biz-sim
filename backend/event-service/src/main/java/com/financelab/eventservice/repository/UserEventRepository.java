package com.financelab.eventservice.repository;

import com.financelab.eventservice.entity.UserEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserEventRepository extends JpaRepository<UserEvent, Long> {

    List<UserEvent> findByUserIdAndResolvedFalse(Long userId);

    List<UserEvent> findByUserId(Long userId);

    @Query("SELECT ue FROM UserEvent ue WHERE ue.userId = :userId AND ue.triggeredAt >= :startDate")
    List<UserEvent> findUserEventsSince(Long userId, LocalDateTime startDate);

    @Query("SELECT COUNT(ue) FROM UserEvent ue WHERE ue.userId = :userId AND ue.resolved = false")
    Long countUnresolvedEvents(Long userId);
}
