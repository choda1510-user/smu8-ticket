package com.smu8.ticket.auth.filter;

import com.smu8.ticket.auth.exception.RefreshTokenAuthenticationException;
import com.smu8.ticket.authentication.RefreshTokenAuthenticationToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

public class RefreshTokenCookieAuthenticationFilter extends OncePerRequestFilter {

    private static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

    private final AuthenticationManager authenticationManager;
    private final AuthenticationEntryPoint authenticationEntryPoint;
    private final RequestMatcher requestMatcher =
            new RegexRequestMatcher("/api/auth/refresh", HttpMethod.GET.name());

    private final SecurityContextHolderStrategy securityContextHolderStrategy =
            SecurityContextHolder.getContextHolderStrategy();

    public RefreshTokenCookieAuthenticationFilter(
            AuthenticationManager authenticationManager,
            AuthenticationEntryPoint authenticationEntryPoint
    ) {
        this.authenticationManager = authenticationManager;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !requestMatcher.matches(request);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String refreshToken = extractRefreshTokenFromCookie(request);

            if (refreshToken == null || refreshToken.isBlank()) {
                throw new RefreshTokenAuthenticationException("Refresh token cookie is missing.");
            }

            RefreshTokenAuthenticationToken authenticationRequest =
                    new RefreshTokenAuthenticationToken(refreshToken);

            authenticationRequest.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            Authentication authenticationResult =
                    authenticationManager.authenticate(authenticationRequest);

            SecurityContext context = securityContextHolderStrategy.createEmptyContext();
            context.setAuthentication(authenticationResult);
            securityContextHolderStrategy.setContext(context);

            filterChain.doFilter(request, response);
        } catch (AuthenticationException exception) {
            securityContextHolderStrategy.clearContext();
            authenticationEntryPoint.commence(request, response, exception);
        }
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}