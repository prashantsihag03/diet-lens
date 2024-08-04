package com.example.dietlens.configs;

import java.time.Duration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.BandwidthBuilder;
import io.github.bucket4j.Bucket;

@Configuration
public class RateLimitConfig {

    @Bean
    Bucket bucket() {
        Bandwidth limit = BandwidthBuilder.builder().capacity(4).refillGreedy(2, Duration.ofMinutes(1)).build();
        return Bucket.builder().addLimit(limit).build();
    }
}