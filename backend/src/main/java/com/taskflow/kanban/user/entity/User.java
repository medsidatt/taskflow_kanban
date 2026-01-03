package com.taskflow.kanban.user.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends AuditableEntity {

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private boolean accountLocked = false;

    @Column(nullable = false)
    private boolean credentialsExpired = false;

    @Column(nullable = false)
    private boolean accountExpired = false;

    private LocalDateTime lastLogin;
    
    private String lastLoginIp;

    // ----------------------
    // Roles (MULTIPLE ROLES)
    // ----------------------
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @JsonManagedReference
    private Set<Role> roles = new HashSet<>();

//    @ManyToMany(mappedBy = "assignees", fetch = FetchType.LAZY)
//    private Set<Card> cards = new HashSet<>();
    // ----------------------
    // Helper methods
    // ----------------------
    public boolean isLocked() {
        return accountLocked;
    }

    public boolean isEmailVerified() {
        return true;
    }
}
