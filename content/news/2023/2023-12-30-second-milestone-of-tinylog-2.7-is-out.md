---
title: Second milestone of tinylog 2.7 is out
date: 2023-12-30
---

Until now, tinylog's writing thread woke up every few milliseconds, even if there were no log entries to output.
With this second milestone of tinylog 2.7.0, the writing thread will only wake up if there are log entries to output.
This prevents the processor from waking up unnecessarily during idle phases, which improves the battery life of mobile devices including Android smartphones.
Special thanks to [manisiu](https://github.com/manisiu), who not only found the problem but also fixed it straight away.
