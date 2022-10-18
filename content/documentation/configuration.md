---
title: Configuration
description: Overview of all configuration parameters
tableOfContents: true
menu:
  main:
    parent: documentation
    weight: 3
---

Typically, tinylog 2 is configured via a properties file. The properties file should be located directly in the resource directory under the name `tinylog.properties`, so that tinylog can find the properties file automatically. In Maven or Gradle projects, the resource directory is usually `src/main/resources`. Plain IDE projects without any build tools usually have no dedicated resource directory. In this case, `tinylog.properties` can be placed directly in the source directory. For example, in plain Eclipse projects the source directory is usually just `src`.

Example of a simple properties file for writing all log entries (with the severity level info and higher) to `log.txt`:

```properties
writer       = file
writer.file  = log.txt
writer.level = info
```

If separate logging configurations for tests and development are preferred, it is possible since tinylog 2.1 to store them in `tinylog-test.properties` and `tinylog-dev.properties` accordingly. tinylog will always prefer `tinylog-dev.properties` over `tinylog-test.properties` and `tinylog-test.properties` over `tinylog.properties`. It is best practice to put `tinylog-test.properties` in the test resource folder (usually `src/test/resources` for Maven and Gradle). The development properties file `tinylog-dev.properties` can be put in the main resource folder (usually `src/main/resources`) and excluded in the distribution artifact by any common build tool.

In case the properties file has a name other than `tinylog.properties`, `tinylog-test.properties`, or `tinylog-dev.properties`, or is stored somewhere else in the classpath or on the file system, the path to the file can be passed via the system property `tinylog.configuration`.

Example:

```text
java -jar -Dtinylog.configuration=/tinylog/configuration.properties application.jar
```

It is also possible to override properties that are set in `tinylog.properties`, or add additional properties via system properties. The property names for system properties are the same as in `tinylog.properties`, but require a "tinylog." prefix.

Example of overriding the severity level:

```text
java -jar -Dtinylog.writer.level=debug application.jar
```

tinylog can also be configured programmatically by using the class `Configuration`. Unlike system properties, `Configuration` does expect all properties without "tinylog." prefix (same as in `tinylog.properties`). Individual properties can be set or overridden via `set(String key, String value)`. A complete configuration can also be passed as a map via `replace(Map<String, String> configuration)`. All properties that have already been set are overwritten. The configuration of tinylog will become immutable as soon as the first log entry is issued. Further configuration changes will be silently ignored in tinylog 2.0 and 2.1. Since version 2.2, an `UnsupportedOperationException` will be thrown instead.

## Automatic Shutdown

By default, tinylog shuts down automatically together with the application. tinylog registers a shutdown hook that closes all writers and releases all resources. If an application also uses [shutdown hooks]({{% javadoc "java.lang.Runtime#addShutdownHook(java.lang.Thread)" %}}) and issues log entries in these shutdown hooks, automatic shutdown has to be disabled, and tinylog must be shut down manually.

Example:

```properties
autoshutdown = false  # optional, default: true
```

```java
Runtime.getRuntime().addShutdownHook(new Thread() {
    @Override
    public void run() {
        ProviderRegistry.getLoggingProvider().shutdown();
    }
});
```

## Environment Variables

The values of properties can contain placeholders for environment variables. These placeholders are automatically resolved at runtime. The format of placeholders for environment variables is `${variable}`.

Example:

```properties
writer      = file
writer.file = ${HOME}/log.txt
```

In case an environment variable is not set, it is possible since tinylog 2.1 to define a default value. The optional default value can be set after the name of the environment variable, separated by a colon.

Example:

```properties
writer      = file
writer.file = ${HOME:/tmp}/log.txt
```

## Escaping

Since tinylog 2.1, it is possible to enable [escaping of curly brackets or entire phrases by single quotes](logging#text-with-arguments). For compatibility reasons, this feature has to be enabled explicitly:

```properties
escaping.enabled = true  # default: false
```

## Exceptions

Since tinylog 2.1, exceptions and other throwables can be filtered and transformed to get a clearer and more readable output. There are four built-in throwable filters, which should cover the most common use cases. However, it is also possible to implement a [custom throwable filter](extending#custom-throwable-filter).

Throwable filters can either be registered globally (property `exception`) or directly on a writer (property `writer.exception`). Multiple throwable filters can be combined, separated by commas.

Example configuration:

```properties
exception        = unpack, strip: jdk.internal

writer           = console
writer.exception = drop cause
```

### Strip Stack Trace Elements

The strip throwable filter can remove defined stack trace elements from a throwable. It is possible to define packages and classes. Multiple definitions can be separated by a pipe `|`. Package definitions also always include all sub packages.

Example configuration:

```properties
exception = strip: jdk.internal
```

Original exception:

```text
java.lang.RuntimeException: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at com.example.Application.query(Application.java:23)
    at com.example.Application.foo(Application.java:16)
    at com.example.Application.main(Application.java:9)
Caused by: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:582)
    at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:185)
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:496)
    at java.base/java.lang.Class.forName0(Native Method)
    at java.base/java.lang.Class.forName(Class.java:292)
    at com.example.Application.connect(Application.java:28)
    at com.example.Application.query(Application.java:21)
    ... 2 more
```

Output:

```text
java.lang.RuntimeException: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at com.example.Application.query(Application.java:23)
    at com.example.Application.foo(Application.java:16)
    at com.example.Application.main(Application.java:9)
Caused by: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:496)
    at java.base/java.lang.Class.forName0(Native Method)
    at java.base/java.lang.Class.forName(Class.java:292)
    at com.example.Application.connect(Application.java:28)
    at com.example.Application.query(Application.java:21)
    ... 2 more
```

### Keep Stack Trace Elements

The keep throwable filter keeps only the defined stack trace elements from a throwable. All other stack trace elements are removed. It is possible to define packages and classes. Multiple definitions can be separated by a pipe `|`. Package definitions always include all sub packages.

Example configuration:

```properties
exception = keep: com.example
```

Original exception:

```text
java.lang.RuntimeException: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at com.example.Application.query(Application.java:23)
    at com.example.Application.foo(Application.java:16)
    at com.example.Application.main(Application.java:9)
Caused by: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:582)
    at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:185)
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:496)
    at java.base/java.lang.Class.forName0(Native Method)
    at java.base/java.lang.Class.forName(Class.java:292)
    at com.example.Application.connect(Application.java:28)
    at com.example.Application.query(Application.java:21)
    ... 2 more
```

Output:

```text
java.lang.RuntimeException: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at com.example.Application.query(Application.java:23)
    at com.example.Application.foo(Application.java:16)
    at com.example.Application.main(Application.java:9)
Caused by: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at com.example.Application.connect(Application.java:28)
    at com.example.Application.query(Application.java:21)
    ... 2 more
```

### Unpack Cause

The unpack throwable filter unpacks exceptions and outputs the cause instead of the original exception. However, if there is no cause throwable, the original exception will be output to prevent exceptions from disappearing. By default, the filter unpacks all types of exceptions. It is possible to unpack only certain exceptions by defining the class names of these exceptions. Multiple class names can be separated by a pipe `|`.

Example configuration:

```properties
exception = unpack: java.lang.RuntimeException
```

Original exception:

```text
java.lang.RuntimeException: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at com.example.Application.query(Application.java:23)
    at com.example.Application.foo(Application.java:16)
    at com.example.Application.main(Application.java:9)
Caused by: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:582)
    at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:185)
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:496)
    at java.base/java.lang.Class.forName0(Native Method)
    at java.base/java.lang.Class.forName(Class.java:292)
    at com.example.Application.connect(Application.java:28)
    at com.example.Application.query(Application.java:21)
    ... 2 more
```

Output:

```text
java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:582)
    at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:185)
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:496)
    at java.base/java.lang.Class.forName0(Native Method)
    at java.base/java.lang.Class.forName(Class.java:292)
    at com.example.Application.connect(Application.java:28)
    at com.example.Application.query(Application.java:21)
    at com.example.Application.foo(Application.java:16)
    at com.example.Application.main(Application.java:9)
```

### Drop Cause

The drop cause throwable filter removes all cause throwables from an exception. By default, the filter removes cause throwables from all types of exceptions. However, it is possible to remove cause throwables only from certain exceptions by defining the class names of these exceptions. Multiple class names can be separated by a pipe `|`.

Example configuration:

```properties
exception = drop cause: java.lang.RuntimeException
```

Original exception:

```text
java.lang.RuntimeException: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at com.example.Application.query(Application.java:23)
    at com.example.Application.foo(Application.java:16)
    at com.example.Application.main(Application.java:9)
Caused by: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:582)
    at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:185)
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:496)
    at java.base/java.lang.Class.forName0(Native Method)
    at java.base/java.lang.Class.forName(Class.java:292)
    at com.example.Application.connect(Application.java:28)
    at com.example.Application.query(Application.java:21)
    ... 2 more
```

Output:

```text
java.lang.RuntimeException: java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
    at com.example.Application.query(Application.java:23)
    at com.example.Application.foo(Application.java:16)
    at com.example.Application.main(Application.java:9)
```

## Format Pattern

A format pattern describes the format for outputting log entries. The default format pattern for the console writer and all file based writers is `{date} [{thread}] {class}.{method}()\n{level}: {message}`.

### Placeholders {#placeholders-format-pattern}

 Placeholder             | Description
:------------------------|:------------
 {closing-curly-bracket} | Closing curly bracket: "}"
 {class}                 | Fully-qualified name of the class in which the log entry was issued
 {class-name}            | Name of the class (without package) in which the log entry was issued
 {context: key}          | Value from [thread-based context](logging#context-values) ("key" should be replaced by a real key)
 {date}                  | Date and time of issuing the log entry. Optionally there can be a custom date format pattern such as `{date: HH:mm:ss.SSS}`. The date format pattern is compatible with [SimpleDateFormat]({{% javadoc "java.text.SimpleDateFormat" %}}) and on Java 9 (or higher), also with [DateTimeFormatter]({{% javadoc "java.time.format.DateTimeFormatter" %}}) that supports milliseconds and nanoseconds. The default date format pattern is "yyyy-MM-dd HH:mm:ss".
 {exception}             | Logged exception including stack trace
 {file}                  | Filename of the source file in which the log entry was issued
 {level}                 | Severity level of the log entry
 {level-code}            | Numeric code of the severity level of the log entry ("1" for error ... "5" for trace)
 {line}                  | Line number of the source file in which the log entry was issued
 {message}               | Logged message including exception and stack trace if present
 {message-only}          | Only logged message without exception and stack trace
 {method}                | Name of the method in which the log entry was issued
 {opening-curly-bracket} | Opening curly bracket: "{"
 {package}               | Package in which the log entry was issued
 {pid}                   | Process ID of the application
 {pipe}                  | Pipe / vertical bar: "\|"
 {tag}                   | [Tag](logging#tags) of log entry. By default, nothing will be output for untagged log entries. However, a default text can be output if explicitly configured, as in {tag: none} for example.
 {thread}                | Name of the thread in which the log entry was issued
 {thread-id}             | ID of the thread in which the log entry was issued
 {timestamp}             | UNIX timestamp of issuing the log entry. By default, the timestamp is output in seconds. `{timestamp: milliseconds}` outputs the timestamp in milliseconds.
 {uptime}                | <p>Application's uptime when the log entry was issued. The default format pattern is "HH:mm:ss". It is also possible to define a custom format pattern such as `{uptime: d:HH:mm:ss.SSS}`. Supported tokens are "d" for days, "H" for hours, "m" for minutes, "s" for seconds, and "S" for fraction of second. Days are defined as 24 hours, even on days with time change.</p><p>Text can be escaped by using single quotes like in `{uptime: H'h'mm}`. The highest defined time unit is never cut off. For example, `48h00` will be output after 48 hours of uptime in the previous example.</p><p>Unlike standard Java, Android does not provide an API to get the application's uptime. Instead, tinylog outputs the time difference between the first and the current log entry on Android. It is therefore recommended to issue a log entry as one of the first statements in `onCreate()` in the main activity. This can even be a trace log entry that is never output due to the actual severity level configuration.</p>

Example:

```properties
writer        = console
writer.format = {level}: {class}.{method}()\t{message}
```

### Size

Optionally, the size of a placeholder or a group of placeholders can be defined. All tinylog versions support the definition of a minimum size. Since tinylog 2.4, it is also possible to define a fixed size or a maximum size.

When defining a minimum size, additional spaces are appended to the end of a placeholder value until the defined minimum size is reached. If the placeholder value has the same or a larger number of characters than the defined minimum size, no spaces are appended. In the example below, the severity level `INFO` would be formatted as `INFO:··` for example.

```properties
writer        = console
writer.format = {{level}:|min-size=8} {message}
```

When defining the maximum size, the first characters of a placeholder value are dropped until the defined maximum size is reached. If the placeholder value has the same or a smaller number of characters than the defined maximum size, no characters are dropped. In the example below, the class name `com.foo.MyClass` will be formatted as `.foo.MyClass` for example.

```properties
writer        = console
writer.format = {class|max-size=12}: {message}
```

The fixed size definition combines the functionality of the minimum and maximum size definitions to ensure that placeholder values have always exactly the same size. This can be useful for formatting placeholders as columns. In the example below, the thread `main` will be formatted as `main··` and the thread `Worker-43` as `ker-43` for example.

```properties
writer        = console
writer.format = {thread|size=6}: {message}
```

### Indentation

The indentation depth of new lines of a multi-line message is configurable. Each line will be indented by the defined number of spaces. Additionally, each tab at the beginning of a line will be replaced by the defined number of spaces.

Example:

```properties
writer        = console
writer.format = {level}: {message|indent=4}
```

```java
Logger.info("Multiple lines\nFirst line\n\tLine with tabs\nAnother line");
```

```text
INFO: Multiple lines
    First line
        Line with tabs
    Another line
```

By default, stack trace elements of an exception are indented by a tab. The exception class name and description are not indented. However, the indentation depth, defined above, works in the same way for exceptions as for multi-line text messages.

```java
Logger.error(exception);
```

```text
ERROR: java.lang.RuntimeException: java.io.FileNotFoundException: file.log
        at Application.run(Application.java:14)
        at Application.main(Application.java:10)
    Caused by: java.io.FileNotFoundException: file.log
        at Application.main(Application.java:9)
```

## JNDI Values

The values of properties can contain placeholders for JNDI values since tinylog 2.5. These placeholders are automatically resolved at runtime. The format of placeholders for JNDI values is `@{value}`, which will resolve the JNDI value from `java:comp/env/value`.

Example:

```properties
writer      = file
writer.file = @{log/path}/log.txt  # resolves path from java:comp/env/log/path
```

In case a JNDI value is not set, it is possible to define a default value. The optional default value can be set after the name of the JNDI value, separated by a colon.

Example:

```properties
writer      = file
writer.file = @{log/path:/tmp}/log.txt  # use /tmp if java:comp/env/log/path doesn't exist
```

## Locale

The locale is primarily used for formatting numbers and dates. If not explicitly set, the default locale of the Java virtual machine is used.

Example:

```properties
locale = en_US
```

## ProGuard

tinylog can be used with ProGuard, but needs three rules. Otherwise, dynamic loading of the logging provider, writers, and policies won't work. Additionally, some warnings can be explicitly disabled by ignoring two classes and two packages. tinylog uses `dalvik.system.VMStack` on Android devices for performance optimizations. The other class and packages would be only loaded on JVMs, but not on Android devices.

```text
-keepnames interface org.tinylog.**
-keepnames class * implements org.tinylog.**
-keepclassmembers class * implements org.tinylog.** { <init>(...); }

-dontwarn dalvik.system.VMStack
-dontwarn java.lang.**
-dontwarn javax.naming.**
-dontwarn sun.reflect.Reflection
```

## Severity Level

tinylog supports five different severity levels: trace, debug, info, warn, and error. Log entries with the severity level `trace` are the least important, and those with `error` the most important. For example, if `info` is set as severity level, only log entries with the severity level `info` and above (info, warn, and error) will be output, while all other log entries (trace and debug) will be ignored. By default, the severity level `trace` is enabled. This means that log entries with any severity level are output. The value `off` disables all kinds of logging.

Example:

```properties
level = info  # optional, default: trace
```

It is also possible to define the maximum logging level for a particular [writer](#writers) to limit the log messages output by that writer. For example, setting `writer1.level=info` and `writer2.level=warn` alongside `level=debug` results in writer1 only logging messages at level info and higher and writer2 logging at warn or higher.

Note that the behavior of `writer.level=xxx` is different to `level=xxx`. However, `writer.level` defines the maximum log level for the writer itself, which cannot be overridden for specific packages or classes, whereas `level` defines the default log level, which can have package or class specific log level overrides.

Example:

```properties
writer1       = console
writer1.level = debug

writer2       = file
writer2.file  = log.txt
writer2.level = info
```

If required, particular severity levels for packages or classes can be set to override the default severity level for them. Severity levels for packages or classes can only be defined globally, but not on a writer.

Example:

```properties
level@org.tinylog = debug
```

## System Properties

The values of properties can contain placeholders for system properties. These placeholders will be resolved at runtime automatically. The format of placeholders for system properties is `#{key}`.

Example:

```properties
writer        = console
writer.format = #{user.name}: {message}
```

In case a system property is not set, it is possible since tinylog 2.1 to define a default value. The optional default value can be set after the name of the system property, separated by a colon.

Example:

```properties
writer        = console
writer.format = #{user.name:anonymous}: {message}
```

## Tags

Writers can be bound to a tag for only outputting log entries with a defined [tag](logging#tags). If a writer is bound to a tag, all untagged log entries (and log entries with other tags) will be ignored by this writer.

Example:

```properties
writer     = console
writer.tag = SYSTEM
```

```java
Logger.tag("SYSTEM").info("Hello World!"); // Output
Logger.info("Hello World!");               // Ignored
```

Since tinylog 2.2, it is possible to bind a writer to more than only one tag. Multiple tags can be assigned as a comma separated list.

Example:

```properties
writer     = console
writer.tag = SYSTEM, BACKEND, FRONTEND
```

A particular severity level can be defined for each tag since tinylog 2.3. For this purpose, the severity level has to be appended to the corresponding tag, separated by an "@" character. For tags without a defined severity level, tinylog uses the general severity level of the writer or the global severity level respectively.

Example:

```properties
writer     = console
writer.tag = SYSTEM@warn, BACKEND, FRONTEND@debug
```

A minus "-" can be used as placeholder for untagged log entries.

Example:

```properties
writer     = console
writer.tag = -
```

```java
Logger.tag("SYSTEM").info("Hello World!"); // Ignored
Logger.info("Hello World!");               // Output
```

## Writers

A writer outputs issued log entries (for example to a log file or to the console). By default, all log entries will be written to the console if no other writer is configured. Out of the box, tinylog contains six different writers. However, it is also possible to implement a [custom writer](extending#custom-writer).

 Writer                                      | Property     | Description
:--------------------------------------------|:-------------|:------------
 [Console Writer](#console-writer)           | console      | Writes log entries to the console
 [File Writer](#file-writer)                 | file         | Writes log entries to a defined file
 [JDBC Writer](#jdbc-writer)                 | jdbc         | Inserts log entries into a SQL database
 [JSON Writer](#json-writer)                 | json         | Writes log entries to a JSON file (available since tinylog 2.4)
 [Logcat Writer](#logcat-writer)             | logcat       | Forwards log entries to Android's native logging system
 [Rolling File Writer](#rolling-file-writer) | rolling file | Like _File Writer_ but uses multiple files by rotating them
 [Shared File Writer](#shared-file-writer)   | shared file  | Like _File Writer_ but supports writing of multiple instances of an application to the same file

Example:

```properties
writer        = console
writer.level  = info
writer.format = {level}: {class}.{method}() {message}
```

Multiple writers can be used in parallel. For example, it is possible to write log entries to the console and to a log file. Each writer must be defined via a unique property that starts with "writer". These can be meaningful names, such as `writerConsole` or `writerFile`, or simply consecutively numbered names.

Example:

```properties
writer1       = console
writer1.level = debug

writer2       = file
writer2.level = info
writer2.file  = log.txt
```

The definition of [format patterns](#format-pattern) and [severity levels](#severity-level) is optional. If not defined, default values will be used.

### Console Writer

The console writer is the default writer of tinylog, and writes log entries to the console. By default, warnings and errors are written to the standard error stream ([System.err]({{% javadoc "java.lang.System#err" %}}), and all other severity levels to the standard output stream ([System.out]({{% javadoc "java.lang.System#out" %}}). The streams are configurable, and it is possible to output all log entries to the same stream, regardless of their severity level.

Example:

```properties
writer        = console
writer.level  = debug              # optional
writer.format = {level}: {message} # optional
writer.stream = err                # "err" or "out", optional
```

Since tinylog 2.3, it is also possible to define the severity level threshold for using the standard error stream. For example, the configuration property `writer.stream=err@INFO` causes all log entries with the severity levels INFO, WARN, and ERROR to be written to the standard error stream and all log entries with the severity levels TRACE and DEBUG to be written to the standard output stream.

### File Writer

The file writer writes log entries to a defined file. The only required property is `writer.file` for the absolute or relative path to a log file. Optionally, the output can be buffered. In this case, new log entries are written to a buffer and output to the log file, together with a delay. This will be significantly faster, especially in connection with activation of the [writing thread](#writing-thread).

By default, an existing log file is overwritten at startup. However, the append mode can be enabled to have an endless log file that is continued at startup.

The file writer uses the standard charset of the Java virtual machine by default. However, it is possible to configure any charset that is supported by the current Java virtual machine. Since Java 7, the charsets US-ASCII, ISO-8859-1, UTF-8, and UTF-16 are guaranteed to be available on every implementation of the Java platform.

Example:

```properties
writer          = file
writer.level    = debug              # optional
writer.format   = {level}: {message} # optional
writer.file     = log.txt            # required, absolute or relative path
writer.charset  = UTF-8              # optional
writer.append   = true               # optional, default: false
writer.buffered = true               # optional, default: false
```

### JDBC Writer

The JDBC writer inserts log entries into a defined table of an SQL database or a Java EE data source. For establishing the connection, the properties `writer.url` for the connection URL, and `writer.table` for the name of the database table, are required. Connection URLs for Java EE data sources and JDBC can be configured in the same way. tinylog will detect (on the basis of the URL), if it is a data source or JDBC. Username and password must not be configured for Java EE data sources in tinylog, as they are usually already defined in the data source itself. In case the table is not in the default schema of the database, the schema can be set via the property `writer.schema` since tinylog 2.5.

The fields of a database table have to be mapped to [format patterns](#format-pattern) like `writer.field.LEVEL = {level}` for example. The property name always starts with `writer.field` and ends with the field name in the database table. In the previous example, the field name would be `LEVEL`. The property value can be a usual format pattern. Complex format patterns with multiple placeholders such as `writer.field.MESSAGE = {class}.{method}() {message}` are supported. If a format pattern contains only one placeholder, the curly brackets are optional. For example, `writer.field.LEVEL = {level}` and `writer.field.LEVEL = level` are identical.

Most placeholders are resolved to a string, and expect a textual SQL type such as VARCHAR or CLOB for the mapped field. Exceptions are `{date}` which expects TIMESTAMP or DATETIME and `{line}`, `{pid}`, and `{thread-id}` which expect a numeric SQL type, such as NUMBER, INT, or BIGINT.

Optionally, inserts can be executed in a batch mode. In this case, new log entries are held in a buffer and are inserted into the table together with a delay. This will be significantly faster, especially in connection with activation of the [writing thread](#writing-thread).

[Prepared statements]({{% javadoc "java.sql.PreparedStatement" %}}) are used to avoid security vulnerability by SQL injections. Automatically reestablishing database connections in case of connection losses is supported, but has to be activated explicitly.

Example for JDBC:

```properties
writer                 = jdbc
writer.level           = debug                               # optional
writer.url             = jdbc:mysql://localhost:3306/example # required
writer.schema          = public                              # optional, default depends on database
writer.table           = LOG_ENTRIES                         # required
writer.user            = jeffrey                             # if required by database
writer.password        = Ya3D_frgTr                          # if required by database
writer.reconnect       = true                                # optional, default: false
writer.batch           = true                                # optional, default: false
writer.field.TIMESTAMP = date                                # short for {date}
writer.field.LEVEL     = level                               # short for {level}
writer.field.MESSAGE   = {class}.{method}() {message}
```

Example for Java EE data source:

```properties
writer                 = jdbc
writer.level           = debug                               # optional
writer.url             = java:comp/env/jdbc/ExampleDS        # required
writer.schema          = public                              # optional, default depends on database
writer.table           = LOG_ENTRIES                         # required
writer.reconnect       = true                                # optional, default: false
writer.batch           = true                                # optional, default: false
writer.field.TIMESTAMP = date                                # short for {date}
writer.field.LEVEL     = level                               # short for {level}
writer.field.MESSAGE   = {class}.{method}() {message}
```

### JSON Writer

The JSON writer writes log entries as JSON to a defined file and is available since tinylog 2.4. The required properties are `writer.file` for the absolute or relative path to a log file and `writer.field.*` for all fields to output. The property name of the fields to be output starts with `writer.field` and ends with the field name for the name-value pair to be output. For example, the name-value pair `writer.field.level = {level}` would be written as `"level": "INFO"` into the JSON file. The property value can be any kind of format pattern. Even complex format patterns with multiple placeholders such as `writer.field.MESSAGE = {class}.{method}() {message}` are supported. If a format pattern contains only one placeholder, the curly brackets are optional. For example, `writer.field.level = {level}` and `writer.field.level = level` are identical.

Two different formats are supported: standard JSON (default) and line-delimited JSON (LDJSON). If using standard JSON, all log entries are stored as a JSON object in a JSON array. If using line-delimited JSON, each log entry is stored as a JSON object in a single line. Whenever possible, it is recommended to use line-delimited JSON for performance reasons.

Optionally, the output can be buffered. In this case, new log entries are written to a buffer and output to the log file, together with a delay. This will be significantly faster, especially in connection with activation of the [writing thread](#writing-thread).

By default, an existing log file is overwritten at startup. However, the append mode can be enabled to have an endless log file that is continued at startup.

The JSON writer uses the standard charset of the Java virtual machine by default. However, it is possible to configure any charset that is supported by the current Java virtual machine. Since Java 7, the charsets US-ASCII, ISO-8859-1, UTF-8, and UTF-16 are guaranteed to be available on every implementation of the Java platform.

Example:

```properties
writer               = json
writer.level         = debug              # optional
writer.file          = log.json           # required, absolute or relative path
writer.format        = LDJSON             # optional, default: JSON
writer.field.level   = level              # short for {level}
writer.field.source  = {class}.{method}()
writer.field.message = message            # short for {message}
writer.charset       = UTF-8              # optional
writer.append        = true               # optional, default: false
writer.buffered      = true               # optional, default: false
```

### Logcat Writer

The logcat writer forwards log entries to Android's native logging system (known as logcat). This writer is only available on Android. By default, tinylog derives the tag name automatically from the class name. The simple class name without package is used and stripped to 23 characters if too long. This is because 23 characters are the maximum supported length for tag names by logcat. The tag name is configurable, and any [format pattern](#format-pattern) can be used.

Example:

```properties
writer         = logcat
writer.level   = trace  # optional
writer.tagname = {tag}  # optional, default: {class-name}
```

### Rolling File Writer

The rolling file writer writes log entries to rolling log files. The log file can be defined as a pattern that will be resolved at runtime. For example, in the file pattern `writer.file = log.{count}.txt`, the placeholder `{count}` is replaced by a consecutive number. The name of the first log file is `log.0.txt`, the second log file is `log.1.txt`, and so on. Besides `{count}` there are `{date}` for the current date and time and `{pid}` for the process ID.

#### Placeholders {#placeholders-rolling-file-writer}

 Placeholder | Description
:------------|:------------
 {count}     | Consecutive number, starting with "0"
 {date}      | Current date and time. Optionally there can be a custom date format pattern such as "{date: HH:mm:ss.SSS}". The date format pattern is compatible with [SimpleDateFormat]({{% javadoc "java.text.SimpleDateFormat" %}}) and on Java 9 (or higher), also with [DateTimeFormatter]({{% javadoc "java.time.format.DateTimeFormatter" %}}) that supports milliseconds and nanoseconds. The default date format pattern is "yyyy-MM-dd_HH-mm-ss".
 {dynamic}   | Dynamic text, available since tinylog 2.5. The actual text can be set in Java by calling the static method `DynamicSegment.setText()`. Setting a new text will trigger a rollover event for the dynamic policy. The initial text can be set as "{dynamic: initial text}".
 {pid}       | Process ID of the application

Multiple placeholders can be combined in a file pattern, for example in `writer.file = /{date:yyyy}/{date:MM}/log-{pid}.{count}`. Here, the log files are created in a directory with the current year in a subdirectory with the current month. The log file name contains the process ID of the application. Log files with the same process ID are numbered consecutively for each process ID, starting with "0".

Since tinylog 2.2, the rolling file writer can create a link that always points to the latest log file. The path and file name of the link can be set via the property `writer.latest`, for example `writer.latest = logs/latest.log`.

When a new log file has to be started, it can be defined via policies. This can happen daily, after a specified file size and/or at startup. Multiple policies can be combined comma-separated with each other. The default is at startup. Out of the box, tinylog contains three different policies. However, it is also possible to implement a [custom policy](extending#custom-policy).

#### Policies

 Policy         | Property  | Description
:---------------|:----------|:------------
 Daily Policy   | daily     | Starts a new log file every day. The time can be defined in 24-hour clock time format, such as: `daily: 03:00`. The default is at midnight (00:00). Since tinylog 2.4, the time zone can be set explicitly (for example `daily: 03:00@UTC`).
 Dynamic Policy| dynamic   | Starts a new log file when calling the static methods `DynamicPolicy.setReset()` or `DynamicSegment.setText()` (available since tinylog 2.5).
 Monthly Policy | monthly   | Starts a new log file on the first day of each month. The time can be defined in 24-hour clock time format, such as: `monthly: 03:00`. The default is at midnight (00:00). This policy is available for tinylog 2.3 and later. Since tinylog 2.4, the time zone can be set explicitly (for example `monthly: 03:00@UTC`).
 Size Policy    | size      | Starts a new log file when the current file exceeds the defined maximum file size. The definition of the file size is mandatory. For example, `size: 10mb` would start a new log file when the current exceeds 10 MB.
 Startup Policy | startup   | Starts a new log file at every startup of the application.

The maximum number of log files that should be kept can be configured via the property `writer.backups`. When the total number of log files exceed the configured number of backups, old log files will be deleted. If nothing has been configured, no log files will be deleted. Since tinylog 2.2, it is possible to compress backup log files by setting `writer.convert = gzip`.

Optionally, the output can be buffered. In this case, new log entries are written to a buffer and output to the log file, together with a delay. This will be significantly faster, especially in connection with activation of the [writing thread](#writing-thread).

The rolling file writer uses the standard charset of the Java virtual machine by default. However, it is possible to configure any charset that is supported by the current Java virtual machine. Since Java 7, the charsets US-ASCII, ISO-8859-1, UTF-8, and UTF-16 are guaranteed to be available on every implementation of the Java platform.

Example:

```properties
writer          = rolling file
writer.level    = debug                 # optional
writer.format   = {level}: {message}    # optional
writer.file     = log_{count}.txt       # required, absolute or relative path with placeholders
writer.latest   = latest.log            # optional link to the latest log file
writer.charset  = UTF-8                 # optional
writer.buffered = true                  # optional, default: false
writer.policies = startup, daily: 03:00 # optional, default: startup
writer.backups  = 100                   # optional
writer.convert  = gzip                  # optional, no compression by default
```

The rolling file writer can also be used if several instances of an application should write to log files on the same machine. In this case, it is strongly recommended to include a process ID placeholder `{pid}` in the file path pattern to avoid any concurrent access to the same log files. The process ID placeholder ensures that each process has its own log file.

### Shared File Writer

The shared file writer writes log entries to a defined file, and allows multiple instances of an application to write to the same log file simultaneously, without overriding each other. The only required property is `writer.file` for the absolute or relative path to the log file.

By default, an already existing log file is overwritten at startup of the first instance of the application. All later instances share the log file with the first instance, without overwriting the file. The append mode can be enabled to have an endless log file that will always be continued, and never overwritten at startup of the first instance.

The shared file writer uses the standard charset of the Java virtual machine by default. However, it is possible to configure any charset that is supported by the current Java virtual machine. Since Java 7, the charsets US-ASCII, ISO-8859-1, UTF-8, and UTF-16 are guaranteed to be available on every implementation of the Java platform.

Example:

```properties
writer         = shared file
writer.level   = debug              # optional
writer.format  = {level}: {message} # optional
writer.file    = log.txt            # required, absolute or relative path
writer.charset = UTF-8              # optional
writer.append  = true               # optional, default: false
```

## Writing Thread

Writers can be executed in a separate thread. The advantage is that the application itself will not be blocked by slow IO operations. The writing thread runs with low priority and shuts down automatically, together with the application.

Example:

```properties
writingthread = true  # optional, default: false
```
