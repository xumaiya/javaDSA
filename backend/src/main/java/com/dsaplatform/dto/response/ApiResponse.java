package com.dsaplatform.dto.response;

public class ApiResponse<T> {
    private T data;
    private String message;
    private Boolean success;
    
    public ApiResponse() {}
    
    public ApiResponse(T data, String message, Boolean success) {
        this.data = data;
        this.message = message;
        this.success = success;
    }
    
    public T getData() { return data; }
    public String getMessage() { return message; }
    public Boolean getSuccess() { return success; }
    
    public void setData(T data) { this.data = data; }
    public void setMessage(String message) { this.message = message; }
    public void setSuccess(Boolean success) { this.success = success; }
    
    public static <T> ApiResponseBuilder<T> builder() { return new ApiResponseBuilder<>(); }
    
    public static class ApiResponseBuilder<T> {
        private T data;
        private String message;
        private Boolean success;
        
        public ApiResponseBuilder<T> data(T data) { this.data = data; return this; }
        public ApiResponseBuilder<T> message(String message) { this.message = message; return this; }
        public ApiResponseBuilder<T> success(Boolean success) { this.success = success; return this; }
        
        public ApiResponse<T> build() { return new ApiResponse<>(data, message, success); }
    }
    
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder().data(data).success(true).build();
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder().data(data).message(message).success(true).build();
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder().message(message).success(false).build();
    }
    
    public static <T> ApiResponse<T> error(String message, T data) {
        return ApiResponse.<T>builder().data(data).message(message).success(false).build();
    }
}
