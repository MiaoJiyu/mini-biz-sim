package com.financelab.eventservice.service;

import com.financelab.eventservice.entity.Event;
import com.financelab.eventservice.entity.EventChoice;
import com.financelab.eventservice.entity.EventType;
import com.financelab.eventservice.repository.EventChoiceRepository;
import com.financelab.eventservice.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventChoiceRepository eventChoiceRepository;
    private final Random random = new Random();

    public List<Event> getAllActiveEvents() {
        return eventRepository.findByActiveTrue();
    }

    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategory(category);
    }

    public List<Event> getEventsByType(EventType type) {
        return eventRepository.findByTypeAndActiveTrue(type);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event event) {
        Event existingEvent = eventRepository.findById(id).orElse(null);
        if (existingEvent != null) {
            existingEvent.setTitle(event.getTitle());
            existingEvent.setDescription(event.getDescription());
            existingEvent.setType(event.getType());
            existingEvent.setSeverity(event.getSeverity());
            existingEvent.setProbability(event.getProbability());
            existingEvent.setCategory(event.getCategory());
            existingEvent.setEffects(event.getEffects());
            existingEvent.setActive(event.getActive());
            return eventRepository.save(existingEvent);
        }
        return null;
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public List<EventChoice> getEventChoices(Long eventId) {
        return eventChoiceRepository.findByEventIdAndActiveTrue(eventId);
    }

    public EventChoice createEventChoice(EventChoice choice) {
        return eventChoiceRepository.save(choice);
    }

    public Event triggerRandomEvent(List<EventType> types, int minSeverityLevel) {
        List<Event> candidateEvents = eventRepository.findByActiveTrue();
        Event selectedEvent = null;

        for (Event event : candidateEvents) {
            boolean typeMatch = types == null || types.isEmpty() || types.contains(event.getType());
            boolean severityMatch = event.getSeverity().ordinal() >= minSeverityLevel;

            if (typeMatch && severityMatch) {
                int roll = random.nextInt(100) + 1;
                if (roll <= event.getProbability()) {
                    selectedEvent = event;
                    break;
                }
            }
        }

        return selectedEvent;
    }

    public Event triggerRandomEventByCategory(String category) {
        List<Event> events = eventRepository.findByCategory(category);
        if (events.isEmpty()) {
            return null;
        }

        Event selectedEvent = null;
        for (Event event : events) {
            if (!event.getActive()) continue;

            int roll = random.nextInt(100) + 1;
            if (roll <= event.getProbability()) {
                selectedEvent = event;
                break;
            }
        }

        return selectedEvent;
    }
}
