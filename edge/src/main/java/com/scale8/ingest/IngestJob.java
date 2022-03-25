package com.scale8.ingest;

import io.micronaut.scheduling.annotation.Scheduled;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Singleton;

@Singleton
public class IngestJob {

  private static final Logger LOG = LoggerFactory.getLogger(IngestJob.class);
  protected final Ingestor ingestor;

  public IngestJob(Ingestor ingestor) {
    this.ingestor = ingestor;
  }

  @Scheduled(fixedDelay = "1s")
  void exec() throws Exception {
    ingestor.push();
  }
}
