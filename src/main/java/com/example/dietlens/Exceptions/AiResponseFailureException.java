package com.example.dietlens.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR, reason = "Failed to generate response from LLM. Please try again!")
public class AiResponseFailureException extends Exception {
  public AiResponseFailureException(String message) {
    super(message);
  }
}
