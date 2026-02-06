package com.taskflow.kanban.security;

import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService,
                                   @Lazy UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    private List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
        Claims claims = jwtService.extractAllClaims(token);

        // Extract roles as List
        List<String> roles = claims.get("roles", List.class);

        if (roles == null) roles = List.of();

        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    /** Paths that are always public; never return 401 for invalid/expired token here (let controller handle). */
    private static boolean isPublicAuthPath(String path) {
        if (path == null) return false;
        if (!path.contains("/auth/")) return false;
        return path.endsWith("/login") || path.endsWith("/register") || path.endsWith("/refresh")
                || path.contains("/verify") || path.contains("/forgot-password") || path.contains("/reset-password");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (isPublicAuthPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        } else {
            // Check for token query parameter (used for SSE connections)
            String tokenParam = request.getParameter("token");
            if (tokenParam != null && !tokenParam.isEmpty()) {
                jwt = tokenParam;
            }
        }

        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            UUID userIdStr = jwtService.extractUserId(jwt);

            if (userIdStr != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                User user = userRepository.findByIdWithRoles(userIdStr)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                CustomUserDetails userDetails = new CustomUserDetails(user);

                if (!jwtService.isTokenValid(jwt, userDetails)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (JwtException e) {
            // Expired, malformed, or otherwise invalid JWT: treat as 401 so client can refresh or re-login
            logger.debug("Invalid or expired JWT: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
