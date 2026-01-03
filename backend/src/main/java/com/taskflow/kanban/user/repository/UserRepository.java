package com.taskflow.kanban.user.repository;

import com.taskflow.kanban.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.username = :username")
    Optional<User> findByUsernameWithRoles(@Param("username") String username);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") UUID id);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("""
    SELECT u FROM User u
    WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    List<User> search(String keyword);

    @Query("""
    SELECT u FROM User u
    WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    Page<User> search(String keyword, Pageable pageable);


    List<User> findByActiveTrue();

    List<User> findByAccountLockedFalse();
}
