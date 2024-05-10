import gn from "./gatsby-node";

describe("the main gatsby thing", () => {
  it("aggregates categories which are the same", async () => {
    const node = {
      node: { frontmatter: {}, fields: { category: "test-stuff", source: "some-source" } }
    };
    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMarkdownRemark: {
          edges: [node, node, node]
        }
      }
    });
    const actions = { createPage: jest.fn() };
    await gn.createPages({ graphql, actions });
    // The categories are all the same so should be consolidated
    const calls = actions.createPage.mock.calls;

    expect(calls.length).toBe(1);

    expect(calls[0][0].component).toContain("CategoryTemplate.js");
  });

  it("makes pages for each category", async () => {
    const node = {
      node: { frontmatter: {}, fields: { category: "test-stuff", source: "some-source" } }
    };
    const otherNode = {
      node: { frontmatter: {}, fields: { category: "other-stuff", source: "some-source" } }
    };
    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMarkdownRemark: {
          edges: [node, otherNode, node]
        }
      }
    });
    const actions = { createPage: jest.fn() };
    await gn.createPages({ graphql, actions });
    // The categories are all different so should not be consolidated
    expect(actions.createPage.mock.calls.length).toBe(2);
  });

  it("aggregates types which are the same", async () => {
    const node = {
      node: { frontmatter: { type: "interview" }, fields: { source: "some-source" } }
    };
    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMarkdownRemark: {
          edges: [node, node, node]
        }
      }
    });
    const actions = { createPage: jest.fn() };
    await gn.createPages({ graphql, actions });
    // The types are all the same so should be consolidated
    const calls = actions.createPage.mock.calls;

    expect(calls.length).toBe(1);

    expect(calls[0][0].component).toContain("TypeTemplate.js");
  });

  it("makes pages for each type", async () => {
    const node = {
      node: {
        frontmatter: { type: "interpretive dance" },
        fields: { source: "some-source" }
      }
    };
    const otherNode = {
      node: {
        frontmatter: { type: "tv show" },
        fields: { source: "some-source" }
      }
    };
    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMarkdownRemark: {
          edges: [node, otherNode, node]
        }
      }
    });
    const actions = { createPage: jest.fn() };
    await gn.createPages({ graphql, actions });
    // The types are all different so should be distinct calls
    expect(actions.createPage.mock.calls.length).toBe(2);
  });

  it("makes pages for posts", async () => {
    const slug = "slug-path";

    const node = {
      node: {
        frontmatter: {},
        fields: { category: "test-stuff", source: "posts", slug, prefix: "a-proper-date" }
      }
    };
    const edges = [node, node];

    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMarkdownRemark: { edges }
      }
    });
    const actions = { createPage: jest.fn() };
    await gn.createPages({ graphql, actions });
    // One call for the category, then a second for the post
    const calls = actions.createPage.mock.calls;
    // One post for each node, plus one for each QR code, plus one for the category
    expect(calls.length).toBe(2 * edges.length + 1);
    // The first argument to the second call ...
    expect(calls[1][0].path).toEqual(slug);
    expect(calls[1][0].component).toContain("PostTemplate.js");

    // The first argument to the third call ...
    expect(calls[2][0].path).toContain(slug);
    expect(calls[2][0].path).toContain("qr");
    expect(calls[2][0].component).toContain("QrCodeTemplate.js");
  });

  it("makes pages for talks", async () => {
    const slug = "slug-path";

    const node = {
      node: {
        frontmatter: {},
        fields: { category: "test-stuff", source: "talks", slug, prefix: "a-proper-date" }
      }
    };
    const edges = [node, node];

    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMarkdownRemark: { edges }
      }
    });
    const actions = { createPage: jest.fn() };
    await gn.createPages({ graphql, actions });
    // One call for the category, then a second for the post
    const calls = actions.createPage.mock.calls;
    // One post for each node, one qr code for each node, plus one for the category
    expect(calls.length).toBe(2 * edges.length + 1);
    // The first argument to the second call ...
    expect(calls[1][0].path).toEqual(slug);
    expect(calls[1][0].component).toContain("PostTemplate.js");
    expect(calls[2][0].path).toContain(slug);
    expect(calls[2][0].path).toContain("qr");
    expect(calls[2][0].component).toContain("QrCodeTemplate.js");
  });

  it("makes pages for publications (and also makes a category)", async () => {
    const url = "http://myfamous.story";
    const slug = "slug-path";

    const node = {
      node: {
        frontmatter: { url },
        fields: { category: "pub-stuff", source: "publications", slug }
      }
    };
    const edges = [node];

    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMarkdownRemark: { edges }
      }
    });
    const actions = { createPage: jest.fn() };
    await gn.createPages({ graphql, actions });
    // One call for the category, then a second for the post
    const calls = actions.createPage.mock.calls;
    // One posts for the nodes plus one for the category
    expect(calls.length).toBe(2);
    // The first argument to the second call ...
    expect(calls[1][0].context.url).toEqual(url);
    expect(calls[1][0].path).toEqual(slug);

    // The first argument to the first call ...
    expect(calls[0][0].path).toEqual("/category/pub-stuff/");
  });

  it("makes pages for pages", async () => {
    const slug = "slug-path";

    const node = {
      node: {
        frontmatter: {},
        fields: { category: "test-stuff", source: "pages", slug }
      }
    };
    const edges = [node, node, node];

    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMarkdownRemark: { edges }
      }
    });
    const actions = { createPage: jest.fn() };
    await gn.createPages({ graphql, actions });
    // One call for the category, then a second for the post
    const calls = actions.createPage.mock.calls;
    // One post for each node plus one for the category
    expect(calls.length).toBe(edges.length + 1);
    // The first argument to the second call ...
    expect(calls[1][0].path).toEqual(slug);
    expect(calls[1][0].component).toContain("PageTemplate.js");
  });
});
