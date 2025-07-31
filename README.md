# markdown-it-purifier

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin that sanitizes `html_block` and `html_inline` tokens using [DOMPurify](https://github.com/cure53/DOMPurify).  
This helps prevent XSS and ensures only safe HTML is rendered from Markdown.

## ✨ Features

- Sanitizes embedded HTML inside Markdown
- Supports `html_block` and `html_inline` tokens
- Passes options directly to DOMPurify (`ADD_TAGS`, `ALLOWED_TAGS`, etc.)
- Easy to use and minimal

## 📦 Installation

```bash
npm install markdown-it-purifier dompurify
```

⚠️ You must install dompurify and markdown-it yourself — this plugin declares them as peerDependencies.

## 🚀 Usage

```js
import MarkdownIt from 'markdown-it'
import markdownItPurifier from 'markdown-it-purifier'

const md = new MarkdownIt({ html: true })

md.use(markdownItPurifier, {
  // These options are passed directly to DOMPurify
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['src', 'width', 'height', 'allow', 'allowfullscreen']
})

const result = md.render(`
# Hello

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>
`)
console.log(result)
```

## ⚙️ Options

You can pass any DOMPurify options directly into this plugin.

* To add tags or attributes, use `ADD_TAGS` / `ADD_ATTR`.
* To fully override the whitelist, use `ALLOWED_TAGS` / `ALLOWED_ATTR`.

⚠️ When you use ALLOWED_TAGS or ALLOWED_ATTR, DOMPurify will not merge with the default list.
You must specify all tags or attributes you want to allow.

## 🛡️ Security

This plugin uses DOMPurify internally and does not maintain its own allowlist.
Make sure to review the DOMPurify security docs if you're processing untrusted user input.

## 📄 License

MIT
