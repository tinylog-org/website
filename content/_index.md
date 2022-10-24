---
title: Lightweight Logging Framework for Java, Scala, Kotlin, and Android
linkTitle: Home
cssClass: home
menu:
  main:
    weight: 1
---

<div class="introduction">

<h1 class="display-1">tinylog</h1>

<p class="lead">
Simplify your logging with tinylog.
The lightweight logging framework can be used with Java, Kotlin, Scala, and any other JVM language.
tinylog is open source and runs wherever Java is used: JVM, GraalVM, and Android
</p>

<div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
<a class="btn btn-outline-dark btn-lg" href="{{% internal-link `getting-started` %}}" role="button">Getting Started</a>
<a class="btn btn-outline-dark btn-lg" href="{{% internal-link `download` %}}" role="button">Download tinylog</a>
</div>

<p class="text-secondary">
Latest Version:
<a href="{{% internal-link `download` %}}">{{% stable-version %}}</a>
{{< has-preview-version >}}
| <a href="{{% internal-link `download-preview` %}}">{{% preview-version %}}</a>
{{< /has-preview-version >}}
</p>

</div>

<div class="details">

<div class="detail">
<div class="text">

## Avoid Boilerplate Code

tinylog has a static logger class.
Therefore, it is not necessary to create a logger instance for each class in which you want to issue log entries.

</div>
<div class="sample">

```java
import org.tinylog.Logger;

public class Application {

    public static void main(String[] args) {
        Logger.info("Hello World!");
    }

}
```

</div>
</div>

<div class="detail">
<div class="text">

## Many Output Options

tinylog has multiple writers for outputting log entries.
Log entries can be written to the console, into database tables, to log files, to JSON files, and to Android's logcat.

There are even four different file-based writers, depending on whether you simply want to write to a log file, to a JSON file, share a log file with several instances simultaneously, or start a new log file regularly after defined events (such as reaching a configured file size).

</div>
<div class="sample">

<ul class="list-group" aria-label="Output Options">
<li class="list-group-item">Console via <code>System.out</code> and <code>System.err</code></li>
<li class="list-group-item">Database via JDBC and Java EE data sources</li>
<li class="list-group-item">Files (including shared and rolling log files)</li>
<li class="list-group-item">Logcat (Android only)</li>
</ul>

</div>
</div>

<div class="detail">
<div class="text">

## Configurable

tinylog is typically configured via a properties file, where you can configure writers, severity level, and [much more](configuration).

</div>
<div class="sample">

```properties
level         = info
writer        = file
writer.file   = application.log
writer.format = {class}.{method}() {message}
```

</div>
</div>

<div class="detail">
<div class="text">

## Compatible

tinylog can be your logging framework wherever Java 6 or newer is used.
Despite downward compatibility with Java 6, tinylog provides modern techniques such as support for lambdas and lazy logging.

The logging framework can be used on the JVM, on GraalVM, on Android, in native images, in Java SE projects, in Java EE projects, in JPMS projects, on OSGi platforms, and in many other environments.
Example projects can be found on the [external resources page](external-resources#example-projects)</a>.

Besides the generic logging API for Java and other JVM languages, there are also special logging APIs for Kotlin and Scala.
tinylog has several adapters for processing log entries from third-party logging APIs like SLF4J.
All of them can be found on the [download page](download).

</div>
<div class="sample">

{{% bootstrap-icon `puzzle` %}}

</div>
</div>

<div class="detail">
<div class="text">

## Lightweight

As the name already implies, tinylog is a lightweight logging framework.
tinylog itself consists of only two JAR files (one for the API and the other for the implementation) without any external dependencies.
Both JAR files have a combined size of only {{% total-file-size %}}.

</div>
<div class="sample">

<span class="display-3" aria-hidden="true">{{% total-file-size %}}</span>

</div>
</div>

<div class="detail">
<div class="text">

## Fast

tinylog is optimized for the fast output of log entries.
See the [benchmark page](benchmark), how it performs in comparison to other logging frameworks.
tinylog can easily output hundreds of thousands log entries per second.

With tinylog, log methods for disabled severity levels even literally become a no-op that the JVM can completely eliminate from the executable code.

</div>
<div class="sample">

{{% benchmark-icon %}}

</div>
</div>

<div class="detail">
<div class="text">

## Open Source

tinylog is open source and licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
This means that the logging framework can be used free of charge and without any restrictions, even in commercial software.

The source code can be found on [GitHub](https://github.com/tinylog-org/tinylog)</a>.
Pull requests and issues are welcome.

</div>
<div class="sample">

{{% bootstrap-icon `github` %}}

</div>
</div>

</div>
