package com.dsaplatform.service;

import com.dsaplatform.dto.response.CodeExecutionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.tools.*;
import java.io.*;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.concurrent.*;

@Service
@Slf4j
public class CodeExecutionService {
    
    private static final long TIMEOUT_SECONDS = 5;
    private static final String TEMP_DIR = System.getProperty("java.io.tmpdir") + "/dsa-code-execution/";
    
    public CodeExecutionResponse executeJavaCode(String code) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Create temp directory
            Path tempDir = Paths.get(TEMP_DIR);
            if (!Files.exists(tempDir)) {
                Files.createDirectories(tempDir);
            }
            
            // Extract class name from code
            String className = extractClassName(code);
            if (className == null) {
                throw new RuntimeException("Could not find public class in code");
            }
            
            // Create unique directory for this execution
            String executionId = String.valueOf(System.currentTimeMillis());
            Path executionDir = tempDir.resolve(executionId);
            Files.createDirectories(executionDir);
            
            // Write code to file
            Path sourceFile = executionDir.resolve(className + ".java");
            Files.writeString(sourceFile, code);
            
            // Compile the code
            String compileError = compileCode(sourceFile);
            if (compileError != null) {
                cleanup(executionDir);
                return CodeExecutionResponse.builder()
                        .output("")
                        .error("Compilation Error:\n" + compileError)
                        .executionTime(System.currentTimeMillis() - startTime)
                        .build();
            }
            
            // Execute the code
            String output = executeCode(executionDir, className);
            
            // Cleanup
            cleanup(executionDir);
            
            return CodeExecutionResponse.builder()
                    .output(output)
                    .error(null)
                    .executionTime(System.currentTimeMillis() - startTime)
                    .build();
                    
        } catch (Exception e) {
            log.error("Error executing code", e);
            return CodeExecutionResponse.builder()
                    .output("")
                    .error("Execution Error: " + e.getMessage())
                    .executionTime(System.currentTimeMillis() - startTime)
                    .build();
        }
    }
    
    private String extractClassName(String code) {
        // Look for public class declaration
        String[] lines = code.split("\n");
        for (String line : lines) {
            line = line.trim();
            if (line.startsWith("public class ")) {
                String[] parts = line.split("\\s+");
                if (parts.length >= 3) {
                    return parts[2].replace("{", "").trim();
                }
            }
        }
        return null;
    }
    
    private String compileCode(Path sourceFile) {
        try {
            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
            if (compiler == null) {
                return "Java compiler not available. Make sure you're running with JDK, not JRE.";
            }
            
            StringWriter errorWriter = new StringWriter();
            StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, null);
            
            Iterable<? extends JavaFileObject> compilationUnits = 
                    fileManager.getJavaFileObjectsFromFiles(Arrays.asList(sourceFile.toFile()));
            
            JavaCompiler.CompilationTask task = compiler.getTask(
                    errorWriter,
                    fileManager,
                    null,
                    null,
                    null,
                    compilationUnits
            );
            
            boolean success = task.call();
            fileManager.close();
            
            if (!success) {
                return errorWriter.toString();
            }
            
            return null;
        } catch (Exception e) {
            return "Compilation failed: " + e.getMessage();
        }
    }
    
    private String executeCode(Path executionDir, String className) throws Exception {
        ProcessBuilder processBuilder = new ProcessBuilder(
                "java",
                "-cp",
                executionDir.toString(),
                className
        );
        
        processBuilder.directory(executionDir.toFile());
        processBuilder.redirectErrorStream(true);
        
        Process process = processBuilder.start();
        
        // Read output with timeout
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<String> outputFuture = executor.submit(() -> {
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            return output.toString();
        });
        
        try {
            // Wait for process with timeout
            boolean finished = process.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            
            if (!finished) {
                process.destroyForcibly();
                executor.shutdownNow();
                return "Execution timed out after " + TIMEOUT_SECONDS + " seconds";
            }
            
            String output = outputFuture.get(1, TimeUnit.SECONDS);
            executor.shutdown();
            
            if (process.exitValue() != 0) {
                return "Runtime Error:\n" + output;
            }
            
            return output.isEmpty() ? "Program executed successfully with no output" : output;
            
        } catch (TimeoutException e) {
            process.destroyForcibly();
            executor.shutdownNow();
            return "Execution timed out";
        } catch (Exception e) {
            executor.shutdownNow();
            throw e;
        }
    }
    
    private void cleanup(Path directory) {
        try {
            if (Files.exists(directory)) {
                Files.walk(directory)
                        .sorted((a, b) -> -a.compareTo(b))
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                log.warn("Failed to delete: " + path, e);
                            }
                        });
            }
        } catch (Exception e) {
            log.warn("Failed to cleanup directory: " + directory, e);
        }
    }
}
