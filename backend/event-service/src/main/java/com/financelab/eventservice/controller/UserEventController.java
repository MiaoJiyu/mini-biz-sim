package com.financelab.eventservice.controller;

import com.financelab.eventservice.entity.UserEvent;
import com.financelab.eventservice.service.UserEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-events")
@RequiredArgsConstructor
public class UserEventController {

    private final UserEventService userEventService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserEvent>> getUserEvents(@PathVariable Long userId) {
        return ResponseEntity.ok(userEventService.getUserEvents(userId));
    }

    @GetMapping("/user/{userId}/pending")
    public ResponseEntity<List<UserEvent>> getPendingEvents(@PathVariable Long userId) {
        return ResponseEntity.ok(userEventService.getUnresolvedUserEvents(userId));
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getPendingEventCount(@PathVariable Long userId) {
        return ResponseEntity.ok(userEventService.countUnresolvedEvents(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserEvent> getUserEventById(@PathVariable Long id) {
        UserEvent userEvent = userEventService.getUserEventById(id);
        return userEvent != null ? ResponseEntity.ok(userEvent) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<UserEvent> resolveEvent(
            @PathVariable Long id,
            @RequestBody ResolveRequest request) {
        UserEvent resolved = userEventService.resolveEvent(id, request.getChoice());
        return resolved != null ? ResponseEntity.ok(resolved) : ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}/has-pending")
    public ResponseEntity<Boolean> hasPendingEvent(@PathVariable Long userId) {
        return ResponseEntity.ok(userEventService.hasPendingEvent(userId));
    }

    public static class ResolveRequest {
        private String choice;

        public String getChoice() {
            return choice;
        }

        public void setChoice(String choice) {
            this.choice = choice;
        }
    }
}
