export default (md) => {
  const defaultRender =
    md.renderer.rules.image ??
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    let alt = token.attrGet("alt");
    let src = token.attrGet("src");
    let title = token.attrGet("title");

    return title && title.startsWith("class=")
      ? `<img src="${src}" alt="${alt}" class="${title.replace(
          "class=",
          ""
        )}" />`
      : defaultRender(tokens, idx, options, env, self);
  };
};
