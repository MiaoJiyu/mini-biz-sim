package com.financelab.eventservice.controller;

import com.financelab.eventservice.entity.Event;
import com.financelab.eventservice.entity.EventChoice;
import com.financelab.eventservice.entity.EventType;
import com.financelab.eventservice.entity.UserEvent;
import com.financelab.eventservice.service.EventService;
import com.financelab.eventservice.service.UserEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserEventService userEventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllActiveEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return event != null ? ResponseEntity.ok(event) : ResponseEntity.notFound().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Event>> getEventsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(eventService.getEventsByCategory(category));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Event>> getEventsByType(@PathVariable EventType type) {
        return ResponseEntity.ok(eventService.getEventsByType(type));
    }

    @GetMapping("/{id}/choices")
    public ResponseEntity<List<EventChoice>> getEventChoices(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventChoices(id));
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        Event updated = eventService.updateEvent(id, event);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/trigger")
    public ResponseEntity<UserEvent> triggerEvent(@PathVariable Long id, @RequestParam Long userId) {
        Event event = eventService.getEventById(id);
        if (event != null) {
            UserEvent userEvent = userEventService.triggerEventForUser(userId, event);
            return ResponseEntity.ok(userEvent);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/random")
    public ResponseEntity<Event> triggerRandomEvent(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) EventType type,
            @RequestParam(defaultValue = "0") int minSeverity) {
        Event event;
        if (category != null) {
            event = eventService.triggerRandomEventByCategory(category);
        } else {
            List<EventType> types = type != null ? List.of(type) : null;
            event = eventService.triggerRandomEvent(types, minSeverity);
        }
        return event != null ? ResponseEntity.ok(event) : ResponseEntity.noContent().build();
    }

    @PostMapping("/random/{userId}")
    public ResponseEntity<UserEvent> triggerRandomEventForUser(@PathVariable Long userId) {
        Event event = eventService.triggerRandomEvent(null, 0);
        if (event != null) {
            UserEvent userEvent = userEventService.triggerEventForUser(userId, event);
            return ResponseEntity.ok(userEvent);
        }
        return ResponseEntity.noContent().build();
    }
}
