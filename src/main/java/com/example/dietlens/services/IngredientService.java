package com.example.dietlens.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import java.util.Objects;
import java.util.function.Function;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import com.example.dietlens.Exceptions.AiResponseFailureException;
import com.example.dietlens.Exceptions.UnsupportedMediaFileException;
import com.fasterxml.jackson.core.JsonParseException;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.dietlens.DTOs.IngredientExplanationResultDTO;
import com.example.dietlens.DTOs.IngredientHealthDataDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.TextContent;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.data.message.ImageContent.DetailLevel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiChatModelName;

@Service
public class IngredientService {

  private final Logger LOGGER = Logger.getLogger(IngredientService.class.toString());

  private final ResourceLoader resourceLoader;

  private final ChatLanguageModel openAiModel;

  private final String prompt;

  private final List<String> supportedImageFormat = Arrays.asList("jpg", "jpeg", "png");

  private final List<Class<? extends Throwable>> retryableExceptions = Arrays.asList(JsonParseException.class, IOException.class);

  public IngredientService(Environment environment, ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader;
    prompt = this.getPrompt();

    openAiModel = OpenAiChatModel.builder()
        .apiKey(environment.getRequiredProperty("openai.api.key", String.class))
        .modelName(OpenAiChatModelName.GPT_4_O)
        .build();
  }

  public String getPrompt() {
    Resource resource = resourceLoader.getResource("classpath:prompt.txt");
    StringBuilder content = new StringBuilder();

    try (InputStream inputStream = resource.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {

      String line;
      while ((line = reader.readLine()) != null) {
        content.append(line).append(System.lineSeparator());
      }
    } catch (Exception e) {
      LOGGER.severe("Couldn't get prompt from prompt file for ingredient analysis:" + e);
    }

    return content.toString();
  }

  public List<IngredientHealthDataDTO> getIngredientHealthData(MultipartFile image) throws AiResponseFailureException {
    int retryAttempt = 1;
    boolean retry = true;

    while (retry) {
      try {
        UserMessage userMessage = UserMessage.from(
            TextContent.from(prompt),
            ImageContent.from(
                Base64.getEncoder().encodeToString(image.getBytes()),
                MimeTypeUtils.parseMimeType(
                        Objects.requireNonNull(image.getContentType()))
                    .toString(),
                DetailLevel.AUTO));

        String result = openAiModel.generate(userMessage).content().text();
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(result,
            new TypeReference<List<IngredientHealthDataDTO>>() {});
      } catch (Exception e) {
        if (retryableExceptions.contains(e.getClass()) && retryAttempt < 4) {
          retryAttempt += 1;
        } else {
          retry = false;
        }
      }
    }
    throw new AiResponseFailureException("Failed to identify response from LLM. Please try again!");
  }

  /**
   * Uses OpenAi api to identify health data for ingredients presented in the provided image, and Azure's cognition
   * image analysis api to identify bounding polygons for words from all ingredient names.
   * @param image {@link MultipartFile} to analyse ingredients from.
   * @return {@link IngredientExplanationResultDTO} consisting detected ingredients health data, and bounding polygons
   * of words in detected ingredient's names.
   * @throws AiResponseFailureException when AI fails to generate response.
   * @throws UnsupportedMediaFileException when provided image format is not supported
   */
  public IngredientExplanationResultDTO explainIngredient(MultipartFile image)
      throws AiResponseFailureException, UnsupportedMediaFileException {

    if (!isFileFormatSupported(image)) {
      throw new UnsupportedMediaFileException("Unsupported image format. Image file must be in 'jpg', 'jpeg', or 'png' format.");
    }

    List<IngredientHealthDataDTO> ingredientHealthDataDTOs = getIngredientHealthData(image);

    Map<String, IngredientHealthDataDTO> allIngredients = ingredientHealthDataDTOs.stream()
        .collect(Collectors.toMap(IngredientHealthDataDTO::getIngredient, Function.identity()));

    List<String> uniqueWords = allIngredients.keySet().stream()
        .flatMap(s -> Arrays.stream(s.split("\\s+")))
        .distinct()
        .map(t -> t.trim().toLowerCase())
        .collect(Collectors.toList());

    return IngredientExplanationResultDTO
        .builder()
        .ingredientHealthData(allIngredients)
        .ingredientWordsBoundingPolygons(Collections.emptyMap())
        .uniqueWords(uniqueWords)
        .detectedWords(Collections.emptyList())
        .build();
  }

  public boolean isFileFormatSupported(MultipartFile file) {
    String originalFilename = file.getOriginalFilename();
    if (originalFilename != null) {
      return supportedImageFormat.contains(FilenameUtils.getExtension(originalFilename));
    }
    return false;
  }
}
