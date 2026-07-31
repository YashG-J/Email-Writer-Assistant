package com.email.reply.email_ai_reply.exception;

public class EmailGenerationException extends RuntimeException {

    public EmailGenerationException(String message) {
        super(message);
    }

    public EmailGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}
