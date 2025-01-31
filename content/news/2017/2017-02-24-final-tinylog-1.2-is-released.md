---
title: Final tinylog 1.2 is released
date: 2017-02-24
---

The final version of tinylog 1.2 is released and can be [downloaded](download). It is identical to the last release candidate as no further bugs have been reported.

New features:

* Full support of Android including a logcat writer
* New alternative JARs for redirecting log entries to logging system of application servers
* Resolve Unix-like placeholders with environment variables in paths such as `${home}`
* Support loading configurations from any input stream
* Support JavaEE DataSources in JDBC writer
* Auto reconnecting option for JDBC writer
* Configurations can be defined as URL to load them from network or web
* Support for choice format in log messages
* Support for custom number format patterns in log messages

Bug fixes:

* Fixed deleting old backup files in rolling file writer if startup policy is used together with timestamp or process ID labeler.
* Fixed `NullPointerException` when loading tinylog with `BootstrapClassLoader` (thanks to [Cristian Spinetta](https://github.com/cspinetta))
