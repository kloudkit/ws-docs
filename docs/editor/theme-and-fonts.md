---
outline: deep
---

# Theme & Fonts

## Fonts

All typography was carefully selected according to its intended place of use, such as in
the terminal, editor, or as comments.

### Terminal

We utilize the [MesloLGS *(nerd)*][MesloLGS] font in the terminal, which is designed to
support the display of custom ligatures and glyphs *(to enhance the visual clarity)*.

Check out the [cheat sheet](https://www.nerdfonts.com/cheat-sheet) for all available
glyphs.

### Editor

We utilize the [FiraCode][] font in the editor.
It is favored for its programming-friendly ligatures that enhance readability and improve
coding syntax visually.

### Comments

We employ the [Victor Mono][] font specifically for comments, where its italic version
presents text in a cursive *(handwriting)* style.
This choice is made to inject a distinctive stylistic touch, clearly differentiating
comments from code.

::: warning
The *Victor Mono* font is not available as *TrueType* font.
:::

#### Opt-out

Some users may not favor this stylistic choice.
To disable the custom comments font, set the `WS_COMMENTS_DISABLE_FONT` environment
variable to a *truthy* value *(either `1` or `true`)*:

```sh{2}
docker run \
  -e WS_COMMENTS_DISABLE_FONT=1 \
  ghcr.io/kloudkit/workspace:latest
```

## Installing on a Local Machine

Fonts are provided directly through the *workspace* as *WebFonts*, eliminating the need
for local installation.

However, when accessing the *workspace* over SSH, you might find that certain fonts are
absent or display improperly on your local machine.

To address this, we offer a small HTTP server that can be initiated from within the
*workspace*, enabling you to easily download the pre-packaged fonts via your web browser.
To start the server, execute the following command:

```sh
# Default port: 38080
ws fonts server

# Alternate port:
ws fonts server --port 12345
```

Download the missing font and install them on your machine:

- **Windows:** Right-click the font file and select `"Install"`.
    Alternatively, open the Control Panel, click on `"Fonts"`.
    Then drag and drop the file into this folder.
- **Mac:** Double-click the font file and then click `"Install Font"` in the preview
    window that opens.

## Licenses

The table below describes the pre-package fonts and their respective license.

👏 Many thanks to the amazing designers of these fonts.

| Name                | License  |
| ------------------- | -------- |
| **[FiraCode][]**    | OFL 1.1  |
| **[MesloLGS][]**    | Apache 2 |
| **[Victor Mono][]** | OFL 1.1  |

[FiraCode]: https://github.com/tonsky/FiraCode
[MesloLGS]: https://github.com/romkatv/powerlevel10k-media
[Victor Mono]: https://github.com/rubjo/victor-mono
