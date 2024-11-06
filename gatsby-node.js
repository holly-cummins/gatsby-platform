/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");
const kebabCase = require("lodash.kebabcase");

const { createFilePath } = require(`gatsby-source-filesystem`);
const { generateFilter } = require("./src/utils/filters");

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode });
    const fileNode = getNode(node.parent);
    const source = fileNode.sourceInstanceName;
    const separtorIndex = ~slug.indexOf("--") ? slug.indexOf("--") : 0;
    const shortSlugStart = separtorIndex ? separtorIndex + 2 : 0;

    if (source !== "parts") {
      createNodeField({
        node,
        name: `slug`,
        value: `${separtorIndex ? "/" : ""}${slug.substring(shortSlugStart)}`
      });
    }
    createNodeField({
      node,
      name: `prefix`,
      value: separtorIndex ? slug.substring(1, separtorIndex) : ""
    });
    createNodeField({
      node,
      name: `source`,
      value: source
    });
  }
};

/**
 * @type {import("gatsby").GatsbyNode["createPages"]}
 */
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const postTemplate = path.resolve("./src/templates/PostTemplate.js");
  const redirectTemplate = path.resolve("./src/templates/RedirectTemplate.js");
  const qrTemplate = path.resolve("./src/templates/QrCodeTemplate.js");
  const pageTemplate = path.resolve("./src/templates/PageTemplate.js");
  const categoryTemplate = path.resolve("./src/templates/CategoryTemplate.js");
  const typeTemplate = path.resolve("./src/templates/TypeTemplate.js");

  const filters = generateFilter();

  return graphql(
    `
          query Posts($filters: MarkdownRemarkFilterInput) {
  allMarkdownRemark(filter: $filters, sort: {fields: {prefix: DESC}}, limit: 1000) {
    edges {
      node {
        id
        fields {
          slug
          prefix
          draft
          source
          category
        }
        frontmatter {
          title
          url
          type
        }
      }
    }
  }
}
        `,
    { filters }
  ).then(result => {
      if (result.errors) {
        console.log(result.errors);
        reject(result.errors);
      }

      const items = result.data.allMarkdownRemark.edges;

      // Create category list
      const categorySet = new Set();
      items.forEach(edge => {
        let {
          node: {
            fields: { category }
          }
        } = edge;

        if (category) {
          categorySet.add(category);
        }
      });

      // Create category pages
      const categoryList = Array.from(categorySet);
      categoryList.forEach(category => {
        createPage({
          path: `/category/${kebabCase(category)}/`,
          component: categoryTemplate,
          context: {
            category
          }
        });
      });

      // Create type list
      const typeSet = new Set();
      items.forEach(edge => {
        const {
          node: {
            frontmatter: { type }
          }
        } = edge;

        if (type) {
          typeSet.add(type);
        }
      });

      // Create type pages
      const typeList = Array.from(typeSet);
      typeList.forEach(type => {
        createPage({
          path: `/type/${kebabCase(type)}/`,
          component: typeTemplate,
          context: {
            type
          }
        });
      });

      // Create posts
      const posts = items.filter(
        item => item.node.fields.source === "posts" || item.node.fields.source === "talks"
      );
      posts.forEach(({ node }, index) => {
        const slug = node.fields.slug;
        const next = index === 0 ? undefined : posts[index - 1].node;
        const prev = index === posts.length - 1 ? undefined : posts[index + 1].node;
        const source = node.fields.source;

        createPage({
          path: slug,
          component: postTemplate,
          context: {
            slug,
            prev,
            next,
            source
          }
        });

        createPage({
          path: `${slug}/qr`.replace("//", "/"),
          component: qrTemplate,
          context: {
            slug
          }
        });
      });

      // Create pages and redirects for publications
      const publications = items.filter(item => item.node.fields.source === "publications");
      publications.forEach(({ node }) => {
        const slug = node.fields.slug;
        const url = node.frontmatter.url;

        createPage({
          path: slug,
          component: redirectTemplate,
          context: {
            slug,
            url
          }
        });
      });

      // and create pages for pages.
      const pages = items.filter(item => item.node.fields.source === "pages");
      pages.forEach(({ node }) => {
        const slug = node.fields.slug;
        const source = node.fields.source;

        createPage({
          path: slug,
          component: pageTemplate,
          context: {
            slug,
            source
          }
        });
      });
    }
  );
}
;


exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        assert: require.resolve("assert"),
        "object.assign/polyfill": require.resolve("object-assign")
      }
    }
  });

  switch (stage) {
    case `build-javascript`:
      actions.setWebpackConfig({
        resolve: {
          fallback: {
            assert: require.resolve("assert"),
            "object.assign/polyfill": require.resolve("object-assign")
          }
        },

        plugins: [
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "./report/treemap.html",
            openAnalyzer: false,
            logLevel: "error",
            defaultSizes: "gzip"
          })
        ]
      });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
  type MarkdownRemark implements Node {
    fields: Fields
  }

  type Fields {
    geography: Geography
    slides: OEmbed
    video: OEmbed
    shortDate: String
    displayCategory: String
    category: String
  }

  `;
  createTypes(typeDefs);
};
