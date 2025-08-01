import MarkdownIt from 'markdown-it'
import purifier from '../dist/index.node.js'

function render(mdText, options = {}) {
  const md = new MarkdownIt({ html: true }).use(purifier, options);
  return md.render(mdText);
}

describe('markdown-it-purifier', () => {
  test('sanitizes html_block', () => {
    const md = `<div onclick="alert('xss')">Safe</div>`;
    const html = render(md);
    expect(html).toContain('<div>Safe</div>');
    expect(html).not.toContain('onclick');
  });

  test('sanitizes html_inline', () => {
    const md = `hello <span onclick="x()">world</span>`;
    const html = render(md);
    expect(html).toContain('<span>world</span>');
    expect(html).not.toContain('onclick');
  });

  test('does not affect normal markdown', () => {
    const md = `**bold**`;
    const html = render(md);
    expect(html).toContain('<strong>bold</strong>');
  });

  test('allows additional tags via ADD_TAGS', () => {
    const md = `<iframe src="x"></iframe>`;
    const html = render(md, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['src'],
    });
    expect(html).toContain('<iframe src="x"></iframe>');
  });

  test('removes allowed attribute via FORBID_ATTR', () => {
    const md = `<a href="https://example.com">link</a>`;
    const html = render(md, {
      FORBID_ATTR: ['href'],
    });
    expect(html).toContain('<a>link</a>');
    expect(html).not.toContain('href');
  });

  test('removes allowed tag via FORBID_TAGS', () => {
    const md = `<strong>bold</strong>`;
    const html = render(md, {
      FORBID_TAGS: ['strong'],
    });
    expect(html).not.toContain('<strong>');
    expect(html).toContain('bold');
  });
});
