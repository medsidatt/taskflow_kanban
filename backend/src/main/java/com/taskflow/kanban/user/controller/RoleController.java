package com.taskflow.kanban.user.controller;

import com.taskflow.kanban.user.dto.RoleDto;
import com.taskflow.kanban.user.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<RoleDto> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public RoleDto getRoleById(@PathVariable UUID id) {
        return roleService.getRoleById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public RoleDto createRole(@RequestBody @Valid RoleDto roleDto) {
        return roleService.createRole(roleDto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public RoleDto updateRole(@PathVariable UUID id, @RequestBody @Valid RoleDto roleDto) {
        return roleService.updateRole(id, roleDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteRole(@PathVariable UUID id) {
        roleService.deleteRole(id);
    }
}
