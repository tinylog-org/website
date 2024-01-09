---
title: Third milestone of tinylog 2.7 is out
date: 2024-01-09
---

With the third milestone of tinylog 2.7, the ability to continue existing log files has been improved.
Now, the [rolling file writer](configuration#rolling-file-writer) is able to find the correct log file to continue, even if there are newer files in the same directory that are not related to tinylog.
In addition, the rolling file writer can now continue log files if the [placeholder](configuration#placeholders-rolling-file-writer) `{dynamic}` is used and refers to an already existing log file at startup.
