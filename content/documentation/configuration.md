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

The default file name for the configuration file is `tinylog.properties`. At startup, tinylog automatically loads the configuration from `tinylog.properties`, if this file is present in the classpath. If a build tool like Maven or Gradle is used, `src/main/resources` is usually the correct folder, where `tinylog.properties` can be placed. Plain IDE projects without build tool usually do not have a dedicated resource directory. In this case, `tinylog.properties` can typically be placed directly in the source directory `src`.

Example of a simple properties file for writing all log entries (with severity level info and higher) to `log.txt`:

```properties
writer.type  = file
writer.file  = log.txt
writer.level = info
```

If separate logging configurations are needed for development or test environments, they can be stored in `tinylog-dev.properties` and `tinylog-test.properties` respectively. On startup, tinylog looks firstly for `tinylog-dev.properties`, then for `tinylog-test.properties`, and afterwards for `tinylog.properties`. Of these three properties files, only the first existing file is loaded. It is best practice to put `tinylog-test.properties` in the test resource folder (usually `src/test/resources`). The development properties file `tinylog-dev.properties` can be put in the main resource folder (usually `src/main/resources`) and excluded in the distribution artifact by any common build tool.

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

The format pattern describes the format for outputting log entries. The default format pattern for the console and file writer is `{date} [{thread}] {level|min-length:5} {class}.{method}(): {message}`. However, the format can be freely configured.

Example:

```properties
writer.type    = console                                 # required
writer.format  = pattern                                 # optional, default: "pattern"
writer.pattern = {level}: {class}.{method}()\t{message}  # optional, default see above
```

Curly brackets can be escaped by using a pair of single quotes. A single quote itself can be output by using doubled single quotes:

```properties
writer.type    = console
writer.pattern = '{' {level} '}' - ''{message}''
```

Example output:

```output
{ INFO } - 'Hello World!'
```

### Placeholders

 Placeholder      | Description
:-----------------|:------------
`{class}`         | The fully-qualified name of the class in which the log entry was issued
`{class-name}`    | The name of the class (without package) in which the log entry was issued
`{context: key}`  | A value from the [thread-based context](logging#context-values) ("key" should be replaced by a real key)
`{date}`          | <p>The date and time, when the log entry was issued</p><p>Optionally, a custom date format pattern like `{date: HH:mm:ss.SSS}` can be provided. If none is provided, `yyyy-MM-dd HH:mm:ss` will be used default date format pattern. The date format pattern is compatible with [DateTimeFormatter]({{% javadoc "java.time.format.DateTimeFormatter" %}}).</p>
`{exception}`     | The logged exception including the stack trace
`{file}`          | The file name of the source file in which the log entry was issued
`{level}`         | <p>The severity level of the log entry</p><p>Possible severity levels: TRACE, DEBUG, INFO, WARN, and ERROR</p>
`{line}`          | The line number of the source file in which the log entry was issued
`{message}`       | The logged message including the exception and stack trace if present
`{message-only}`  | Only the logged message without any possible exception
`{method}`        | The name of the method in which the log entry was issued
`{package}`       | The name of the package in which the log entry was issued
`{process-id}`    | The process ID of the application
`{severity-code}` | The numeric code of the severity level of the log entry ("1" for ERROR ... "5" for TRACE)
`{tag}`           | <p>The tag of the log entry</p><p>By default, nothing is output for untagged log entries. However, a default text can be explicitly configured. For example, `{tag: none}` outputs "none" for untagged log entries.</p>
`{thread}`        | The name of the thread in which the log entry was issued
`{thread-id}`     | The ID of the thread in which the log entry was issued
`{timestamp}`     | <p>The UNIX timestamp, when the log entry was issued</p><p>By default, the timestamp is output in seconds. However, `{timestamp: milliseconds}` outputs the timestamp in milliseconds.</p>
`{uptime}`        | <p>The application's uptime, when the log entry was issued</p><p>The default time format pattern is `HH:mm:ss`. However, it is also possible to define a custom time format pattern, such as `{uptime: d:HH:mm:ss.SSS}`. Supported symbols are "d" for days, "H" for hours, "m" for minutes, "s" for seconds, and "S" for fraction of second. Days are defined as 24 hours, even on days with time change.</p><p>Unlike standard Java, Android does not provide an API for receiving the application's uptime. Instead, tinylog outputs the time difference between the initialization of the logging framework and the current log entry on Android. Therefore, it is recommended to call `Tinylog.startUp()` explicitly as one of the first statements in `onCreate()` in the main activity to ensure correct uptimes on Android.</p>

### Length

The length of placeholders and even whole parts of the format pattern can be explicitly configured to align log entries. It is possible to define a minimum length, a maximum length, and an exact length.

When defining a minimum length, additional spaces are appended to the end until the defined minimum length is reached. If the output value has the same or a greater number of characters than the defined minimum length, no spaces are appended.

Example for minimum length:

```properties
writer.type    = console
writer.pattern = {level|min-length:5}: {message}
```

Output:

```output
TRACE: Hello Trace!
DEBUG: Hello Debug!
INFO : Hello Info!
WARN : Hello Warning!
ERROR: Hello Error!
```

The minimum length (and all other length definitions) can also be defined for placeholders together with plain text. In opposite to the example above, this example avoids outputting any spaces before the colon:

```properties
writer.type    = console
writer.pattern = {{level}:|min-length:6} {message}
```

Output:

```output
TRACE: Hello Trace!
DEBUG: Hello Debug!
INFO:  Hello Info!
WARN:  Hello Warning!
ERROR: Hello Error!
```

When defining a maximum length, the output value will be truncated if it is longer than the defined maximum length. If the maximum length is three or greater, an ellipsis (three dot characters) is placed at the end, so that truncated output can be easily recognized. These three dot characters are included in the maximum length. In other words, the truncated part is the three characters shorter than the defined maximum length for having enough space for the dot characters.

Example for maximum length:

```properties
writer.type    = console
writer.pattern = [{thread|max-length:10}] {message}
```

Output:

```output
[main] Hello Main Thread!
[Worker-...] Hello Worker Thread!
```

It is also possible to define the exact length for the output value. This has the same effect as defining a minimum and maximum length with the same value.

Example for exact length:

```properties
writer.type    = console
writer.pattern = [{thread|length:10}] {message}
```

Output:

```output
[main      ] Hello Main Thread!
[Worker-...] Hello Worker Thread!
```

For packages and fully-qualified class names, tinylog shortens the packages instead of truncating the end of the name. Thus, packages and classes can be easily recognized, even if they are shortened.

Example:

```properties
writer.type    = console
writer.pattern = {class|length:18} <- {class}
```

Output:

```output
c.f.bar.FirstClass <- com.foo.bar.FirstClass
o.baz.SecondClass  <- org.baz.SecondClass
```

### Indentation

The indentation depth of new lines of multiline messages is configurable. If an indentation depth is defined, each line but the first will be indented by the defined number of spaces and each tab at the beginning of a line will be replaced by the defined number of spaces.

Example:

```properties
writer.type    = console
writer.pattern = {level}: {message|indent:4}
```

Log statement:

```java
Logger.info("Multiple lines\nFirst line\n\tLine with tabs\nAnother line");
```

Output:

```output
INFO: Multiple lines
    First line
        Line with tabs
    Another line
```

By default, stack trace elements of exceptions are indented by a tab. The first line with the exception class name and description are not indented. However, the indentation depth defined in the example above works for exceptions in the same way as for multiline text messages.

Log statement:

```java
Logger.error(ex);
```

Output:

```output
ERROR: java.lang.RuntimeException: java.io.FileNotFoundException: file.log
        at Application.run(Application.java:14)
        at Application.main(Application.java:10)
    Caused by: java.io.FileNotFoundException: file.log
        at Application.main(Application.java:9)
```

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

The console and file writer can output log entries as JSON. In general, tinylog outputs [newline-delimited JSON](http://ndjson.org/) (NDJSON), which has the advantage of being streamable. Each log entry is stored as a separate JSON object in a single line. Thus, the first log entries can already be read by external tools while tinylog is still writing more log entries to the same file.

JSON output has to be explicitly configured, because tinylog uses format pattern based output by default. Each JSON field can be individually configured by using any kind of [placeholders](#placeholders) or [format patterns](#format-pattern). It is possible to define complex format patterns with multiple placeholders for JSON fields.

Example:

```properties
writer.type       = console                          # required
writer.format     = ndjson                           # optional, default: "pattern"
writer.fields.lvl = level                            # short for "{level}"
writer.fields.src = {class}.{method}({file}:{line})
writer.fields.msg = message                          # short for "{message}"
```

Output:

```json
{"lvl": "INFO", "src": "com.example.MyClass.foo(MyClass.java:6)", "msg": "Hello World!"}
{"lvl": "DEBUG", "src": "com.example.MyClass.foo(MyClass.java:8)", "msg": "First line\nSecond line"}
```

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
