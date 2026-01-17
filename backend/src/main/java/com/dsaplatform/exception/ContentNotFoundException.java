package com.dsaplatform.exception;

/**
 * Exception thrown when requested content (lesson, chapter, etc.) is not found.
 * 
 * Requirements: 6.3, 8.1
 */
public class ContentNotFoundException extends ChatException {
    
    private final String resourceType;
    private final Long resourceId;
    
    public ContentNotFoundException(String resourceType, Long resourceId) {
        super(String.format("%s not found with id: %d", resourceType, resourceId));
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
    
    public ContentNotFoundException(String message) {
        super(message);
        this.resourceType = null;
        this.resourceId = null;
    }
    
    public String getResourceType() {
        return resourceType;
    }
    
    public Long getResourceId() {
        return resourceId;
    }
}
