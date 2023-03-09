---
title: Logging
description: Overview of all logging methods
tableOfContents: true
menu:
  main:
    parent: documentation
    weight: 2
---

## Introduction

Unlike other logging frameworks, tinylog has a static logger class. Thus, the logger class can be used directly without having to create an instance of the logger for every class. tinylog supports five different severity levels: trace, debug, info, warn, and error. The logging methods are named according to the severity levels (for example, `Logger.trace()` for trace). Which severity levels should be output and which should be discarded is freely [configurable](configuration#severity-levels).

The class name of tinylog’s static logger is `org.tinylog.Logger`. Additionally, there is `org.tinylog.kotlin.Logger` for Kotlin, which is a re-implementation of `org.tinylog.Logger` for supporting enhanced Kotlin features.

## Plain Text

The most common logging method is probably the plain text output:

```java
Logger.trace("Hello World!");
Logger.debug("Hello World!");
Logger.info("Hello World!");
Logger.warn("Hello World!");
Logger.error("Hello World!");
```

## Text with Arguments

Texts can be assembled at runtime by using "{}" placeholders. For performance reasons, "{}" placeholders should be used instead of manual concatenation of strings by using the "+" operator.

```java
Logger.trace("Divide {} by {}", a, b);
Logger.debug("Divide {} by {}", a, b);
Logger.info("Divide {} by {}", a, b);
Logger.warn("Divide {} by {}", a, b);
Logger.error("Divide {} by {}", a, b);
```

In Kotlin, it is also possible to pass string templates as lambdas for lazy evaluation. This means that a passed string template will be only resolved, if the log entry is actually output, and not for disabled severity levels.

```kotlin
Logger.trace { "Divide $a by $b" }
Logger.debug { "Divide $a by $b" }
Logger.info { "Divide $a by $b" }
Logger.warn { "Divide $a by $b" }
Logger.error { "Divide $a by $b" }
```

Numbers can be formatted by using a [DecimalFormat-compatible pattern]({{% javadoc "java.text.DecimalFormat" %}}) within the curly brackets of a placeholder.

```java
Logger.trace("Income: {0.00} EUR", amount);
Logger.debug("Income: {0.00} EUR", amount);
Logger.info("Income: {0.00} EUR", amount);
Logger.warn("Income: {0.00} EUR", amount);
Logger.error("Income: {0.00} EUR", amount);
```

It is even possible to format numbers conditional by using a [ChoiceFormat-compatible pattern]({{% javadoc "java.text.ChoiceFormat" %}}):

```java
Logger.trace("There {0#are no files|1#is one file|1<are {} files}", count);
Logger.debug("There {0#are no files|1#is one file|1<are {} files}", count);
Logger.info("There {0#are no files|1#is one file|1<are {} files}", count);
Logger.warn("There {0#are no files|1#is one file|1<are {} files}", count);
Logger.error("There {0#are no files|1#is one file|1<are {} files}", count);
```

Dates and times can be formatted by using a [DateTimeFormatter-compatible pattern]({{% javadoc "java.time.format.DateTimeFormatter" %}}) within the curly brackets of a placeholder.

```java
Logger.trace("Registration date: {yyyy-MM-dd}", date);
Logger.debug("Registration date: {yyyy-MM-dd}", date);
Logger.info("Registration date: {yyyy-MM-dd}", date);
Logger.warn("Registration date: {yyyy-MM-dd}", date);
Logger.error("Registration date: {yyyy-MM-dd}", date);
```

If curly brackets should be output unchanged and not replaced by an argument, the brackets can be escaped by using a pair of single quotes. However, escaping is only required if one or more arguments are passed.

```java
Logger.trace("Curly brackets as placeholder {} or escaped '{}'", value);
Logger.debug("Curly brackets as placeholder {} or escaped '{}'", value);
Logger.info("Curly brackets as placeholder {} or escaped '{}'", value);
Logger.warn("Curly brackets as placeholder {} or escaped '{}'", value);
Logger.error("Curly brackets as placeholder {} or escaped '{}'", value);
```

A single quote itself can be output by using doubled single quotes:

```java
Logger.trace("Here is a single quote <''>", value);
Logger.debug("Here is a single quote <''>", value);
Logger.info("Here is a single quote <''>", value);
Logger.warn("Here is a single quote <''>", value);
Logger.error("Here is a single quote <''>", value);
```

## Exceptions

Exceptions and other throwables can be directly passed to a logging method. An additional textual message is optional.

```java
Logger.trace(ex);
Logger.debug(ex);
Logger.info(ex);
Logger.warn(ex);
Logger.error(ex);
```

In tinylog, exceptions are always the first argument and have to be passed before a message or arguments.

```java
Logger.trace(ex, "Cannot divide {} by {}", a, b);
Logger.debug(ex, "Cannot divide {} by {}", a, b);
Logger.info(ex, "Cannot divide {} by {}", a, b);
Logger.warn(ex, "Cannot divide {} by {}", a, b);
Logger.error(ex, "Cannot divide {} by {}", a, b);
```

## Objects

For performance reasons, objects should never be logged by calling their `toString()` method directly. tinylog provides separate logging methods for objects, which only calls their `toString()` method if the log entry is actually output, and not for disabled severity levels.

```java
Logger.trace(LocalDate.now());
Logger.debug(LocalDate.now());
Logger.info(LocalDate.now());
Logger.warn(LocalDate.now());
Logger.error(LocalDate.now());
```

## Lazy Logging

Sometimes a message or argument has to be computed specifically for logging. For expensive computations, lazy logging with lambda expressions is recommended, since these will only be evaluated if the log entry is actually output, and not for disabled severity levels.

{{< tabs tab-group="programming-language" >}}
<div data-identifier="java" data-title="Java">

```java
Logger.trace(() -> compute());
Logger.debug(() -> compute());
Logger.info(() -> compute());
Logger.warn(() -> compute());
Logger.error(() -> compute());
```

</div>
<div data-identifier="kotlin" data-title="Kotlin">

```kotlin
Logger.trace { compute() }
Logger.debug { compute() }
Logger.info { compute() }
Logger.warn { compute() }
Logger.error { compute() }
```

</div>
{{< /tabs >}}

Lambda expressions can also be passed as arguments for a text message with "{}" placeholders:

{{< tabs tab-group="programming-language" >}}
<div data-identifier="java" data-title="Java">

```java
Logger.trace("Expensive computation: {}", () -> compute());
Logger.debug("Expensive computation: {}", () -> compute());
Logger.info("Expensive computation: {}", () -> compute());
Logger.warn("Expensive computation: {}", () -> compute());
Logger.error("Expensive computation: {}", () -> compute());
```

</div>
<div data-identifier="kotlin" data-title="Kotlin">

```kotlin
Logger.trace("Expensive computation: {}", { compute() })
Logger.debug("Expensive computation: {}", { compute() })
Logger.info("Expensive computation: {}", { compute() })
Logger.warn("Expensive computation: {}", { compute() })
Logger.error("Expensive computation: {}", { compute() })
```

</div>
{{< /tabs >}}

## Tags

tinylog supports tags for categorizing log entries. For example, tags can be output as part of the [format pattern](configuration#format-pattern), or used to output log entries via [different writers](configuration#tags).

```java
Logger.tag("foo").trace("Hello World!");
Logger.tag("foo").debug("Hello World!");
Logger.tag("foo").info("Hello World!");
Logger.tag("foo").warn("Hello World!");
Logger.tag("foo").error("Hello World!");
```

If a tag is used extensively, an instance of the corresponding tagged logger can be held:

```java
TaggedLogger logger = Logger.tag("foo");
```

It is even possible to create a tagged logger with multiple tags that assigns all defined tags to each issued log entry:

```java
TaggedLogger logger = Logger.tags("foo", "bar", "baz");
```

Usually, the static logger is used for issuing untagged log entries. However, it is also possible to obtain an untagged logger instance that works exactly like the static logger class:

```java
TaggedLogger logger = Logger.tag(null);
```

## Context Values

tinylog has a thread-based context for enriching log entries with additional values. Context values can be output as part of the [format pattern](configuration#format-pattern). Stored values are only visible for the thread in which a value has been set and its child threads. This means that independent threads can simultaneously store different context values for the same key.

 ```java
ThreadContext.put("user", name);
```

Stored values are present until they are explicitly removed. Therefore, the thread context should be cleared before returning a thread to a thread pool. This is not necessary for threads that are not reused.

 ```java
ThreadContext.clear();
```

Even within the same thread, code blocks can be executed with different independent context values. For this purpose, tinylog provides two methods: `withEmptyContext()` executes a code block without any predefined context values, and `withIndependentContext()` executes a code block with a copy of all existing context values of the current thread. Regardless of which of the two methods is used, all context value changes are undone after execution.

{{< tabs tab-group="programming-language" >}}
<div data-identifier="java" data-title="Java">

```java
ThreadContext.put("value", "foo");

ThreadContext.withEmptyContext(() -> {
    Logger.info(ThreadContext.get("value"));  // null
    ThreadContext.put("value", "bar");
    Logger.info(ThreadContext.get("value"));  // "bar"
});

ThreadContext.withIndependentContext(() -> {
    Logger.info(ThreadContext.get("value"));  // "foo"
    ThreadContext.put("value", "bar");
    Logger.info(ThreadContext.get("value"));  // "bar"
});

Logger.info(ThreadContext.get("value"));      // "foo"
```

</div>
<div data-identifier="kotlin" data-title="Kotlin">

```kotlin
ThreadContext.put("value", "foo")

ThreadContext.withEmptyContext {
    Logger.info(ThreadContext["value"])  // null
    ThreadContext.put("value", "bar")
    Logger.info(ThreadContext["value"])  // "bar"
}

ThreadContext.withIndependentContext {
    Logger.info(ThreadContext["value"])  // "foo"
    ThreadContext.put("value", "bar") 
    Logger.info(ThreadContext["value"])  // "bar"
}

Logger.info(ThreadContext["value"])      // "foo"
```

</div>
{{< /tabs >}}

The methods `withEmptyContext()` and `withIndependentContext()` are only necessary for encapsulating context values within the same thread for different code blocks. If a context value should be stored for the entire lifetime of the thread, `ThreadContext.put()` can simply be called directly.
