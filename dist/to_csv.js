"use strict";
/***
 *
 * `to_csv.ts` contains CSV output routines.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.quote_except_numbers = exports.quote_strict_nl = exports.quote_minimal = exports.quote_always = exports.quoters = exports.quote_when_contains = exports.quote_frame = exports.stringify_make_row = exports.to_csv = void 0;
/***
 *
 * Perform a quoting
 *
 * @param s The cell string data
 *
 * @returns The string provided, quoted
 *
 */
function quote_frame(s, quot, emquot) {
    return `${quot}${s.toString().replaceAll(quot, emquot)}${quot}`;
}
exports.quote_frame = quote_frame;
/***
 *
 * Quoting metafunction that handles quoting given an array of triggers
 *
 * @param s     The cell string data
 * @param conts An array of trigger strings
 *
 * @returns The string provided, quoted when containing anything from `conts`
 *
 */
function quote_when_contains(s, conts, quot, emquot) {
    const hasAnyItem = conts.some((d) => s.includes(d));
    return hasAnyItem ? quote_frame(s, quot, emquot) : s;
}
exports.quote_when_contains = quote_when_contains;
/***
 *
 * Quote every cell
 *
 * @param cell The cell data
 *
 * @returns The string provided, quoted
 *
 */
function quote_always(c, _sep = ",", _nl = "\r\n", quot = '"', emquot = '""') {
    return quote_frame(c, quot, emquot);
}
exports.quote_always = quote_always;
/***
 *
 * Quote only that which needs to be quoted (strings containing `",\r\n`)
 *
 * @param cell The cell data
 *
 * @returns The string provided, quoted when containing `"`, `,`, `\r`, or `\n`
 *
 */
function quote_minimal(c, sep = ",", nl = "\r\v", quot = '"', emquot = '""') {
    const uitems = [sep, nl, quot, emquot, '\r', '\n'], // adding \r and \n isn't strictly correct, but most parsers break if strays aren't quoted, despite the rfc
    items = uitems.filter((x) => x !== undefined);
    return quote_when_contains(c, items, quot, emquot);
}
exports.quote_minimal = quote_minimal;
/***
 *
 * Quote only that which needs to be quoted.  Pass carriage returns and newlines individually without quoting (which is
 * strictly correct, but which few parsers will handle correctly.)
 *
 * @param cell The cell data
 *
 * @returns The string provided, quoted when containing `"`, `,`, or `\r\n`
 *
 */
function quote_strict_nl(c, sep = ',', _nl = '\r\n', quot = '"', emquot = '""') {
    return quote_when_contains(c, ['\r\n', sep, quot, emquot], quot, emquot);
}
exports.quote_strict_nl = quote_strict_nl;
/***
 *
 * Quote things which do not appear to be numbers (that is, which contain characters other than 0-9, period, + and -.)
 *
 * @param cell The cell data
 *
 * @returns The string provided, quoted if not believed to be a number
 *
 */
function quote_except_numbers(cell, _sep = ',', _nl = '\r\n', quot = '"', emquot = '""') {
    return (!isNaN(parseFloat(cell))) ? cell : quote_frame(cell, quot, emquot);
}
exports.quote_except_numbers = quote_except_numbers;
/***
 *
 * Makes a single CSV document's row.
 *
 * ```
 * import { stringify_make_row, quote_minimal, quote_always } from 'csv_by_rfc';
 *
 * stringify_make_row([1,2,3], quote_minimal, ",");
 * // returns '1,2,3'
 *
 * stringify_make_row([4,5,6], quote_always, ":");
 * // returns '"4":"5":"6"'
 * ```
 *
 * @param rowdata   The data underlying this row only
 * @param quoter    A function responsible for making decisions about quoting the cell's data
 * @param separator The string used inbetween cells
 *
 * @returns The row as a CSV substring
 *
 */
function stringify_make_row(rowdata, quoter, separator, newline, quote, emquote) {
    return rowdata.map((r) => quoter(r, separator, newline, quote, emquote))
        .join(separator);
}
exports.stringify_make_row = stringify_make_row;
/***
 *
 * # Main method
 *
 * Converts Javascript array data to CSV string data.
 *
 * This is the module's main method.  Almost all use of this module should be through this method.
 *
 * ## Basic usage
 *
 * The module is pre-loaded with sensible defaults; as a result, generally it's good enough to just call this with your
 * data, like so:
 *
 * ```
 * import { to_csv } from 'csv_by_rfc';
 *
 * const data = [ ['ace', 'deuce', 'tres'], [1, 2, 3] ],
 *       csv  = to_csv(data);
 *
 * console.log(csv);  // 'ace,deuce,tres\r\n1,2,3'
 * ```
 *
 * ## Embedded wacky text
 *
 * Of course, much of the purpose of a module like this is to make sure that the gross bits have been properly handled:
 *
 * ```
 * import { to_csv } from 'csv_by_rfc';
 *
 * const data = [ ['ace', 'deuce'], [1, 2], ['a"b', 'c\r\nd'] ];
 * console.log( to_csv(data) );  // 'ace,deuce\r\n1,2\r\n"a""b","c\r\nd"'
 * ```
 *
 * ## Configuration
 *
 * whargarbl todo
 *
 * @param data       The CSV's dataset
 * @param headers    An array of strings to be used as the header row
 * @param quoter     A function to determine how and when to quote individual cells
 * @param separator  What string to use inbetween cells
 * @param newline    What string to use inbetween rows
 *
 * @returns The dataset as a CSV string
 *
 */
function to_csv(data, { headers = false, quoter = quote_minimal, separator = ',', newline = '\r\n', quote = '"', embed_quote = '""' } = {}) {
    const header = headers ? (stringify_make_row(headers, quoter, separator, newline, quote, embed_quote) + newline)
        : '';
    const body = data.map((hd) => stringify_make_row(hd, quoter, separator, newline, quote, embed_quote))
        .join(newline);
    return header + body;
}
exports.to_csv = to_csv;
const quoters = {
    minimal: quote_minimal,
    always: quote_always,
    except_numbers: quote_except_numbers,
    strict_nl: quote_strict_nl
};
exports.quoters = quoters;
//# sourceMappingURL=to_csv.js.map