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

The default file name for the configuration file is `tinylog.properties`. At startup, tinylog automatically loads the configuration from `tinylog.properties`, if this file is present in the classpath. If a build tool like Maven or Gradle is used, `src/main/resources` is usually the correct folder, where `tinylog.properties` can be placed.

Plain IDE projects without build tool usually do not have a dedicated resource directory. Typically, `tinylog.properties` can typically be placed directly in the source directory `src` in this case.

Example of a simple properties file for writing all log entries (with severity level info and higher) to `log.txt`:

```properties
writer.type  = file
writer.file  = log.txt
writer.level = info
```

If separate logging configurations are needed for development or test environments, they can be stored in `tinylog-dev.properties` and `tinylog-test.properties` respectively. On startup, tinylog looks firstly for `tinylog-dev.properties`, then for `tinylog-test.properties`, and afterwards for `tinylog.properties`. Of these three properties files, only the first existing file is loaded.

It is best practice to put `tinylog-test.properties` in the test resource folder (usually `src/test/resources`). The development properties file `tinylog-dev.properties` can be put in the main resource folder (usually `src/main/resources`) and excluded in the distribution artifact by any common build tool.

In case the properties file has a name other than `tinylog.properties`, `tinylog-test.properties`, or `tinylog-dev.properties`, or is stored somewhere else in the classpath or on the file system, the path to the file can be passed via the system property `tinylog.configuration`.

Example:

```text
java -jar -Dtinylog.configuration=/tinylog/configuration.properties application.jar
```

### Configuration API

The configuration API of tinylog can be accessed by calling `Tinylog.getConfigurationBuilder(boolean inherit)`. If the argument `inherit` is set to `true`, the received [ConfigurationBuilder]({{% javadoc "org.tinylog.core.ConfigurationBuilder" %}}) is initialized with the current configuration. Whereas if the argument `inherit` is set to `false`, the received [ConfigurationBuilder]({{% javadoc "org.tinylog.core.ConfigurationBuilder" %}}) is empty.

Via the received configuration builder, configuration parameters can be read and set. Configuration changes have to be made before issuing the first log entry. After issuing the first log entry, the configuration becomes immutable and further configuration changes will throw an `UnsupportedOperationException`.

Example of configuring a [file writer](#file-writer) for writing all log entries (with severity level info and higher) to `log.txt`:

```java
Tinylog.getConfigurationBuilder(true)
    .set("writer.type", "file")
    .set("writer.file", "log.txt")
    .set("writer.level", "info")
    .activate();
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

 Placeholder       | Description
:------------------|:------------
 `{class}`         | The fully-qualified name of the class in which the log entry was issued
 `{class-name}`    | The name of the class (without package) in which the log entry was issued
 `{context: key}`  | A value from the [thread-based context](logging#context-values) ("key" should be replaced by a real key). If the key is omitted, all keys and their values are output.
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
 `{tag}`           | The tag of the log entry
 `{thread}`        | The name of the thread in which the log entry was issued
 `{thread-id}`     | The ID of the thread in which the log entry was issued
 `{timestamp}`     | <p>The UNIX timestamp, when the log entry was issued</p><p>By default, the timestamp is output in seconds. However, `{timestamp: milliseconds}` outputs the timestamp in milliseconds.</p>
 `{uptime}`        | <p>The application’s uptime, when the log entry was issued</p><p>The default time format pattern is `HH:mm:ss`. However, it is also possible to define a custom time format pattern, such as `{uptime: d:HH:mm:ss.SSS}`. Supported symbols are "d" for days, "H" for hours, "m" for minutes, "s" for seconds, and "S" for fraction of second. Days are defined as 24 hours, even on days with time change.</p><p>Unlike standard Java, Android does not provide an API for receiving the application’s uptime. Instead, tinylog outputs the time difference between the initialization of the logging framework and the current log entry on Android. Therefore, it is recommended to call `Tinylog.startUp()` explicitly as one of the first statements in `onCreate()` in the main activity to ensure correct uptimes on Android.</p>

### Default Value

By default, nothing is output if a placeholder has no value. For example, if the `{tag}` placeholder is used, no tag will be output for an untagged log entry. However, it is possible to explicitly configure a default value for placeholders.

Example:

```properties
writer.type    = console
writer.pattern = {tag|default:<none>}: {message}
```

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

The minimum length (and all other length definitions) can also be defined for placeholders together with plain text. In opposite to the above example, this example avoids outputting any spaces before the colon:

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

By default, stack trace elements of exceptions are indented by a tab. The first line with the exception class name and description are not indented. However, the indentation depth defined in the above example works for exceptions in the same way as for multiline text messages.

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

## Logging Backend

If the `tinylog-impl` artifact is in the classpath and there are no other artifacts with tinylog-compatible logging backends, the native tinylog backend will be used for outputting log entries. However, if there are multiple tinylog-compatible logging backends in the classpath, all log entries will be forwarded to all of them. In this case, the native tinylog backend can be explicitly defined as the only active logging backend.

Example:

```properties
backends = tinylog  # optional, default depends on classpath
```

It is also possible to completely disable any kind of logging output by using the NOP logging backend.

Example:

```properties
backends = nop  # optional, default depends on classpath
```

## Severity Levels

### Global

tinylog supports five different severity levels: trace, debug, info, warn, and error, Log entries with severity level "trace" are the least important. Those with severity level "error" are the most important. By default, the severity level "trace" is enabled. This means that log entries with any severity level are output.

It is also possible to set the severity level to one of the five supported severity levels as well as to "off" to disable any kind of logging. For example, if "info" is set as severity level, only log entries with severity level "info" and higher (info, warn, and error) will be output, while all other log entries (trace and debug) will be ignored.

Example:

```properties
level = info  # optional, default: trace
```

### Packages & Classes

If needed, specific severity levels can be set for packages and classes to override the global severity level for them. In the below example, only log entries with severity level "warn" and higher are output by default. However, log entries with severity level "info" (and higher) are output, if issued by a class of the package `com.foo` or a sub package. If issued by the class `com.foo.MyClass`, even log entries with severity level "debug" (and higher) are output.

Example:

```properties
level                 = warn
level@com.foo         = info
level@com.foo.MyClass = debug
```

### Writers {#writers-level}

Severity levels can also be defined directly on writers. Thus, it is possible to have different severity levels for different writers. In the below example, only log entries with severity level "warn" and higher are output by the configured file writer. The console writer is configured to output log entries with severity level "debug" and higher. However, tinylog never passes any debug log entries to this writer as the global severity level is set to "info".

Example:

```properties
level         = info     # optional, default: trace

writer1.type  = file     # required
writer1.level = warn     # optional, default: global severity level
writer1.file  = log.txt  # required

writer2.type  = console  # required
writer2.level = debug    # optional, default: global severity level
```

### Tags

If using [tagged log entries](logging#tags), the severity level can be configured individually for each tag. The concrete tag can be appended to the severity level, separated by an "@" character, if the severity level should only be assigned to the specific tag.

Example:

```properties
level = info@foo, warn@bar
```

There are also three wildcards for more generic tag based configurations. The wildcard "-" is for untagged log entries, the wildcard "+" for all tagged log entries, and the wildcard "&ast;" for both, untagged and tagged log entries. Where the wildcard "&ast;" is optional as for example `level = *@info` is just the same as `level = info`. Such generic severity level configurations can be combined with concrete severity level configurations for specific tags.

For example:

```properties
level = info@-, warn@+, debug@foo
```

The output of internal tinylog log entries can be configured in the same way by using the "tinylog" tag (see [verbose mode](#verbose-mode)).

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

## Time Zone

The configured time zone is used for logging date-based values, outputting the date and time of log entries via the date placeholder, adding dates or time to the log file path, and configuring the time for date-based policies.

By default, tinylog uses the system’s default time zone. However, any time zone supported by Java can be configured.

Example:

```properties
zone = UTC  # optional, default: TimeZone.getDefault()
```

## Verbose Mode

By default, tinylog only outputs its internal log entries if these are warning or errors. Internal log entries are log entries that are issued by the logging framework itself, such as configuration issues. The tag "tinylog" can be used to configure the severity level of internal log entries in the same way as for [all other tags](#tags). However, the tag "tinylog" has always to be configured explicitly and is not covered by wildcards.

When having any configuration issues with tinylog, setting the severity level to "debug" can be helpful to understand what is going on under the hood.

Example:

```properties
level = info, debug@tinylog
```

## Writers

Writers are used to output log entries. By default, if no writers are configured, tinylog outputs all log entries on the JVM to the console and on Android to Logcat. However, a writer can be configured explicitly via the property `writer`.

Example:

```properties
writer.type    = file
writer.level   = info
writer.pattern = {date}: {message}
writer.file    = log.txt
```

It is also possible to have multiple writers. Each writer has to be configured via a unique property that starts with `writer`. These can be meaningful names, such as `writerConsole` or `writerFile`, or simply consecutively numbered names.

Example:

```properties
writer1.type    = console
writer1.level   = debug
writer1.pattern = {level}: {message}

writer2.type    = file
writer2.level   = info
writer2.pattern = {date}: {message}
writer2.file    = log.txt
```

The definition of [format patterns](#format-pattern) and [severity levels](#severity-levels) is optional. If not explicitly set, default values are used.

### Console Writer

The console writer is the default writer of tinylog and outputs log entries to the console. It is possible to configure the [severity level](#severity-levels), the [format pattern](#format-pattern), and the threshold for outputting log entries to the standard output or standard error stream. Instead of format patterns, it is also possible to output [JSON](#json).

By default, warnings and errors are output to the standard error stream ([System.err]({{% javadoc "java.lang.System#err" %}})), and all other severity levels are output to the standard output stream ([System.out]({{% javadoc "java.lang.System#out" %}})). However, the threshold is configurable. For example, setting "threshold" to "trace" will output all log entries to the standard error stream, whereas setting "threshold" to "off" will output all log entries to the standard output stream.

Example:

```properties
writer.type      = console            # required
writer.level     = info               # optional, default: global severity level
writer.format    = pattern            # optional, default: "pattern"
writer.pattern   = {date}: {message}  # optional, default: see format pattern chapter
writer.threshold = off                # optional, default: "warn"
```

### File Writer

The file writer writes log entries to log files. It is possible to configure the [severity level](#severity-levels), the [format pattern](#format-pattern), the path and name to the log file, the charset, and the policies for starting new log files. Instead of format patterns, it is also possible to output [JSON](#json).

Example:

```properties
writer.type     = file               # required
writer.level    = info               # optional, default: global severity level
writer.file     = app.log            # required
writer.charset  = ISO-8859-1         # optional, default: UTF-8
writer.format   = pattern            # optional, default: "pattern"
writer.pattern  = {date}: {message}  # optional, default: see format pattern chapter
writer.policies = startup            # optional, default: <none>
```

#### File Path & Name

The path and name of the log file can contain dynamic path segments that are resolved when starting a new log file.

 Dynamic Path Segment | Description
:---------------------|:------------
 `{count}`            | Consecutive number, starting with "0" for the first log file, "1" for the second log file, and so on
 `{date}`             | <p>Current date and time</p><p>Optionally, a custom date format pattern such as `{date: yyyy-MM-dd}` can be specified. If none is specified, `yyyy-MM-dd_HH-mm-ss` will be used default date format pattern. The date format pattern is compatible with [DateTimeFormatter]({{% javadoc "java.time.format.DateTimeFormatter" %}}).</p>
 `{process-id}`       | Process ID of the application

It is possible to use multiple dynamic path segments for the same log file.

Example:

```properties
writer.type     = file
writer.file     = logs/{date: yyyy-MM}/app-{count}.log
writer.policies = startup
```

#### Policies

By default, tinylog always appends log entries to the same log file. However, it is possible (and recommended) to define policies for regularly starting new log files on defined events.

 Policy        | Description
:--------------|:------------
 `daily`       | <p>Starts a new log file every day</p><p>By default, a new log file is started at midnight. However, the desired time can be defined in 24-hour format, such as: "`daily: 03:00`".</p>
 `monthly`     | <p>Starts a new log file on the first day of each month</p><p>By default, a new log file is started at midnight. However, the desired time can be defined in 24-hour format, such as: "`monthly: 03:00`".</p>
 `size: <max>` | <p>Starts a new log file if the next log entry would exceed the maximum file size for the current log file</p><p>This policy ensures that a log file never exceeds the specified maximum file size. The file size can be set in bytes, KB, MB, or GB, such as: "`size: 32 MB`". Since tinylog never spreads a single log entry over multiple log files, full log files are usually a few bytes smaller than the specified maximum file size.</p>
 `startup`     | Starts a new log file at every application startup
 `weekly`      | <p>Starts a new log file every week</p><p>By default, a new log file is started at midnight on the first day of the week. The first day of the week depends on the [locale](#locale) and is usually a Sunday or Monday. However, the desired weekday can be freely defined, such as: "`weekly: Saturday`". The time with can also be explicitly set, such as: "`weekly: Saturday 03:00`".</p>

It is possible to define multiple policies for the same file writer.

Example:

```properties
writer.type     = file
writer.file     = app.log
writer.policies = startup, size: 32 MB
```

### JDBC Writer

The JDBC writer inserts log entries into a table of an SQL database or a data source. It is possible to configure the [severity level](#severity-levels), the URL, the credentials, the schema, the table, and the fields.

All configured fields must exist as column in the target database table. The value for each field can be individually configured by using any kind of [placeholders](#placeholders) or [format patterns](#format-pattern). It is possible to define complex format patterns with multiple placeholders for fields.

Most placeholders are resolved to a string and expect the corresponding database column to have a textual data type such as VARCHAR or CLOB. Exceptions are `{date}` which expects TIMESTAMP or DATETIME and `{line}`, `{process-id}`, `{severity-code}`, `{thread-id}`, and `{timestamp}` which expect a numeric date type like NUMBER, INT, or BIGINT.

Example for SQL database:

```properties
writer.type             = jdbc                             # required
writer.level            = info                             # optional, default: global severity level
writer.url              = jdbc:mysql://localhost/example   # required
writer.user             = bob                              # usually required by database
writer.password         = secret123                        # usually required by database
writer.schema           = PUBLIC                           # optional, default depends on database
writer.table            = LOGS                             # required
writer.fields.TIMESTAMP = date                             # short for "{date}"
writer.fields.SOURCE    = {class}.{method}({file}:{line})
writer.fields.MESSAGE   = message                          # short for "{message}"
```

Example for data source:

```properties
writer.type             = jdbc                             # required
writer.level            = info                             # optional, default: global severity level
writer.url              = java:comp/env/jdbc/ExampleDS     # required
writer.user             = bob                              # usually not required for data sources
writer.password         = secret123                        # usually not required for data sources
writer.schema           = PUBLIC                           # optional, default depends on database
writer.table            = LOGS                             # required
writer.fields.TIMESTAMP = date                             # short for "{date}"
writer.fields.SOURCE    = {class}.{method}({file}:{line})
writer.fields.MESSAGE   = message                          # short for "{message}"
```

### Logcat Writer

The Logcat writer forwards log entries to Android’s native logging system (known as Logcat). Therefore, this writer is only available on Android. It is possible to configure the [severity level](#severity-levels) and the [format patterns](#format-pattern) for the tag and message.

Example:

```properties
writer.type            = logcat             # required
writer.level           = info               # optional, default: global severity level
writer.tag-pattern     = {class-name}       # optional, default: <none>
writer.message-pattern = {file}: {message}  # optional, default: "{message}"
```
