package com.financelab.eventservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financelab.eventservice.entity.Event;
import com.financelab.eventservice.entity.EventChoice;
import com.financelab.eventservice.entity.EventSeverity;
import com.financelab.eventservice.entity.UserEvent;
import com.financelab.eventservice.repository.UserEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserEventService {

    private final UserEventRepository userEventRepository;
    private final EventService eventService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<UserEvent> getUserEvents(Long userId) {
        return userEventRepository.findByUserId(userId);
    }

    public List<UserEvent> getUnresolvedUserEvents(Long userId) {
        return userEventRepository.findByUserIdAndResolvedFalse(userId);
    }

    public Long countUnresolvedEvents(Long userId) {
        return userEventRepository.countUnresolvedEvents(userId);
    }

    public UserEvent getUserEventById(Long id) {
        return userEventRepository.findById(id).orElse(null);
    }

    @Transactional
    public UserEvent triggerEventForUser(Long userId, Event event) {
        UserEvent userEvent = new UserEvent();
        userEvent.setUserId(userId);
        userEvent.setEventId(event.getId());
        userEvent.setTitle(event.getTitle());
        userEvent.setDescription(event.getDescription());
        userEvent.setType(event.getType());
        userEvent.setSeverity(event.getSeverity());
        userEvent.setEffects(event.getEffects());

        return userEventRepository.save(userEvent);
    }

    @Transactional
    public UserEvent resolveEvent(Long userEventId, String choice) {
        UserEvent userEvent = userEventRepository.findById(userEventId).orElse(null);
        if (userEvent != null) {
            userEvent.setResolved(true);
            userEvent.setResolvedAt(LocalDateTime.now());
            userEvent.setUserChoice(choice);

            Map<String, Object> outcome = calculateOutcome(userEvent, choice);
            try {
                userEvent.setOutcome(objectMapper.writeValueAsString(outcome));
            } catch (Exception e) {
                userEvent.setOutcome("{\"error\":\"Failed to serialize outcome\"}");
            }

            return userEventRepository.save(userEvent);
        }
        return null;
    }

    private Map<String, Object> calculateOutcome(UserEvent userEvent, String choice) {
        Map<String, Object> outcome = Map.of(
            "choice", choice,
            "timestamp", LocalDateTime.now().toString(),
            "success", Math.random() > 0.3,
            "message", "事件已处理完成"
        );

        return outcome;
    }

    public void cleanOldEvents() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        List<UserEvent> oldEvents = userEventRepository.findUserEventsSince(1L, cutoffDate);
    }

    public boolean hasPendingEvent(Long userId) {
        return countUnresolvedEvents(userId) > 0;
    }
}
