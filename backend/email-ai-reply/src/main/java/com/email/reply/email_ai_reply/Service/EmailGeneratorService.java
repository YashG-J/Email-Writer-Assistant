package com.email.reply.email_ai_reply.Service;

import com.email.reply.email_ai_reply.Controller.EmailRequest;
import com.email.reply.email_ai_reply.exception.EmailGenerationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;


import java.util.Map;

@Service
public class EmailGeneratorService {

    private static final Logger log = LoggerFactory.getLogger(EmailGeneratorService.class);

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest){
        if (emailRequest == null || emailRequest.getEmailContent() == null
                || emailRequest.getEmailContent().isBlank()) {
            throw new IllegalArgumentException("Email content must not be empty");
        }

        // Build the prompt
        String prompt = buildPrompt(emailRequest);

        // Craft a request
        Map<String , Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts" , new Object[] {
                                Map.of("text",prompt)
                        })
                }
        );

        // Do request and get response
        String response;
        try {
            response = webClient.post()
                    .uri(geminiApiUrl + geminiApiKey)
                    .header("Content-Type" , "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (WebClientResponseException e) {
            log.error("Gemini API returned an error status {}: {}",
                    e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new EmailGenerationException(
                    "The email generation service returned an error: " + e.getStatusCode(), e);
        } catch (Exception e) {
            log.error("Failed to call Gemini API", e);
            throw new EmailGenerationException(
                    "Unable to reach the email generation service", e);
        }

        if (response == null || response.isBlank()) {
            log.error("Gemini API returned an empty response");
            throw new EmailGenerationException("The email generation service returned an empty response");
        }

        // Extract response and Return
        return extractResponseContent(response);

    }

    private String extractResponseContent(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode textNode = rootNode.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");

            if (textNode.isMissingNode() || textNode.isNull()) {
                log.error("Unexpected response structure from Gemini API: {}", response);
                throw new EmailGenerationException(
                        "The email generation service returned an unexpected response");
            }

            return textNode.asString();

        } catch (JacksonException e) {
            log.error("Failed to parse response from Gemini API: {}", response, e);
            throw new EmailGenerationException(
                    "Unable to parse the response from the email generation service", e);
        }
    }


    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email content. Please don't generate a subject line ");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
