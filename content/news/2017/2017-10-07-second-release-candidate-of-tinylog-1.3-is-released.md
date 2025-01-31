---
title: Second release candidate of tinylog 1.3 is released
date: 2017-10-07
---

The second release candidate of tinylog 1.3 is released and can be [downloaded](download). tinylog 1.3 is feature complete now.

Changes:

* Logging messages and arguments can be provided as lambda expression. Lambda expressions can be used for messages and arguments, which are expensive to compute, as they will be only evaluated if the log entry is really output.
* Improve performance for JDBC writer by reusing SQL statements
* Make output stream configurable for console writer. By default, warnings and errors are written to the error stream and all other logging levels to the default output stream. Now it's possible for example to output all kind of log entries to the default output stream or error stream.
