package com.financelab.eventservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_events")
public class UserEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private EventType type;

    @Enumerated(EnumType.STRING)
    private EventSeverity severity;

    @Column(columnDefinition = "JSON")
    private String effects;

    @Column(nullable = false)
    private LocalDateTime triggeredAt;

    @Column
    private LocalDateTime resolvedAt;

    @Column(nullable = false)
    private Boolean resolved;

    @Column(columnDefinition = "TEXT")
    private String userChoice;

    @Column(columnDefinition = "TEXT")
    private String outcome;

    @PrePersist
    protected void onCreate() {
        triggeredAt = LocalDateTime.now();
        resolved = false;
    }
}
