---
title: "Benchmark: tinylog 1.0 vs 1.1"
date: 2016-04-14
---

The tinylog project contains benchmarks to prevent performance issues for new releases. Both benchmarks have been executes with tinylog 1.1 and 1.2 on the same machine.

Maximum logging performance (creating log entries in a loop one million times)

<table class="table benchmark">
    <tbody>
        <tr class="sync">
            <td>tinylog 1.1</td>
            <td>
                <div class="bar" style="width: 82%"></div>
                <span class="total">2&thinsp;s 613&thinsp;ms</span>
            </td>
        </tr>
        <tr class="async">
            <td>with writing thread</td>
            <td>
                <div class="bar" style="width: 41%"></div>
                <span class="total">1&thinsp;s 321&thinsp;ms</span>
            </td>
        </tr>
        <tr class="sync">
            <td>tinylog 1.0</td>
            <td>
                <div class="bar" style="width: 100%"></div>
                <span class="total">3&thinsp;s 189&thinsp;ms</span>
            </td>
        </tr>
        <tr class="async">
            <td>with writing thread</td>
            <td>
                <div class="bar" style="width: 54%"></div>
                <span class="total">1&thinsp;s 728&thinsp;ms</span>
            </td>
        </tr>
    </tbody>
</table>

Influence on compute-intensive application (calculating all prime numbers from 2 to 10,000,000)

<table class="table benchmark">
    <tbody>
        <tr class="sync">
            <td>tinylog 1.1</td>
            <td>
                <div class="bar" style="width: 99%"></div>
                <span class="total">3&thinsp;s 390&thinsp;ms</span>
            </td>
        </tr>
        <tr class="async">
            <td>with writing thread</td>
            <td>
                <div class="bar" style="width: 40%"></div>
                <span class="total">1&thinsp;s 363&thinsp;ms</span>
            </td>
        </tr>
        <tr class="sync">
            <td>tinylog 1.0</td>
            <td>
                <div class="bar" style="width: 100%"></div>
                <span class="total">3&thinsp;s 427&thinsp;ms</span>
            </td>
        </tr>
        <tr class="async">
            <td>with writing thread</td>
            <td>
                <div class="bar" style="width: 43%"></div>
                <span class="total">1&thinsp;s 466&thinsp;ms</span>
            </td>
        </tr>
    </tbody>
</table>

All parameters and the method of measurement are documented on the [benchmark page](benchmark).
