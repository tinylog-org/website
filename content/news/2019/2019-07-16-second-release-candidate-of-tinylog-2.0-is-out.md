---
title: Second release candidate of tinylog 2.0 is out
date: 2019-07-16
---

All JARs of tinylog are valid modules now. Thus, tinylog can be used easily in modular Java applications that are using the Java Platform Module System. For consistency, tinylog uses the new module names also as bundle names for OSGi.

 Maven Artifact     | New Module/Bundle Name
:-------------------|:-----------------------
 tinylog-api-kotlin | org.tinylog.api.kotlin
 tinylog-api-scala  | org.tinylog.api.scala
 jcl-tinylog        | org.tinylog.api.jcl
 log4j1.2-api       | org.tinylog.api.log4j12
 jul-tinylog        | org.tinylog.api.jul
 jboss-tinylog      | org.tinylog.api.jboss
 slf4j-tinylog      | org.tinylog.api.slf4j
 tinylog1.3-api     | org.tinylog.api.tinylog13
 tinylog-impl       | org.tinylog.impl
 tinylog-jul        | org.tinylog.adapter.jul
 tinylog-jboss      | org.tinylog.adapter.jboss
 tinylog-api        | org.tinylog.api

Furthermore, the placeholder `{timestamp}` no longer inserts an SQL timestamp but a numeric UNIX timestamp in database tables. The placeholder `{date}` can be used for SQL timestamps.
