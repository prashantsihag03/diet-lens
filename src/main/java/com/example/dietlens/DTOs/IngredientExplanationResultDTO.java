package com.example.dietlens.DTOs;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.azure.ai.vision.imageanalysis.models.ImagePoint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IngredientExplanationResultDTO {
    private Map<String, IngredientHealthDataDTO> ingredientHealthData;
    private Map<String, List<List<ImagePoint>>> ingredientWordsBoundingPolygons;
    private Collection<String> uniqueWords;
    private Collection<String> detectedWords;
}
