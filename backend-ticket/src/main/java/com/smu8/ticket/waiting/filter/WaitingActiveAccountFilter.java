package com.smu8.ticket.waiting.filter;

import com.smu8.ticket.waiting.authentication.WaitingActiveAccountAuthentication;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@Profile({"dev-waiting", "local-dev-waiting", "test-waiting", "load-test-waiting", "local-test-waiting"})
public class WaitingActiveAccountFilter extends OncePerRequestFilter {
    private final AuthenticationManager authenticationManager;
    private final ObjectMapper objectMapper;

    public WaitingActiveAccountFilter(
            AuthenticationManager authenticationManager,
            ObjectMapper objectMapper
    ) {
        this.authenticationManager = authenticationManager;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        HttpServletRequest requestToUse = request;
        String concertId = request.getParameter("concertId");

        if (concertId == null && hasJsonBody(request)) {
            CachedBodyHttpServletRequest cachedRequest = new CachedBodyHttpServletRequest(request);
            requestToUse = cachedRequest;
            concertId = extractConcertId(cachedRequest.getCachedBody());
        }

        if (concertId == null || concertId.isBlank()) {
            filterChain.doFilter(requestToUse, response);
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            authenticationManager.authenticate(
                    new WaitingActiveAccountAuthentication(concertId, authentication.getName()));
        } catch (AuthenticationException exception) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        filterChain.doFilter(requestToUse, response);
    }

    private boolean hasJsonBody(HttpServletRequest request) {
        return (HttpMethod.POST.matches(request.getMethod())
                || HttpMethod.PUT.matches(request.getMethod())
                || HttpMethod.PATCH.matches(request.getMethod())
                || HttpMethod.DELETE.matches(request.getMethod()))
                && request.getContentType() != null
                && request.getContentType().contains("application/json");
    }

    @SuppressWarnings("unchecked")
    private String extractConcertId(byte[] body) throws IOException {
        if (body.length == 0) {
            return null;
        }

        Map<String, Object> requestBody = objectMapper.readValue(body, Map.class);
        Object concertId = requestBody.get("concertId");
        return concertId == null ? null : String.valueOf(concertId);
    }

    private static final class CachedBodyHttpServletRequest extends HttpServletRequestWrapper {
        private final byte[] cachedBody;

        private CachedBodyHttpServletRequest(HttpServletRequest request) throws IOException {
            super(request);
            this.cachedBody = request.getInputStream().readAllBytes();
        }

        private byte[] getCachedBody() {
            return cachedBody;
        }

        @Override
        public ServletInputStream getInputStream() {
            ByteArrayInputStream inputStream = new ByteArrayInputStream(cachedBody);

            return new ServletInputStream() {
                @Override
                public boolean isFinished() {
                    return inputStream.available() == 0;
                }

                @Override
                public boolean isReady() {
                    return true;
                }

                @Override
                public void setReadListener(ReadListener readListener) {
                    throw new UnsupportedOperationException();
                }

                @Override
                public int read() {
                    return inputStream.read();
                }
            };
        }

        @Override
        public BufferedReader getReader() {
            return new BufferedReader(new InputStreamReader(getInputStream(), StandardCharsets.UTF_8));
        }
    }
}
