package com.stockpilot.common.api;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

/**
 * Standard envelope for paginated collections in StockPilot.
 *
 * @param <T> Item type
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Paginated list response")
public class PagedResponse<T> {

    @Schema(description = "List of items on current page")
    @Builder.Default
    private List<T> items = Collections.emptyList();

    @Schema(description = "Pagination metadata")
    private PageMetadata pagination;

    public static <T> PagedResponse<T> of(List<T> items, int page, int size, long totalElements) {
        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 0;
        return PagedResponse.<T>builder()
                .items(items != null ? items : Collections.emptyList())
                .pagination(PageMetadata.builder()
                        .page(page)
                        .size(size)
                        .totalElements(totalElements)
                        .totalPages(totalPages)
                        .hasNext(page + 1 < totalPages)
                        .hasPrevious(page > 0)
                        .build())
                .build();
    }
}
