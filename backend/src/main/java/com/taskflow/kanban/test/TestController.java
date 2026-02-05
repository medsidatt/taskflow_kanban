package com.taskflow.kanban.test;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;

@RestController("/tests")
public class TestController {

    @GetMapping
    public String index() {
        return "Hello, World!";
    }
}
