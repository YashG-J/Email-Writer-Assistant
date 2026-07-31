package com.email.reply.email_ai_reply.Controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EmailRequest {

    @NotBlank
    @Size(max = 10000)
    private String emailContent;

    @Pattern(regexp = "^(|professional|casual|friendly)$")
    private String tone;
}
