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

<table class="tabs-simple" data-tab-group="programming-language">
<thead>
<tr class="nav nav-pills" role="tablist">
<th class="nav-link active" data-tab-item="java" role="tab" aria-selected="true" tabindex="0">Java</th>
<th class="nav-link" data-tab-item="kotlin" role="tab" aria-selected="true" tabindex="0">Kotlin</th>
</tr>
</thead>
<tbody>
<tr class="tab-content">
<td class="tab-pane" data-tab-item="java" role="tabpanel">

You can either {{% download-file file="tinylog" version="stable" %}} and add the following JARs to your classpath:

- `tinylog-api.jar`
- `tinylog-core.jar`
- `tinylog-iml.jar`

Or you can add the latest version of tinylog 3 as dependency for your favorite build tool:

{{% download-artifact artifacts="tinylog-api,tinylog-impl" bundles="org.tinylog.api,org.tinylog.impl" version="stable" %}}

</td>
<td class="tab-pane" data-tab-item="kotlin" role="tabpanel">

You can either {{% download-file file="tinylog-kotlin" version="stable" %}} and add the following JARs to your classpath:

- `tinylog-api-kotlin.jar`
- `tinylog-core.jar`
- `tinylog-iml.jar`

Or you can add the latest version of tinylog 3 as dependency for your favorite build tool:

{{% download-artifact artifacts="tinylog-api-kotlin,tinylog-impl" bundles="org.tinylog.api.kotlin,org.tinylog.impl" version="stable" %}}

</td>
</tr>
</tbody>
</table>

## Logging

<table class="tabs-simple" data-tab-group="programming-language">
<thead>
<tr class="nav nav-pills" role="tablist">
<th class="nav-link active" data-tab-item="java" role="tab" aria-selected="true" tabindex="0">Java</th>
<th class="nav-link" data-tab-item="kotlin" role="tab" aria-selected="true" tabindex="0">Kotlin</th>
</tr>
</thead>
<tbody>
<tr class="tab-content">
<td class="tab-pane" data-tab-item="java" role="tabpanel">

Just add a logging statement to your application:

```java
import org.tinylog.Logger;

public class Application {

    public static void main(String[] args) {
        Logger.info("Hello World!");
    }

}
```

</td>
<td class="tab-pane" data-tab-item="kotlin" role="tabpanel">

Just add a logging statement to your application:

```kotlin
import org.tinylog.kotlin.Logger

fun main() {
    Logger.info("Hello World!")
}
```

</td>
</tr>
</tbody>
</table>

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
