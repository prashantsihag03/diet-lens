package com.example.dietlens.DTOs;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IngredientHealthDataDTO {
    private String ingredient;
    private String health_score;
    private String explanation;
    private List<String> banned_in;
    private boolean preservative;
    private boolean causes_allergic_reaction;
    private boolean causes_digestive_issues;
}
