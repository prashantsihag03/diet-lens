package com.example.dietlens.DTOs;

import com.azure.ai.vision.imageanalysis.models.ImagePoint;
import lombok.Data;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Data
public class BoundingPolygonsByWordsDTO {
  private final Collection<String> detectedWords;
  private final Map<String, List<List<ImagePoint>>> boundingPolygonsByWords;
}
