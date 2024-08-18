package com.example.dietlens.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

//import com.example.dietlens.DTOs.BoundingPolygonsByWordsDTO;
import com.example.dietlens.Exceptions.AiResponseFailureException;
import com.example.dietlens.Exceptions.UnsupportedMediaFileException;
import org.apache.commons.io.FilenameUtils;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

//import com.azure.ai.vision.imageanalysis.ImageAnalysisClient;
//import com.azure.ai.vision.imageanalysis.ImageAnalysisClientBuilder;
//import com.azure.ai.vision.imageanalysis.models.DetectedTextLine;
//import com.azure.ai.vision.imageanalysis.models.ImageAnalysisOptions;
//import com.azure.ai.vision.imageanalysis.models.ImageAnalysisResult;
//import com.azure.ai.vision.imageanalysis.models.ImagePoint;
//import com.azure.ai.vision.imageanalysis.models.VisualFeatures;
//import com.azure.core.credential.KeyCredential;
//import com.azure.core.util.BinaryData;
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
// import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
// import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
// import software.amazon.awssdk.regions.Region;
import lombok.Getter;

@Service
public class IngredientService {
  private final ResourceLoader resourceLoader;

  // private final BedrockMistralAiChatModel model;
  private final ChatLanguageModel openAiModel;
//  private final ImageAnalysisClient client;

//  private final String AZ_VISION_ENDPOINT;
//  private final String AZ_VISION_KEY;
  private final String OPEN_AI_API_KEY;

  private final String prompt;

  @Getter
  private final List<String> supportedImageFormat = Arrays.asList("jpg", "jpeg", "png");

  public static boolean isValidJSON(String jsonString) {
    try {
      new JSONObject(jsonString);
    } catch (Exception ex) {
      try {
        new JSONArray(jsonString);
      } catch (Exception ex1) {
        return false;
      }
    }
    return true;
  }

  public IngredientService(Environment environment, ResourceLoader resourceLoader) throws IOException {
    this.resourceLoader = resourceLoader;
    prompt = this.getPrompt();
    OPEN_AI_API_KEY = environment.getRequiredProperty("openai.api.key", String.class);
//    AZ_VISION_KEY = environment.getRequiredProperty("azure.vision.api.key",
//        String.class);
//    AZ_VISION_ENDPOINT = environment.getRequiredProperty("azure.vision.api.endpoint", String.class);

    // AwsCredentialsProvider awsCredentials =
    // EnvironmentVariableCredentialsProvider.create();

    // model = BedrockMistralAiChatModel
    // .builder()
    // .credentialsProvider(awsCredentials)
    // .model(BedrockMistralAiChatModel.Types.Mistral7bInstructV0_2.getValue())
    // .region(Region.AP_SOUTHEAST_2)
    // .build();

    openAiModel = OpenAiChatModel.builder()
        .apiKey(OPEN_AI_API_KEY)
        .modelName(OpenAiChatModelName.GPT_4_O)
        .build();

    // Create a synchronous Image Analysis client.
//    client = new ImageAnalysisClientBuilder()
//        .endpoint(
//            AZ_VISION_ENDPOINT)
//        .credential(new KeyCredential(
//            AZ_VISION_KEY))
//        .buildClient();

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
      e.printStackTrace();
    }

    return content.toString();
  }

  @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 100))
  public List<IngredientHealthDataDTO> getIngredientHealthData(MultipartFile image) throws AiResponseFailureException, IOException {
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
    List<IngredientHealthDataDTO> ingredientHealthDataDTOs = Collections.emptyList();
    ingredientHealthDataDTOs = objectMapper.readValue(result, new TypeReference<List<IngredientHealthDataDTO>>() {});

    return ingredientHealthDataDTOs;
  }

  /**
   * Uses OpenAi api to identify health data for ingredients presented in the provided image, and Azure's cognition
   * image analysis api to identify bounding polygons for words from all ingredient names.
   * @param image {@link MultipartFile} to analyse ingredients from.
   * @return {@link IngredientExplanationResultDTO} consisting detected ingredients health data, and bounding polygons
   * of words in detected ingredient's names.
   * @throws AiResponseFailureException when AI fails to generate response.
   * @throws IOException when image does not have any bytes in it.
   * @throws UnsupportedMediaFileException when provided image format is not supported
   */
  public IngredientExplanationResultDTO explainIngredient(MultipartFile image)
      throws AiResponseFailureException, IOException, UnsupportedMediaFileException {

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

//    BoundingPolygonsByWordsDTO boundingPolygonsForWords = getBoundingPolygonsForWordsInImage(uniqueWords, image);

    return IngredientExplanationResultDTO
        .builder()
        .ingredientHealthData(allIngredients)
//        .ingredientWordsBoundingPolygons(boundingPolygonsForWords.getBoundingPolygonsByWords())
        .ingredientWordsBoundingPolygons(Collections.emptyMap())
        .uniqueWords(uniqueWords)
//        .detectedWords(boundingPolygonsForWords.getDetectedWords())
        .detectedWords(Collections.emptyList())
        .build();
  }


//  /**
//   * Uses Azure's cognition image analysis tool to analyse provided image and detect words and their bounding polygons
//   * in the image.
//   * @param wordsToFetchBoundingPolygon These are the words for which detected bounding polygons will be returned.
//   * @param image {@link MultipartFile} image to analyse using Azure's cognition image analysis api.
//   * @return Map<String, Object> that includes list of all detected words, and boundingPolygonsByWords.
//   */
//  public BoundingPolygonsByWordsDTO getBoundingPolygonsForWordsInImage(Collection<String> wordsToFetchBoundingPolygon, MultipartFile image) throws IOException {
//    ImageAnalysisResult result1 = client.analyze(
//        BinaryData.fromBytes(
//            image.getBytes()),
//        Collections.singletonList(VisualFeatures.READ),
//        new ImageAnalysisOptions());
//
//    Collection<String> detectedWords = new LinkedList<>();
//    Map<String, List<List<ImagePoint>>> boundingPolygonsByWords = new HashMap<>();
//
//    for (DetectedTextLine line : result1.getRead().getBlocks().get(0).getLines()) {
//      line.getWords().forEach(word -> {
//        detectedWords.add(word.getText().trim().toLowerCase());
//        if (wordsToFetchBoundingPolygon.contains(word.getText().trim().toLowerCase())) {
//          List<List<ImagePoint>> currBoundingPolygons = boundingPolygonsByWords
//              .getOrDefault(word.getText().trim().toLowerCase(),
//                  new ArrayList<>());
//          currBoundingPolygons.add(word.getBoundingPolygon());
//          boundingPolygonsByWords.put(word.getText(), currBoundingPolygons);
//        }
//      });
//    }
//
//    return new BoundingPolygonsByWordsDTO(detectedWords, boundingPolygonsByWords);
//  }

  public boolean isFileFormatSupported(MultipartFile file) {
    String originalFilename = file.getOriginalFilename();
    if (originalFilename != null) {
      return supportedImageFormat.contains(FilenameUtils.getExtension(originalFilename));
    }
    return false;
  }

  @Recover
  public void recover(Throwable t, MultipartFile image) throws AiResponseFailureException {
    throw new AiResponseFailureException("Failed to identify response from LLM. Please try again!");
  }
}
