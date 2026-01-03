package com.taskflow.kanban.config;

import com.taskflow.kanban.board.entity.Board;
import com.taskflow.kanban.board.entity.BoardColumn;
import com.taskflow.kanban.board.repository.BoardRepository;
import com.taskflow.kanban.board.repository.ColumnRepository;
import com.taskflow.kanban.user.entity.Role;
import com.taskflow.kanban.user.entity.User;
import com.taskflow.kanban.user.repository.RoleRepository;
import com.taskflow.kanban.user.repository.UserRepository;
import com.taskflow.kanban.workspace.entity.Workspace;
import com.taskflow.kanban.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

// @Component // Disabled in favor of Flyway migrations
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final WorkspaceRepository workspaceRepository;
    private final BoardRepository boardRepository;
    private final ColumnRepository columnRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // This logic is now handled by Flyway migrations in V2__Initial_Data.sql
    }
}
