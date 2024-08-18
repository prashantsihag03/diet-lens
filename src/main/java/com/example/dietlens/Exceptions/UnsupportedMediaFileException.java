package com.example.dietlens.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNSUPPORTED_MEDIA_TYPE, reason = "Provided media file is not supported. Please try again with supported media file!")
public class UnsupportedMediaFileException extends Exception {
  public UnsupportedMediaFileException(String message) {
    super(message);
  }
}
