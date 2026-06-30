# Monitoring

## Metrics

- Prometheus metrics exposed at `/metrics` on all services
- Default metrics: request count, latency, error rate, resource usage

## Dashboards

- Grafana dashboards available under `deploy/grafana/`
- Key panels: API throughput, generation queue depth, GPU utilization

## Logging

- Structured JSON logs written to stdout
- Docker driver sends to CloudWatch (AWS) or Loki (self-hosted)

## Alerts

| Alert rule             | Threshold          | Severity |
|------------------------|--------------------|----------|
| API error rate         | > 5% for 5 min    | critical |
| Generation queue depth | > 100              | warning  |
| GPU memory usage       | > 90%              | warning  |
| Pod restarts           | > 3 in 10 min     | critical |
