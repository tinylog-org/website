# Website for tinylog

This is the repository for the website: https://tinylog.org/. The repository for tinylog itself is [tinylog-org/tinylog](https://github.com/tinylog-org/tinylog).

## Content

Pull requests are welcome! The Markdown files for all pages are stored in [src/pages/](https://github.com/tinylog-org/website/tree/main/src/pages) and for the news posts in [src/posts/](https://github.com/tinylog-org/website/tree/main/src/posts). Feel free to fix typos or improve the documentation.

## Commands

This section is only relevant if you want to run the website on your local machine. If you only want to edit the content of the tinylog website, you can just edit the Markdown files as mentioned in the previous content section.

To run the website on your local machine, you have to install [NodeJS](https://nodejs.org/en/) and check out this repository.

 Command                   | Description
:--------------------------|:------------------------------------------------------------
 `./scripts/create-post`   | Creates a new news post
 `npm install`             | Install all NPM packages
 `npm run astro:build`     | Builds the deployable website with Astro CMS
 `npm run astro:check`     | Reports all Astro CMS violations in the Astro files
 `npm run astro:start`     | Starts the Astro CMS web server with the website
 `npm run cspell:check`    | Checks the spelling in all Markdown files
 `npm run eslint:check`    | Reports all ESLint violations in the source code files
 `npm run eslint:fix`      | Tries to fix all ESLint violations in the source code files
 `npm run remark:check`    | Reports all Markdown violations in the MDX files
 `npm run remark:format`   | Re-format all Markdown files
 `npm run stylelint:check` | Reports all Stylelint violations in the Sass files
 `npm run stylelint:fix`   | Tries to fix all Stylelint violations in the Sass files
