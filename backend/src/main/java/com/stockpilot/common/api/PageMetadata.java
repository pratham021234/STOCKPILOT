package com.stockpilot.common.api;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Metadata associated with paginated query results.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Pagination navigation and count details")
public class PageMetadata {

    @Schema(description = "Current zero-based page index", example = "0")
    private int page;

    @Schema(description = "Number of items per page", example = "20")
    private int size;

    @Schema(description = "Total number of items across all pages", example = "142")
    private long totalElements;

    @Schema(description = "Total number of pages", example = "8")
    private int totalPages;

    @Schema(description = "True if another page exists after the current one", example = "true")
    private boolean hasNext;

    @Schema(description = "True if a previous page exists before the current one", example = "false")
    private boolean hasPrevious;
}
