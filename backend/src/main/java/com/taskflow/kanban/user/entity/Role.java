package com.taskflow.kanban.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.taskflow.kanban.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends AuditableEntity {

////    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;

    @EqualsAndHashCode.Include
    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "roles", fetch =  FetchType.LAZY)
    @JsonIgnore
    private Set<User> users;

    public Role(String roleName) {
        this.name = roleName;
    }
}
