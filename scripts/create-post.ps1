#!/usr/bin/env pwsh

$title = $args[0]
if (-Not $title)
{
    $title = Read-Host "Title"
}

$year = (Get-Date).year
$date = (Get-Date).ToString("yyyy-MM-dd")

$root = [IO.Path]::GetFullPath([IO.Path]::Combine($PSScriptRoot, ".."))
$base = $title.ToLower() -Replace '[^0-9a-zA-z_.]+','-'
$path = [IO.Path]::Combine($root, "content", "news", $year, "$date-$base.md")

New-Item -ItemType File -Force -Path $path > $null
Add-Content $path "---"
Add-Content $path "title: $title"
Add-Content $path "date: $date"
Add-Content $path "---"
Add-Content $path ""

Write-Host "Created post: $path"
