package com.example.dietlens.controllers;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.dietlens.DTOs.IngredientExplanationResultDTO;
import com.example.dietlens.services.IngredientService;

@RestController
class IngredientController {

    private IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @PostMapping(path = "/ingredient", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<IngredientExplanationResultDTO> getIngredientExplaination(
            @RequestPart MultipartFile file) throws IOException {
        System.out.printf("File size is");
        System.out.println();
        return ResponseEntity.ok(ingredientService.explainIngredient(file));
    }
}
