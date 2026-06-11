import { Plugin } from 'unified';
import { Root } from 'mdast';
import { DocxOptions } from './mdast-util-to-docx';
export type { DocxOptions };
declare module "unified" {
    interface CompileResultMap {
        docx: Promise<ArrayBuffer>;
    }
}
declare const plugin: Plugin<[DocxOptions?], Root, Promise<ArrayBuffer>>;
export default plugin;
