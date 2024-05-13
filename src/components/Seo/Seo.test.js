import React from "react";
import { render } from "@testing-library/react";
import Helmet from "react-helmet";
import Seo from "./Seo";

const siteTitle = "sitebla";
const shortSiteTitle = "short site title";
const siteDescription = "This is a site which is inexplicably filled with test data.";
const siteUrl = "hannahbanana.com";
const pathPrefix = "!";
const authorTwitterAccount = "banana-tweets";
const siteImage = `${siteUrl}/banana.png`;

jest.mock("../../utils/configger", () => ({
  siteTitle,
  shortSiteTitle,
  siteDescription,
  siteUrl,
  siteImage: "hannahbanana.com/banana.png", // For Reasons, this can't reference the out of scope directly, or Jest complains
  pathPrefix,
  authorTwitterAccount
}));

describe("Seo component", () => {
  beforeAll(() => {});

  it("should render correct meta data for the front page", () => {
    render(<Seo />);
    const helmet = Helmet.peek();

    expect(helmet.title).toBe(siteTitle);

    expect(helmet.metaTags).toContainObject({
      name: "twitter:card",
      content: "summary"
    });

    expect(helmet.metaTags).toContainObject({
      property: "og:image",
      content: siteImage
    });

    expect(helmet.metaTags).toContainObject({
      property: "og:title",
      content: siteTitle
    });

    expect(helmet.metaTags).toContainObject({
      name: "description",
      content: siteDescription
    });

    expect(helmet.metaTags).toContainObject({
      property: "og:description",
      content: siteDescription
    });
  });

  it("should render correct meta data for a blog post", () => {
    const postTitle = "Post title";
    const postDescription = "Beginning sentence of a blog post.";
    const slug = "slugs-are-slimy/";
    const postImage = `${siteUrl}/slug.png`;

    const data = {
      frontmatter: {},
      fields: {
        slug,
        title: postTitle,
        cover: {
          childImageSharp: {
            gatsbyImageData: { images: { fallback: { src: postImage } } }
          }
        }
      },
      excerpt: postDescription
    };

    render(<Seo data={data} />);
    const helmet = Helmet.peek();

    const aggregateTitle = `${postTitle} - ${shortSiteTitle}`;
    expect(helmet.title).toBe(aggregateTitle);

    expect(helmet.metaTags).toContainObject({
      name: "description",
      content: postDescription
    });

    expect(helmet.metaTags).toContainObject({
      property: "og:title",
      content: aggregateTitle
    });

    expect(helmet.metaTags).toContainObject({
      property: "og:description",
      content: postDescription
    });

    expect(helmet.metaTags).toContainObject({
      property: "og:url",
      content: `${siteUrl}${pathPrefix}${slug}`
    });

    expect(helmet.metaTags).toContainObject({
      name: "twitter:card",
      content: "summary"
    });

    expect(helmet.metaTags).toContainObject({
      property: "og:image",
      content: postImage
    });
  });

  it("should default to site content where post content is missing", () => {
    const data = {};

    render(<Seo data={data} />);
    const helmet = Helmet.peek();

    expect(helmet.metaTags).toContainObject({
      property: "og:image",
      content: siteImage
    });
  });
});

// Custom matcher for array inspection
expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(received, expect.arrayContaining([expect.objectContaining(argument)]));

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} not to contain object ${this.utils.printExpected(argument)}`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} to contain object ${this.utils.printExpected(argument)}`,
        pass: false
      };
    }
  }
});
