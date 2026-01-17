package com.dsaplatform;

import com.dsaplatform.config.OpenAIProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableCaching
@EnableJpaAuditing
@EnableConfigurationProperties(OpenAIProperties.class)
public class DsaLearningPlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(DsaLearningPlatformApplication.class, args);
    }
}







