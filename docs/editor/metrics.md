---
see:
  - name: Configuration
    link: /settings/configuration
---

# Metrics

![Metrics](/icons/grafana.svg){.doc-image}

Kloud Workspace ships with a built-in **Prometheus-compatible metrics exporter** that
exposes resource and session telemetry for your running workspace.

The exporter is **disabled by default** and must be explicitly enabled via an environment
variable.

## Enabling Metrics

Set `WS_METRICS_ENABLE` to `true` when launching the container:

```sh{2}
docker run \
  -e WS_METRICS_ENABLE=true \
  ghcr.io/kloudkit/workspace:v0.1.2
```

Once enabled, the exporter serves metrics at `/` on port **9100** *(default)*.

## Configuration

Three environment variables control the metrics exporter:

- <EnvVar group="metrics" name="enable" />
- <EnvVar group="metrics" name="port" />
- <EnvVar group="metrics" name="collectors" />

To expose metrics on a custom port with only CPU and memory collectors:

```sh{2-4}
docker run \
  -e WS_METRICS_ENABLE=true \
  -e WS_METRICS_PORT=9200 \
  -e WS_METRICS_COLLECTORS="container.cpu,container.memory" \
  ghcr.io/kloudkit/workspace:v0.1.2
```

## Collectors

Collectors are organized hierarchically.
Enabling a parent collector *(e.g. `container`)* implicitly enables all its children.

| Collector              | Description                         |
| ---------------------- | ----------------------------------- |
| `workspace`            | All workspace metrics               |
| `workspace.info`       | Workspace build info                |
| `workspace.session`    | Session timestamp and uptime        |
| `workspace.extensions` | Installed extensions count          |
| `container`            | All container metrics               |
| `container.cpu`        | CPU usage metrics                   |
| `container.memory`     | Memory usage metrics                |
| `container.fs`         | Filesystem usage metrics            |
| `container.fd`         | File descriptor metrics             |
| `container.pids`       | Process metrics                     |
| `pressure`             | All pressure metrics *(cgroup v2)*  |
| `pressure.cpu`         | CPU pressure metrics                |
| `pressure.memory`      | Memory pressure metrics             |
| `pressure.io`          | IO pressure metrics                 |
| `network`              | Network metrics                     |
| `sockets`              | Socket metrics                      |
| `io`                   | IO metrics                          |
| `gpu`                  | GPU metrics *(requires nvidia-smi)* |

When unset or `*`, all collectors are enabled *(gpu only when hardware is available)*.

## Exposed Metrics

### Workspace

| Metric                                            | Type  | Description                                        |
| ------------------------------------------------- | ----- | -------------------------------------------------- |
| `workspace_info`                                  | gauge | Build info *(labels: `version`, `vscode_version`)* |
| `workspace_session_initialized_timestamp_seconds` | gauge | Unix timestamp when initialized                    |
| `workspace_session_uptime_seconds`                | gauge | Seconds since initialization                       |
| `workspace_extensions_installed_total`            | gauge | VS Code extensions installed                       |

### Container — CPU

| Metric                                            | Type    | Description                  |
| ------------------------------------------------- | ------- | ---------------------------- |
| `workspace_container_cpu_usage_seconds_total`     | counter | Total CPU time consumed      |
| `workspace_container_cpu_user_seconds_total`      | counter | CPU time in user mode        |
| `workspace_container_cpu_system_seconds_total`    | counter | CPU time in system mode      |
| `workspace_container_cpu_periods_total`           | counter | Total CPU scheduling periods |
| `workspace_container_cpu_throttled_periods_total` | counter | Throttled CPU periods        |
| `workspace_container_cpu_throttled_seconds_total` | counter | Total time throttled         |

### Container — Memory

| Metric                                        | Type    | Description                |
| --------------------------------------------- | ------- | -------------------------- |
| `workspace_container_memory_usage_bytes`      | gauge   | Current memory usage       |
| `workspace_container_memory_limit_bytes`      | gauge   | Memory limit               |
| `workspace_container_memory_rss_bytes`        | gauge   | Resident set size          |
| `workspace_container_memory_cache_bytes`      | gauge   | Page cache memory          |
| `workspace_container_memory_swap_bytes`       | gauge   | Swap usage                 |
| `workspace_container_memory_swap_limit_bytes` | gauge   | Swap limit                 |
| `workspace_container_memory_anon_bytes`       | gauge   | Anonymous memory           |
| `workspace_container_memory_kernel_bytes`     | gauge   | Kernel memory              |
| `workspace_container_memory_slab_bytes`       | gauge   | Slab allocator memory      |
| `workspace_container_memory_oom_total`        | counter | OOM events                 |
| `workspace_container_memory_oom_kill_total`   | counter | OOM kill events            |
| `workspace_container_memory_max_total`        | counter | Times memory limit was hit |

### Container — Filesystem

| Metric                               | Type  | Description                         |
| ------------------------------------ | ----- | ----------------------------------- |
| `workspace_container_fs_usage_bytes` | gauge | Filesystem usage on `/workspace`    |
| `workspace_container_fs_limit_bytes` | gauge | Filesystem capacity on `/workspace` |

### Container — File Descriptors

| Metric                                       | Type  | Description           |
| -------------------------------------------- | ----- | --------------------- |
| `workspace_container_file_descriptors_open`  | gauge | Open file descriptors |
| `workspace_container_file_descriptors_limit` | gauge | File descriptor limit |

### Container — Processes

| Metric                             | Type  | Description                 |
| ---------------------------------- | ----- | --------------------------- |
| `workspace_container_pids_current` | gauge | Current number of processes |
| `workspace_container_pids_limit`   | gauge | Process limit               |

### Pressure — CPU

| Metric                                         | Type    | Description                         |
| ---------------------------------------------- | ------- | ----------------------------------- |
| `workspace_pressure_cpu_waiting_seconds_total` | counter | Total time tasks waited for CPU     |
| `workspace_pressure_cpu_stalled_seconds_total` | counter | Total time all tasks stalled on CPU |

### Pressure — Memory

| Metric                                            | Type    | Description                            |
| ------------------------------------------------- | ------- | -------------------------------------- |
| `workspace_pressure_memory_waiting_seconds_total` | counter | Total time tasks waited for memory     |
| `workspace_pressure_memory_stalled_seconds_total` | counter | Total time all tasks stalled on memory |

### Pressure — IO

| Metric                                        | Type    | Description                         |
| --------------------------------------------- | ------- | ----------------------------------- |
| `workspace_pressure_io_waiting_seconds_total` | counter | Total time tasks waited for I/O     |
| `workspace_pressure_io_stalled_seconds_total` | counter | Total time all tasks stalled on I/O |

::: tip
Pressure metrics require **cgroup v2** and are sourced from the
[PSI (Pressure Stall Information)](https://docs.kernel.org/accounting/psi.html)
subsystem.
:::

### Network

| Metric                                     | Type    | Description               |
| ------------------------------------------ | ------- | ------------------------- |
| `workspace_network_receive_bytes_total`    | counter | Total bytes received      |
| `workspace_network_transmit_bytes_total`   | counter | Total bytes transmitted   |
| `workspace_network_receive_packets_total`  | counter | Total packets received    |
| `workspace_network_transmit_packets_total` | counter | Total packets transmitted |
| `workspace_network_receive_errors_total`   | counter | Total receive errors      |
| `workspace_network_transmit_errors_total`  | counter | Total transmit errors     |

### Sockets

| Metric                              | Type  | Description                 |
| ----------------------------------- | ----- | --------------------------- |
| `workspace_sockets_tcp_established` | gauge | Established TCP connections |
| `workspace_sockets_tcp_listen`      | gauge | Listening TCP sockets       |
| `workspace_sockets_udp`             | gauge | UDP sockets                 |

### IO

| Metric                           | Type    | Description                 |
| -------------------------------- | ------- | --------------------------- |
| `workspace_io_read_bytes_total`  | counter | Total bytes read from disk  |
| `workspace_io_write_bytes_total` | counter | Total bytes written to disk |
| `workspace_io_read_ops_total`    | counter | Total disk read operations  |
| `workspace_io_write_ops_total`   | counter | Total disk write operations |

### GPU

| Metric                              | Type  | Description             |
| ----------------------------------- | ----- | ----------------------- |
| `workspace_gpu_utilization_ratio`   | gauge | GPU utilization *(0–1)* |
| `workspace_gpu_memory_used_bytes`   | gauge | GPU memory used         |
| `workspace_gpu_memory_total_bytes`  | gauge | GPU memory total        |
| `workspace_gpu_temperature_celsius` | gauge | GPU temperature         |
| `workspace_gpu_power_watts`         | gauge | GPU power consumption   |

::: tip

GPU metrics require `nvidia-smi` to be available in the container.

When the GPU collector is enabled but no GPU hardware is detected, these metrics are
silently omitted.

:::

## Scraping and Visualization

::: tip
Prometheus and Grafana are **not bundled** with Kloud Workspace.

The workspace only exposes a `/metrics`-compatible endpoint, scraping, alerting, and
dashboards are managed by your own infrastructure.
:::

Point your Prometheus instance at the workspace metrics port:

```yaml
scrape_configs:
  - job_name: workspace
    static_configs:
      - targets:
        - <workspace-host>:9100
```
