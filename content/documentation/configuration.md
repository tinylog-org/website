---
title: Configuration
description: Overview of all configuration parameters
tableOfContents: true
menu:
  main:
    parent: documentation
    weight: 3
---

## Introduction

tinylog 3 can be configured either via properties files or programmatically via the configuration API. The recommended way for configuring the logging framework is using properties files.

### Properties Files

The default file name for the configuration file is `tinylog.properties`. At startup, tinylog automatically loads the configuration from `tinylog.properties`, if this file is present in the classpath. If you use a build tool like Maven or Gradle, `src/main/resources` is usually the correct folder, where `tinylog.properties` can be placed. Plain IDE projects without build tool usually do not have a dedicated resource directory. In this case, `tinylog.properties` can typically be placed directly in the source directory `src`.

Example of a simple properties file for writing all log entries (with severity level info and higher) to `log.txt`:

```properties
writer.type  = file
writer.file  = log.txt
writer.level = info
```

If you need separate logging configurations for your development or test environments, you can store them in `tinylog-dev.properties` and `tinylog-test.properties` respectively. On startup, tinylog looks firstly for `tinylog-dev.properties`, then for `tinylog-test.properties`, and afterwards for `tinylog.properties`. Of these three properties files, only the first existing file is loaded. It is best practice to put `tinylog-test.properties` in the test resource folder (usually `src/test/resources`). The development properties file `tinylog-dev.properties` can be put in the main resource folder (usually `src/main/resources`) and excluded in the distribution artifact by any common build tool.

In case the properties file has a name other than `tinylog.properties`, `tinylog-test.properties`, or `tinylog-dev.properties`, or is stored somewhere else in the classpath or on the file system, the path to the file can be passed via the system property `tinylog.configuration`.

Example:

```text
java -jar -Dtinylog.configuration=/tinylog/configuration.properties application.jar
```

### Configuration API

The configuration API of tinylog can be accessed by calling `Tinylog.getConfiguration()`. Via the received instance of the class [Configuration]({{% javadoc "org.tinylog.core.Configuration" %}}), configuration parameters can be read and set. Configuration changes have to be made before issuing the first log entry. After issuing the first log entry, the configuration becomes immutable and further configuration changes will throw an `UnsupportedOperationException`.

Example of configuring a [file writer](#file-writer) for writing all log entries (with severity level info and higher) to `log.txt`:

```java
Tinylog.getConfiguration()
    .set("writer.type", "file")
    .set("writer.file", "log.txt")
    .set("writer.level", "info");
```

## Automatic Shutdown

By default, tinylog shuts down automatically together with the application. For this purpose, tinylog registers a shutdown hook that closes all writers and releases all resources. If an application also uses [shutdown hooks]({{% javadoc "java.lang.Runtime#addShutdownHook(java.lang.Thread)" %}}) and wants to issue log entries in these shutdown hooks, automatic shutdown has to be disabled and tinylog must be shut down manually.

Example:

```properties
auto-shutdown = false  # optional, default: true
```

```java
Runtime.getRuntime().addShutdownHook(new Thread() {
    @Override
    public void run() {
        Logger.info("Goodbye"):
        Tinylog.shutDown();
    }
});
```

## Environment Variables

Values of properties can contain placeholders for environment variables. These placeholders are automatically resolved at runtime. The format of placeholders for environment variables is `${variable}`. Whitespace around the variable name is supported.

Example:

```properties
writer.type = file
writer.file = ${ HOME }/log.txt
```

In case an environment variable is not set, it is possible to define a default value. The optional default value can be set after the name of the environment variable, separated by a pipe.

Example:

```properties
writer.type = file
writer.file = ${ HOME | /tmp }/log.txt
```

## Format Pattern

TODO

### Placeholders

TODO

### Length

TODO

### Indentation

TODO

## JNDI Values

Values of properties can contain placeholders for JNDI values. These placeholders are automatically resolved at runtime. The format of placeholders for JNDI values is `${java:comp/env/value}` or just `${value}`. Both notations resolve the JNDI value from `java:comp/env/value`. Whitespace around the value name is supported.

Example:

```properties
writer.type = file
writer.file = @{ log/path }/log.txt  # resolve path from java:comp/env/log/path
```

In case a JNDI value is not set, it is possible to define a default value. The optional default value can be set after the name of the JNDI value, separated by a pipe.

Example:

```properties
writer.type = file
writer.file = @{ log/path | /tmp }/log.txt  # use /tmp if java:comp/env/log/path doesn't exist
```

## JSON

TODO

## Locale

The locale is primarily used for formatting numbers and dates. If it is not explicitly set, the default locale of the JVM is used.

Example:

```properties
locale = en_US  # optional, default: Locale.getDefault()
```

## Severity Levels

TODO

## System Properties

Values of properties can contain placeholders for system properties. These placeholders are automatically resolved at runtime. The format of placeholders for system properties is `#{property}`. Whitespace around the property name is supported.

Example:

```properties
writer.type   = console
writer.format = #{user.name}: {message}
```

In case a system property is not set, it is possible to define a default value. The optional default value can be set after the name of the system property, separated by a pipe.

Example:

```properties
writer.type = file
writer.file = #{ user.name | anonymous }/log.txt
```

## Tags

TODO

## Verbose Mode

TODO

## Writers

TODO

### Console Writer

TODO

### File Writer

TODO

### JDBC Writer

TODO

### Logcat Writer

TODO
