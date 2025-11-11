/*
MIT License

Copyright (c) 2025 Claudemir Todo Bom <claudemir@todobom.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React from "react";
import { marked } from "marked";

import "./react-whatsmarked.css";

function escapeHTML(html) {
  return html.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

class CustomRenderer extends marked.Renderer {
  heading(input) {
    return marked.parseInline(input.raw);
  }

  em(input) {
    const { raw, tokens } = input;
    if (raw.startsWith("*")) {
      return `<strong>${this.parser.parseInline(tokens)}</strong>`;
    }

    return `<em>${this.parser.parseInline(tokens)}</em>`;
  }

  strong(input) {
    const { raw, tokens } = input;
    const firstChar = raw.charAt(0);
    if (firstChar === "_") {
      return `${firstChar}<em>${this.parser.parseInline(tokens)}</em>${firstChar}`;
    }

    return `${firstChar}<strong>${this.parser.parseInline(tokens)}</strong>${firstChar}`;
  }

  codespan(input) {
    return `<code>${escapeHTML(input.text)}</code>`;
  }

  unsupported(input) {
    console.debug(input);
    return input.raw.replace("\n", "<br>");
  }

  checkbox(input) {
    return input.checked ? "<tt>[X]</tt>" : "<tt>[ ]</tt>";
  }

  table(input) {
    return this.unsupported(input);
  }

  link({ href, text, raw }) {
    if (href === raw) {
      return `<a href="${href}" target="_blank">${text}</a>`;
    }
    return raw.replace("\n", "<br>");
  }

  html({ text }) {
    return escapeHTML(text);
  }

  space(input) {
    return input.raw.replace("\n\n", "").replaceAll("\n", "<br>");
  }

}

// use ⣿ for gray text
const gray = {
  name: 'gray',
  level: 'inline',
  start(src) { return src.indexOf('⣿'); },
  tokenizer(src, _tokens) {
    const rule = /^⣿(?=\S)(.*\S)⣿/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'gray',
        raw: match[0],
        text: match[1].trim(),
      };
    }
  },
  renderer(token) {
    return `<span class="graytext">${escapeHTML(token.text)}</span>`;
  },
};

// mention syntax: @[base64-encoded-json]
const mention = {
  name: 'mention',
  level: 'inline',
  start(src) { return src.indexOf('@[eyJ'); },
  tokenizer(src) {
    if (!window.mentionRenderer) {
      return;
    }
    const rule = /^@\[(eyJ.*?)\]/;
    const match = rule.exec(src);
    if (match) {
      try {
        const jsonStr = atob(match[1]);
        const payload = JSON.parse(jsonStr);
        return {
          type: 'mention',
          raw: match[0],
          payload,
        };
      } catch (e) {
        // no op
      }
    }
  },
  renderer(token) {
    return window.mentionRenderer(token.payload);
  },
};

const renderer = new CustomRenderer();

marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

marked.use({ extensions: [gray, mention] });

const WhatsMarked = ({ children, oneline, className }) => {
  if (!children) return null;

  // insert blank line after blockquotes
  children = children.replace(/^(>.*)(\n(?!\n))/gm, "$1\n$2");

  const htmlContent = oneline ? marked.parseInline(children) : marked.parse(children);

  return <div
    className={className || oneline ? "whatsmarkedOneline" : "whatsmarked"}
    dangerouslySetInnerHTML={{ __html: htmlContent }}
  />;
};

export default WhatsMarked;
