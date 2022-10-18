---
title: First release candidate of tinylog 2.1 is out
date: 2020-01-12
---

The first release candidate of tinylog 2.1 brings several improvements and new features for configuring tinylog, using tinylog with Scala, and outputting exceptions. All new improvements and features are ready to use. Further release candidates will only contain bug fixes. The first release candidate, for which no bugs are reported, will be released unchanged as the final version 2.1.0.

In the new version, it is possible to define default values for [environment variables](configuration#environment-variables) and [system properties](configuration#system-properties) in configuration files for tinylog. These default values will be used if an environment variable and system property is not set to ensure that tinylog will work as expected nevertheless. Many thanks to [simonsilvalauinger](https://github.com/simonsilvalauinger) for the idea and implementation!

Already since the first version, tinylog loads the configuration from the properties file `tinylog.properties` automatically. With the new version, tinylog supports also `tinylog-test.properties` as configuration for tests and `tinylog-dev.properties` as configuration for development. This makes it easier to use different configurations for different environments. Details can be found in the [configuration documentation](configuration#configuration).

The artifact of tinylog's Scala API contains the Scala version now. This makes it easier to use and find the artifact. The new artifact name is `org.tinylog:tinylog-api-scala_2.12:2.1.0-RC1`.

The biggest new feature are [throwable filters](configuration#exceptions) for filtering and transforming exceptions to get a clearer and more readable output. For example, it is possible to remove internal and generated stack trace elements from the stack trace or to unpack a `RuntimeException` to output only the exception that caused it. There are four configurable [throwable filters](configuration#exceptions), which can be adapted to meet individual requirements.
