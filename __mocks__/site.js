module.exports = {
  cover: {
    children: [
      {
        fluid: {
          base64: "data:image/png;base64,iV==",
          aspectRatio: 1,
          src: "/static/somewhere.png",
          srcSet: "/static/somewhere.png 75w",
          sizes: "(max-width: 300px) 100vw, 300px"
        }
      }
    ]
  }
};
