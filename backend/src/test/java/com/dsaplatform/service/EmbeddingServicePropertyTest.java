package com.dsaplatform.service;

import com.dsaplatform.service.EmbeddingService.TextChunk;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Property-based tests for EmbeddingService text chunking.
 * 
 * **Feature: rag-chatbot-backend, Property 2: Text Chunking Produces Valid Chunks**
 * **Validates: Requirements 2.2**
 * 
 * Property: For any text input and valid chunk size/overlap parameters, the chunking 
 * function SHALL produce chunks where each chunk length is at most chunkSize, 
 * consecutive chunks overlap by exactly the overlap amount, and all original text is covered.
 */
class EmbeddingServicePropertyTest {

    private EmbeddingService embeddingService;
    private Random random;

    @BeforeEach
    void setUp() {
        // Create EmbeddingService with minimal dependencies for unit testing
        embeddingService = new EmbeddingService(null, null, null);
        random = new Random(42); // Fixed seed for reproducibility
    }

    /**
     * **Feature: rag-chatbot-backend, Property 2: Text Chunking Produces Valid Chunks**
     * **Validates: Requirements 2.2**
     * 
     * Property: Each chunk length is at most chunkSize.
     */
    @ParameterizedTest
    @CsvSource({
        "100, 20",
        "50, 10",
        "200, 50",
        "500, 100",
        "1000, 200"
    })
    @DisplayName("Property 2.1: Each chunk length is at most chunkSize")
    void chunkLengthNeverExceedsChunkSize(int chunkSize, int overlap) {
        // Generate random texts of various lengths
        for (int textLength : new int[]{50, 100, 500, 1000, 2000, 5000}) {
            String text = generateRandomText(textLength);
            
            List<TextChunk> chunks = embeddingService.chunkText(text, chunkSize, overlap);
            
            assertThat(chunks)
                .as("All chunks for text of length %d with chunkSize=%d", textLength, chunkSize)
                .allSatisfy(chunk -> 
                    assertThat(chunk.getText().length())
                        .as("Chunk %d length", chunk.getIndex())
                        .isLessThanOrEqualTo(chunkSize)
                );
        }
    }

    /**
     * **Feature: rag-chatbot-backend, Property 2: Text Chunking Produces Valid Chunks**
     * **Validates: Requirements 2.2**
     * 
     * Property: Consecutive chunks overlap by exactly the overlap amount (when not at end).
     */
    @ParameterizedTest
    @CsvSource({
        "100, 20",
        "50, 10",
        "200, 50"
    })
    @DisplayName("Property 2.2: Consecutive chunks have correct overlap")
    void consecutiveChunksHaveCorrectOverlap(int chunkSize, int overlap) {
        // Use text long enough to have multiple full chunks
        String text = generateRandomText(chunkSize * 5);
        
        List<TextChunk> chunks = embeddingService.chunkText(text, chunkSize, overlap);
        
        // Check overlap between consecutive chunks (except last which may be shorter)
        for (int i = 0; i < chunks.size() - 1; i++) {
            TextChunk current = chunks.get(i);
            TextChunk next = chunks.get(i + 1);
            
            // If current chunk is full size, verify overlap
            if (current.getText().length() == chunkSize) {
                String currentSuffix = current.getText().substring(chunkSize - overlap);
                String nextPrefix = next.getText().substring(0, Math.min(overlap, next.getText().length()));
                
                assertThat(currentSuffix)
                    .as("Overlap between chunk %d and %d", i, i + 1)
                    .isEqualTo(nextPrefix);
            }
        }
    }

    /**
     * **Feature: rag-chatbot-backend, Property 2: Text Chunking Produces Valid Chunks**
     * **Validates: Requirements 2.2**
     * 
     * Property: All original text is covered by the chunks.
     */
    @ParameterizedTest
    @CsvSource({
        "100, 20",
        "50, 10",
        "200, 50",
        "500, 100"
    })
    @DisplayName("Property 2.3: All original text is covered by chunks")
    void allOriginalTextIsCovered(int chunkSize, int overlap) {
        for (int textLength : new int[]{50, 100, 500, 1000, 2000}) {
            String text = generateRandomText(textLength);
            
            List<TextChunk> chunks = embeddingService.chunkText(text, chunkSize, overlap);
            
            // Reconstruct text from chunks (accounting for overlap)
            StringBuilder reconstructed = new StringBuilder();
            int step = chunkSize - overlap;
            
            for (int i = 0; i < chunks.size(); i++) {
                TextChunk chunk = chunks.get(i);
                if (i == 0) {
                    reconstructed.append(chunk.getText());
                } else {
                    // Append only the non-overlapping part
                    int startIndex = Math.min(overlap, chunk.getText().length());
                    if (startIndex < chunk.getText().length()) {
                        reconstructed.append(chunk.getText().substring(startIndex));
                    }
                }
            }
            
            // The reconstructed text should match the original
            assertThat(reconstructed.toString())
                .as("Reconstructed text for length %d", textLength)
                .isEqualTo(text);
        }
    }

    /**
     * **Feature: rag-chatbot-backend, Property 2: Text Chunking Produces Valid Chunks**
     * **Validates: Requirements 2.2**
     * 
     * Property: Chunk indices are sequential starting from 0.
     */
    @ParameterizedTest
    @ValueSource(ints = {100, 500, 1000, 2000, 5000})
    @DisplayName("Property 2.4: Chunk indices are sequential")
    void chunkIndicesAreSequential(int textLength) {
        String text = generateRandomText(textLength);
        int chunkSize = 100;
        int overlap = 20;
        
        List<TextChunk> chunks = embeddingService.chunkText(text, chunkSize, overlap);
        
        for (int i = 0; i < chunks.size(); i++) {
            assertThat(chunks.get(i).getIndex())
                .as("Chunk at position %d should have index %d", i, i)
                .isEqualTo(i);
        }
    }

    /**
     * **Feature: rag-chatbot-backend, Property 2: Text Chunking Produces Valid Chunks**
     * **Validates: Requirements 2.2**
     * 
     * Property: Empty or null text returns empty list.
     */
    @Test
    @DisplayName("Property 2.5: Empty/null text returns empty list")
    void emptyOrNullTextReturnsEmptyList() {
        assertThat(embeddingService.chunkText(null, 100, 20)).isEmpty();
        assertThat(embeddingService.chunkText("", 100, 20)).isEmpty();
    }

    /**
     * **Feature: rag-chatbot-backend, Property 2: Text Chunking Produces Valid Chunks**
     * **Validates: Requirements 2.2**
     * 
     * Property: Short text (less than chunkSize) returns single chunk.
     */
    @ParameterizedTest
    @CsvSource({
        "50, 100, 20",
        "10, 50, 10",
        "99, 100, 20"
    })
    @DisplayName("Property 2.6: Short text returns single chunk")
    void shortTextReturnsSingleChunk(int textLength, int chunkSize, int overlap) {
        String text = generateRandomText(textLength);
        
        List<TextChunk> chunks = embeddingService.chunkText(text, chunkSize, overlap);
        
        assertThat(chunks).hasSize(1);
        assertThat(chunks.get(0).getText()).isEqualTo(text);
        assertThat(chunks.get(0).getIndex()).isEqualTo(0);
    }

    /**
     * **Feature: rag-chatbot-backend, Property 2: Text Chunking Produces Valid Chunks**
     * **Validates: Requirements 2.2**
     * 
     * Property: Invalid parameters throw appropriate exceptions.
     */
    @Test
    @DisplayName("Property 2.7: Invalid parameters throw exceptions")
    void invalidParametersThrowExceptions() {
        String text = "Some text";
        
        // Chunk size must be positive
        assertThatThrownBy(() -> embeddingService.chunkText(text, 0, 10))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Chunk size must be positive");
        
        assertThatThrownBy(() -> embeddingService.chunkText(text, -1, 10))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Chunk size must be positive");
        
        // Overlap cannot be negative
        assertThatThrownBy(() -> embeddingService.chunkText(text, 100, -1))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Overlap cannot be negative");
        
        // Overlap must be less than chunk size
        assertThatThrownBy(() -> embeddingService.chunkText(text, 100, 100))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Overlap must be less than chunk size");
        
        assertThatThrownBy(() -> embeddingService.chunkText(text, 100, 150))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Overlap must be less than chunk size");
    }

    /**
     * **Feature: rag-chatbot-backend, Property 2: Text Chunking Produces Valid Chunks**
     * **Validates: Requirements 2.2**
     * 
     * Property: Number of chunks is predictable based on text length and parameters.
     */
    @ParameterizedTest
    @CsvSource({
        "1000, 100, 20",
        "500, 50, 10",
        "2000, 200, 50"
    })
    @DisplayName("Property 2.8: Number of chunks is predictable")
    void numberOfChunksIsPredictable(int textLength, int chunkSize, int overlap) {
        String text = generateRandomText(textLength);
        
        List<TextChunk> chunks = embeddingService.chunkText(text, chunkSize, overlap);
        
        // Calculate expected number of chunks
        int step = chunkSize - overlap;
        int expectedChunks = (int) Math.ceil((double) (textLength - overlap) / step);
        if (textLength <= chunkSize) {
            expectedChunks = 1;
        }
        
        assertThat(chunks.size())
            .as("Number of chunks for text length %d", textLength)
            .isEqualTo(expectedChunks);
    }

    /**
     * Generates random text of specified length for testing.
     */
    private String generateRandomText(int length) {
        StringBuilder sb = new StringBuilder(length);
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
