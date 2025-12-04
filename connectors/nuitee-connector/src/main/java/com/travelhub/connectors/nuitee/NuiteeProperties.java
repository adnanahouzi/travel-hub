package com.travelhub.connectors.nuitee;

import org.springframework.boot.context.properties.ConfigurationProperties;
import java.time.Duration;

@ConfigurationProperties(prefix = "travelhub.connectors.nuitee")
public class NuiteeProperties {

    /**
     * The base URL of the LiteAPI (e.g., https://api.liteapi.travel/v3.0)
     */
    private String baseUrl;

    /**
     * The base URL for booking operations (e.g., https://book.liteapi.travel/v3.0)
     */
    private String bookingBaseUrl = "https://book.liteapi.travel/v3.0";

    /**
     * The Private API Key for authentication.
     */
    private String apiKey;
    
    /**
     * The Public Key.
     */
    private String publicKey;

    /**
     * Connection timeout.
     */
    private Duration connectTimeout = Duration.ofSeconds(5);

    /**
     * Read timeout.
     */
    private Duration readTimeout = Duration.ofSeconds(10);

    /**
     * Max total connections.
     */
    private int maxTotalConnections = 100;

    /**
     * Max connections per route.
     */
    private int maxConnectionsPerRoute = 20;

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getBookingBaseUrl() {
        return bookingBaseUrl;
    }

    public void setBookingBaseUrl(String bookingBaseUrl) {
        this.bookingBaseUrl = bookingBaseUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public Duration getConnectTimeout() {
        return connectTimeout;
    }

    public void setConnectTimeout(Duration connectTimeout) {
        this.connectTimeout = connectTimeout;
    }

    public Duration getReadTimeout() {
        return readTimeout;
    }

    public void setReadTimeout(Duration readTimeout) {
        this.readTimeout = readTimeout;
    }

    public int getMaxTotalConnections() {
        return maxTotalConnections;
    }

    public void setMaxTotalConnections(int maxTotalConnections) {
        this.maxTotalConnections = maxTotalConnections;
    }

    public int getMaxConnectionsPerRoute() {
        return maxConnectionsPerRoute;
    }

    public void setMaxConnectionsPerRoute(int maxConnectionsPerRoute) {
        this.maxConnectionsPerRoute = maxConnectionsPerRoute;
    }
}
