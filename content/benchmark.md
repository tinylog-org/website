---
title: Benchmark
menu:
  main:
    weight: 5
---

Logging should have no significant impact on performance. This is why multiple benchmarks are part of the tinylog project. These are helpful for comparing different logging frameworks. Additionally, benchmarks are used during development for testing performance optimizations and detecting performance bugs at an early stage.

The benchmarks are based on [JMH](http://openjdk.java.net/projects/code-tools/jmh/) and [hosted on GitHub]({{% github-folder "benchmarks" %}}). The first benchmark measures how many log entries per second can be output to a log file. Usually, there are also trace and debug log statements that should be ignored in production. How many log statements can be discarded per second is measured in the second benchmark.

To ensure statistically reliable data, each benchmark for each logging framework was executed sequentially in 10 forks, with 10 warm-up iterations and 10 relevant iterations. In the benchmark diagrams, you see the average value of the total 100 relevant iterations (10 forks × 10 iterations). The test machine was an Intel Core i5-1145G7 with 32 GB RAM and a 512 GB NVMe SSD from Samsung (model PM991a). Java Runtime Environment 11.0.6 was used to execute the benchmarks.

## Writing Log Entries to a File

In these benchmarks, all logging frameworks have to write info log entries to a log file. Firstly, the log entries are written synchronously and unbuffered (blue bars). This supports every logging framework and is the default for all of them. For preventing an application from being blocked by slow I/O operations, all logging frameworks (except java.util.logging) can also write log entries asynchronously and buffered. The recommended configuration for asynchronous output for each logging framework has been benchmarked in the second step (yellow bars).

The output of caller information such as class and method name can have a big impact on performance. Therefore, there are three different benchmarks: output of class and method name, output of class or category, and no output of any caller information.

### Class and Method

In this benchmark, all logging frameworks use `{date:yyyy-MM-dd HH:mm:ss} - {thread} - {class}.{method}() - {level}: {message}` or an equivalent as format pattern for outputting log entries.

{{% benchmark method="output" nameHeader="Framework" dataHeader="Processed Log Entries per Second" locationInfo="FULL" %}}

### Class or Category only

In this benchmark, all logging frameworks use `{date:yyyy-MM-dd HH:mm:ss} - {thread} - {class} - {level}: {message}` or an equivalent as format pattern for outputting log entries. Only tinylog 1 and 2 use the caller class. All other logging frameworks use the logger category instead, which is according to the documentation of [Logback](http://logback.qos.ch/manual/layouts.html#class) and [Apache Log4j](https://logging.apache.org/log4j/2.x/manual/configuration.html#Configuring_Loggers) significantly faster and ensures a fair benchmark.

{{% benchmark method="output" nameHeader="Framework" dataHeader="Processed Log Entries per Second" locationInfo="CLASS_OR_CATEGORY_ONLY" %}}

### No Caller Information

In this benchmark, all logging frameworks use `{date:yyyy-MM-dd HH:mm:ss} - {thread} - {level}: {message}` or an equivalent as format pattern for outputting log entries. No caller information is output.

{{% benchmark method="output" nameHeader="Framework" dataHeader="Processed Log Entries per Second" locationInfo="NONE" %}}

## Discarding Log Entries

Debug and trace log entries are helpful for developers in their development environment, but are not usually output in the production environment. This benchmark measures how many log entries can be discarded per second by the logging frameworks.

{{% benchmark method="discard" nameHeader="Framework" dataHeader="Processed Log Entries per Second" locationInfo="CLASS_OR_CATEGORY_ONLY" %}}

For comparison, here is a no-op JMH benchmark that runs an empty method that does simply nothing:

{{% benchmark method="emptyMethod" nameHeader="No-Op Benchmark" dataHeader="Invocations per Second" %}}

## Conclusion

All logging frameworks but java.util.logging can benefit a lot from using buffered and asynchronous output. It is practically always useful to enable it to negate the performance impact of slow I/O operations, regardless of which logging framework is used.

tinylog is multiple times faster than all other logging frameworks when outputting log entries along with caller information such as class and method name. With tinylog, caller information – even such as the method name – can be output with good conscience and without noticeable impact on the performance in real projects.

When outputting the class or category name as the only caller information, tinylog’s output performance is between Apache Log4j and Logback. Surprisingly, tinylog 1 and Logback seem to be the fastest logging frameworks when outputting no caller information at all. This is because tinylog 1 and Logback perform the rendering of log entries synchronously in the caller thread and perform only the slow I/O operations asynchronously in the writing thread and async appender respectively. In contrast, tinylog 2 also performs the rendering of log entries asynchronously in the writing thread, which on the one hand reduces the benchmark performance, but on the other hand leads to very low latency of issuing log entries in real projects, since the caller thread is blocked for significantly shorter time.

tinylog 2 is very good at discarding log entries with disabled severity levels. Calling a logging method for a disabled severity level is effectively a no-op. This is because tinylog 2 loads the visibility of the severity levels while class loading, and stores them as final boolean values. Each logging method firstly checks against this boolean value whether a severity level is enabled or disabled. This allows the JVM to identify which logging methods will never output anything at runtime and eliminate these calls completely. Hence, the performance of tinylog 2 for disabled severity levels is identical to an invocation of an empty no-op method that does nothing.
