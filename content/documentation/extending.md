---
title: Extending
description: Development of custom extensions for tinylog
tableOfContents: true
menu:
  main:
    parent: documentation
    weight: 4
---

## Introduction

tinylog is highly extensible. Most of tinylog’s features are based on standard Java services, which are loaded via the [ServiceLoader]({{% javadoc "java.util.ServiceLoader" %}}) mechanism. A good tutorial on how services generally work in Java can be found at [baeldung.com](https://www.baeldung.com/java-spi). A custom feature can be developed for tinylog by implementing the corresponding interface and registering the implementation as a service.

In every chapter, there are links to the service interfaces, which provide detailed implementation documentation in the Javadoc. Additionally, the linked built-in implementations provide a good basis for developing own custom implementations.

## Configuration Loaders

Configuration loaders load the configuration for tinylog. For example, the logging framework has a built-in properties loader, which loads the configuration for tinylog from properties files. However, other file formats can be supported by implementing a custom configuration loader.

tinylog automatically uses the configuration loader with the [highest priority]({{% javadoc "org.tinylog.core.loader.ConfigurationLoader#getPriority()" %}}). A custom configuration loader with a higher priority than `0` is always preferred over the built-in properties loader.

{{% service-info
    interfaces="tinylog-core/org.tinylog.core.loader.ConfigurationLoader"
    baseClasses="tinylog-core/org.tinylog.core.loader.AbstractConfigurationLoader"
    implementations="tinylog-core/org.tinylog.core.loader.PropertiesLoader"
%}}

## Hooks

Hooks can be used for executing custom code when tinylog is starting and/or shutting down. It is possible to register hooks as a standard Java service as well as register them at runtime via [Tinylog.registerHook()]({{% javadoc "org.tinylog.core.Tinylog#registerHook(org.tinylog.core.Hook)" %}}).

{{% service-info
    interfaces="tinylog-core/org.tinylog.core.Hook"
    implementations="tinylog-impl/org.tinylog.impl.backend.LifeCycleHook"
%}}

## Logging APIs

Implementing a custom logging API or custom logger does not require any service interface. Log entries can simply be passed to the logging backend, which can be received by calling [Tinylog.getFramework().getLoggingBackend()]({{% javadoc "org.tinylog.core.Framework#getLoggingBackend()" %}}).

{{% service-info
    implementations="slf4j-tinylog/org.tinylog.slf4j.TinylogLogger,tinylog-api/org.tinylog.Logger,tinylog-api/org.tinylog.TaggedLogger,tinylog-api-kotlin/org.tinylog.kotlin.Logger,tinylog-api-kotlin/org.tinylog.kotlin.TaggedLogger"
%}}

## Logging Backends

Logging backends are responsible for processing log entries, which are issued by the logging API. Custom logging backends can either output log entries directly or act as adapters for other third-party logging backends.

The [name]({{% javadoc "org.tinylog.core.backend.LoggingBackendBuilder#getName()" %}}) of a custom logging backend can be used in the tinylog configuration to explicitly enable it as described on the [configuration page](configuration#logging-backend).

{{% service-info
    interfaces="tinylog-core/org.tinylog.core.backend.LoggingBackendBuilder,tinylog-core/org.tinylog.core.backend.LoggingBackend"
    implementations="tinylog-core/org.tinylog.core.backend.InternalLoggingBackendBuilder,tinylog-core/org.tinylog.core.backend.InternalLoggingBackend,tinylog-core/org.tinylog.core.backend.NopLoggingBackendBuilder,tinylog-core/org.tinylog.core.backend.NopLoggingBackend,tinylog-impl/org.tinylog.impl.backend.NativeLoggingBackendBuilder,tinylog-impl/org.tinylog.impl.backend.NativeLoggingBackend"
%}}

## Output Formats

The [console writer](configuration#console-writer) and the [file writer](configuration#file-writer) support different output formats. For example, tinylog has two built-in output formats: [format patterns](configuration#format-pattern) and [JSON](configuration#json). The [name]({{% javadoc "org.tinylog.impl.format.OutputFormatBuilder#getName()" %}}) of a custom output format can be used to enable it in the configuration for a writer.

Example:

```properties
writer.type   = console
writer.format = my-output-format
```

{{% service-info
    interfaces="tinylog-impl/org.tinylog.impl.format.OutputFormatBuilder,tinylog-impl/org.tinylog.impl.format.OutputFormat"
    implementations="tinylog-impl/org.tinylog.impl.format.json.NewlineDelimitedJsonBuilder,tinylog-impl/org.tinylog.impl.format.json.NewlineDelimitedJson,tinylog-impl/org.tinylog.impl.format.pattern.FormatPatternBuilder,tinylog-impl/org.tinylog.impl.format.pattern.FormatPatternParser"
%}}

## Path Segments

The [file writer](configuration#file-writer) supports dynamic path segments to resolve the path and name of the log file at runtime. For example, tinylog has [built-in path segments](configuration#file-path--name) for sequential numbering, the current date and time, and the process ID. The [name]({{% javadoc "org.tinylog.impl.path.segments.PathSegmentBuilder#getName()" %}}) of a custom path segment can be used enclosed in curly brackets as part of the file path or name. Optionally, path segments can support a configurable value.

Example:

```properties
writer.type = file
writer.file = logs/{my-path-segment}/app-{my-path-segment: 42}.log
```

{{% service-info
    interfaces="tinylog-impl/org.tinylog.impl.path.segments.PathSegmentBuilder,tinylog-impl/org.tinylog.impl.path.segments.PathSegment"
    implementations="tinylog-impl/org.tinylog.impl.path.segments.CountSegmentBuilder,tinylog-impl/org.tinylog.impl.path.segments.CountSegment,tinylog-impl/org.tinylog.impl.path.segments.DateTimeSegmentBuilder,tinylog-impl/org.tinylog.impl.path.segments.DateTimeSegment,tinylog-impl/org.tinylog.impl.path.segments.ProcessIdSegmentBuilder,tinylog-impl/org.tinylog.impl.path.segments.StaticPathSegment"
%}}

## Placeholders

tinylog has many [built-in placeholders](configuration#placeholders) that can be used for [format patterns](configuration#format-pattern). However, it is of course also possible to implement a custom placeholder. The [name]({{% javadoc "org.tinylog.impl.format.pattern.placeholders.PlaceholderBuilder#getName()" %}}) of a custom placeholder can be used enclosed in curly brackets in any format pattern. Optionally, placeholders can support a configurable value.

Example:

```properties
writer.type    = console
writer.pattern = {my-placeholder}/{my-placeholder: 42}: {message}
```

{{% service-info
    interfaces="tinylog-impl/org.tinylog.impl.format.pattern.placeholders.PlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.Placeholder"
    implementations="tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ClassNamePlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ClassNamePlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ClassPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ClassPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ContextPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ContextPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.DatePlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.DatePlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ExceptionPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ExceptionPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.FilePlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.FilePlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.LevelPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.LevelPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.LinePlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.LinePlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.MessageOnlyPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.MessageOnlyPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.MessagePlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.MessagePlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.MethodPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.MethodPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.PackagePlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.PackagePlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ProcessIdPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ProcessIdPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.SeverityCodePlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.SeverityCodePlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.TagPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.TagPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ThreadIdPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ThreadIdPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ThreadPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.ThreadPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.TimestampPlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.TimestampPlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.UptimePlaceholderBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.UptimePlaceholder"
%}}

## Policies

[Policies](configuration#policies) are used by the [file writer](configuration#file-writer) to decide when to start a new log file. The [name]({{% javadoc "org.tinylog.impl.policies.PolicyBuilder#getName()" %}}) of a custom policy can be used to enable it in the configuration for a file writer. Optionally, policies can support a configurable value.

Example:

```properties
writer.type     = file
writer.file     = app.log
writer.policies = my-policy, my-policy: 42
```

{{% service-info
    interfaces="tinylog-impl/org.tinylog.impl.policies.Policy,tinylog-impl/org.tinylog.impl.policies.PolicyBuilder"
    baseClasses="tinylog-impl/org.tinylog.impl.policies.AbstractDatePolicyBuilder,tinylog-impl/org.tinylog.impl.policies.AbstractDatePolicy"
    implementations="tinylog-impl/org.tinylog.impl.policies.DailyPolicyBuilder,tinylog-impl/org.tinylog.impl.policies.DailyPolicy,tinylog-impl/org.tinylog.impl.policies.MonthlyPolicyBuilder,tinylog-impl/org.tinylog.impl.policies.MonthlyPolicy,tinylog-impl/org.tinylog.impl.policies.SizePolicyBuilder,tinylog-impl/org.tinylog.impl.policies.SizePolicy,tinylog-impl/org.tinylog.impl.policies.StartupPolicyBuilder,tinylog-impl/org.tinylog.impl.policies.StartupPolicy,tinylog-impl/org.tinylog.impl.policies.WeeklyPolicyBuilder,tinylog-impl/org.tinylog.impl.policies.WeeklyPolicy"
%}}

## Runtime Flavors

There are already two built-in runtime flavors for standard Java and Android. Both runtime flavors provide the name of the default writer as well as non-standardized implementations for getting the process ID, the current uptime, and the location information of the direct caller.

tinylog automatically uses the [supported]({{% javadoc "org.tinylog.core.runtime.RuntimeBuilder#isSupported()" %}}) runtime flavor with the [highest priority]({{% javadoc "org.tinylog.core.runtime.RuntimeBuilder#getPriority()" %}}). A custom runtime flavor with a higher priority than `0` is always preferred over the built-in runtime flavors as long as its `isSupported()` getter returns `true`.

{{% service-info
    interfaces="tinylog-core/org.tinylog.core.runtime.RuntimeBuilder,tinylog-core/org.tinylog.core.runtime.RuntimeFlavor"
    implementations="tinylog-core/org.tinylog.core.runtime.AndroidRuntimeBuilder,tinylog-core/org.tinylog.core.runtime.AndroidRuntime,tinylog-core/org.tinylog.core.runtime.JavaRuntimeBuilder,tinylog-core/org.tinylog.core.runtime.JavaRuntime"
%}}

## Styles

tinylog has built-in styles such as [default value](configuration#default-value), [length](configuration#length), and [indentation](configuration#indentation) that can be used for styling [placeholders](configuration#placeholders) in [format patterns](configuration#format-pattern). However, it is of course also possible to implement a custom style. The [name]({{% javadoc "org.tinylog.impl.format.pattern.styles.StyleBuilder#getName()" %}}) of a custom style can be used within the curly brackets of a placeholder after a pipe. Optionally, styles can have a configurable value.

Example:

```properties
writer.type    = console
writer.pattern = {level | my-style}: {message | my-style:42}
```

{{% service-info
    interfaces="tinylog-impl/org.tinylog.impl.format.pattern.styles.StyleBuilder,tinylog-impl/org.tinylog.impl.format.pattern.placeholders.Placeholder"
    baseClasses="tinylog-impl/org.tinylog.impl.format.pattern.styles.AbstractStylePlaceholder,tinylog-impl/org.tinylog.impl.format.pattern.styles.AbstractMaxLengthStyle"
    implementations="tinylog-impl/org.tinylog.impl.format.pattern.styles.DefaultValueStyleBuilder,tinylog-impl/org.tinylog.impl.format.pattern.styles.DefaultValueStyle,tinylog-impl/org.tinylog.impl.format.pattern.styles.IndentStyleBuilder,tinylog-impl/org.tinylog.impl.format.pattern.styles.IndentStyle,tinylog-impl/org.tinylog.impl.format.pattern.styles.LengthStyleBuilder,tinylog-impl/org.tinylog.impl.format.pattern.styles.MaxLengthStyleBuilder,tinylog-impl/org.tinylog.impl.format.pattern.styles.MaxTextLengthStyle,tinylog-impl/org.tinylog.impl.format.pattern.styles.MaxClassLengthStyle,tinylog-impl/org.tinylog.impl.format.pattern.styles.MaxPackageLengthStyle,tinylog-impl/org.tinylog.impl.format.pattern.styles.MinLengthStyleBuilder,tinylog-impl/org.tinylog.impl.format.pattern.styles.MinLengthStyle"
%}}

## Value Formats

Value formats are used for formatting values such as dates, times, and numbers within [logging statements](logging#text-with-arguments). The format pattern can be defined within the curly brackets of an argument placeholder.

Example:

```java
Logger.info("Income: {0.00} EUR", 42);
```

Here, the pattern `0.00` and the number `42` are passed to `NumberFormat.format(String, Object)` for formatting the integer.

{{% service-info
    interfaces="tinylog-core/org.tinylog.core.format.value.ValueFormat"
    implementations="tinylog-core/org.tinylog.core.format.value.DateFormat,tinylog-core/org.tinylog.core.format.value.JavaTimeFormat,tinylog-core/org.tinylog.core.format.value.NumberFormat"
%}}

## Variable Resolvers

tinylog supports variable resolvers for dynamically resolving values in the configuration at startup. Placeholders for variable resolvers start with a custom prefix, following by an opening curly bracket, then the variable name, and end with a closing curly bracket. For example, the prefix for the built-in environment variable resolver is `$`. Therefore, the placeholder for the environment variable `HOME` can be defined as `${HOME}`.

{{% service-info
    interfaces="tinylog-core/org.tinylog.core.variable.VariableResolver"
    implementations="tinylog-core/org.tinylog.core.variable.EnvironmentVariableResolver,tinylog-core/org.tinylog.core.variable.JndiValueResolver,tinylog-core/org.tinylog.core.variable.SystemPropertyResolver"
%}}

## Writers

Writers are used to output log entries. The [name]({{% javadoc "org.tinylog.impl.writers.WriterBuilder#getName()" %}}) of a writer can be used to enable it in the configuration. All properties of a writer are passed to its writer builder as part of the [configuration object]({{% javadoc "org.tinylog.core.Configuration" %}}).

Example:

```properties
writer.type = my-writer
writer.foo  = 42
writer.bar  = true
```

Here, the custom writer is initialized with a configuration object containing "`foo = 42`" and "`bar = true`". The property prefix "`writer.`" is truncated.

{{% service-info
    interfaces="tinylog-impl/org.tinylog.impl.writers.WriterBuilder,tinylog-impl/org.tinylog.impl.writers.Writer"
    baseClasses="tinylog-impl/org.tinylog.impl.writers.AbstractFormattableWriterBuilder"
    implementations="tinylog-impl/org.tinylog.impl.writers.console.ConsoleWriterBuilder,tinylog-impl/org.tinylog.impl.writers.console.ConsoleWriter,tinylog-impl/org.tinylog.impl.writers.file.FileWriterBuilder,tinylog-impl/org.tinylog.impl.writers.file.FileWriter,tinylog-impl/org.tinylog.impl.writers.jdbc.JdbcWriterBuilder,tinylog-impl/org.tinylog.impl.writers.jdbc.JdbcWriter,tinylog-impl/org.tinylog.impl.writers.logcat.LogcatWriterBuilder,tinylog-impl/org.tinylog.impl.writers.logcat.LogcatWriter"
%}}
