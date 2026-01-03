package com.taskflow.kanban.security;

import com.taskflow.kanban.config.JwtProperties;
import com.taskflow.kanban.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // -------------------------------
    // Generate Access Token
    // -------------------------------
    public String generateToken(CustomUserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getId().toString())
                .claim("roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority) // Already has ROLE_ prefix
                        .collect(Collectors.toList()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // -------------------------------
    // Generate Refresh Token
    // -------------------------------
    public String generateRefreshToken(CustomUserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getId().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getRefreshExpiration()))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // -------------------------------
    // Extract Subject (user ID)
    // -------------------------------
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // -------------------------------
    // Validate Token
    // -------------------------------
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String userId = extractUsername(token);
        boolean isExpired = isTokenExpired(token);
        if (userDetails instanceof CustomUserDetails) {
             return userId.equals(((CustomUserDetails) userDetails).getId().toString()) && !isExpired;
        }
        return userId.equals(userDetails.getUsername()) && !isExpired;
    }

    // -------------------------------
    // Helpers
    // -------------------------------
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public UUID extractUserId(String token) {
        String subject = extractAllClaims(token).getSubject();
        return subject == null ? null : UUID.fromString(subject);
    }
}
