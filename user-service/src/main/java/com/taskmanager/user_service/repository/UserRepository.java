package com.taskmanager.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taskmanager.user_service.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}