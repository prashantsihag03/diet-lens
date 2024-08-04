package com.example.dietlens.controllers;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.dietlens.DTOs.IngredientExplanationResultDTO;
import com.example.dietlens.services.IngredientService;

import io.github.bucket4j.Bucket;

@RestController
class IngredientController {

    private IngredientService ingredientService;
    private Bucket bucket;

    public IngredientController(IngredientService ingredientService, Bucket bucket) {
        this.ingredientService = ingredientService;
        this.bucket = bucket;
    }

    @PostMapping(path = "/ingredient", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<IngredientExplanationResultDTO> getIngredientExplaination(
            @RequestPart MultipartFile file) throws IOException {
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(ingredientService.explainIngredient(file));
        }
        throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests - please try again later");
    }
}
