package com.scale8;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.scale8.backends.storage.StorageInterface;
import com.scale8.config.Payload;
import com.scale8.config.Replacements;
import com.scale8.config.structures.IngestSettings;
import com.scale8.extended.ExtendedRequest;
import com.scale8.ingest.Ingestor;
import io.micronaut.cache.annotation.CacheConfig;
import io.micronaut.cache.annotation.Cacheable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Singleton
@CacheConfig("ingest")
public class IngestEntity {

  private static final Logger LOG = LoggerFactory.getLogger(IngestEntity.class);

  @Inject Env env;

  @Inject StorageInterface storage;

  @Inject Ingestor ingestor;

  @Inject Payload payload;

  @Cacheable()
  protected IngestSettings getConfig(String uri) throws IOException {
    return new Gson().fromJson(storage.get(env.CONFIG_BUCKET, uri), IngestSettings.class);
  }

  public IngestSettings getConfigByHost(String host) throws IOException {
    return this.getConfig("ingest-domain/" + host + ".json");
  }

  public IngestSettings getConfigById(String id) throws IOException {
    String name = id.contains(".") ? id : (env.IS_PROD ? "p" : "d") + id + ".scale8.com";
    return this.getConfig("ingest-domain/" + name + ".json");
  }

  protected void trackUsage(
      ExtendedRequest extendedRequest, JsonObject jsonObject, IngestSettings ingestSettings) {
    if (!ingestSettings.getUsageIngestEnvId().isEmpty() && ingestSettings.getIsAnalyticsEnabled()) {
      // track usage...
      try {
        IngestSettings usageIngestSettings = getConfigById(ingestSettings.getUsageIngestEnvId());
        JsonObject payloadObject = new JsonObject();
        payloadObject.add(
            "bytes",
            new JsonPrimitive(
                new Gson().toJson(jsonObject).getBytes(StandardCharsets.UTF_8).length));

        JsonObject trackingPayload =
            payload.applyDefaultValues(
                payloadObject,
                usageIngestSettings.getSchemaAsMap(),
                new Replacements(extendedRequest, ingestSettings, null));

        List<String> trackingIssues =
            payload.validateSchemaAgainstPayload(trackingPayload, usageIngestSettings.getSchemaAsMap());

        if (trackingIssues.isEmpty()) {
          // go ahead and log this...
          ingestor.add(trackingPayload, usageIngestSettings);
        } else {
          // we don't want to throw, if there is a problem here output to logs as it is our fault.
          trackingIssues.forEach(issue -> LOG.warn("Tracking issue: " + issue));
        }

      } catch (Exception e) {
        LOG.error("Failed to track usage on environment", e);
      }
    }
  }

  protected List<String> offerToIngestor(
      ExtendedRequest extendedRequest, JsonObject jsonObject, IngestSettings ingestSettings) {
    JsonObject data =
        payload.applyDefaultValues(
            jsonObject,
            ingestSettings.getSchemaAsMap(),
            new Replacements(extendedRequest, ingestSettings, null));

    List<String> issues =
        payload.validateSchemaAgainstPayload(data, ingestSettings.getSchemaAsMap());

    if (issues.isEmpty()) {
      ingestor.add(data, ingestSettings);
      trackUsage(extendedRequest, data, ingestSettings);
    }

    return issues;
  }

  public List<String> add(
      ExtendedRequest extendedRequest, IngestSettings ingestSettings, JsonObject jsonObject) {
    return offerToIngestor(extendedRequest, jsonObject, ingestSettings);
  }

  public List<String> add(ExtendedRequest extendedRequest, JsonObject jsonObject)
      throws IOException {
    return offerToIngestor(extendedRequest, jsonObject, getConfigByHost(extendedRequest.getHost()));
  }
}
