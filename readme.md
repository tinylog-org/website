# Website for tinylog 2

This is the repository for the website: https://tinylog.org/. The repository for tinylog itself is [tinylog-org/tinylog](https://github.com/tinylog-org/tinylog).

## Content

Pull requests are welcome! All pages and news posts are stored as Markdown files in [content/](https://github.com/tinylog-org/website/tree/v2/content). Feel free to fix typos or improve the documentation.

## Commands

This section is only relevant, if you want to run the website on your local machine. If you only want to edit the content of the tinylog website, you can simply edit the Markdown files as mentioned in the previous content section.

In order to run the website on your local machine, you have to install [NodeJS](https://nodejs.org/en/) and check out this repository. All NPM packages can be installed via the command `npm install`.

 Command                   | Description                                                                     
:--------------------------|:--------------------------------------------------------------------------------
 `npm run build:dev`       | Builds the website including drafts and source maps                             
 `npm run build:prod`      | Builds the website excluding drafts and minifies all assets                     
 `npm run create:post`     | Creates a news post                                                             
 `npm run cspell:check`    | Checks the spelling in all content files                                        
 `npm run eslint:check`    | Reports all ESLint violations in the Typescript files                           
 `npm run eslint:fix`      | Tries to fix all ESLint violations in the Typescript files                      
 `npm run start:dev`       | Starts the web server with the website including drafts and source maps         
 `npm run start:prod`      | Starts the web server with the website excluding drafts and minifies all assets 
 `npm run stylelint:check` | Reports all Stylelint violations in the SASS files                              
 `npm run stylelint:fix`   | Tries to fix all Stylelint violations in the SASS files                         
