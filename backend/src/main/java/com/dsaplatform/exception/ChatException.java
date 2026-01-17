package com.dsaplatform.exception;

/**
 * Base exception class for chat-related errors.
 * All chat-specific exceptions should extend this class.
 * 
 * Requirements: 8.1, 8.2
 */
public class ChatException extends RuntimeException {
    
    public ChatException(String message) {
        super(message);
    }
    
    public ChatException(String message, Throwable cause) {
        super(message, cause);
    }
}
