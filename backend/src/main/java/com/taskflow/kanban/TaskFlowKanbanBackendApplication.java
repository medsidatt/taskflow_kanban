package com.taskflow.kanban;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableAsync
@CrossOrigin(origins = "http://localhost:4200")
public class TaskFlowKanbanBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskFlowKanbanBackendApplication.class, args);
	}

}
