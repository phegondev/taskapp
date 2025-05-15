package com.phegondev.TasksApp.service;

import com.phegondev.TasksApp.dto.Response;
import com.phegondev.TasksApp.dto.UserRequest;
import com.phegondev.TasksApp.entity.User;


public interface UserService {

    Response<?> signUp(UserRequest userRequest);
    Response<?> login(UserRequest userRequest);
    User getCurrentLoggedInUser();

}
