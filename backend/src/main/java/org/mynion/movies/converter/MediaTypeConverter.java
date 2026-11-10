package org.mynion.movies.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.mynion.movies.util.MediaType;

@Converter
public class MediaTypeConverter implements AttributeConverter<MediaType, String> {

    @Override
    public String convertToDatabaseColumn(MediaType attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public MediaType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : MediaType.valueOf(dbData.toUpperCase());
    }
}