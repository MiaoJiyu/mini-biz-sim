package com.financelab.common.metrics;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Slf4j
@Aspect
@Component
public class MetricsAspect {

    @Around("@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.GetMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.DeleteMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    public Object logApiMetrics(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.nanoTime();
        String methodName = joinPoint.getSignature().toShortString();

        try {
            Object result = joinPoint.proceed();
            long duration = System.nanoTime() - startTime;
            long durationMs = TimeUnit.NANOSECONDS.toMillis(duration);

            log.info("API Metrics - Method: {}, Duration: {}ms, Status: SUCCESS",
                    methodName, durationMs);

            if (durationMs > 1000) {
                log.warn("SLOW API DETECTED - Method: {}, Duration: {}ms",
                        methodName, durationMs);
            }

            return result;

        } catch (Exception e) {
            long duration = System.nanoTime() - startTime;
            long durationMs = TimeUnit.NANOSECONDS.toMillis(duration);

            log.error("API Metrics - Method: {}, Duration: {}ms, Status: ERROR, Error: {}",
                    methodName, durationMs, e.getMessage());

            throw e;
        }
    }

    @Around("@annotation(com.financelab.common.metrics.Timed)")
    public Object logTimedMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.nanoTime();
        String methodName = joinPoint.getSignature().toShortString();

        try {
            Object result = joinPoint.proceed();
            long duration = System.nanoTime() - startTime;
            log.debug("Timed Method - {}, Duration: {}ms", methodName,
                    TimeUnit.NANOSECONDS.toMillis(duration));
            return result;

        } catch (Exception e) {
            long duration = System.nanoTime() - startTime;
            log.error("Timed Method Failed - {}, Duration: {}ms", methodName,
                    TimeUnit.NANOSECONDS.toMillis(duration));
            throw e;
        }
    }
}
