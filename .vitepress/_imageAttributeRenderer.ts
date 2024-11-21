export default (md) => {
  const defaultRender = md.renderer.rules.image ?? function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]

    const title = token.attrGet('title')
    const attrs = title && title.match(/attrs={(.+)}/)

    return attrs
      ? `<img src="${token.attrGet('src') }" alt="${token.attrGet('alt') }" ${attrs[1]} />`
      : defaultRender(tokens, idx, options, env, self)
  }
}
