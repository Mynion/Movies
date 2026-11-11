
package org.mynion.movies.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.mynion.movies.enums.ScoreType;

@Converter
public class ScoreTypeConverter implements AttributeConverter<ScoreType, String> {

    @Override
    public String convertToDatabaseColumn(ScoreType attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public ScoreType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : ScoreType.valueOf(dbData.toUpperCase());
    }
}
