---
title: Getting Started
description: Short introduction to tinylog with a small example
tableOfContents: true
menu:
  main:
    parent: documentation
    weight: 1
---

1. Download [tinylog {{% stable-version %}}](download) and add `tinylog-api.jar` and `tinylog-impl.jar` to your classpath. If you use a build tool such as Maven or Gradle, you can add both JAR files as [dependencies](download).

2. Add a logging statement to your application:

   ```java
   import org.tinylog.Logger;

   public class Application {

       public static void main(String[] args) {
           Logger.info("Hello World!");
       }

   }
   ```

   As you can see, tinylog has a static logger. Therefore, it is not necessary to create an instance of the logger class.

3. When you run this small application, you will see the following output in the console:

   ```text
   2018-03-31 18:15:32 [main] Application.main()
   INFO: Hello World!
   ```

4. You can configure tinylog by creating a properties file with the name `tinylog.properties` in the default classpath. If you use a build tool such as Maven or Gradle, it is usually located at `src/main/resources`. For plain IDE projects, it is usually located directly at `src` along with source files and packages.

   Example `tinylog.properties`:

   ```properties
   writer        = console
   writer.format = {date: HH:mm:ss.SSS} {level}: {message}
   ```

5. When you run the application, you will now see the following output in the console:

   ```text
   18:29:57.382 INFO: Hello World!
   ```

   For a detailed documentation of all configuration parameters, see the [configuration page](configuration), and for all logging methods, see the [logging page](logging).
