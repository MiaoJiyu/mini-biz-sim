package com.financelab.eventservice.scheduler;

import com.financelab.eventservice.entity.Event;
import com.financelab.eventservice.entity.EventType;
import com.financelab.eventservice.entity.UserEvent;
import com.financelab.eventservice.service.EventService;
import com.financelab.eventservice.service.UserEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
public class EventScheduler {

    private final EventService eventService;
    private final UserEventService userEventService;
    private final Random random = new Random();

    @Scheduled(fixedRate = 300000)
    public void triggerRandomMarketEvent() {
        log.info("Checking for random market events...");

        Event event = eventService.triggerRandomEvent(
            List.of(EventType.MARKET_CRASH, EventType.ECONOMIC_BOOM, EventType.FINANCIAL_REGULATION),
            1
        );

        if (event != null) {
            log.info("Market event triggered: {}", event.getTitle());
            notifyUsers(event);
        }
    }

    @Scheduled(cron = "0 0 */6 * * ?")
    public void triggerDailyEvents() {
        log.info("Triggering daily random events for users...");

        Event event = eventService.triggerRandomEvent(null, 0);
        if (event != null) {
            log.info("Daily event triggered: {}", event.getTitle());
        }
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupOldEvents() {
        log.info("Cleaning up old user events...");
        userEventService.cleanOldEvents();
    }

    private void notifyUsers(Event event) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "EVENT");
        notification.put("eventId", event.getId());
        notification.put("title", event.getTitle());
        notification.put("description", event.getDescription());
        notification.put("severity", event.getSeverity().toString());
        notification.put("timestamp", System.currentTimeMillis());

        log.info("Broadcasting event notification: {}", notification);
    }
}
