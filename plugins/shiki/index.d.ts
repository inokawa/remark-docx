import { RemarkDocxPlugin } from '../../types';
import { BundledTheme } from 'shiki';
export interface ShikiPluginOptions {
    /**
     * https://shiki.style/themes
     */
    theme: BundledTheme;
}
/**
 * A plugin to render "code" nodes, with syntax highlighting powered by shiki.
 */
export declare const shikiPlugin: ({ theme, }: ShikiPluginOptions) => RemarkDocxPlugin;
