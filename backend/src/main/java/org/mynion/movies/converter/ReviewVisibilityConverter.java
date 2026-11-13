package org.mynion.movies.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.mynion.movies.enums.ReviewVisibility;

@Converter
public class ReviewVisibilityConverter
        implements AttributeConverter<ReviewVisibility, String> {

    @Override
    public String convertToDatabaseColumn(ReviewVisibility visibility) {
        return visibility == null
                ? null
                : visibility.name().toLowerCase(java.util.Locale.ROOT);
    }

    @Override
    public ReviewVisibility convertToEntityAttribute(String value) {
        return value == null
                ? null
                : ReviewVisibility.valueOf(value.toUpperCase(java.util.Locale.ROOT));
    }
}