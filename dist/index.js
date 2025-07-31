"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = markdownItPurifier;
var _dompurify = _interopRequireDefault(require("dompurify"));
var _jsdom = require("jsdom");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
let DOMPurify;
if (typeof window === 'undefined') {
  const {
    window
  } = new _jsdom.JSDOM('');
  DOMPurify = (0, _dompurify.default)(window);
} else {
  DOMPurify = (0, _dompurify.default)(window);
}
function markdownItPurifier(md, options = {}) {
  md.core.ruler.push('sanitize', function (state) {
    state.tokens.forEach(token => {
      if (token.type === 'html_block') {
        token.content = DOMPurify.sanitize(token.content, options);
      }
      if (token.type === 'inline' && token.children) {
        const sanitizedChildren = [];
        let buffer = '';
        let inHtmlBlock = false;
        token.children.forEach(child => {
          const isStartTag = /^<[^/][^>]*>$/.test(child.content);
          const isEndTag = /^<\/[^>]+>$/.test(child.content);
          if (inHtmlBlock) {
            buffer += child.content;
            if (isEndTag) {
              sanitizedChildren.push({
                type: 'html_inline',
                content: DOMPurify.sanitize(buffer, options),
                level: child.level
              });
              buffer = '';
              inHtmlBlock = false;
            }
          } else {
            if (isStartTag) {
              inHtmlBlock = true;
              buffer += child.content;
            } else {
              sanitizedChildren.push(child);
            }
          }
        });
        if (buffer.length > 0) {
          sanitizedChildren.push({
            type: 'html_inline',
            content: DOMPurify.sanitize(buffer, options),
            level: 0
          });
        }
        token.children = sanitizedChildren;
      }
    });
  });
}