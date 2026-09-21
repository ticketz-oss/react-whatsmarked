import { ComponentType, ReactNode } from 'react';

interface WhatsMarkedProps {
  /** The text content to render with WhatsApp-style markup. */
  children?: ReactNode;
  /** Render as inline (no block elements). */
  oneline?: boolean;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Render text following WhatsApp markup patterns.
 *
 * Supports:
 * - *bold* → bold
 * - _italic_ → italic
 * - ~strikethrough~ → strikethrough
 * - `code` → inline code
 * - ```code blocks```
 * - > blockquotes
 * - - or * bullet lists
 * - 1. numbered lists
 * - URLs (auto-linked)
 * - ⣿gray text⣿
 * - @[base64] mentions (requires window.mentionRenderer)
 */
declare const WhatsMarked: ComponentType<WhatsMarkedProps>;

export default WhatsMarked;
