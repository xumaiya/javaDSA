package com.dsaplatform.exception;

/**
 * Exception thrown when OpenAI API operations fail.
 * 
 * Requirements: 8.1, 8.2
 */
public class OpenAIException extends ChatException {
    
    public OpenAIException(String message) {
        super(message);
    }
    
    public OpenAIException(String message, Throwable cause) {
        super(message, cause);
    }
}
