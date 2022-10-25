# Website for tinylog 2

This is the repository for the website: https://tinylog.org/v2/. The repository for tinylog itself is [tinylog-org/tinylog](https://github.com/tinylog-org/tinylog).

## Content

You are welcome to fix typos and improve the content. All pages and news posts are stored as markdown files in [content/](https://github.com/tinylog-org/website/tree/master/content).

## Commands

If you want to build or run the website on your local computer, [NodeJS](https://nodejs.org/en/) must be installed. If NodeJS is installed, all packages can be installed via the command `npm install`.

 Command           | Description                                                                     
:------------------|:------------
 `build:dev`       | Builds the website including drafts and source maps                             
 `build:prod`      | Builds the website excluding drafts and minifies all assets                     
 `create:post`     | Creates a news post                                                             
 `cspell:check`    | Checks the spelling in all content files                                        
 `start:dev`       | Starts the web server with the website including drafts and source maps         
 `start:prod`      | Starts the web server with the website excluding drafts and minifies all assets 
