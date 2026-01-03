package com.taskflow.kanban.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("userSecurity")
public class UserSecurity {

    public boolean isCurrentUser(UUID userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            UUID authenticatedUserId = ((CustomUserDetails) principal).getId();
            return authenticatedUserId.equals(userId);
        } else if (principal instanceof UserDetails) {
             // Fallback if principal is not CustomUserDetails (e.g. during tests if not fully mocked)
             // But ideally we should use CustomUserDetails everywhere
             String username = ((UserDetails) principal).getUsername();
             try {
                 UUID authenticatedUserId = UUID.fromString(username);
                 return authenticatedUserId.equals(userId);
             } catch (IllegalArgumentException e) {
                 return false;
             }
        }
        return false;
    }
}
