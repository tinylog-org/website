# Website for tinylog 2

This is the repository for the website: https://tinylog.org/v2/. The repository for tinylog itself is [tinylog-org/tinylog](https://github.com/tinylog-org/tinylog).

## Content

Pull requests are welcome! All pages and news posts are stored as Markdown files in [content/](https://github.com/tinylog-org/website/tree/v2/content). Feel free to fix typos or improve the documentation.

## Commands

This section is only relevant, if you want to run the website on your local machine. If you only want to edit the content of the tinylog website, you can simply edit the Markdown files as mentioned in the previous content section.

In order to run the website on your local machine, you have to install [NodeJS](https://nodejs.org/en/) and check out the repository recursively to integrate the tinylog theme as submodule. Many Git clients offer a checkbox that can be checked to check out the repository recursively. Otherwise, execute `git submodule update --init` on the console in the directory, where you have checked out the website repository. All NPM packages can be installed via the command `npm install`.

 Command                   | Description                                                                     
:--------------------------|:--------------------------------------------------------------------------------
 `npm run build:dev`       | Builds the website including drafts and source maps                             
 `npm run build:prod`      | Builds the website excluding drafts and minifies all assets                     
 `npm run create:post`     | Creates a news post                                                             
 `npm run cspell:check`    | Checks the spelling in all content files                                        
 `npm run start:dev`       | Starts the web server with the website including drafts and source maps         
 `npm run start:prod`      | Starts the web server with the website excluding drafts and minifies all assets 

The theme can be updated via `git submodule update --remote`.
