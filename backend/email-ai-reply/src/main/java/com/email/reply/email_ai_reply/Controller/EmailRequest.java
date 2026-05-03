package com.email.reply.email_ai_reply.Controller;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
