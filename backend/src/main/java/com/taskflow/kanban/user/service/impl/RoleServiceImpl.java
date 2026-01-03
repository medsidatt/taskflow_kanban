package com.taskflow.kanban.user.service.impl;

import com.taskflow.kanban.user.dto.RoleDto;
import com.taskflow.kanban.user.entity.Role;
import com.taskflow.kanban.user.repository.RoleRepository;
import com.taskflow.kanban.user.service.RoleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleDto getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));
        return toDto(role);
    }

    @Override
    public RoleDto createRole(RoleDto roleDto) {
        if (roleRepository.findByName(roleDto.getName()).isPresent()) {
            throw new IllegalArgumentException("Role with this name already exists");
        }
        Role role = new Role();
        role.setName(roleDto.getName());
        return toDto(roleRepository.save(role));
    }

    @Override
    public RoleDto updateRole(UUID id, RoleDto roleDto) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));
        
        if (!role.getName().equals(roleDto.getName()) && roleRepository.findByName(roleDto.getName()).isPresent()) {
             throw new IllegalArgumentException("Role with this name already exists");
        }

        role.setName(roleDto.getName());
        return toDto(roleRepository.save(role));
    }

    @Override
    public void deleteRole(UUID id) {
        if (!roleRepository.existsById(id)) {
            throw new EntityNotFoundException("Role not found");
        }
        roleRepository.deleteById(id);
    }

    private RoleDto toDto(Role role) {
        return new RoleDto(role.getId(), role.getName());
    }
}
