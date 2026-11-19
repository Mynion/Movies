package org.mynion.movies.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.mynion.movies.enums.Visibility;

@Converter
public class VisibilityConverter
        implements AttributeConverter<Visibility, String> {

    @Override
    public String convertToDatabaseColumn(Visibility visibility) {
        return visibility == null
                ? null
                : visibility.name().toLowerCase(java.util.Locale.ROOT);
    }

    @Override
    public Visibility convertToEntityAttribute(String value) {
        return value == null
                ? null
                : Visibility.valueOf(value.toUpperCase(java.util.Locale.ROOT));
    }
}