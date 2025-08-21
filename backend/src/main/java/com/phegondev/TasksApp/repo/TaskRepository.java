package com.phegondev.TasksApp.repo;

import com.phegondev.TasksApp.entity.Task;
import com.phegondev.TasksApp.entity.User;
import com.phegondev.TasksApp.enums.Priority;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser(User user, Sort sort);
    List<Task> findByCompletedAndUser(boolean completed, User user);
    List<Task> findByPriorityAndUser(Priority priority, User user, Sort sort);

}
