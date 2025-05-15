package com.phegondev.TasksApp.exceptions;



public class BadRequestException extends RuntimeException{
    public BadRequestException(String ex){
        super(ex);
    }
}
