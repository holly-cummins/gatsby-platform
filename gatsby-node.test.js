import gn from "./gatsby-node";

describe("the main gatsby thing", () => {
  it("makes pages for each category", async () => {
    const node = {
      node: { frontmatter: { category: "test-stuff" }, fields: { source: "some-source" } }
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

  it("aggregates categories which are the same", async () => {
    const node = {
      node: { frontmatter: { category: "test-stuff" }, fields: { source: "some-source" } }
    };
    const otherNode = {
      node: { frontmatter: { category: "other-stuff" }, fields: { source: "some-source" } }
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
    // The categories are all the same so should be consolidated
    expect(actions.createPage.mock.calls.length).toBe(2);
  });

  it("makes pages for posts", async () => {
    const slug = "slug-path";

    const node = {
      node: {
        frontmatter: { category: "test-stuff" },
        fields: { source: "posts", slug }
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
    // One post for each node plus one for the category
    expect(calls.length).toBe(edges.length + 1);
    // The first argument to the second call ...
    expect(calls[1][0].path).toEqual(slug);
    expect(calls[1][0].component).toContain("PostTemplate.js");
  });

  it("does not makes pages for publications (but does make a category)", async () => {
    const url = "http://myfamous.story";
    const node = {
      node: {
        frontmatter: { category: "pub-stuff", url },
        fields: { source: "publications" }
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
    // No posts for the nodes but one for the category
    expect(calls.length).toBe(1);
    // The first argument to the second call ...
    expect(calls[0][0].path).toEqual("/category/pub-stuff/");
  });

  it("makes pages for pages", async () => {
    const slug = "slug-path";

    const node = {
      node: {
        frontmatter: { category: "test-stuff" },
        fields: { source: "pages", slug }
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