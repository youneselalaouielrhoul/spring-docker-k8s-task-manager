package com.taskmanager.task_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taskmanager.task_manager.model.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
}
