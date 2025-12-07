import type { Paragraph, ParagraphChild, Table, TableOfContents } from "docx";

export type DocxChild = Paragraph | Table | TableOfContents;
export type DocxContent = DocxChild | ParagraphChild;
