
package org.mynion.movies.dto.list;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.mynion.movies.enums.Visibility;

public record CreateMediaListRequestDto(
        @NotBlank
        @Size(max = 100)
        String name,

        String description,

        Visibility visibility
) {}
