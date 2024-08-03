package com.example.dietlens.DTOs;

import java.util.List;
import java.util.Map;

import com.azure.ai.vision.imageanalysis.models.ImagePoint;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IngredientExplanationResultDTO {
    private Map<String, IngredientHealthDataDTO> ingredientHealthData;
    private Map<String, List<List<ImagePoint>>> ingredientWordsboundingPolygons;
    private List<String> uniqueWords;
    private List<String> detectedWords;
}
