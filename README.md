# Holly's blog

This blog is a [GatsbyJS](https://www.gatsbyjs.org/) blog, based on the [HeroBlog starter](<(https://gatsby-starter-hero-blog.greglobinski.com/)>). <br /><br />

## Development

For local development

```text
gatsby develop
```

to hot-serve your website on http://localhost:8000 or

```text
gatsby build
```

to create static site ready to host (/public).

To run unit tests, use

```text
npm run test
```

Integration tests need the site to have been built first (and note that `develop` will un-build it)

```text
gatsby build
npm run test:int
```

### What are all the things?

- xxTemplate: used in generation to make components
- Page: A page with content (headline and body text)
- Article: Wrapped around pages, posts, and categories. Mysterious.
- Blog: The component on the front page with the unordered list and all the Items.
- Item: An entry on the front page.
- Post: A blog entry hosted on this site.
- Publication: A blog entry hosted elsewhere.
- Slug: The unique part of a page URL.

##### External services

The starter uses external services for some functions: comments, searching, analytics. To use them you have to secure some access data. All services are free to use or have generous free tiers big enough for a personal blog.

Create an `.env` file like below in the root folder. Change `...` placeholders with real data.
<br />By default, your `.env` file will be ignored by git. Remove `.env` from `.gitignore` in order to be able to push the file to your repository.

```text
GOOGLE_ANALYTICS_ID=...
ALGOLIA_APP_ID=...
ALGOLIA_SEARCH_ONLY_API_KEY=...
ALGOLIA_ADMIN_API_KEY=...
ALGOLIA_INDEX_NAME=...
FB_APP_ID=...
```

### Instructions & tutorials

- [How to install, setup and add new content to a Blog starter](https://dev.greglobinski.com/install-blog-starter/)
- [Setup Algolia account for your GatsbyJS blog](https://dev.greglobinski.com/setup-algolia-account/)
- More articles at [Front-end web development with Greg](https://dev.greglobinski.com/)

## Authors

- Content: Holly Cummins
- Original starter: Greg Lobinski [@greglobinski](https://github.com/greglobinski)

See also the list of [contributors](https://github.com/greglobinski/gatsby-starter-personal-blog/graphs/contributors) who participated in this project.

## Licence

###

Copyright © 2020 Holly Cummins. The source code in articles is freely reusable.

### Original starter:

MIT License

Copyright (c) 2017 gatsbyjs <br />Copyright (c) 2018 greg lobinski

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
