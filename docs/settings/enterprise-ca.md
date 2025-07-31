# Enterprise CA *(certificate authority)*

## Overview

![Enterprise CA icon](/icons/enterprise-ca.svg){.doc-image}

Many companies implement a *MITM (Man-in-the-Middle) firewall* as part of a strict and
secure network infrastructure using a self-hosted *CA (certificate authority)*.

A *custom root CA* along with a *MITM firewall*, also known as an interception or
enterprise certificate, is a digital certificate used by network security devices to
intercept `SSL/TLS`-encrypted communication between a user and a server.
During interception, data is decrypted and inspected for security and monitoring purposes.

## Usage

### Mounting Certificate Volume

To add your company's root CA, all you need to do is mount the certificate
*(or certificates)* to `/usr/local/share/ca-certificates/workspace/` path
*(in the container)*:

::: code-group

```sh{2} [Single]
docker run \
  -v /path/on-host/ca.crt:/usr/local/share/ca-certificates/workspace/ca.crt \
  ghcr.io/kloudkit/workspace
```

```sh{2} [Multiple]
docker run \
  -v /folder/on-host:/usr/local/share/ca-certificates/workspace \
  ghcr.io/kloudkit/workspace
```

:::

### Install Certificate from HTTP Endpoint

Alternatively, you can add your company's root CA via an *HTTP* endpoint.
Use the `WS_CA_ADDITIONAL_CERT_ENDPOINTS` environment variable to define one or more
*(space delimited)* endpoints pointing to the desired certificate.

:::warning
If your certificate is hosted on an insecure server you can use the
`WS_CA_ADDITIONAL_CERT_ALLOW_INSECURE` *(set to any value)* environment variable to ignore
security checks.

This may be deemed risky due to the certificate being acquired through an unsecured
process that lacks `SSL/TLS` encryption.

Please make sure that you accept the risk.
:::

::: code-group

```sh{2} [Single]
docker run \
  -e WS_CA_ADDITIONAL_CERT_ENDPOINTS="http://comp.me/shared-ca.pem" \
  ghcr.io/kloudkit/workspace
```

```sh{2} [Multiple]
docker run \
  -e WS_CA_ADDITIONAL_CERT_ENDPOINTS="http://comp.me/share-1.pem http://other.me/ca.pem" \
  ghcr.io/kloudkit/workspace
```

:::

## Generated Configurations

The installed certificates will be detected at startup and bundled along with all other
available certificates *(into `/usr/local/share/ca-certificates/workspace-bundle.crt`)*.

In addition, each `zsh` session will contain program specific environment variables
that require the abovementioned bundles and are set automatically *(system-wide)*:

- `COMPOSER_CAFILE`
- `CURL_CA_BUNDLE`
- `NODE_EXTRA_CA_CERTS`
- `NPM_CONFIG_CAFILE`
- `PIP_CERT`
- `REQUESTS_CA_BUNDLE`
- `SSL_CERT_FILE`
