---
title: Second milestone of tinylog 2.0 is out
date: 2018-11-24
---

In the second milestone, tinylog 2 supports the logging API of tinylog 1.3 and first third-party logging APIs. This includes a binding for SLF4J and a bridge for `java.util.logging` aka JUL. The support for all these logging APIs is provided by [separate artifacts](download#third-party-logging-apis) and can be integrated as needed.

tinylog's binding for SLF4J is compatible with the versions 1.6 and 1.7, and has to be in the classpath together with [slf4j-api](http://www.slf4j.org/download.html). All log entries will be forwarded from `org.slf4j.Logger` to tinylog, and processed by the tinylog implementation like other log entries. Markers are mapped to tinylog's tags. MDC and tinylog's thread context share their data.

The bridge for forwarding log entries from `java.util.logging.Logger` to tinylog has to be activated explicitly. JUL doesn't provide any API to do this automatically. tinylog's bridge for JUL can be activated by calling `org.tinylog.jul.JulTinylogBridge.activate()` at the startup of your application, before issuing any log entries via `java.util.logging.Logger`.

To simplify the migration from tinylog 1.3 to tinylog 2, there is a re-implementation of the legacy logging API of tinylog. Thereby, applications can use both versions of tinylog's logging API and all log entries will be handled by tinylog 2. This means that only one configuration is necessary.
