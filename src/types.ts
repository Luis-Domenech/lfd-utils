/**
 * Function overload for indent function. This allows string to beplaced as first parameter or last
 */
export type IndentOverload = {
  <T extends string>(to_indent?: string, indent_amount?: number, indent_spaces?: number): string
  (indent_amount?: number, indent_spaces?: number, to_indent?: string): string
}