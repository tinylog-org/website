---
title: Third milestone of tinylog 2.0 is out
date: 2019-02-18
---

With the third milestone, tinylog 2.0 provides support for the logging APIs of Apache Commons Logging (JCL), Apache Log4j 1.2 and JBoss Logging 3. Already since the previous milestone, JUL, SLF4J and tinylog 1.3 are supported. Thus, all planned third-party logging APIs are implemented now.

For Apache Commons Logging (JCL) and JBoss Logging 3, tinylog provides bindings. This means that the original JARs of both framework can be used together with tinylog by just adding tinylog's binding for these both frameworks.

Since Apache Log4j 1.2 does not support bindings, tinylog offers a replacement for the legacy Log4j-JAR. This means that the legacy Log4j-JAR has to be removed from the classpath, when using tinylog's log4j1.2-api.

Furthermore, [the fix of tinylog 1.3.6](https://tinylog.org/v1/news#92) for ConcurrentModificationExceptions that can occur, if system properties change while loading the configuration, has been merged to tinylog 2.
