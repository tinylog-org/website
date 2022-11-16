---
title: Getting Started
description: Short introduction to tinylog with a small example
tableOfContents: true
menu:
  main:
    parent: documentation
    weight: 1
---

## Setup

{{< tabs tab-group="programming-language" pills=true >}}
<div data-identifier="java" data-title="Java">

You can either download {{% download-file file="tinylog" version="stable" %}} and add the following JARs to your classpath:

- `tinylog-api-{{% stable-version %}}.jar`
- `tinylog-core-{{% stable-version %}}.jar`
- `tinylog-iml-{{% stable-version %}}.jar`

Or you can add the latest version of tinylog 3 as dependency for your favorite build tool:

{{% download-artifact artifacts="tinylog-api,tinylog-impl" bundles="org.tinylog.api,org.tinylog.impl" version="stable" %}}

</div>
<div data-identifier="kotlin" data-title="Kotlin">

You can either download {{% download-file file="tinylog-kotlin" version="stable" %}} and add the following JARs to your classpath:

- `tinylog-api-kotlin-{{% stable-version %}}.jar`
- `tinylog-core-{{% stable-version %}}.jar`
- `tinylog-iml-{{% stable-version %}}.jar`

Or you can add the latest version of tinylog 3 as dependency for your favorite build tool:

{{% download-artifact artifacts="tinylog-api-kotlin,tinylog-impl" bundles="org.tinylog.api.kotlin,org.tinylog.impl" version="stable" %}}

</div>
{{< /tabs >}}

## Logging

{{< tabs tab-group="programming-language" pills=true >}}
<div data-identifier="java" data-title="Java">

Just add a log statement to your application:

```java
import org.tinylog.Logger;

public class Application {

    public static void main(String[] args) {
        Logger.info("Hello World!");
    }

}
```

</div>
<div data-identifier="kotlin" data-title="Kotlin">

Just add a log statement to your application:

```kotlin
import org.tinylog.kotlin.Logger

fun main() {
    Logger.info("Hello World!")
}
```

</div>
{{< /tabs >}}

When you run this example application, you will see a log entry in the console:

```text
2022-06-11 14:24:47 [main] INFO  Application.main(): Hello World!
```

## Configuration

You can configure tinylog by creating a properties file with the name `tinylog.properties` in the default classpath. If you use a build tool such as Maven or Gradle, it is usually located at `src/main/resources`. For plain IDE projects, it is usually located directly at `src` along with source files and packages.

Example `tinylog.properties`:

```properties
writer.type    = console
writer.pattern = {date: HH:mm:ss.SSS} {level}: {message}
```

When you run the previous example application now, you will see the log entry in the new format in the console:

```text
14:24:47 INFO: Hello World!
```

For a detailed documentation of all configuration parameters, see the [configuration page](configuration), and for all logging methods, see the [logging page](logging).
