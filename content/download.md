---
title: Download
tableOfContents: true
showMenuChildren: false
menu:
  main:
    identifier: download
    weight: 3
---

## tinylog {{% stable-version %}}

### Java

tinylog API and implementation for Java and any other JVM language

{{% download-artifact file="tinylog" artifacts="tinylog-api,tinylog-impl" bundles="org.tinylog.api,org.tinylog.impl" version="stable" %}}

### Kotlin

Enhanced logging API for Kotlin with tinylog implementation

{{% download-artifact file="tinylog-kotlin" artifacts="tinylog-api-kotlin,tinylog-impl" bundles="org.tinylog.api.kotlin,org.tinylog.impl" version="stable" %}}

### Scala

Enhanced logging API for Scala with tinylog implementation

{{% download-artifact file="tinylog-scala" artifacts="tinylog-api-scala_2.13,tinylog-impl" bundles="org.tinylog.api.scala_2.13,org.tinylog.impl" version="stable" %}}

## Third-Party Logging APIs

### Apache Commons Logging (JCL)

`jcl-tinylog` is a binding for Apache Commons Logging (JCL). This means that `commons-logging` must also exist in the classpath, but no other binding than `jcl-tinylog`. All log entries will be forwarded from `org.apache.commons.logging.Log` to tinylog and processed by the tinylog implementation.

{{% download-artifact file="jcl-tinylog" artifacts="jcl-tinylog" bundles="org.tinylog.api.jcl" version="stable" %}}

### Apache Log4j 1.2

`log4j1.2-api` provides the logging API of Apache Log4j 1.2 for tinylog 2 and should be used instead of the legacy log4j artifact. Thus, classes that use Apache Log4j 1.2 for logging can be used together with tinylog 2.

{{% download-artifact file="log4j1.2-api" artifacts="log4j1.2-api" bundles="org.tinylog.api.log4j12" version="stable" %}}

### Java System Logger

`jsl-tinylog` is a binding for `java.lang.System.Logger` and has just to be added to the classpath. Then, all log entries logged via `java.lang.System.Logger` will be processed by the tinylog implementation.

{{% download-artifact file="jsl-tinylog" artifacts="jsl-tinylog" bundles="org.tinylog.api.jsl" version="stable" %}}

### Java Util Logging (JUL)

`jul-tinylog` is a bridge for `java.util.logging.Logger`. Before issuing any log entries via `java.util.logging.Logger`, it has to be activated by calling `org.tinylog.jul.JulTinylogBridge.activate()` at the startup of the application. All log entries will be forwarded from `java.util.logging.Logger` to tinylog and processed by the tinylog implementation.

{{% download-artifact file="jul-tinylog" artifacts="jul-tinylog" bundles="org.tinylog.api.jul" version="stable" %}}

### JBoss Logging 3

`jboss-tinylog` is a binding for JBoss Logging 3. This means that `jboss-logging` must also exist in the classpath, but no other binding than `jboss-tinylog`. All log entries will be forwarded from `org.jboss.logging.Logger` to tinylog and processed by the tinylog implementation. MDC and tinylog’s thread context will share their data.

{{% download-artifact file="jboss-tinylog" artifacts="jboss-tinylog" bundles="org.tinylog.api.jboss" version="stable" %}}

### SLF4J 1.6 – 2.0

`slf4j-tinylog` is a binding for SLF4J, which supports all versions from 1.6 up to 2.0. This means that `slf4j-api` must also exist in the classpath, but no other binding than `slf4j-tinylog`. All log entries will be forwarded from `org.slf4j.Logger` to tinylog and processed by the tinylog implementation. Markers are mapped to tinylog’s tags. MDC and tinylog’s thread context share their data.

{{% download-artifact file="slf4j-tinylog" artifacts="slf4j-tinylog" bundles="org.tinylog.api.slf4j" version="stable" %}}

### tinylog 1.3

`tinylog1.3-api` provides the logging API of tinylog 1.3 for tinylog 2 and should be used instead of the old tinylog 1.3 artifact. Thus, classes that still use tinylog 1.3 for logging can be used together with tinylog 2.

{{% download-artifact file="tinylog1.3-api" artifacts="tinylog1.3-api" bundles="org.tinylog.api.tinylog13" version="stable" %}}

## Web and Application Servers

tinylog can be used on web and application servers like all other popular logging APIs. For outputting log entries by the logging back-end of a server, one of the adapters below can be used instead of `tinylog-impl`. If log entries should be output by tinylog as well as by the logging back-end of a server, the adapters can be also used together with `tinylog-impl` in parallel.

### Java Util Logging Based Servers

`tinylog-jul` is an adapter implementation for all web and application servers that use `java.util.logging` (JUL) as logging back-end. This includes Tomcat and Glassfish for example. It is also possible to use this adapter for Spring Boot applications, but `tinylog-jboss` is recommended in this case.

{{% download-artifact file="tinylog-jboss" artifacts="tinylog-jboss" bundles="org.tinylog.adapter.jul" version="stable" %}}

### JBoss Logging Based Servers

`tinylog-jboss` is an adapter implementation for all web and application servers that use JBoss Logging as logging back-end. This includes Wildfly and JBoss EAP for example. Furthermore, this adapter can be used for Spring Boot applications.

{{% download-artifact file="tinylog-jul" artifacts="tinylog-jul" bundles="org.tinylog.adapter.jboss" version="stable" %}}
