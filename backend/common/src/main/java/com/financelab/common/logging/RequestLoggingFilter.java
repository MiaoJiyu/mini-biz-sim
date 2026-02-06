package com.financelab.common.logging;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        CachedBodyHttpServletRequest wrappedRequest = new CachedBodyHttpServletRequest(httpRequest);

        logRequest(wrappedRequest);

        chain.doFilter(wrappedRequest, response);
    }

    private void logRequest(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();

        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.put(headerName, request.getHeader(headerName));
        }

        log.info("=== Request ===");
        log.info("Method: {}", request.getMethod());
        log.info("URI: {}", request.getRequestURI());
        log.info("Remote Addr: {}", request.getRemoteAddr());
        log.info("Headers: {}", headers);

        if (request.getContentLength() > 0 && !"GET".equals(request.getMethod())) {
            String body = new String(((CachedBodyHttpServletRequest) request).getBodyBytes(), StandardCharsets.UTF_8);
            log.info("Body: {}", body);
        }

        log.info("================");
    }
}
