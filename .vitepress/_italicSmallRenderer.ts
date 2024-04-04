export default md => {
  const defaultRender = md.renderer.rules.em_open ?? function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.em_open = function (tokens, idx, options, env, self) {
    const content = tokens[idx + 1].content

    return content.startsWith('(')
      ? '<em class="small">'
      : defaultRender(tokens, idx, options, env, self)
  }
}
