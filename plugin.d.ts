import { Plugin } from 'unified';
import { Root } from 'mdast';
import { DocxOptions } from './mdast-util-to-docx';
export type { DocxOptions };
declare const plugin: Plugin<[DocxOptions?], Root, Uint8Array>;
export default plugin;
