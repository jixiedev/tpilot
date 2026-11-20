(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/mdast-util-gfm-autolink-literal/node_modules/micromark-util-symbol/lib/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65_279,
    // Unicode Specials block.
    replacementCharacter: 65_533 // `�`
};
}),
"[project]/frontend/node_modules/mdast-util-gfm-footnote/node_modules/micromark-util-symbol/lib/values.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * While micromark works based on character codes, this module includes the
 * string versions of ’em.
 * The C0 block, except for LF, CR, HT, and w/ the replacement character added,
 * are available here.
 */ __turbopack_context__.s([
    "values",
    ()=>values
]);
const values = {
    ht: '\t',
    lf: '\n',
    cr: '\r',
    space: ' ',
    exclamationMark: '!',
    quotationMark: '"',
    numberSign: '#',
    dollarSign: '$',
    percentSign: '%',
    ampersand: '&',
    apostrophe: "'",
    leftParenthesis: '(',
    rightParenthesis: ')',
    asterisk: '*',
    plusSign: '+',
    comma: ',',
    dash: '-',
    dot: '.',
    slash: '/',
    digit0: '0',
    digit1: '1',
    digit2: '2',
    digit3: '3',
    digit4: '4',
    digit5: '5',
    digit6: '6',
    digit7: '7',
    digit8: '8',
    digit9: '9',
    colon: ':',
    semicolon: ';',
    lessThan: '<',
    equalsTo: '=',
    greaterThan: '>',
    questionMark: '?',
    atSign: '@',
    uppercaseA: 'A',
    uppercaseB: 'B',
    uppercaseC: 'C',
    uppercaseD: 'D',
    uppercaseE: 'E',
    uppercaseF: 'F',
    uppercaseG: 'G',
    uppercaseH: 'H',
    uppercaseI: 'I',
    uppercaseJ: 'J',
    uppercaseK: 'K',
    uppercaseL: 'L',
    uppercaseM: 'M',
    uppercaseN: 'N',
    uppercaseO: 'O',
    uppercaseP: 'P',
    uppercaseQ: 'Q',
    uppercaseR: 'R',
    uppercaseS: 'S',
    uppercaseT: 'T',
    uppercaseU: 'U',
    uppercaseV: 'V',
    uppercaseW: 'W',
    uppercaseX: 'X',
    uppercaseY: 'Y',
    uppercaseZ: 'Z',
    leftSquareBracket: '[',
    backslash: '\\',
    rightSquareBracket: ']',
    caret: '^',
    underscore: '_',
    graveAccent: '`',
    lowercaseA: 'a',
    lowercaseB: 'b',
    lowercaseC: 'c',
    lowercaseD: 'd',
    lowercaseE: 'e',
    lowercaseF: 'f',
    lowercaseG: 'g',
    lowercaseH: 'h',
    lowercaseI: 'i',
    lowercaseJ: 'j',
    lowercaseK: 'k',
    lowercaseL: 'l',
    lowercaseM: 'm',
    lowercaseN: 'n',
    lowercaseO: 'o',
    lowercaseP: 'p',
    lowercaseQ: 'q',
    lowercaseR: 'r',
    lowercaseS: 's',
    lowercaseT: 't',
    lowercaseU: 'u',
    lowercaseV: 'v',
    lowercaseW: 'w',
    lowercaseX: 'x',
    lowercaseY: 'y',
    lowercaseZ: 'z',
    leftCurlyBrace: '{',
    verticalBar: '|',
    rightCurlyBrace: '}',
    tilde: '~',
    replacementCharacter: '�'
};
}),
"[project]/frontend/node_modules/mdast-util-to-markdown/node_modules/micromark-util-symbol/lib/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65_279,
    // Unicode Specials block.
    replacementCharacter: 65_533 // `�`
};
}),
"[project]/frontend/node_modules/mdast-util-to-markdown/node_modules/micromark-util-symbol/lib/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */ __turbopack_context__.s([
    "constants",
    ()=>constants
]);
const constants = {
    attentionSideAfter: 2,
    attentionSideBefore: 1,
    atxHeadingOpeningFenceSizeMax: 6,
    autolinkDomainSizeMax: 63,
    autolinkSchemeSizeMax: 32,
    cdataOpeningString: 'CDATA[',
    characterGroupPunctuation: 2,
    characterGroupWhitespace: 1,
    characterReferenceDecimalSizeMax: 7,
    characterReferenceHexadecimalSizeMax: 6,
    characterReferenceNamedSizeMax: 31,
    codeFencedSequenceSizeMin: 3,
    contentTypeContent: 'content',
    contentTypeDocument: 'document',
    contentTypeFlow: 'flow',
    contentTypeString: 'string',
    contentTypeText: 'text',
    hardBreakPrefixSizeMin: 2,
    htmlBasic: 6,
    htmlCdata: 5,
    htmlComment: 2,
    htmlComplete: 7,
    htmlDeclaration: 4,
    htmlInstruction: 3,
    htmlRawSizeMax: 8,
    htmlRaw: 1,
    linkResourceDestinationBalanceMax: 32,
    linkReferenceSizeMax: 999,
    listItemValueSizeMax: 10,
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 0x10,
    tabSize: 4,
    thematicBreakMarkerCountMin: 3,
    v8MaxSafeChunkSize: 10_000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
};
}),
"[project]/frontend/node_modules/micromark-extension-cjk-friendly-util/node_modules/micromark-util-symbol/lib/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65_279,
    // Unicode Specials block.
    replacementCharacter: 65_533 // `�`
};
}),
"[project]/frontend/node_modules/micromark-extension-cjk-friendly-util/node_modules/micromark-util-symbol/lib/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */ __turbopack_context__.s([
    "constants",
    ()=>constants
]);
const constants = {
    attentionSideAfter: 2,
    attentionSideBefore: 1,
    atxHeadingOpeningFenceSizeMax: 6,
    autolinkDomainSizeMax: 63,
    autolinkSchemeSizeMax: 32,
    cdataOpeningString: 'CDATA[',
    characterGroupPunctuation: 2,
    characterGroupWhitespace: 1,
    characterReferenceDecimalSizeMax: 7,
    characterReferenceHexadecimalSizeMax: 6,
    characterReferenceNamedSizeMax: 31,
    codeFencedSequenceSizeMin: 3,
    contentTypeContent: 'content',
    contentTypeDocument: 'document',
    contentTypeFlow: 'flow',
    contentTypeString: 'string',
    contentTypeText: 'text',
    hardBreakPrefixSizeMin: 2,
    htmlBasic: 6,
    htmlCdata: 5,
    htmlComment: 2,
    htmlComplete: 7,
    htmlDeclaration: 4,
    htmlInstruction: 3,
    htmlRawSizeMax: 8,
    htmlRaw: 1,
    linkResourceDestinationBalanceMax: 32,
    linkReferenceSizeMax: 999,
    listItemValueSizeMax: 10,
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 0x10,
    tabSize: 4,
    thematicBreakMarkerCountMin: 3,
    v8MaxSafeChunkSize: 10_000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-autolink-literal/node_modules/micromark-util-symbol/lib/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65_279,
    // Unicode Specials block.
    replacementCharacter: 65_533 // `�`
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-autolink-literal/node_modules/micromark-util-symbol/lib/values.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * While micromark works based on character codes, this module includes the
 * string versions of ’em.
 * The C0 block, except for LF, CR, HT, and w/ the replacement character added,
 * are available here.
 */ __turbopack_context__.s([
    "values",
    ()=>values
]);
const values = {
    ht: '\t',
    lf: '\n',
    cr: '\r',
    space: ' ',
    exclamationMark: '!',
    quotationMark: '"',
    numberSign: '#',
    dollarSign: '$',
    percentSign: '%',
    ampersand: '&',
    apostrophe: "'",
    leftParenthesis: '(',
    rightParenthesis: ')',
    asterisk: '*',
    plusSign: '+',
    comma: ',',
    dash: '-',
    dot: '.',
    slash: '/',
    digit0: '0',
    digit1: '1',
    digit2: '2',
    digit3: '3',
    digit4: '4',
    digit5: '5',
    digit6: '6',
    digit7: '7',
    digit8: '8',
    digit9: '9',
    colon: ':',
    semicolon: ';',
    lessThan: '<',
    equalsTo: '=',
    greaterThan: '>',
    questionMark: '?',
    atSign: '@',
    uppercaseA: 'A',
    uppercaseB: 'B',
    uppercaseC: 'C',
    uppercaseD: 'D',
    uppercaseE: 'E',
    uppercaseF: 'F',
    uppercaseG: 'G',
    uppercaseH: 'H',
    uppercaseI: 'I',
    uppercaseJ: 'J',
    uppercaseK: 'K',
    uppercaseL: 'L',
    uppercaseM: 'M',
    uppercaseN: 'N',
    uppercaseO: 'O',
    uppercaseP: 'P',
    uppercaseQ: 'Q',
    uppercaseR: 'R',
    uppercaseS: 'S',
    uppercaseT: 'T',
    uppercaseU: 'U',
    uppercaseV: 'V',
    uppercaseW: 'W',
    uppercaseX: 'X',
    uppercaseY: 'Y',
    uppercaseZ: 'Z',
    leftSquareBracket: '[',
    backslash: '\\',
    rightSquareBracket: ']',
    caret: '^',
    underscore: '_',
    graveAccent: '`',
    lowercaseA: 'a',
    lowercaseB: 'b',
    lowercaseC: 'c',
    lowercaseD: 'd',
    lowercaseE: 'e',
    lowercaseF: 'f',
    lowercaseG: 'g',
    lowercaseH: 'h',
    lowercaseI: 'i',
    lowercaseJ: 'j',
    lowercaseK: 'k',
    lowercaseL: 'l',
    lowercaseM: 'm',
    lowercaseN: 'n',
    lowercaseO: 'o',
    lowercaseP: 'p',
    lowercaseQ: 'q',
    lowercaseR: 'r',
    lowercaseS: 's',
    lowercaseT: 't',
    lowercaseU: 'u',
    lowercaseV: 'v',
    lowercaseW: 'w',
    lowercaseX: 'x',
    lowercaseY: 'y',
    lowercaseZ: 'z',
    leftCurlyBrace: '{',
    verticalBar: '|',
    rightCurlyBrace: '}',
    tilde: '~',
    replacementCharacter: '�'
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-footnote/node_modules/micromark-util-symbol/lib/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65_279,
    // Unicode Specials block.
    replacementCharacter: 65_533 // `�`
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-footnote/node_modules/micromark-util-symbol/lib/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */ __turbopack_context__.s([
    "constants",
    ()=>constants
]);
const constants = {
    attentionSideAfter: 2,
    attentionSideBefore: 1,
    atxHeadingOpeningFenceSizeMax: 6,
    autolinkDomainSizeMax: 63,
    autolinkSchemeSizeMax: 32,
    cdataOpeningString: 'CDATA[',
    characterGroupPunctuation: 2,
    characterGroupWhitespace: 1,
    characterReferenceDecimalSizeMax: 7,
    characterReferenceHexadecimalSizeMax: 6,
    characterReferenceNamedSizeMax: 31,
    codeFencedSequenceSizeMin: 3,
    contentTypeContent: 'content',
    contentTypeDocument: 'document',
    contentTypeFlow: 'flow',
    contentTypeString: 'string',
    contentTypeText: 'text',
    hardBreakPrefixSizeMin: 2,
    htmlBasic: 6,
    htmlCdata: 5,
    htmlComment: 2,
    htmlComplete: 7,
    htmlDeclaration: 4,
    htmlInstruction: 3,
    htmlRawSizeMax: 8,
    htmlRaw: 1,
    linkResourceDestinationBalanceMax: 32,
    linkReferenceSizeMax: 999,
    listItemValueSizeMax: 10,
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 0x10,
    tabSize: 4,
    thematicBreakMarkerCountMin: 3,
    v8MaxSafeChunkSize: 10_000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-footnote/node_modules/micromark-util-symbol/lib/types.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Here is the list of all types of tokens exposed by micromark, with a short
 * explanation of what they include and where they are found.
 * In picking names, generally, the rule is to be as explicit as possible
 * instead of reusing names.
 * For example, there is a `definitionDestination` and a `resourceDestination`,
 * instead of one shared name.
 */ // Note: when changing the next record, you must also change `TokenTypeMap`
// in `micromark-util-types/index.d.ts`.
__turbopack_context__.s([
    "types",
    ()=>types
]);
const types = {
    // Generic type for data, such as in a title, a destination, etc.
    data: 'data',
    // Generic type for syntactic whitespace (tabs, virtual spaces, spaces).
    // Such as, between a fenced code fence and an info string.
    whitespace: 'whitespace',
    // Generic type for line endings (line feed, carriage return, carriage return +
    // line feed).
    lineEnding: 'lineEnding',
    // A line ending, but ending a blank line.
    lineEndingBlank: 'lineEndingBlank',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the start of a
    // line.
    linePrefix: 'linePrefix',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the end of a
    // line.
    lineSuffix: 'lineSuffix',
    // Whole ATX heading:
    //
    // ```markdown
    // #
    // ## Alpha
    // ### Bravo ###
    // ```
    //
    // Includes `atxHeadingSequence`, `whitespace`, `atxHeadingText`.
    atxHeading: 'atxHeading',
    // Sequence of number signs in an ATX heading (`###`).
    atxHeadingSequence: 'atxHeadingSequence',
    // Content in an ATX heading (`alpha`).
    // Includes text.
    atxHeadingText: 'atxHeadingText',
    // Whole autolink (`<https://example.com>` or `<admin@example.com>`)
    // Includes `autolinkMarker` and `autolinkProtocol` or `autolinkEmail`.
    autolink: 'autolink',
    // Email autolink w/o markers (`admin@example.com`)
    autolinkEmail: 'autolinkEmail',
    // Marker around an `autolinkProtocol` or `autolinkEmail` (`<` or `>`).
    autolinkMarker: 'autolinkMarker',
    // Protocol autolink w/o markers (`https://example.com`)
    autolinkProtocol: 'autolinkProtocol',
    // A whole character escape (`\-`).
    // Includes `escapeMarker` and `characterEscapeValue`.
    characterEscape: 'characterEscape',
    // The escaped character (`-`).
    characterEscapeValue: 'characterEscapeValue',
    // A whole character reference (`&amp;`, `&#8800;`, or `&#x1D306;`).
    // Includes `characterReferenceMarker`, an optional
    // `characterReferenceMarkerNumeric`, in which case an optional
    // `characterReferenceMarkerHexadecimal`, and a `characterReferenceValue`.
    characterReference: 'characterReference',
    // The start or end marker (`&` or `;`).
    characterReferenceMarker: 'characterReferenceMarker',
    // Mark reference as numeric (`#`).
    characterReferenceMarkerNumeric: 'characterReferenceMarkerNumeric',
    // Mark reference as numeric (`x` or `X`).
    characterReferenceMarkerHexadecimal: 'characterReferenceMarkerHexadecimal',
    // Value of character reference w/o markers (`amp`, `8800`, or `1D306`).
    characterReferenceValue: 'characterReferenceValue',
    // Whole fenced code:
    //
    // ````markdown
    // ```js
    // alert(1)
    // ```
    // ````
    codeFenced: 'codeFenced',
    // A fenced code fence, including whitespace, sequence, info, and meta
    // (` ```js `).
    codeFencedFence: 'codeFencedFence',
    // Sequence of grave accent or tilde characters (` ``` `) in a fence.
    codeFencedFenceSequence: 'codeFencedFenceSequence',
    // Info word (`js`) in a fence.
    // Includes string.
    codeFencedFenceInfo: 'codeFencedFenceInfo',
    // Meta words (`highlight="1"`) in a fence.
    // Includes string.
    codeFencedFenceMeta: 'codeFencedFenceMeta',
    // A line of code.
    codeFlowValue: 'codeFlowValue',
    // Whole indented code:
    //
    // ```markdown
    //     alert(1)
    // ```
    //
    // Includes `lineEnding`, `linePrefix`, and `codeFlowValue`.
    codeIndented: 'codeIndented',
    // A text code (``` `alpha` ```).
    // Includes `codeTextSequence`, `codeTextData`, `lineEnding`, and can include
    // `codeTextPadding`.
    codeText: 'codeText',
    codeTextData: 'codeTextData',
    // A space or line ending right after or before a tick.
    codeTextPadding: 'codeTextPadding',
    // A text code fence (` `` `).
    codeTextSequence: 'codeTextSequence',
    // Whole content:
    //
    // ```markdown
    // [a]: b
    // c
    // =
    // d
    // ```
    //
    // Includes `paragraph` and `definition`.
    content: 'content',
    // Whole definition:
    //
    // ```markdown
    // [micromark]: https://github.com/micromark/micromark
    // ```
    //
    // Includes `definitionLabel`, `definitionMarker`, `whitespace`,
    // `definitionDestination`, and optionally `lineEnding` and `definitionTitle`.
    definition: 'definition',
    // Destination of a definition (`https://github.com/micromark/micromark` or
    // `<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteral` or `definitionDestinationRaw`.
    definitionDestination: 'definitionDestination',
    // Enclosed destination of a definition
    // (`<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteralMarker` and optionally
    // `definitionDestinationString`.
    definitionDestinationLiteral: 'definitionDestinationLiteral',
    // Markers of an enclosed definition destination (`<` or `>`).
    definitionDestinationLiteralMarker: 'definitionDestinationLiteralMarker',
    // Unenclosed destination of a definition
    // (`https://github.com/micromark/micromark`).
    // Includes `definitionDestinationString`.
    definitionDestinationRaw: 'definitionDestinationRaw',
    // Text in an destination (`https://github.com/micromark/micromark`).
    // Includes string.
    definitionDestinationString: 'definitionDestinationString',
    // Label of a definition (`[micromark]`).
    // Includes `definitionLabelMarker` and `definitionLabelString`.
    definitionLabel: 'definitionLabel',
    // Markers of a definition label (`[` or `]`).
    definitionLabelMarker: 'definitionLabelMarker',
    // Value of a definition label (`micromark`).
    // Includes string.
    definitionLabelString: 'definitionLabelString',
    // Marker between a label and a destination (`:`).
    definitionMarker: 'definitionMarker',
    // Title of a definition (`"x"`, `'y'`, or `(z)`).
    // Includes `definitionTitleMarker` and optionally `definitionTitleString`.
    definitionTitle: 'definitionTitle',
    // Marker around a title of a definition (`"`, `'`, `(`, or `)`).
    definitionTitleMarker: 'definitionTitleMarker',
    // Data without markers in a title (`z`).
    // Includes string.
    definitionTitleString: 'definitionTitleString',
    // Emphasis (`*alpha*`).
    // Includes `emphasisSequence` and `emphasisText`.
    emphasis: 'emphasis',
    // Sequence of emphasis markers (`*` or `_`).
    emphasisSequence: 'emphasisSequence',
    // Emphasis text (`alpha`).
    // Includes text.
    emphasisText: 'emphasisText',
    // The character escape marker (`\`).
    escapeMarker: 'escapeMarker',
    // A hard break created with a backslash (`\\n`).
    // Note: does not include the line ending.
    hardBreakEscape: 'hardBreakEscape',
    // A hard break created with trailing spaces (`  \n`).
    // Does not include the line ending.
    hardBreakTrailing: 'hardBreakTrailing',
    // Flow HTML:
    //
    // ```markdown
    // <div
    // ```
    //
    // Inlcudes `lineEnding`, `htmlFlowData`.
    htmlFlow: 'htmlFlow',
    htmlFlowData: 'htmlFlowData',
    // HTML in text (the tag in `a <i> b`).
    // Includes `lineEnding`, `htmlTextData`.
    htmlText: 'htmlText',
    htmlTextData: 'htmlTextData',
    // Whole image (`![alpha](bravo)`, `![alpha][bravo]`, `![alpha][]`, or
    // `![alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    image: 'image',
    // Whole link label (`[*alpha*]`).
    // Includes `labelLink` or `labelImage`, `labelText`, and `labelEnd`.
    label: 'label',
    // Text in an label (`*alpha*`).
    // Includes text.
    labelText: 'labelText',
    // Start a link label (`[`).
    // Includes a `labelMarker`.
    labelLink: 'labelLink',
    // Start an image label (`![`).
    // Includes `labelImageMarker` and `labelMarker`.
    labelImage: 'labelImage',
    // Marker of a label (`[` or `]`).
    labelMarker: 'labelMarker',
    // Marker to start an image (`!`).
    labelImageMarker: 'labelImageMarker',
    // End a label (`]`).
    // Includes `labelMarker`.
    labelEnd: 'labelEnd',
    // Whole link (`[alpha](bravo)`, `[alpha][bravo]`, `[alpha][]`, or `[alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    link: 'link',
    // Whole paragraph:
    //
    // ```markdown
    // alpha
    // bravo.
    // ```
    //
    // Includes text.
    paragraph: 'paragraph',
    // A reference (`[alpha]` or `[]`).
    // Includes `referenceMarker` and an optional `referenceString`.
    reference: 'reference',
    // A reference marker (`[` or `]`).
    referenceMarker: 'referenceMarker',
    // Reference text (`alpha`).
    // Includes string.
    referenceString: 'referenceString',
    // A resource (`(https://example.com "alpha")`).
    // Includes `resourceMarker`, an optional `resourceDestination` with an optional
    // `whitespace` and `resourceTitle`.
    resource: 'resource',
    // A resource destination (`https://example.com`).
    // Includes `resourceDestinationLiteral` or `resourceDestinationRaw`.
    resourceDestination: 'resourceDestination',
    // A literal resource destination (`<https://example.com>`).
    // Includes `resourceDestinationLiteralMarker` and optionally
    // `resourceDestinationString`.
    resourceDestinationLiteral: 'resourceDestinationLiteral',
    // A resource destination marker (`<` or `>`).
    resourceDestinationLiteralMarker: 'resourceDestinationLiteralMarker',
    // A raw resource destination (`https://example.com`).
    // Includes `resourceDestinationString`.
    resourceDestinationRaw: 'resourceDestinationRaw',
    // Resource destination text (`https://example.com`).
    // Includes string.
    resourceDestinationString: 'resourceDestinationString',
    // A resource marker (`(` or `)`).
    resourceMarker: 'resourceMarker',
    // A resource title (`"alpha"`, `'alpha'`, or `(alpha)`).
    // Includes `resourceTitleMarker` and optionally `resourceTitleString`.
    resourceTitle: 'resourceTitle',
    // A resource title marker (`"`, `'`, `(`, or `)`).
    resourceTitleMarker: 'resourceTitleMarker',
    // Resource destination title (`alpha`).
    // Includes string.
    resourceTitleString: 'resourceTitleString',
    // Whole setext heading:
    //
    // ```markdown
    // alpha
    // bravo
    // =====
    // ```
    //
    // Includes `setextHeadingText`, `lineEnding`, `linePrefix`, and
    // `setextHeadingLine`.
    setextHeading: 'setextHeading',
    // Content in a setext heading (`alpha\nbravo`).
    // Includes text.
    setextHeadingText: 'setextHeadingText',
    // Underline in a setext heading, including whitespace suffix (`==`).
    // Includes `setextHeadingLineSequence`.
    setextHeadingLine: 'setextHeadingLine',
    // Sequence of equals or dash characters in underline in a setext heading (`-`).
    setextHeadingLineSequence: 'setextHeadingLineSequence',
    // Strong (`**alpha**`).
    // Includes `strongSequence` and `strongText`.
    strong: 'strong',
    // Sequence of strong markers (`**` or `__`).
    strongSequence: 'strongSequence',
    // Strong text (`alpha`).
    // Includes text.
    strongText: 'strongText',
    // Whole thematic break:
    //
    // ```markdown
    // * * *
    // ```
    //
    // Includes `thematicBreakSequence` and `whitespace`.
    thematicBreak: 'thematicBreak',
    // A sequence of one or more thematic break markers (`***`).
    thematicBreakSequence: 'thematicBreakSequence',
    // Whole block quote:
    //
    // ```markdown
    // > a
    // >
    // > b
    // ```
    //
    // Includes `blockQuotePrefix` and flow.
    blockQuote: 'blockQuote',
    // The `>` or `> ` of a block quote.
    blockQuotePrefix: 'blockQuotePrefix',
    // The `>` of a block quote prefix.
    blockQuoteMarker: 'blockQuoteMarker',
    // The optional ` ` of a block quote prefix.
    blockQuotePrefixWhitespace: 'blockQuotePrefixWhitespace',
    // Whole ordered list:
    //
    // ```markdown
    // 1. a
    //    b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listOrdered: 'listOrdered',
    // Whole unordered list:
    //
    // ```markdown
    // - a
    //   b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listUnordered: 'listUnordered',
    // The indent of further list item lines.
    listItemIndent: 'listItemIndent',
    // A marker, as in, `*`, `+`, `-`, `.`, or `)`.
    listItemMarker: 'listItemMarker',
    // The thing that starts a list item, such as `1. `.
    // Includes `listItemValue` if ordered, `listItemMarker`, and
    // `listItemPrefixWhitespace` (unless followed by a line ending).
    listItemPrefix: 'listItemPrefix',
    // The whitespace after a marker.
    listItemPrefixWhitespace: 'listItemPrefixWhitespace',
    // The numerical value of an ordered item.
    listItemValue: 'listItemValue',
    // Internal types used for subtokenizers, compiled away
    chunkDocument: 'chunkDocument',
    chunkContent: 'chunkContent',
    chunkFlow: 'chunkFlow',
    chunkText: 'chunkText',
    chunkString: 'chunkString'
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-footnote/node_modules/micromark-util-symbol/lib/values.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * While micromark works based on character codes, this module includes the
 * string versions of ’em.
 * The C0 block, except for LF, CR, HT, and w/ the replacement character added,
 * are available here.
 */ __turbopack_context__.s([
    "values",
    ()=>values
]);
const values = {
    ht: '\t',
    lf: '\n',
    cr: '\r',
    space: ' ',
    exclamationMark: '!',
    quotationMark: '"',
    numberSign: '#',
    dollarSign: '$',
    percentSign: '%',
    ampersand: '&',
    apostrophe: "'",
    leftParenthesis: '(',
    rightParenthesis: ')',
    asterisk: '*',
    plusSign: '+',
    comma: ',',
    dash: '-',
    dot: '.',
    slash: '/',
    digit0: '0',
    digit1: '1',
    digit2: '2',
    digit3: '3',
    digit4: '4',
    digit5: '5',
    digit6: '6',
    digit7: '7',
    digit8: '8',
    digit9: '9',
    colon: ':',
    semicolon: ';',
    lessThan: '<',
    equalsTo: '=',
    greaterThan: '>',
    questionMark: '?',
    atSign: '@',
    uppercaseA: 'A',
    uppercaseB: 'B',
    uppercaseC: 'C',
    uppercaseD: 'D',
    uppercaseE: 'E',
    uppercaseF: 'F',
    uppercaseG: 'G',
    uppercaseH: 'H',
    uppercaseI: 'I',
    uppercaseJ: 'J',
    uppercaseK: 'K',
    uppercaseL: 'L',
    uppercaseM: 'M',
    uppercaseN: 'N',
    uppercaseO: 'O',
    uppercaseP: 'P',
    uppercaseQ: 'Q',
    uppercaseR: 'R',
    uppercaseS: 'S',
    uppercaseT: 'T',
    uppercaseU: 'U',
    uppercaseV: 'V',
    uppercaseW: 'W',
    uppercaseX: 'X',
    uppercaseY: 'Y',
    uppercaseZ: 'Z',
    leftSquareBracket: '[',
    backslash: '\\',
    rightSquareBracket: ']',
    caret: '^',
    underscore: '_',
    graveAccent: '`',
    lowercaseA: 'a',
    lowercaseB: 'b',
    lowercaseC: 'c',
    lowercaseD: 'd',
    lowercaseE: 'e',
    lowercaseF: 'f',
    lowercaseG: 'g',
    lowercaseH: 'h',
    lowercaseI: 'i',
    lowercaseJ: 'j',
    lowercaseK: 'k',
    lowercaseL: 'l',
    lowercaseM: 'm',
    lowercaseN: 'n',
    lowercaseO: 'o',
    lowercaseP: 'p',
    lowercaseQ: 'q',
    lowercaseR: 'r',
    lowercaseS: 's',
    lowercaseT: 't',
    lowercaseU: 'u',
    lowercaseV: 'v',
    lowercaseW: 'w',
    lowercaseX: 'x',
    lowercaseY: 'y',
    lowercaseZ: 'z',
    leftCurlyBrace: '{',
    verticalBar: '|',
    rightCurlyBrace: '}',
    tilde: '~',
    replacementCharacter: '�'
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-strikethrough/node_modules/micromark-util-symbol/lib/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65_279,
    // Unicode Specials block.
    replacementCharacter: 65_533 // `�`
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-strikethrough/node_modules/micromark-util-symbol/lib/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */ __turbopack_context__.s([
    "constants",
    ()=>constants
]);
const constants = {
    attentionSideAfter: 2,
    attentionSideBefore: 1,
    atxHeadingOpeningFenceSizeMax: 6,
    autolinkDomainSizeMax: 63,
    autolinkSchemeSizeMax: 32,
    cdataOpeningString: 'CDATA[',
    characterGroupPunctuation: 2,
    characterGroupWhitespace: 1,
    characterReferenceDecimalSizeMax: 7,
    characterReferenceHexadecimalSizeMax: 6,
    characterReferenceNamedSizeMax: 31,
    codeFencedSequenceSizeMin: 3,
    contentTypeContent: 'content',
    contentTypeDocument: 'document',
    contentTypeFlow: 'flow',
    contentTypeString: 'string',
    contentTypeText: 'text',
    hardBreakPrefixSizeMin: 2,
    htmlBasic: 6,
    htmlCdata: 5,
    htmlComment: 2,
    htmlComplete: 7,
    htmlDeclaration: 4,
    htmlInstruction: 3,
    htmlRawSizeMax: 8,
    htmlRaw: 1,
    linkResourceDestinationBalanceMax: 32,
    linkReferenceSizeMax: 999,
    listItemValueSizeMax: 10,
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 0x10,
    tabSize: 4,
    thematicBreakMarkerCountMin: 3,
    v8MaxSafeChunkSize: 10_000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-strikethrough/node_modules/micromark-util-symbol/lib/types.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Here is the list of all types of tokens exposed by micromark, with a short
 * explanation of what they include and where they are found.
 * In picking names, generally, the rule is to be as explicit as possible
 * instead of reusing names.
 * For example, there is a `definitionDestination` and a `resourceDestination`,
 * instead of one shared name.
 */ // Note: when changing the next record, you must also change `TokenTypeMap`
// in `micromark-util-types/index.d.ts`.
__turbopack_context__.s([
    "types",
    ()=>types
]);
const types = {
    // Generic type for data, such as in a title, a destination, etc.
    data: 'data',
    // Generic type for syntactic whitespace (tabs, virtual spaces, spaces).
    // Such as, between a fenced code fence and an info string.
    whitespace: 'whitespace',
    // Generic type for line endings (line feed, carriage return, carriage return +
    // line feed).
    lineEnding: 'lineEnding',
    // A line ending, but ending a blank line.
    lineEndingBlank: 'lineEndingBlank',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the start of a
    // line.
    linePrefix: 'linePrefix',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the end of a
    // line.
    lineSuffix: 'lineSuffix',
    // Whole ATX heading:
    //
    // ```markdown
    // #
    // ## Alpha
    // ### Bravo ###
    // ```
    //
    // Includes `atxHeadingSequence`, `whitespace`, `atxHeadingText`.
    atxHeading: 'atxHeading',
    // Sequence of number signs in an ATX heading (`###`).
    atxHeadingSequence: 'atxHeadingSequence',
    // Content in an ATX heading (`alpha`).
    // Includes text.
    atxHeadingText: 'atxHeadingText',
    // Whole autolink (`<https://example.com>` or `<admin@example.com>`)
    // Includes `autolinkMarker` and `autolinkProtocol` or `autolinkEmail`.
    autolink: 'autolink',
    // Email autolink w/o markers (`admin@example.com`)
    autolinkEmail: 'autolinkEmail',
    // Marker around an `autolinkProtocol` or `autolinkEmail` (`<` or `>`).
    autolinkMarker: 'autolinkMarker',
    // Protocol autolink w/o markers (`https://example.com`)
    autolinkProtocol: 'autolinkProtocol',
    // A whole character escape (`\-`).
    // Includes `escapeMarker` and `characterEscapeValue`.
    characterEscape: 'characterEscape',
    // The escaped character (`-`).
    characterEscapeValue: 'characterEscapeValue',
    // A whole character reference (`&amp;`, `&#8800;`, or `&#x1D306;`).
    // Includes `characterReferenceMarker`, an optional
    // `characterReferenceMarkerNumeric`, in which case an optional
    // `characterReferenceMarkerHexadecimal`, and a `characterReferenceValue`.
    characterReference: 'characterReference',
    // The start or end marker (`&` or `;`).
    characterReferenceMarker: 'characterReferenceMarker',
    // Mark reference as numeric (`#`).
    characterReferenceMarkerNumeric: 'characterReferenceMarkerNumeric',
    // Mark reference as numeric (`x` or `X`).
    characterReferenceMarkerHexadecimal: 'characterReferenceMarkerHexadecimal',
    // Value of character reference w/o markers (`amp`, `8800`, or `1D306`).
    characterReferenceValue: 'characterReferenceValue',
    // Whole fenced code:
    //
    // ````markdown
    // ```js
    // alert(1)
    // ```
    // ````
    codeFenced: 'codeFenced',
    // A fenced code fence, including whitespace, sequence, info, and meta
    // (` ```js `).
    codeFencedFence: 'codeFencedFence',
    // Sequence of grave accent or tilde characters (` ``` `) in a fence.
    codeFencedFenceSequence: 'codeFencedFenceSequence',
    // Info word (`js`) in a fence.
    // Includes string.
    codeFencedFenceInfo: 'codeFencedFenceInfo',
    // Meta words (`highlight="1"`) in a fence.
    // Includes string.
    codeFencedFenceMeta: 'codeFencedFenceMeta',
    // A line of code.
    codeFlowValue: 'codeFlowValue',
    // Whole indented code:
    //
    // ```markdown
    //     alert(1)
    // ```
    //
    // Includes `lineEnding`, `linePrefix`, and `codeFlowValue`.
    codeIndented: 'codeIndented',
    // A text code (``` `alpha` ```).
    // Includes `codeTextSequence`, `codeTextData`, `lineEnding`, and can include
    // `codeTextPadding`.
    codeText: 'codeText',
    codeTextData: 'codeTextData',
    // A space or line ending right after or before a tick.
    codeTextPadding: 'codeTextPadding',
    // A text code fence (` `` `).
    codeTextSequence: 'codeTextSequence',
    // Whole content:
    //
    // ```markdown
    // [a]: b
    // c
    // =
    // d
    // ```
    //
    // Includes `paragraph` and `definition`.
    content: 'content',
    // Whole definition:
    //
    // ```markdown
    // [micromark]: https://github.com/micromark/micromark
    // ```
    //
    // Includes `definitionLabel`, `definitionMarker`, `whitespace`,
    // `definitionDestination`, and optionally `lineEnding` and `definitionTitle`.
    definition: 'definition',
    // Destination of a definition (`https://github.com/micromark/micromark` or
    // `<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteral` or `definitionDestinationRaw`.
    definitionDestination: 'definitionDestination',
    // Enclosed destination of a definition
    // (`<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteralMarker` and optionally
    // `definitionDestinationString`.
    definitionDestinationLiteral: 'definitionDestinationLiteral',
    // Markers of an enclosed definition destination (`<` or `>`).
    definitionDestinationLiteralMarker: 'definitionDestinationLiteralMarker',
    // Unenclosed destination of a definition
    // (`https://github.com/micromark/micromark`).
    // Includes `definitionDestinationString`.
    definitionDestinationRaw: 'definitionDestinationRaw',
    // Text in an destination (`https://github.com/micromark/micromark`).
    // Includes string.
    definitionDestinationString: 'definitionDestinationString',
    // Label of a definition (`[micromark]`).
    // Includes `definitionLabelMarker` and `definitionLabelString`.
    definitionLabel: 'definitionLabel',
    // Markers of a definition label (`[` or `]`).
    definitionLabelMarker: 'definitionLabelMarker',
    // Value of a definition label (`micromark`).
    // Includes string.
    definitionLabelString: 'definitionLabelString',
    // Marker between a label and a destination (`:`).
    definitionMarker: 'definitionMarker',
    // Title of a definition (`"x"`, `'y'`, or `(z)`).
    // Includes `definitionTitleMarker` and optionally `definitionTitleString`.
    definitionTitle: 'definitionTitle',
    // Marker around a title of a definition (`"`, `'`, `(`, or `)`).
    definitionTitleMarker: 'definitionTitleMarker',
    // Data without markers in a title (`z`).
    // Includes string.
    definitionTitleString: 'definitionTitleString',
    // Emphasis (`*alpha*`).
    // Includes `emphasisSequence` and `emphasisText`.
    emphasis: 'emphasis',
    // Sequence of emphasis markers (`*` or `_`).
    emphasisSequence: 'emphasisSequence',
    // Emphasis text (`alpha`).
    // Includes text.
    emphasisText: 'emphasisText',
    // The character escape marker (`\`).
    escapeMarker: 'escapeMarker',
    // A hard break created with a backslash (`\\n`).
    // Note: does not include the line ending.
    hardBreakEscape: 'hardBreakEscape',
    // A hard break created with trailing spaces (`  \n`).
    // Does not include the line ending.
    hardBreakTrailing: 'hardBreakTrailing',
    // Flow HTML:
    //
    // ```markdown
    // <div
    // ```
    //
    // Inlcudes `lineEnding`, `htmlFlowData`.
    htmlFlow: 'htmlFlow',
    htmlFlowData: 'htmlFlowData',
    // HTML in text (the tag in `a <i> b`).
    // Includes `lineEnding`, `htmlTextData`.
    htmlText: 'htmlText',
    htmlTextData: 'htmlTextData',
    // Whole image (`![alpha](bravo)`, `![alpha][bravo]`, `![alpha][]`, or
    // `![alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    image: 'image',
    // Whole link label (`[*alpha*]`).
    // Includes `labelLink` or `labelImage`, `labelText`, and `labelEnd`.
    label: 'label',
    // Text in an label (`*alpha*`).
    // Includes text.
    labelText: 'labelText',
    // Start a link label (`[`).
    // Includes a `labelMarker`.
    labelLink: 'labelLink',
    // Start an image label (`![`).
    // Includes `labelImageMarker` and `labelMarker`.
    labelImage: 'labelImage',
    // Marker of a label (`[` or `]`).
    labelMarker: 'labelMarker',
    // Marker to start an image (`!`).
    labelImageMarker: 'labelImageMarker',
    // End a label (`]`).
    // Includes `labelMarker`.
    labelEnd: 'labelEnd',
    // Whole link (`[alpha](bravo)`, `[alpha][bravo]`, `[alpha][]`, or `[alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    link: 'link',
    // Whole paragraph:
    //
    // ```markdown
    // alpha
    // bravo.
    // ```
    //
    // Includes text.
    paragraph: 'paragraph',
    // A reference (`[alpha]` or `[]`).
    // Includes `referenceMarker` and an optional `referenceString`.
    reference: 'reference',
    // A reference marker (`[` or `]`).
    referenceMarker: 'referenceMarker',
    // Reference text (`alpha`).
    // Includes string.
    referenceString: 'referenceString',
    // A resource (`(https://example.com "alpha")`).
    // Includes `resourceMarker`, an optional `resourceDestination` with an optional
    // `whitespace` and `resourceTitle`.
    resource: 'resource',
    // A resource destination (`https://example.com`).
    // Includes `resourceDestinationLiteral` or `resourceDestinationRaw`.
    resourceDestination: 'resourceDestination',
    // A literal resource destination (`<https://example.com>`).
    // Includes `resourceDestinationLiteralMarker` and optionally
    // `resourceDestinationString`.
    resourceDestinationLiteral: 'resourceDestinationLiteral',
    // A resource destination marker (`<` or `>`).
    resourceDestinationLiteralMarker: 'resourceDestinationLiteralMarker',
    // A raw resource destination (`https://example.com`).
    // Includes `resourceDestinationString`.
    resourceDestinationRaw: 'resourceDestinationRaw',
    // Resource destination text (`https://example.com`).
    // Includes string.
    resourceDestinationString: 'resourceDestinationString',
    // A resource marker (`(` or `)`).
    resourceMarker: 'resourceMarker',
    // A resource title (`"alpha"`, `'alpha'`, or `(alpha)`).
    // Includes `resourceTitleMarker` and optionally `resourceTitleString`.
    resourceTitle: 'resourceTitle',
    // A resource title marker (`"`, `'`, `(`, or `)`).
    resourceTitleMarker: 'resourceTitleMarker',
    // Resource destination title (`alpha`).
    // Includes string.
    resourceTitleString: 'resourceTitleString',
    // Whole setext heading:
    //
    // ```markdown
    // alpha
    // bravo
    // =====
    // ```
    //
    // Includes `setextHeadingText`, `lineEnding`, `linePrefix`, and
    // `setextHeadingLine`.
    setextHeading: 'setextHeading',
    // Content in a setext heading (`alpha\nbravo`).
    // Includes text.
    setextHeadingText: 'setextHeadingText',
    // Underline in a setext heading, including whitespace suffix (`==`).
    // Includes `setextHeadingLineSequence`.
    setextHeadingLine: 'setextHeadingLine',
    // Sequence of equals or dash characters in underline in a setext heading (`-`).
    setextHeadingLineSequence: 'setextHeadingLineSequence',
    // Strong (`**alpha**`).
    // Includes `strongSequence` and `strongText`.
    strong: 'strong',
    // Sequence of strong markers (`**` or `__`).
    strongSequence: 'strongSequence',
    // Strong text (`alpha`).
    // Includes text.
    strongText: 'strongText',
    // Whole thematic break:
    //
    // ```markdown
    // * * *
    // ```
    //
    // Includes `thematicBreakSequence` and `whitespace`.
    thematicBreak: 'thematicBreak',
    // A sequence of one or more thematic break markers (`***`).
    thematicBreakSequence: 'thematicBreakSequence',
    // Whole block quote:
    //
    // ```markdown
    // > a
    // >
    // > b
    // ```
    //
    // Includes `blockQuotePrefix` and flow.
    blockQuote: 'blockQuote',
    // The `>` or `> ` of a block quote.
    blockQuotePrefix: 'blockQuotePrefix',
    // The `>` of a block quote prefix.
    blockQuoteMarker: 'blockQuoteMarker',
    // The optional ` ` of a block quote prefix.
    blockQuotePrefixWhitespace: 'blockQuotePrefixWhitespace',
    // Whole ordered list:
    //
    // ```markdown
    // 1. a
    //    b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listOrdered: 'listOrdered',
    // Whole unordered list:
    //
    // ```markdown
    // - a
    //   b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listUnordered: 'listUnordered',
    // The indent of further list item lines.
    listItemIndent: 'listItemIndent',
    // A marker, as in, `*`, `+`, `-`, `.`, or `)`.
    listItemMarker: 'listItemMarker',
    // The thing that starts a list item, such as `1. `.
    // Includes `listItemValue` if ordered, `listItemMarker`, and
    // `listItemPrefixWhitespace` (unless followed by a line ending).
    listItemPrefix: 'listItemPrefix',
    // The whitespace after a marker.
    listItemPrefixWhitespace: 'listItemPrefixWhitespace',
    // The numerical value of an ordered item.
    listItemValue: 'listItemValue',
    // Internal types used for subtokenizers, compiled away
    chunkDocument: 'chunkDocument',
    chunkContent: 'chunkContent',
    chunkFlow: 'chunkFlow',
    chunkText: 'chunkText',
    chunkString: 'chunkString'
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-table/node_modules/micromark-util-symbol/lib/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65_279,
    // Unicode Specials block.
    replacementCharacter: 65_533 // `�`
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-table/node_modules/micromark-util-symbol/lib/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */ __turbopack_context__.s([
    "constants",
    ()=>constants
]);
const constants = {
    attentionSideAfter: 2,
    attentionSideBefore: 1,
    atxHeadingOpeningFenceSizeMax: 6,
    autolinkDomainSizeMax: 63,
    autolinkSchemeSizeMax: 32,
    cdataOpeningString: 'CDATA[',
    characterGroupPunctuation: 2,
    characterGroupWhitespace: 1,
    characterReferenceDecimalSizeMax: 7,
    characterReferenceHexadecimalSizeMax: 6,
    characterReferenceNamedSizeMax: 31,
    codeFencedSequenceSizeMin: 3,
    contentTypeContent: 'content',
    contentTypeDocument: 'document',
    contentTypeFlow: 'flow',
    contentTypeString: 'string',
    contentTypeText: 'text',
    hardBreakPrefixSizeMin: 2,
    htmlBasic: 6,
    htmlCdata: 5,
    htmlComment: 2,
    htmlComplete: 7,
    htmlDeclaration: 4,
    htmlInstruction: 3,
    htmlRawSizeMax: 8,
    htmlRaw: 1,
    linkResourceDestinationBalanceMax: 32,
    linkReferenceSizeMax: 999,
    listItemValueSizeMax: 10,
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 0x10,
    tabSize: 4,
    thematicBreakMarkerCountMin: 3,
    v8MaxSafeChunkSize: 10_000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-table/node_modules/micromark-util-symbol/lib/types.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Here is the list of all types of tokens exposed by micromark, with a short
 * explanation of what they include and where they are found.
 * In picking names, generally, the rule is to be as explicit as possible
 * instead of reusing names.
 * For example, there is a `definitionDestination` and a `resourceDestination`,
 * instead of one shared name.
 */ // Note: when changing the next record, you must also change `TokenTypeMap`
// in `micromark-util-types/index.d.ts`.
__turbopack_context__.s([
    "types",
    ()=>types
]);
const types = {
    // Generic type for data, such as in a title, a destination, etc.
    data: 'data',
    // Generic type for syntactic whitespace (tabs, virtual spaces, spaces).
    // Such as, between a fenced code fence and an info string.
    whitespace: 'whitespace',
    // Generic type for line endings (line feed, carriage return, carriage return +
    // line feed).
    lineEnding: 'lineEnding',
    // A line ending, but ending a blank line.
    lineEndingBlank: 'lineEndingBlank',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the start of a
    // line.
    linePrefix: 'linePrefix',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the end of a
    // line.
    lineSuffix: 'lineSuffix',
    // Whole ATX heading:
    //
    // ```markdown
    // #
    // ## Alpha
    // ### Bravo ###
    // ```
    //
    // Includes `atxHeadingSequence`, `whitespace`, `atxHeadingText`.
    atxHeading: 'atxHeading',
    // Sequence of number signs in an ATX heading (`###`).
    atxHeadingSequence: 'atxHeadingSequence',
    // Content in an ATX heading (`alpha`).
    // Includes text.
    atxHeadingText: 'atxHeadingText',
    // Whole autolink (`<https://example.com>` or `<admin@example.com>`)
    // Includes `autolinkMarker` and `autolinkProtocol` or `autolinkEmail`.
    autolink: 'autolink',
    // Email autolink w/o markers (`admin@example.com`)
    autolinkEmail: 'autolinkEmail',
    // Marker around an `autolinkProtocol` or `autolinkEmail` (`<` or `>`).
    autolinkMarker: 'autolinkMarker',
    // Protocol autolink w/o markers (`https://example.com`)
    autolinkProtocol: 'autolinkProtocol',
    // A whole character escape (`\-`).
    // Includes `escapeMarker` and `characterEscapeValue`.
    characterEscape: 'characterEscape',
    // The escaped character (`-`).
    characterEscapeValue: 'characterEscapeValue',
    // A whole character reference (`&amp;`, `&#8800;`, or `&#x1D306;`).
    // Includes `characterReferenceMarker`, an optional
    // `characterReferenceMarkerNumeric`, in which case an optional
    // `characterReferenceMarkerHexadecimal`, and a `characterReferenceValue`.
    characterReference: 'characterReference',
    // The start or end marker (`&` or `;`).
    characterReferenceMarker: 'characterReferenceMarker',
    // Mark reference as numeric (`#`).
    characterReferenceMarkerNumeric: 'characterReferenceMarkerNumeric',
    // Mark reference as numeric (`x` or `X`).
    characterReferenceMarkerHexadecimal: 'characterReferenceMarkerHexadecimal',
    // Value of character reference w/o markers (`amp`, `8800`, or `1D306`).
    characterReferenceValue: 'characterReferenceValue',
    // Whole fenced code:
    //
    // ````markdown
    // ```js
    // alert(1)
    // ```
    // ````
    codeFenced: 'codeFenced',
    // A fenced code fence, including whitespace, sequence, info, and meta
    // (` ```js `).
    codeFencedFence: 'codeFencedFence',
    // Sequence of grave accent or tilde characters (` ``` `) in a fence.
    codeFencedFenceSequence: 'codeFencedFenceSequence',
    // Info word (`js`) in a fence.
    // Includes string.
    codeFencedFenceInfo: 'codeFencedFenceInfo',
    // Meta words (`highlight="1"`) in a fence.
    // Includes string.
    codeFencedFenceMeta: 'codeFencedFenceMeta',
    // A line of code.
    codeFlowValue: 'codeFlowValue',
    // Whole indented code:
    //
    // ```markdown
    //     alert(1)
    // ```
    //
    // Includes `lineEnding`, `linePrefix`, and `codeFlowValue`.
    codeIndented: 'codeIndented',
    // A text code (``` `alpha` ```).
    // Includes `codeTextSequence`, `codeTextData`, `lineEnding`, and can include
    // `codeTextPadding`.
    codeText: 'codeText',
    codeTextData: 'codeTextData',
    // A space or line ending right after or before a tick.
    codeTextPadding: 'codeTextPadding',
    // A text code fence (` `` `).
    codeTextSequence: 'codeTextSequence',
    // Whole content:
    //
    // ```markdown
    // [a]: b
    // c
    // =
    // d
    // ```
    //
    // Includes `paragraph` and `definition`.
    content: 'content',
    // Whole definition:
    //
    // ```markdown
    // [micromark]: https://github.com/micromark/micromark
    // ```
    //
    // Includes `definitionLabel`, `definitionMarker`, `whitespace`,
    // `definitionDestination`, and optionally `lineEnding` and `definitionTitle`.
    definition: 'definition',
    // Destination of a definition (`https://github.com/micromark/micromark` or
    // `<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteral` or `definitionDestinationRaw`.
    definitionDestination: 'definitionDestination',
    // Enclosed destination of a definition
    // (`<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteralMarker` and optionally
    // `definitionDestinationString`.
    definitionDestinationLiteral: 'definitionDestinationLiteral',
    // Markers of an enclosed definition destination (`<` or `>`).
    definitionDestinationLiteralMarker: 'definitionDestinationLiteralMarker',
    // Unenclosed destination of a definition
    // (`https://github.com/micromark/micromark`).
    // Includes `definitionDestinationString`.
    definitionDestinationRaw: 'definitionDestinationRaw',
    // Text in an destination (`https://github.com/micromark/micromark`).
    // Includes string.
    definitionDestinationString: 'definitionDestinationString',
    // Label of a definition (`[micromark]`).
    // Includes `definitionLabelMarker` and `definitionLabelString`.
    definitionLabel: 'definitionLabel',
    // Markers of a definition label (`[` or `]`).
    definitionLabelMarker: 'definitionLabelMarker',
    // Value of a definition label (`micromark`).
    // Includes string.
    definitionLabelString: 'definitionLabelString',
    // Marker between a label and a destination (`:`).
    definitionMarker: 'definitionMarker',
    // Title of a definition (`"x"`, `'y'`, or `(z)`).
    // Includes `definitionTitleMarker` and optionally `definitionTitleString`.
    definitionTitle: 'definitionTitle',
    // Marker around a title of a definition (`"`, `'`, `(`, or `)`).
    definitionTitleMarker: 'definitionTitleMarker',
    // Data without markers in a title (`z`).
    // Includes string.
    definitionTitleString: 'definitionTitleString',
    // Emphasis (`*alpha*`).
    // Includes `emphasisSequence` and `emphasisText`.
    emphasis: 'emphasis',
    // Sequence of emphasis markers (`*` or `_`).
    emphasisSequence: 'emphasisSequence',
    // Emphasis text (`alpha`).
    // Includes text.
    emphasisText: 'emphasisText',
    // The character escape marker (`\`).
    escapeMarker: 'escapeMarker',
    // A hard break created with a backslash (`\\n`).
    // Note: does not include the line ending.
    hardBreakEscape: 'hardBreakEscape',
    // A hard break created with trailing spaces (`  \n`).
    // Does not include the line ending.
    hardBreakTrailing: 'hardBreakTrailing',
    // Flow HTML:
    //
    // ```markdown
    // <div
    // ```
    //
    // Inlcudes `lineEnding`, `htmlFlowData`.
    htmlFlow: 'htmlFlow',
    htmlFlowData: 'htmlFlowData',
    // HTML in text (the tag in `a <i> b`).
    // Includes `lineEnding`, `htmlTextData`.
    htmlText: 'htmlText',
    htmlTextData: 'htmlTextData',
    // Whole image (`![alpha](bravo)`, `![alpha][bravo]`, `![alpha][]`, or
    // `![alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    image: 'image',
    // Whole link label (`[*alpha*]`).
    // Includes `labelLink` or `labelImage`, `labelText`, and `labelEnd`.
    label: 'label',
    // Text in an label (`*alpha*`).
    // Includes text.
    labelText: 'labelText',
    // Start a link label (`[`).
    // Includes a `labelMarker`.
    labelLink: 'labelLink',
    // Start an image label (`![`).
    // Includes `labelImageMarker` and `labelMarker`.
    labelImage: 'labelImage',
    // Marker of a label (`[` or `]`).
    labelMarker: 'labelMarker',
    // Marker to start an image (`!`).
    labelImageMarker: 'labelImageMarker',
    // End a label (`]`).
    // Includes `labelMarker`.
    labelEnd: 'labelEnd',
    // Whole link (`[alpha](bravo)`, `[alpha][bravo]`, `[alpha][]`, or `[alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    link: 'link',
    // Whole paragraph:
    //
    // ```markdown
    // alpha
    // bravo.
    // ```
    //
    // Includes text.
    paragraph: 'paragraph',
    // A reference (`[alpha]` or `[]`).
    // Includes `referenceMarker` and an optional `referenceString`.
    reference: 'reference',
    // A reference marker (`[` or `]`).
    referenceMarker: 'referenceMarker',
    // Reference text (`alpha`).
    // Includes string.
    referenceString: 'referenceString',
    // A resource (`(https://example.com "alpha")`).
    // Includes `resourceMarker`, an optional `resourceDestination` with an optional
    // `whitespace` and `resourceTitle`.
    resource: 'resource',
    // A resource destination (`https://example.com`).
    // Includes `resourceDestinationLiteral` or `resourceDestinationRaw`.
    resourceDestination: 'resourceDestination',
    // A literal resource destination (`<https://example.com>`).
    // Includes `resourceDestinationLiteralMarker` and optionally
    // `resourceDestinationString`.
    resourceDestinationLiteral: 'resourceDestinationLiteral',
    // A resource destination marker (`<` or `>`).
    resourceDestinationLiteralMarker: 'resourceDestinationLiteralMarker',
    // A raw resource destination (`https://example.com`).
    // Includes `resourceDestinationString`.
    resourceDestinationRaw: 'resourceDestinationRaw',
    // Resource destination text (`https://example.com`).
    // Includes string.
    resourceDestinationString: 'resourceDestinationString',
    // A resource marker (`(` or `)`).
    resourceMarker: 'resourceMarker',
    // A resource title (`"alpha"`, `'alpha'`, or `(alpha)`).
    // Includes `resourceTitleMarker` and optionally `resourceTitleString`.
    resourceTitle: 'resourceTitle',
    // A resource title marker (`"`, `'`, `(`, or `)`).
    resourceTitleMarker: 'resourceTitleMarker',
    // Resource destination title (`alpha`).
    // Includes string.
    resourceTitleString: 'resourceTitleString',
    // Whole setext heading:
    //
    // ```markdown
    // alpha
    // bravo
    // =====
    // ```
    //
    // Includes `setextHeadingText`, `lineEnding`, `linePrefix`, and
    // `setextHeadingLine`.
    setextHeading: 'setextHeading',
    // Content in a setext heading (`alpha\nbravo`).
    // Includes text.
    setextHeadingText: 'setextHeadingText',
    // Underline in a setext heading, including whitespace suffix (`==`).
    // Includes `setextHeadingLineSequence`.
    setextHeadingLine: 'setextHeadingLine',
    // Sequence of equals or dash characters in underline in a setext heading (`-`).
    setextHeadingLineSequence: 'setextHeadingLineSequence',
    // Strong (`**alpha**`).
    // Includes `strongSequence` and `strongText`.
    strong: 'strong',
    // Sequence of strong markers (`**` or `__`).
    strongSequence: 'strongSequence',
    // Strong text (`alpha`).
    // Includes text.
    strongText: 'strongText',
    // Whole thematic break:
    //
    // ```markdown
    // * * *
    // ```
    //
    // Includes `thematicBreakSequence` and `whitespace`.
    thematicBreak: 'thematicBreak',
    // A sequence of one or more thematic break markers (`***`).
    thematicBreakSequence: 'thematicBreakSequence',
    // Whole block quote:
    //
    // ```markdown
    // > a
    // >
    // > b
    // ```
    //
    // Includes `blockQuotePrefix` and flow.
    blockQuote: 'blockQuote',
    // The `>` or `> ` of a block quote.
    blockQuotePrefix: 'blockQuotePrefix',
    // The `>` of a block quote prefix.
    blockQuoteMarker: 'blockQuoteMarker',
    // The optional ` ` of a block quote prefix.
    blockQuotePrefixWhitespace: 'blockQuotePrefixWhitespace',
    // Whole ordered list:
    //
    // ```markdown
    // 1. a
    //    b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listOrdered: 'listOrdered',
    // Whole unordered list:
    //
    // ```markdown
    // - a
    //   b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listUnordered: 'listUnordered',
    // The indent of further list item lines.
    listItemIndent: 'listItemIndent',
    // A marker, as in, `*`, `+`, `-`, `.`, or `)`.
    listItemMarker: 'listItemMarker',
    // The thing that starts a list item, such as `1. `.
    // Includes `listItemValue` if ordered, `listItemMarker`, and
    // `listItemPrefixWhitespace` (unless followed by a line ending).
    listItemPrefix: 'listItemPrefix',
    // The whitespace after a marker.
    listItemPrefixWhitespace: 'listItemPrefixWhitespace',
    // The numerical value of an ordered item.
    listItemValue: 'listItemValue',
    // Internal types used for subtokenizers, compiled away
    chunkDocument: 'chunkDocument',
    chunkContent: 'chunkContent',
    chunkFlow: 'chunkFlow',
    chunkText: 'chunkText',
    chunkString: 'chunkString'
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-task-list-item/node_modules/micromark-util-symbol/lib/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65_279,
    // Unicode Specials block.
    replacementCharacter: 65_533 // `�`
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm-task-list-item/node_modules/micromark-util-symbol/lib/types.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Here is the list of all types of tokens exposed by micromark, with a short
 * explanation of what they include and where they are found.
 * In picking names, generally, the rule is to be as explicit as possible
 * instead of reusing names.
 * For example, there is a `definitionDestination` and a `resourceDestination`,
 * instead of one shared name.
 */ // Note: when changing the next record, you must also change `TokenTypeMap`
// in `micromark-util-types/index.d.ts`.
__turbopack_context__.s([
    "types",
    ()=>types
]);
const types = {
    // Generic type for data, such as in a title, a destination, etc.
    data: 'data',
    // Generic type for syntactic whitespace (tabs, virtual spaces, spaces).
    // Such as, between a fenced code fence and an info string.
    whitespace: 'whitespace',
    // Generic type for line endings (line feed, carriage return, carriage return +
    // line feed).
    lineEnding: 'lineEnding',
    // A line ending, but ending a blank line.
    lineEndingBlank: 'lineEndingBlank',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the start of a
    // line.
    linePrefix: 'linePrefix',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the end of a
    // line.
    lineSuffix: 'lineSuffix',
    // Whole ATX heading:
    //
    // ```markdown
    // #
    // ## Alpha
    // ### Bravo ###
    // ```
    //
    // Includes `atxHeadingSequence`, `whitespace`, `atxHeadingText`.
    atxHeading: 'atxHeading',
    // Sequence of number signs in an ATX heading (`###`).
    atxHeadingSequence: 'atxHeadingSequence',
    // Content in an ATX heading (`alpha`).
    // Includes text.
    atxHeadingText: 'atxHeadingText',
    // Whole autolink (`<https://example.com>` or `<admin@example.com>`)
    // Includes `autolinkMarker` and `autolinkProtocol` or `autolinkEmail`.
    autolink: 'autolink',
    // Email autolink w/o markers (`admin@example.com`)
    autolinkEmail: 'autolinkEmail',
    // Marker around an `autolinkProtocol` or `autolinkEmail` (`<` or `>`).
    autolinkMarker: 'autolinkMarker',
    // Protocol autolink w/o markers (`https://example.com`)
    autolinkProtocol: 'autolinkProtocol',
    // A whole character escape (`\-`).
    // Includes `escapeMarker` and `characterEscapeValue`.
    characterEscape: 'characterEscape',
    // The escaped character (`-`).
    characterEscapeValue: 'characterEscapeValue',
    // A whole character reference (`&amp;`, `&#8800;`, or `&#x1D306;`).
    // Includes `characterReferenceMarker`, an optional
    // `characterReferenceMarkerNumeric`, in which case an optional
    // `characterReferenceMarkerHexadecimal`, and a `characterReferenceValue`.
    characterReference: 'characterReference',
    // The start or end marker (`&` or `;`).
    characterReferenceMarker: 'characterReferenceMarker',
    // Mark reference as numeric (`#`).
    characterReferenceMarkerNumeric: 'characterReferenceMarkerNumeric',
    // Mark reference as numeric (`x` or `X`).
    characterReferenceMarkerHexadecimal: 'characterReferenceMarkerHexadecimal',
    // Value of character reference w/o markers (`amp`, `8800`, or `1D306`).
    characterReferenceValue: 'characterReferenceValue',
    // Whole fenced code:
    //
    // ````markdown
    // ```js
    // alert(1)
    // ```
    // ````
    codeFenced: 'codeFenced',
    // A fenced code fence, including whitespace, sequence, info, and meta
    // (` ```js `).
    codeFencedFence: 'codeFencedFence',
    // Sequence of grave accent or tilde characters (` ``` `) in a fence.
    codeFencedFenceSequence: 'codeFencedFenceSequence',
    // Info word (`js`) in a fence.
    // Includes string.
    codeFencedFenceInfo: 'codeFencedFenceInfo',
    // Meta words (`highlight="1"`) in a fence.
    // Includes string.
    codeFencedFenceMeta: 'codeFencedFenceMeta',
    // A line of code.
    codeFlowValue: 'codeFlowValue',
    // Whole indented code:
    //
    // ```markdown
    //     alert(1)
    // ```
    //
    // Includes `lineEnding`, `linePrefix`, and `codeFlowValue`.
    codeIndented: 'codeIndented',
    // A text code (``` `alpha` ```).
    // Includes `codeTextSequence`, `codeTextData`, `lineEnding`, and can include
    // `codeTextPadding`.
    codeText: 'codeText',
    codeTextData: 'codeTextData',
    // A space or line ending right after or before a tick.
    codeTextPadding: 'codeTextPadding',
    // A text code fence (` `` `).
    codeTextSequence: 'codeTextSequence',
    // Whole content:
    //
    // ```markdown
    // [a]: b
    // c
    // =
    // d
    // ```
    //
    // Includes `paragraph` and `definition`.
    content: 'content',
    // Whole definition:
    //
    // ```markdown
    // [micromark]: https://github.com/micromark/micromark
    // ```
    //
    // Includes `definitionLabel`, `definitionMarker`, `whitespace`,
    // `definitionDestination`, and optionally `lineEnding` and `definitionTitle`.
    definition: 'definition',
    // Destination of a definition (`https://github.com/micromark/micromark` or
    // `<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteral` or `definitionDestinationRaw`.
    definitionDestination: 'definitionDestination',
    // Enclosed destination of a definition
    // (`<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteralMarker` and optionally
    // `definitionDestinationString`.
    definitionDestinationLiteral: 'definitionDestinationLiteral',
    // Markers of an enclosed definition destination (`<` or `>`).
    definitionDestinationLiteralMarker: 'definitionDestinationLiteralMarker',
    // Unenclosed destination of a definition
    // (`https://github.com/micromark/micromark`).
    // Includes `definitionDestinationString`.
    definitionDestinationRaw: 'definitionDestinationRaw',
    // Text in an destination (`https://github.com/micromark/micromark`).
    // Includes string.
    definitionDestinationString: 'definitionDestinationString',
    // Label of a definition (`[micromark]`).
    // Includes `definitionLabelMarker` and `definitionLabelString`.
    definitionLabel: 'definitionLabel',
    // Markers of a definition label (`[` or `]`).
    definitionLabelMarker: 'definitionLabelMarker',
    // Value of a definition label (`micromark`).
    // Includes string.
    definitionLabelString: 'definitionLabelString',
    // Marker between a label and a destination (`:`).
    definitionMarker: 'definitionMarker',
    // Title of a definition (`"x"`, `'y'`, or `(z)`).
    // Includes `definitionTitleMarker` and optionally `definitionTitleString`.
    definitionTitle: 'definitionTitle',
    // Marker around a title of a definition (`"`, `'`, `(`, or `)`).
    definitionTitleMarker: 'definitionTitleMarker',
    // Data without markers in a title (`z`).
    // Includes string.
    definitionTitleString: 'definitionTitleString',
    // Emphasis (`*alpha*`).
    // Includes `emphasisSequence` and `emphasisText`.
    emphasis: 'emphasis',
    // Sequence of emphasis markers (`*` or `_`).
    emphasisSequence: 'emphasisSequence',
    // Emphasis text (`alpha`).
    // Includes text.
    emphasisText: 'emphasisText',
    // The character escape marker (`\`).
    escapeMarker: 'escapeMarker',
    // A hard break created with a backslash (`\\n`).
    // Note: does not include the line ending.
    hardBreakEscape: 'hardBreakEscape',
    // A hard break created with trailing spaces (`  \n`).
    // Does not include the line ending.
    hardBreakTrailing: 'hardBreakTrailing',
    // Flow HTML:
    //
    // ```markdown
    // <div
    // ```
    //
    // Inlcudes `lineEnding`, `htmlFlowData`.
    htmlFlow: 'htmlFlow',
    htmlFlowData: 'htmlFlowData',
    // HTML in text (the tag in `a <i> b`).
    // Includes `lineEnding`, `htmlTextData`.
    htmlText: 'htmlText',
    htmlTextData: 'htmlTextData',
    // Whole image (`![alpha](bravo)`, `![alpha][bravo]`, `![alpha][]`, or
    // `![alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    image: 'image',
    // Whole link label (`[*alpha*]`).
    // Includes `labelLink` or `labelImage`, `labelText`, and `labelEnd`.
    label: 'label',
    // Text in an label (`*alpha*`).
    // Includes text.
    labelText: 'labelText',
    // Start a link label (`[`).
    // Includes a `labelMarker`.
    labelLink: 'labelLink',
    // Start an image label (`![`).
    // Includes `labelImageMarker` and `labelMarker`.
    labelImage: 'labelImage',
    // Marker of a label (`[` or `]`).
    labelMarker: 'labelMarker',
    // Marker to start an image (`!`).
    labelImageMarker: 'labelImageMarker',
    // End a label (`]`).
    // Includes `labelMarker`.
    labelEnd: 'labelEnd',
    // Whole link (`[alpha](bravo)`, `[alpha][bravo]`, `[alpha][]`, or `[alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    link: 'link',
    // Whole paragraph:
    //
    // ```markdown
    // alpha
    // bravo.
    // ```
    //
    // Includes text.
    paragraph: 'paragraph',
    // A reference (`[alpha]` or `[]`).
    // Includes `referenceMarker` and an optional `referenceString`.
    reference: 'reference',
    // A reference marker (`[` or `]`).
    referenceMarker: 'referenceMarker',
    // Reference text (`alpha`).
    // Includes string.
    referenceString: 'referenceString',
    // A resource (`(https://example.com "alpha")`).
    // Includes `resourceMarker`, an optional `resourceDestination` with an optional
    // `whitespace` and `resourceTitle`.
    resource: 'resource',
    // A resource destination (`https://example.com`).
    // Includes `resourceDestinationLiteral` or `resourceDestinationRaw`.
    resourceDestination: 'resourceDestination',
    // A literal resource destination (`<https://example.com>`).
    // Includes `resourceDestinationLiteralMarker` and optionally
    // `resourceDestinationString`.
    resourceDestinationLiteral: 'resourceDestinationLiteral',
    // A resource destination marker (`<` or `>`).
    resourceDestinationLiteralMarker: 'resourceDestinationLiteralMarker',
    // A raw resource destination (`https://example.com`).
    // Includes `resourceDestinationString`.
    resourceDestinationRaw: 'resourceDestinationRaw',
    // Resource destination text (`https://example.com`).
    // Includes string.
    resourceDestinationString: 'resourceDestinationString',
    // A resource marker (`(` or `)`).
    resourceMarker: 'resourceMarker',
    // A resource title (`"alpha"`, `'alpha'`, or `(alpha)`).
    // Includes `resourceTitleMarker` and optionally `resourceTitleString`.
    resourceTitle: 'resourceTitle',
    // A resource title marker (`"`, `'`, `(`, or `)`).
    resourceTitleMarker: 'resourceTitleMarker',
    // Resource destination title (`alpha`).
    // Includes string.
    resourceTitleString: 'resourceTitleString',
    // Whole setext heading:
    //
    // ```markdown
    // alpha
    // bravo
    // =====
    // ```
    //
    // Includes `setextHeadingText`, `lineEnding`, `linePrefix`, and
    // `setextHeadingLine`.
    setextHeading: 'setextHeading',
    // Content in a setext heading (`alpha\nbravo`).
    // Includes text.
    setextHeadingText: 'setextHeadingText',
    // Underline in a setext heading, including whitespace suffix (`==`).
    // Includes `setextHeadingLineSequence`.
    setextHeadingLine: 'setextHeadingLine',
    // Sequence of equals or dash characters in underline in a setext heading (`-`).
    setextHeadingLineSequence: 'setextHeadingLineSequence',
    // Strong (`**alpha**`).
    // Includes `strongSequence` and `strongText`.
    strong: 'strong',
    // Sequence of strong markers (`**` or `__`).
    strongSequence: 'strongSequence',
    // Strong text (`alpha`).
    // Includes text.
    strongText: 'strongText',
    // Whole thematic break:
    //
    // ```markdown
    // * * *
    // ```
    //
    // Includes `thematicBreakSequence` and `whitespace`.
    thematicBreak: 'thematicBreak',
    // A sequence of one or more thematic break markers (`***`).
    thematicBreakSequence: 'thematicBreakSequence',
    // Whole block quote:
    //
    // ```markdown
    // > a
    // >
    // > b
    // ```
    //
    // Includes `blockQuotePrefix` and flow.
    blockQuote: 'blockQuote',
    // The `>` or `> ` of a block quote.
    blockQuotePrefix: 'blockQuotePrefix',
    // The `>` of a block quote prefix.
    blockQuoteMarker: 'blockQuoteMarker',
    // The optional ` ` of a block quote prefix.
    blockQuotePrefixWhitespace: 'blockQuotePrefixWhitespace',
    // Whole ordered list:
    //
    // ```markdown
    // 1. a
    //    b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listOrdered: 'listOrdered',
    // Whole unordered list:
    //
    // ```markdown
    // - a
    //   b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listUnordered: 'listUnordered',
    // The indent of further list item lines.
    listItemIndent: 'listItemIndent',
    // A marker, as in, `*`, `+`, `-`, `.`, or `)`.
    listItemMarker: 'listItemMarker',
    // The thing that starts a list item, such as `1. `.
    // Includes `listItemValue` if ordered, `listItemMarker`, and
    // `listItemPrefixWhitespace` (unless followed by a line ending).
    listItemPrefix: 'listItemPrefix',
    // The whitespace after a marker.
    listItemPrefixWhitespace: 'listItemPrefixWhitespace',
    // The numerical value of an ordered item.
    listItemValue: 'listItemValue',
    // Internal types used for subtokenizers, compiled away
    chunkDocument: 'chunkDocument',
    chunkContent: 'chunkContent',
    chunkFlow: 'chunkFlow',
    chunkText: 'chunkText',
    chunkString: 'chunkString'
};
}),
"[project]/frontend/node_modules/micromark-extension-gfm/node_modules/micromark-util-symbol/lib/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */ __turbopack_context__.s([
    "constants",
    ()=>constants
]);
const constants = {
    attentionSideAfter: 2,
    attentionSideBefore: 1,
    atxHeadingOpeningFenceSizeMax: 6,
    autolinkDomainSizeMax: 63,
    autolinkSchemeSizeMax: 32,
    cdataOpeningString: 'CDATA[',
    characterGroupPunctuation: 2,
    characterGroupWhitespace: 1,
    characterReferenceDecimalSizeMax: 7,
    characterReferenceHexadecimalSizeMax: 6,
    characterReferenceNamedSizeMax: 31,
    codeFencedSequenceSizeMin: 3,
    contentTypeContent: 'content',
    contentTypeDocument: 'document',
    contentTypeFlow: 'flow',
    contentTypeString: 'string',
    contentTypeText: 'text',
    hardBreakPrefixSizeMin: 2,
    htmlBasic: 6,
    htmlCdata: 5,
    htmlComment: 2,
    htmlComplete: 7,
    htmlDeclaration: 4,
    htmlInstruction: 3,
    htmlRawSizeMax: 8,
    htmlRaw: 1,
    linkResourceDestinationBalanceMax: 32,
    linkReferenceSizeMax: 999,
    listItemValueSizeMax: 10,
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 0x10,
    tabSize: 4,
    thematicBreakMarkerCountMin: 3,
    v8MaxSafeChunkSize: 10_000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
};
}),
"[project]/frontend/node_modules/micromark-extension-math/node_modules/micromark-util-symbol/lib/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65_279,
    // Unicode Specials block.
    replacementCharacter: 65_533 // `�`
};
}),
"[project]/frontend/node_modules/micromark-extension-math/node_modules/micromark-util-symbol/lib/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */ __turbopack_context__.s([
    "constants",
    ()=>constants
]);
const constants = {
    attentionSideAfter: 2,
    attentionSideBefore: 1,
    atxHeadingOpeningFenceSizeMax: 6,
    autolinkDomainSizeMax: 63,
    autolinkSchemeSizeMax: 32,
    cdataOpeningString: 'CDATA[',
    characterGroupPunctuation: 2,
    characterGroupWhitespace: 1,
    characterReferenceDecimalSizeMax: 7,
    characterReferenceHexadecimalSizeMax: 6,
    characterReferenceNamedSizeMax: 31,
    codeFencedSequenceSizeMin: 3,
    contentTypeContent: 'content',
    contentTypeDocument: 'document',
    contentTypeFlow: 'flow',
    contentTypeString: 'string',
    contentTypeText: 'text',
    hardBreakPrefixSizeMin: 2,
    htmlBasic: 6,
    htmlCdata: 5,
    htmlComment: 2,
    htmlComplete: 7,
    htmlDeclaration: 4,
    htmlInstruction: 3,
    htmlRawSizeMax: 8,
    htmlRaw: 1,
    linkResourceDestinationBalanceMax: 32,
    linkReferenceSizeMax: 999,
    listItemValueSizeMax: 10,
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 0x10,
    tabSize: 4,
    thematicBreakMarkerCountMin: 3,
    v8MaxSafeChunkSize: 10_000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
};
}),
"[project]/frontend/node_modules/micromark-extension-math/node_modules/micromark-util-symbol/lib/types.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Here is the list of all types of tokens exposed by micromark, with a short
 * explanation of what they include and where they are found.
 * In picking names, generally, the rule is to be as explicit as possible
 * instead of reusing names.
 * For example, there is a `definitionDestination` and a `resourceDestination`,
 * instead of one shared name.
 */ // Note: when changing the next record, you must also change `TokenTypeMap`
// in `micromark-util-types/index.d.ts`.
__turbopack_context__.s([
    "types",
    ()=>types
]);
const types = {
    // Generic type for data, such as in a title, a destination, etc.
    data: 'data',
    // Generic type for syntactic whitespace (tabs, virtual spaces, spaces).
    // Such as, between a fenced code fence and an info string.
    whitespace: 'whitespace',
    // Generic type for line endings (line feed, carriage return, carriage return +
    // line feed).
    lineEnding: 'lineEnding',
    // A line ending, but ending a blank line.
    lineEndingBlank: 'lineEndingBlank',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the start of a
    // line.
    linePrefix: 'linePrefix',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the end of a
    // line.
    lineSuffix: 'lineSuffix',
    // Whole ATX heading:
    //
    // ```markdown
    // #
    // ## Alpha
    // ### Bravo ###
    // ```
    //
    // Includes `atxHeadingSequence`, `whitespace`, `atxHeadingText`.
    atxHeading: 'atxHeading',
    // Sequence of number signs in an ATX heading (`###`).
    atxHeadingSequence: 'atxHeadingSequence',
    // Content in an ATX heading (`alpha`).
    // Includes text.
    atxHeadingText: 'atxHeadingText',
    // Whole autolink (`<https://example.com>` or `<admin@example.com>`)
    // Includes `autolinkMarker` and `autolinkProtocol` or `autolinkEmail`.
    autolink: 'autolink',
    // Email autolink w/o markers (`admin@example.com`)
    autolinkEmail: 'autolinkEmail',
    // Marker around an `autolinkProtocol` or `autolinkEmail` (`<` or `>`).
    autolinkMarker: 'autolinkMarker',
    // Protocol autolink w/o markers (`https://example.com`)
    autolinkProtocol: 'autolinkProtocol',
    // A whole character escape (`\-`).
    // Includes `escapeMarker` and `characterEscapeValue`.
    characterEscape: 'characterEscape',
    // The escaped character (`-`).
    characterEscapeValue: 'characterEscapeValue',
    // A whole character reference (`&amp;`, `&#8800;`, or `&#x1D306;`).
    // Includes `characterReferenceMarker`, an optional
    // `characterReferenceMarkerNumeric`, in which case an optional
    // `characterReferenceMarkerHexadecimal`, and a `characterReferenceValue`.
    characterReference: 'characterReference',
    // The start or end marker (`&` or `;`).
    characterReferenceMarker: 'characterReferenceMarker',
    // Mark reference as numeric (`#`).
    characterReferenceMarkerNumeric: 'characterReferenceMarkerNumeric',
    // Mark reference as numeric (`x` or `X`).
    characterReferenceMarkerHexadecimal: 'characterReferenceMarkerHexadecimal',
    // Value of character reference w/o markers (`amp`, `8800`, or `1D306`).
    characterReferenceValue: 'characterReferenceValue',
    // Whole fenced code:
    //
    // ````markdown
    // ```js
    // alert(1)
    // ```
    // ````
    codeFenced: 'codeFenced',
    // A fenced code fence, including whitespace, sequence, info, and meta
    // (` ```js `).
    codeFencedFence: 'codeFencedFence',
    // Sequence of grave accent or tilde characters (` ``` `) in a fence.
    codeFencedFenceSequence: 'codeFencedFenceSequence',
    // Info word (`js`) in a fence.
    // Includes string.
    codeFencedFenceInfo: 'codeFencedFenceInfo',
    // Meta words (`highlight="1"`) in a fence.
    // Includes string.
    codeFencedFenceMeta: 'codeFencedFenceMeta',
    // A line of code.
    codeFlowValue: 'codeFlowValue',
    // Whole indented code:
    //
    // ```markdown
    //     alert(1)
    // ```
    //
    // Includes `lineEnding`, `linePrefix`, and `codeFlowValue`.
    codeIndented: 'codeIndented',
    // A text code (``` `alpha` ```).
    // Includes `codeTextSequence`, `codeTextData`, `lineEnding`, and can include
    // `codeTextPadding`.
    codeText: 'codeText',
    codeTextData: 'codeTextData',
    // A space or line ending right after or before a tick.
    codeTextPadding: 'codeTextPadding',
    // A text code fence (` `` `).
    codeTextSequence: 'codeTextSequence',
    // Whole content:
    //
    // ```markdown
    // [a]: b
    // c
    // =
    // d
    // ```
    //
    // Includes `paragraph` and `definition`.
    content: 'content',
    // Whole definition:
    //
    // ```markdown
    // [micromark]: https://github.com/micromark/micromark
    // ```
    //
    // Includes `definitionLabel`, `definitionMarker`, `whitespace`,
    // `definitionDestination`, and optionally `lineEnding` and `definitionTitle`.
    definition: 'definition',
    // Destination of a definition (`https://github.com/micromark/micromark` or
    // `<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteral` or `definitionDestinationRaw`.
    definitionDestination: 'definitionDestination',
    // Enclosed destination of a definition
    // (`<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteralMarker` and optionally
    // `definitionDestinationString`.
    definitionDestinationLiteral: 'definitionDestinationLiteral',
    // Markers of an enclosed definition destination (`<` or `>`).
    definitionDestinationLiteralMarker: 'definitionDestinationLiteralMarker',
    // Unenclosed destination of a definition
    // (`https://github.com/micromark/micromark`).
    // Includes `definitionDestinationString`.
    definitionDestinationRaw: 'definitionDestinationRaw',
    // Text in an destination (`https://github.com/micromark/micromark`).
    // Includes string.
    definitionDestinationString: 'definitionDestinationString',
    // Label of a definition (`[micromark]`).
    // Includes `definitionLabelMarker` and `definitionLabelString`.
    definitionLabel: 'definitionLabel',
    // Markers of a definition label (`[` or `]`).
    definitionLabelMarker: 'definitionLabelMarker',
    // Value of a definition label (`micromark`).
    // Includes string.
    definitionLabelString: 'definitionLabelString',
    // Marker between a label and a destination (`:`).
    definitionMarker: 'definitionMarker',
    // Title of a definition (`"x"`, `'y'`, or `(z)`).
    // Includes `definitionTitleMarker` and optionally `definitionTitleString`.
    definitionTitle: 'definitionTitle',
    // Marker around a title of a definition (`"`, `'`, `(`, or `)`).
    definitionTitleMarker: 'definitionTitleMarker',
    // Data without markers in a title (`z`).
    // Includes string.
    definitionTitleString: 'definitionTitleString',
    // Emphasis (`*alpha*`).
    // Includes `emphasisSequence` and `emphasisText`.
    emphasis: 'emphasis',
    // Sequence of emphasis markers (`*` or `_`).
    emphasisSequence: 'emphasisSequence',
    // Emphasis text (`alpha`).
    // Includes text.
    emphasisText: 'emphasisText',
    // The character escape marker (`\`).
    escapeMarker: 'escapeMarker',
    // A hard break created with a backslash (`\\n`).
    // Note: does not include the line ending.
    hardBreakEscape: 'hardBreakEscape',
    // A hard break created with trailing spaces (`  \n`).
    // Does not include the line ending.
    hardBreakTrailing: 'hardBreakTrailing',
    // Flow HTML:
    //
    // ```markdown
    // <div
    // ```
    //
    // Inlcudes `lineEnding`, `htmlFlowData`.
    htmlFlow: 'htmlFlow',
    htmlFlowData: 'htmlFlowData',
    // HTML in text (the tag in `a <i> b`).
    // Includes `lineEnding`, `htmlTextData`.
    htmlText: 'htmlText',
    htmlTextData: 'htmlTextData',
    // Whole image (`![alpha](bravo)`, `![alpha][bravo]`, `![alpha][]`, or
    // `![alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    image: 'image',
    // Whole link label (`[*alpha*]`).
    // Includes `labelLink` or `labelImage`, `labelText`, and `labelEnd`.
    label: 'label',
    // Text in an label (`*alpha*`).
    // Includes text.
    labelText: 'labelText',
    // Start a link label (`[`).
    // Includes a `labelMarker`.
    labelLink: 'labelLink',
    // Start an image label (`![`).
    // Includes `labelImageMarker` and `labelMarker`.
    labelImage: 'labelImage',
    // Marker of a label (`[` or `]`).
    labelMarker: 'labelMarker',
    // Marker to start an image (`!`).
    labelImageMarker: 'labelImageMarker',
    // End a label (`]`).
    // Includes `labelMarker`.
    labelEnd: 'labelEnd',
    // Whole link (`[alpha](bravo)`, `[alpha][bravo]`, `[alpha][]`, or `[alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    link: 'link',
    // Whole paragraph:
    //
    // ```markdown
    // alpha
    // bravo.
    // ```
    //
    // Includes text.
    paragraph: 'paragraph',
    // A reference (`[alpha]` or `[]`).
    // Includes `referenceMarker` and an optional `referenceString`.
    reference: 'reference',
    // A reference marker (`[` or `]`).
    referenceMarker: 'referenceMarker',
    // Reference text (`alpha`).
    // Includes string.
    referenceString: 'referenceString',
    // A resource (`(https://example.com "alpha")`).
    // Includes `resourceMarker`, an optional `resourceDestination` with an optional
    // `whitespace` and `resourceTitle`.
    resource: 'resource',
    // A resource destination (`https://example.com`).
    // Includes `resourceDestinationLiteral` or `resourceDestinationRaw`.
    resourceDestination: 'resourceDestination',
    // A literal resource destination (`<https://example.com>`).
    // Includes `resourceDestinationLiteralMarker` and optionally
    // `resourceDestinationString`.
    resourceDestinationLiteral: 'resourceDestinationLiteral',
    // A resource destination marker (`<` or `>`).
    resourceDestinationLiteralMarker: 'resourceDestinationLiteralMarker',
    // A raw resource destination (`https://example.com`).
    // Includes `resourceDestinationString`.
    resourceDestinationRaw: 'resourceDestinationRaw',
    // Resource destination text (`https://example.com`).
    // Includes string.
    resourceDestinationString: 'resourceDestinationString',
    // A resource marker (`(` or `)`).
    resourceMarker: 'resourceMarker',
    // A resource title (`"alpha"`, `'alpha'`, or `(alpha)`).
    // Includes `resourceTitleMarker` and optionally `resourceTitleString`.
    resourceTitle: 'resourceTitle',
    // A resource title marker (`"`, `'`, `(`, or `)`).
    resourceTitleMarker: 'resourceTitleMarker',
    // Resource destination title (`alpha`).
    // Includes string.
    resourceTitleString: 'resourceTitleString',
    // Whole setext heading:
    //
    // ```markdown
    // alpha
    // bravo
    // =====
    // ```
    //
    // Includes `setextHeadingText`, `lineEnding`, `linePrefix`, and
    // `setextHeadingLine`.
    setextHeading: 'setextHeading',
    // Content in a setext heading (`alpha\nbravo`).
    // Includes text.
    setextHeadingText: 'setextHeadingText',
    // Underline in a setext heading, including whitespace suffix (`==`).
    // Includes `setextHeadingLineSequence`.
    setextHeadingLine: 'setextHeadingLine',
    // Sequence of equals or dash characters in underline in a setext heading (`-`).
    setextHeadingLineSequence: 'setextHeadingLineSequence',
    // Strong (`**alpha**`).
    // Includes `strongSequence` and `strongText`.
    strong: 'strong',
    // Sequence of strong markers (`**` or `__`).
    strongSequence: 'strongSequence',
    // Strong text (`alpha`).
    // Includes text.
    strongText: 'strongText',
    // Whole thematic break:
    //
    // ```markdown
    // * * *
    // ```
    //
    // Includes `thematicBreakSequence` and `whitespace`.
    thematicBreak: 'thematicBreak',
    // A sequence of one or more thematic break markers (`***`).
    thematicBreakSequence: 'thematicBreakSequence',
    // Whole block quote:
    //
    // ```markdown
    // > a
    // >
    // > b
    // ```
    //
    // Includes `blockQuotePrefix` and flow.
    blockQuote: 'blockQuote',
    // The `>` or `> ` of a block quote.
    blockQuotePrefix: 'blockQuotePrefix',
    // The `>` of a block quote prefix.
    blockQuoteMarker: 'blockQuoteMarker',
    // The optional ` ` of a block quote prefix.
    blockQuotePrefixWhitespace: 'blockQuotePrefixWhitespace',
    // Whole ordered list:
    //
    // ```markdown
    // 1. a
    //    b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listOrdered: 'listOrdered',
    // Whole unordered list:
    //
    // ```markdown
    // - a
    //   b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listUnordered: 'listUnordered',
    // The indent of further list item lines.
    listItemIndent: 'listItemIndent',
    // A marker, as in, `*`, `+`, `-`, `.`, or `)`.
    listItemMarker: 'listItemMarker',
    // The thing that starts a list item, such as `1. `.
    // Includes `listItemValue` if ordered, `listItemMarker`, and
    // `listItemPrefixWhitespace` (unless followed by a line ending).
    listItemPrefix: 'listItemPrefix',
    // The whitespace after a marker.
    listItemPrefixWhitespace: 'listItemPrefixWhitespace',
    // The numerical value of an ordered item.
    listItemValue: 'listItemValue',
    // Internal types used for subtokenizers, compiled away
    chunkDocument: 'chunkDocument',
    chunkContent: 'chunkContent',
    chunkFlow: 'chunkFlow',
    chunkText: 'chunkText',
    chunkString: 'chunkString'
};
}),
"[project]/frontend/node_modules/micromark-util-symbol/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65279,
    // Unicode Specials block.
    replacementCharacter: 65533 // `�`
};
}),
"[project]/frontend/node_modules/micromark-util-symbol/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */ __turbopack_context__.s([
    "constants",
    ()=>constants
]);
const constants = {
    attentionSideBefore: 1,
    attentionSideAfter: 2,
    atxHeadingOpeningFenceSizeMax: 6,
    autolinkDomainSizeMax: 63,
    autolinkSchemeSizeMax: 32,
    cdataOpeningString: 'CDATA[',
    characterGroupWhitespace: 1,
    characterGroupPunctuation: 2,
    characterReferenceDecimalSizeMax: 7,
    characterReferenceHexadecimalSizeMax: 6,
    characterReferenceNamedSizeMax: 31,
    codeFencedSequenceSizeMin: 3,
    contentTypeDocument: 'document',
    contentTypeFlow: 'flow',
    contentTypeContent: 'content',
    contentTypeString: 'string',
    contentTypeText: 'text',
    hardBreakPrefixSizeMin: 2,
    htmlRaw: 1,
    htmlComment: 2,
    htmlInstruction: 3,
    htmlDeclaration: 4,
    htmlCdata: 5,
    htmlBasic: 6,
    htmlComplete: 7,
    htmlRawSizeMax: 8,
    linkResourceDestinationBalanceMax: 32,
    linkReferenceSizeMax: 999,
    listItemValueSizeMax: 10,
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 0x10,
    tabSize: 4,
    thematicBreakMarkerCountMin: 3,
    v8MaxSafeChunkSize: 10000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
};
}),
"[project]/frontend/node_modules/micromark-util-symbol/types.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Here is the list of all types of tokens exposed by micromark, with a short
 * explanation of what they include and where they are found.
 * In picking names, generally, the rule is to be as explicit as possible
 * instead of reusing names.
 * For example, there is a `definitionDestination` and a `resourceDestination`,
 * instead of one shared name.
 */ // Note: when changing the next record, you must also change `TokenTypeMap`
// in `micromark-util-types/index.d.ts`.
__turbopack_context__.s([
    "types",
    ()=>types
]);
const types = {
    // Generic type for data, such as in a title, a destination, etc.
    data: 'data',
    // Generic type for syntactic whitespace (tabs, virtual spaces, spaces).
    // Such as, between a fenced code fence and an info string.
    whitespace: 'whitespace',
    // Generic type for line endings (line feed, carriage return, carriage return +
    // line feed).
    lineEnding: 'lineEnding',
    // A line ending, but ending a blank line.
    lineEndingBlank: 'lineEndingBlank',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the start of a
    // line.
    linePrefix: 'linePrefix',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the end of a
    // line.
    lineSuffix: 'lineSuffix',
    // Whole ATX heading:
    //
    // ```markdown
    // #
    // ## Alpha
    // ### Bravo ###
    // ```
    //
    // Includes `atxHeadingSequence`, `whitespace`, `atxHeadingText`.
    atxHeading: 'atxHeading',
    // Sequence of number signs in an ATX heading (`###`).
    atxHeadingSequence: 'atxHeadingSequence',
    // Content in an ATX heading (`alpha`).
    // Includes text.
    atxHeadingText: 'atxHeadingText',
    // Whole autolink (`<https://example.com>` or `<admin@example.com>`)
    // Includes `autolinkMarker` and `autolinkProtocol` or `autolinkEmail`.
    autolink: 'autolink',
    // Email autolink w/o markers (`admin@example.com`)
    autolinkEmail: 'autolinkEmail',
    // Marker around an `autolinkProtocol` or `autolinkEmail` (`<` or `>`).
    autolinkMarker: 'autolinkMarker',
    // Protocol autolink w/o markers (`https://example.com`)
    autolinkProtocol: 'autolinkProtocol',
    // A whole character escape (`\-`).
    // Includes `escapeMarker` and `characterEscapeValue`.
    characterEscape: 'characterEscape',
    // The escaped character (`-`).
    characterEscapeValue: 'characterEscapeValue',
    // A whole character reference (`&amp;`, `&#8800;`, or `&#x1D306;`).
    // Includes `characterReferenceMarker`, an optional
    // `characterReferenceMarkerNumeric`, in which case an optional
    // `characterReferenceMarkerHexadecimal`, and a `characterReferenceValue`.
    characterReference: 'characterReference',
    // The start or end marker (`&` or `;`).
    characterReferenceMarker: 'characterReferenceMarker',
    // Mark reference as numeric (`#`).
    characterReferenceMarkerNumeric: 'characterReferenceMarkerNumeric',
    // Mark reference as numeric (`x` or `X`).
    characterReferenceMarkerHexadecimal: 'characterReferenceMarkerHexadecimal',
    // Value of character reference w/o markers (`amp`, `8800`, or `1D306`).
    characterReferenceValue: 'characterReferenceValue',
    // Whole fenced code:
    //
    // ````markdown
    // ```js
    // alert(1)
    // ```
    // ````
    codeFenced: 'codeFenced',
    // A fenced code fence, including whitespace, sequence, info, and meta
    // (` ```js `).
    codeFencedFence: 'codeFencedFence',
    // Sequence of grave accent or tilde characters (` ``` `) in a fence.
    codeFencedFenceSequence: 'codeFencedFenceSequence',
    // Info word (`js`) in a fence.
    // Includes string.
    codeFencedFenceInfo: 'codeFencedFenceInfo',
    // Meta words (`highlight="1"`) in a fence.
    // Includes string.
    codeFencedFenceMeta: 'codeFencedFenceMeta',
    // A line of code.
    codeFlowValue: 'codeFlowValue',
    // Whole indented code:
    //
    // ```markdown
    //     alert(1)
    // ```
    //
    // Includes `lineEnding`, `linePrefix`, and `codeFlowValue`.
    codeIndented: 'codeIndented',
    // A text code (``` `alpha` ```).
    // Includes `codeTextSequence`, `codeTextData`, `lineEnding`, and can include
    // `codeTextPadding`.
    codeText: 'codeText',
    codeTextData: 'codeTextData',
    // A space or line ending right after or before a tick.
    codeTextPadding: 'codeTextPadding',
    // A text code fence (` `` `).
    codeTextSequence: 'codeTextSequence',
    // Whole content:
    //
    // ```markdown
    // [a]: b
    // c
    // =
    // d
    // ```
    //
    // Includes `paragraph` and `definition`.
    content: 'content',
    // Whole definition:
    //
    // ```markdown
    // [micromark]: https://github.com/micromark/micromark
    // ```
    //
    // Includes `definitionLabel`, `definitionMarker`, `whitespace`,
    // `definitionDestination`, and optionally `lineEnding` and `definitionTitle`.
    definition: 'definition',
    // Destination of a definition (`https://github.com/micromark/micromark` or
    // `<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteral` or `definitionDestinationRaw`.
    definitionDestination: 'definitionDestination',
    // Enclosed destination of a definition
    // (`<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteralMarker` and optionally
    // `definitionDestinationString`.
    definitionDestinationLiteral: 'definitionDestinationLiteral',
    // Markers of an enclosed definition destination (`<` or `>`).
    definitionDestinationLiteralMarker: 'definitionDestinationLiteralMarker',
    // Unenclosed destination of a definition
    // (`https://github.com/micromark/micromark`).
    // Includes `definitionDestinationString`.
    definitionDestinationRaw: 'definitionDestinationRaw',
    // Text in an destination (`https://github.com/micromark/micromark`).
    // Includes string.
    definitionDestinationString: 'definitionDestinationString',
    // Label of a definition (`[micromark]`).
    // Includes `definitionLabelMarker` and `definitionLabelString`.
    definitionLabel: 'definitionLabel',
    // Markers of a definition label (`[` or `]`).
    definitionLabelMarker: 'definitionLabelMarker',
    // Value of a definition label (`micromark`).
    // Includes string.
    definitionLabelString: 'definitionLabelString',
    // Marker between a label and a destination (`:`).
    definitionMarker: 'definitionMarker',
    // Title of a definition (`"x"`, `'y'`, or `(z)`).
    // Includes `definitionTitleMarker` and optionally `definitionTitleString`.
    definitionTitle: 'definitionTitle',
    // Marker around a title of a definition (`"`, `'`, `(`, or `)`).
    definitionTitleMarker: 'definitionTitleMarker',
    // Data without markers in a title (`z`).
    // Includes string.
    definitionTitleString: 'definitionTitleString',
    // Emphasis (`*alpha*`).
    // Includes `emphasisSequence` and `emphasisText`.
    emphasis: 'emphasis',
    // Sequence of emphasis markers (`*` or `_`).
    emphasisSequence: 'emphasisSequence',
    // Emphasis text (`alpha`).
    // Includes text.
    emphasisText: 'emphasisText',
    // The character escape marker (`\`).
    escapeMarker: 'escapeMarker',
    // A hard break created with a backslash (`\\n`).
    // Note: does not include the line ending.
    hardBreakEscape: 'hardBreakEscape',
    // A hard break created with trailing spaces (`  \n`).
    // Does not include the line ending.
    hardBreakTrailing: 'hardBreakTrailing',
    // Flow HTML:
    //
    // ```markdown
    // <div
    // ```
    //
    // Inlcudes `lineEnding`, `htmlFlowData`.
    htmlFlow: 'htmlFlow',
    htmlFlowData: 'htmlFlowData',
    // HTML in text (the tag in `a <i> b`).
    // Includes `lineEnding`, `htmlTextData`.
    htmlText: 'htmlText',
    htmlTextData: 'htmlTextData',
    // Whole image (`![alpha](bravo)`, `![alpha][bravo]`, `![alpha][]`, or
    // `![alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    image: 'image',
    // Whole link label (`[*alpha*]`).
    // Includes `labelLink` or `labelImage`, `labelText`, and `labelEnd`.
    label: 'label',
    // Text in an label (`*alpha*`).
    // Includes text.
    labelText: 'labelText',
    // Start a link label (`[`).
    // Includes a `labelMarker`.
    labelLink: 'labelLink',
    // Start an image label (`![`).
    // Includes `labelImageMarker` and `labelMarker`.
    labelImage: 'labelImage',
    // Marker of a label (`[` or `]`).
    labelMarker: 'labelMarker',
    // Marker to start an image (`!`).
    labelImageMarker: 'labelImageMarker',
    // End a label (`]`).
    // Includes `labelMarker`.
    labelEnd: 'labelEnd',
    // Whole link (`[alpha](bravo)`, `[alpha][bravo]`, `[alpha][]`, or `[alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    link: 'link',
    // Whole paragraph:
    //
    // ```markdown
    // alpha
    // bravo.
    // ```
    //
    // Includes text.
    paragraph: 'paragraph',
    // A reference (`[alpha]` or `[]`).
    // Includes `referenceMarker` and an optional `referenceString`.
    reference: 'reference',
    // A reference marker (`[` or `]`).
    referenceMarker: 'referenceMarker',
    // Reference text (`alpha`).
    // Includes string.
    referenceString: 'referenceString',
    // A resource (`(https://example.com "alpha")`).
    // Includes `resourceMarker`, an optional `resourceDestination` with an optional
    // `whitespace` and `resourceTitle`.
    resource: 'resource',
    // A resource destination (`https://example.com`).
    // Includes `resourceDestinationLiteral` or `resourceDestinationRaw`.
    resourceDestination: 'resourceDestination',
    // A literal resource destination (`<https://example.com>`).
    // Includes `resourceDestinationLiteralMarker` and optionally
    // `resourceDestinationString`.
    resourceDestinationLiteral: 'resourceDestinationLiteral',
    // A resource destination marker (`<` or `>`).
    resourceDestinationLiteralMarker: 'resourceDestinationLiteralMarker',
    // A raw resource destination (`https://example.com`).
    // Includes `resourceDestinationString`.
    resourceDestinationRaw: 'resourceDestinationRaw',
    // Resource destination text (`https://example.com`).
    // Includes string.
    resourceDestinationString: 'resourceDestinationString',
    // A resource marker (`(` or `)`).
    resourceMarker: 'resourceMarker',
    // A resource title (`"alpha"`, `'alpha'`, or `(alpha)`).
    // Includes `resourceTitleMarker` and optionally `resourceTitleString`.
    resourceTitle: 'resourceTitle',
    // A resource title marker (`"`, `'`, `(`, or `)`).
    resourceTitleMarker: 'resourceTitleMarker',
    // Resource destination title (`alpha`).
    // Includes string.
    resourceTitleString: 'resourceTitleString',
    // Whole setext heading:
    //
    // ```markdown
    // alpha
    // bravo
    // =====
    // ```
    //
    // Includes `setextHeadingText`, `lineEnding`, `linePrefix`, and
    // `setextHeadingLine`.
    setextHeading: 'setextHeading',
    // Content in a setext heading (`alpha\nbravo`).
    // Includes text.
    setextHeadingText: 'setextHeadingText',
    // Underline in a setext heading, including whitespace suffix (`==`).
    // Includes `setextHeadingLineSequence`.
    setextHeadingLine: 'setextHeadingLine',
    // Sequence of equals or dash characters in underline in a setext heading (`-`).
    setextHeadingLineSequence: 'setextHeadingLineSequence',
    // Strong (`**alpha**`).
    // Includes `strongSequence` and `strongText`.
    strong: 'strong',
    // Sequence of strong markers (`**` or `__`).
    strongSequence: 'strongSequence',
    // Strong text (`alpha`).
    // Includes text.
    strongText: 'strongText',
    // Whole thematic break:
    //
    // ```markdown
    // * * *
    // ```
    //
    // Includes `thematicBreakSequence` and `whitespace`.
    thematicBreak: 'thematicBreak',
    // A sequence of one or more thematic break markers (`***`).
    thematicBreakSequence: 'thematicBreakSequence',
    // Whole block quote:
    //
    // ```markdown
    // > a
    // >
    // > b
    // ```
    //
    // Includes `blockQuotePrefix` and flow.
    blockQuote: 'blockQuote',
    // The `>` or `> ` of a block quote.
    blockQuotePrefix: 'blockQuotePrefix',
    // The `>` of a block quote prefix.
    blockQuoteMarker: 'blockQuoteMarker',
    // The optional ` ` of a block quote prefix.
    blockQuotePrefixWhitespace: 'blockQuotePrefixWhitespace',
    // Whole unordered list:
    //
    // ```markdown
    // - a
    //   b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listOrdered: 'listOrdered',
    // Whole ordered list:
    //
    // ```markdown
    // 1. a
    //    b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listUnordered: 'listUnordered',
    // The indent of further list item lines.
    listItemIndent: 'listItemIndent',
    // A marker, as in, `*`, `+`, `-`, `.`, or `)`.
    listItemMarker: 'listItemMarker',
    // The thing that starts a list item, such as `1. `.
    // Includes `listItemValue` if ordered, `listItemMarker`, and
    // `listItemPrefixWhitespace` (unless followed by a line ending).
    listItemPrefix: 'listItemPrefix',
    // The whitespace after a marker.
    listItemPrefixWhitespace: 'listItemPrefixWhitespace',
    // The numerical value of an ordered item.
    listItemValue: 'listItemValue',
    // Internal types used for subtokenizers, compiled away
    chunkDocument: 'chunkDocument',
    chunkContent: 'chunkContent',
    chunkFlow: 'chunkFlow',
    chunkText: 'chunkText',
    chunkString: 'chunkString'
};
}),
"[project]/frontend/node_modules/micromark-util-symbol/values.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * While micromark works based on character codes, this module includes the
 * string versions of ’em.
 * The C0 block, except for LF, CR, HT, and w/ the replacement character added,
 * are available here.
 */ __turbopack_context__.s([
    "values",
    ()=>values
]);
const values = {
    ht: '\t',
    lf: '\n',
    cr: '\r',
    space: ' ',
    exclamationMark: '!',
    quotationMark: '"',
    numberSign: '#',
    dollarSign: '$',
    percentSign: '%',
    ampersand: '&',
    apostrophe: "'",
    leftParenthesis: '(',
    rightParenthesis: ')',
    asterisk: '*',
    plusSign: '+',
    comma: ',',
    dash: '-',
    dot: '.',
    slash: '/',
    digit0: '0',
    digit1: '1',
    digit2: '2',
    digit3: '3',
    digit4: '4',
    digit5: '5',
    digit6: '6',
    digit7: '7',
    digit8: '8',
    digit9: '9',
    colon: ':',
    semicolon: ';',
    lessThan: '<',
    equalsTo: '=',
    greaterThan: '>',
    questionMark: '?',
    atSign: '@',
    uppercaseA: 'A',
    uppercaseB: 'B',
    uppercaseC: 'C',
    uppercaseD: 'D',
    uppercaseE: 'E',
    uppercaseF: 'F',
    uppercaseG: 'G',
    uppercaseH: 'H',
    uppercaseI: 'I',
    uppercaseJ: 'J',
    uppercaseK: 'K',
    uppercaseL: 'L',
    uppercaseM: 'M',
    uppercaseN: 'N',
    uppercaseO: 'O',
    uppercaseP: 'P',
    uppercaseQ: 'Q',
    uppercaseR: 'R',
    uppercaseS: 'S',
    uppercaseT: 'T',
    uppercaseU: 'U',
    uppercaseV: 'V',
    uppercaseW: 'W',
    uppercaseX: 'X',
    uppercaseY: 'Y',
    uppercaseZ: 'Z',
    leftSquareBracket: '[',
    backslash: '\\',
    rightSquareBracket: ']',
    caret: '^',
    underscore: '_',
    graveAccent: '`',
    lowercaseA: 'a',
    lowercaseB: 'b',
    lowercaseC: 'c',
    lowercaseD: 'd',
    lowercaseE: 'e',
    lowercaseF: 'f',
    lowercaseG: 'g',
    lowercaseH: 'h',
    lowercaseI: 'i',
    lowercaseJ: 'j',
    lowercaseK: 'k',
    lowercaseL: 'l',
    lowercaseM: 'm',
    lowercaseN: 'n',
    lowercaseO: 'o',
    lowercaseP: 'p',
    lowercaseQ: 'q',
    lowercaseR: 'r',
    lowercaseS: 's',
    lowercaseT: 't',
    lowercaseU: 'u',
    lowercaseV: 'v',
    lowercaseW: 'w',
    lowercaseX: 'x',
    lowercaseY: 'y',
    lowercaseZ: 'z',
    leftCurlyBrace: '{',
    verticalBar: '|',
    rightCurlyBrace: '}',
    tilde: '~',
    replacementCharacter: '�'
};
}),
"[project]/frontend/node_modules/streamdown/node_modules/micromark-util-symbol/lib/codes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Character codes.
 *
 * This module is compiled away!
 *
 * micromark works based on character codes.
 * This module contains constants for the ASCII block and the replacement
 * character.
 * A couple of them are handled in a special way, such as the line endings
 * (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
 * tab) and its expansion based on what column it’s at (virtual space),
 * and the end-of-file (eof) character.
 * As values are preprocessed before handling them, the actual characters LF,
 * CR, HT, and NUL (which is present as the replacement character), are
 * guaranteed to not exist.
 *
 * Unicode basic latin block.
 */ __turbopack_context__.s([
    "codes",
    ()=>codes
]);
const codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65_279,
    // Unicode Specials block.
    replacementCharacter: 65_533 // `�`
};
}),
"[project]/frontend/node_modules/streamdown/node_modules/micromark-util-symbol/lib/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Parsing markdown comes with a couple of constants, such as minimum or maximum
 * sizes of certain sequences.
 * Additionally, there are a couple symbols used inside micromark.
 * These are all defined here, but compiled away by scripts.
 */ __turbopack_context__.s([
    "constants",
    ()=>constants
]);
const constants = {
    attentionSideAfter: 2,
    attentionSideBefore: 1,
    atxHeadingOpeningFenceSizeMax: 6,
    autolinkDomainSizeMax: 63,
    autolinkSchemeSizeMax: 32,
    cdataOpeningString: 'CDATA[',
    characterGroupPunctuation: 2,
    characterGroupWhitespace: 1,
    characterReferenceDecimalSizeMax: 7,
    characterReferenceHexadecimalSizeMax: 6,
    characterReferenceNamedSizeMax: 31,
    codeFencedSequenceSizeMin: 3,
    contentTypeContent: 'content',
    contentTypeDocument: 'document',
    contentTypeFlow: 'flow',
    contentTypeString: 'string',
    contentTypeText: 'text',
    hardBreakPrefixSizeMin: 2,
    htmlBasic: 6,
    htmlCdata: 5,
    htmlComment: 2,
    htmlComplete: 7,
    htmlDeclaration: 4,
    htmlInstruction: 3,
    htmlRawSizeMax: 8,
    htmlRaw: 1,
    linkResourceDestinationBalanceMax: 32,
    linkReferenceSizeMax: 999,
    listItemValueSizeMax: 10,
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 0x10,
    tabSize: 4,
    thematicBreakMarkerCountMin: 3,
    v8MaxSafeChunkSize: 10_000 // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
};
}),
"[project]/frontend/node_modules/streamdown/node_modules/micromark-util-symbol/lib/types.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * Here is the list of all types of tokens exposed by micromark, with a short
 * explanation of what they include and where they are found.
 * In picking names, generally, the rule is to be as explicit as possible
 * instead of reusing names.
 * For example, there is a `definitionDestination` and a `resourceDestination`,
 * instead of one shared name.
 */ // Note: when changing the next record, you must also change `TokenTypeMap`
// in `micromark-util-types/index.d.ts`.
__turbopack_context__.s([
    "types",
    ()=>types
]);
const types = {
    // Generic type for data, such as in a title, a destination, etc.
    data: 'data',
    // Generic type for syntactic whitespace (tabs, virtual spaces, spaces).
    // Such as, between a fenced code fence and an info string.
    whitespace: 'whitespace',
    // Generic type for line endings (line feed, carriage return, carriage return +
    // line feed).
    lineEnding: 'lineEnding',
    // A line ending, but ending a blank line.
    lineEndingBlank: 'lineEndingBlank',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the start of a
    // line.
    linePrefix: 'linePrefix',
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the end of a
    // line.
    lineSuffix: 'lineSuffix',
    // Whole ATX heading:
    //
    // ```markdown
    // #
    // ## Alpha
    // ### Bravo ###
    // ```
    //
    // Includes `atxHeadingSequence`, `whitespace`, `atxHeadingText`.
    atxHeading: 'atxHeading',
    // Sequence of number signs in an ATX heading (`###`).
    atxHeadingSequence: 'atxHeadingSequence',
    // Content in an ATX heading (`alpha`).
    // Includes text.
    atxHeadingText: 'atxHeadingText',
    // Whole autolink (`<https://example.com>` or `<admin@example.com>`)
    // Includes `autolinkMarker` and `autolinkProtocol` or `autolinkEmail`.
    autolink: 'autolink',
    // Email autolink w/o markers (`admin@example.com`)
    autolinkEmail: 'autolinkEmail',
    // Marker around an `autolinkProtocol` or `autolinkEmail` (`<` or `>`).
    autolinkMarker: 'autolinkMarker',
    // Protocol autolink w/o markers (`https://example.com`)
    autolinkProtocol: 'autolinkProtocol',
    // A whole character escape (`\-`).
    // Includes `escapeMarker` and `characterEscapeValue`.
    characterEscape: 'characterEscape',
    // The escaped character (`-`).
    characterEscapeValue: 'characterEscapeValue',
    // A whole character reference (`&amp;`, `&#8800;`, or `&#x1D306;`).
    // Includes `characterReferenceMarker`, an optional
    // `characterReferenceMarkerNumeric`, in which case an optional
    // `characterReferenceMarkerHexadecimal`, and a `characterReferenceValue`.
    characterReference: 'characterReference',
    // The start or end marker (`&` or `;`).
    characterReferenceMarker: 'characterReferenceMarker',
    // Mark reference as numeric (`#`).
    characterReferenceMarkerNumeric: 'characterReferenceMarkerNumeric',
    // Mark reference as numeric (`x` or `X`).
    characterReferenceMarkerHexadecimal: 'characterReferenceMarkerHexadecimal',
    // Value of character reference w/o markers (`amp`, `8800`, or `1D306`).
    characterReferenceValue: 'characterReferenceValue',
    // Whole fenced code:
    //
    // ````markdown
    // ```js
    // alert(1)
    // ```
    // ````
    codeFenced: 'codeFenced',
    // A fenced code fence, including whitespace, sequence, info, and meta
    // (` ```js `).
    codeFencedFence: 'codeFencedFence',
    // Sequence of grave accent or tilde characters (` ``` `) in a fence.
    codeFencedFenceSequence: 'codeFencedFenceSequence',
    // Info word (`js`) in a fence.
    // Includes string.
    codeFencedFenceInfo: 'codeFencedFenceInfo',
    // Meta words (`highlight="1"`) in a fence.
    // Includes string.
    codeFencedFenceMeta: 'codeFencedFenceMeta',
    // A line of code.
    codeFlowValue: 'codeFlowValue',
    // Whole indented code:
    //
    // ```markdown
    //     alert(1)
    // ```
    //
    // Includes `lineEnding`, `linePrefix`, and `codeFlowValue`.
    codeIndented: 'codeIndented',
    // A text code (``` `alpha` ```).
    // Includes `codeTextSequence`, `codeTextData`, `lineEnding`, and can include
    // `codeTextPadding`.
    codeText: 'codeText',
    codeTextData: 'codeTextData',
    // A space or line ending right after or before a tick.
    codeTextPadding: 'codeTextPadding',
    // A text code fence (` `` `).
    codeTextSequence: 'codeTextSequence',
    // Whole content:
    //
    // ```markdown
    // [a]: b
    // c
    // =
    // d
    // ```
    //
    // Includes `paragraph` and `definition`.
    content: 'content',
    // Whole definition:
    //
    // ```markdown
    // [micromark]: https://github.com/micromark/micromark
    // ```
    //
    // Includes `definitionLabel`, `definitionMarker`, `whitespace`,
    // `definitionDestination`, and optionally `lineEnding` and `definitionTitle`.
    definition: 'definition',
    // Destination of a definition (`https://github.com/micromark/micromark` or
    // `<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteral` or `definitionDestinationRaw`.
    definitionDestination: 'definitionDestination',
    // Enclosed destination of a definition
    // (`<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteralMarker` and optionally
    // `definitionDestinationString`.
    definitionDestinationLiteral: 'definitionDestinationLiteral',
    // Markers of an enclosed definition destination (`<` or `>`).
    definitionDestinationLiteralMarker: 'definitionDestinationLiteralMarker',
    // Unenclosed destination of a definition
    // (`https://github.com/micromark/micromark`).
    // Includes `definitionDestinationString`.
    definitionDestinationRaw: 'definitionDestinationRaw',
    // Text in an destination (`https://github.com/micromark/micromark`).
    // Includes string.
    definitionDestinationString: 'definitionDestinationString',
    // Label of a definition (`[micromark]`).
    // Includes `definitionLabelMarker` and `definitionLabelString`.
    definitionLabel: 'definitionLabel',
    // Markers of a definition label (`[` or `]`).
    definitionLabelMarker: 'definitionLabelMarker',
    // Value of a definition label (`micromark`).
    // Includes string.
    definitionLabelString: 'definitionLabelString',
    // Marker between a label and a destination (`:`).
    definitionMarker: 'definitionMarker',
    // Title of a definition (`"x"`, `'y'`, or `(z)`).
    // Includes `definitionTitleMarker` and optionally `definitionTitleString`.
    definitionTitle: 'definitionTitle',
    // Marker around a title of a definition (`"`, `'`, `(`, or `)`).
    definitionTitleMarker: 'definitionTitleMarker',
    // Data without markers in a title (`z`).
    // Includes string.
    definitionTitleString: 'definitionTitleString',
    // Emphasis (`*alpha*`).
    // Includes `emphasisSequence` and `emphasisText`.
    emphasis: 'emphasis',
    // Sequence of emphasis markers (`*` or `_`).
    emphasisSequence: 'emphasisSequence',
    // Emphasis text (`alpha`).
    // Includes text.
    emphasisText: 'emphasisText',
    // The character escape marker (`\`).
    escapeMarker: 'escapeMarker',
    // A hard break created with a backslash (`\\n`).
    // Note: does not include the line ending.
    hardBreakEscape: 'hardBreakEscape',
    // A hard break created with trailing spaces (`  \n`).
    // Does not include the line ending.
    hardBreakTrailing: 'hardBreakTrailing',
    // Flow HTML:
    //
    // ```markdown
    // <div
    // ```
    //
    // Inlcudes `lineEnding`, `htmlFlowData`.
    htmlFlow: 'htmlFlow',
    htmlFlowData: 'htmlFlowData',
    // HTML in text (the tag in `a <i> b`).
    // Includes `lineEnding`, `htmlTextData`.
    htmlText: 'htmlText',
    htmlTextData: 'htmlTextData',
    // Whole image (`![alpha](bravo)`, `![alpha][bravo]`, `![alpha][]`, or
    // `![alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    image: 'image',
    // Whole link label (`[*alpha*]`).
    // Includes `labelLink` or `labelImage`, `labelText`, and `labelEnd`.
    label: 'label',
    // Text in an label (`*alpha*`).
    // Includes text.
    labelText: 'labelText',
    // Start a link label (`[`).
    // Includes a `labelMarker`.
    labelLink: 'labelLink',
    // Start an image label (`![`).
    // Includes `labelImageMarker` and `labelMarker`.
    labelImage: 'labelImage',
    // Marker of a label (`[` or `]`).
    labelMarker: 'labelMarker',
    // Marker to start an image (`!`).
    labelImageMarker: 'labelImageMarker',
    // End a label (`]`).
    // Includes `labelMarker`.
    labelEnd: 'labelEnd',
    // Whole link (`[alpha](bravo)`, `[alpha][bravo]`, `[alpha][]`, or `[alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    link: 'link',
    // Whole paragraph:
    //
    // ```markdown
    // alpha
    // bravo.
    // ```
    //
    // Includes text.
    paragraph: 'paragraph',
    // A reference (`[alpha]` or `[]`).
    // Includes `referenceMarker` and an optional `referenceString`.
    reference: 'reference',
    // A reference marker (`[` or `]`).
    referenceMarker: 'referenceMarker',
    // Reference text (`alpha`).
    // Includes string.
    referenceString: 'referenceString',
    // A resource (`(https://example.com "alpha")`).
    // Includes `resourceMarker`, an optional `resourceDestination` with an optional
    // `whitespace` and `resourceTitle`.
    resource: 'resource',
    // A resource destination (`https://example.com`).
    // Includes `resourceDestinationLiteral` or `resourceDestinationRaw`.
    resourceDestination: 'resourceDestination',
    // A literal resource destination (`<https://example.com>`).
    // Includes `resourceDestinationLiteralMarker` and optionally
    // `resourceDestinationString`.
    resourceDestinationLiteral: 'resourceDestinationLiteral',
    // A resource destination marker (`<` or `>`).
    resourceDestinationLiteralMarker: 'resourceDestinationLiteralMarker',
    // A raw resource destination (`https://example.com`).
    // Includes `resourceDestinationString`.
    resourceDestinationRaw: 'resourceDestinationRaw',
    // Resource destination text (`https://example.com`).
    // Includes string.
    resourceDestinationString: 'resourceDestinationString',
    // A resource marker (`(` or `)`).
    resourceMarker: 'resourceMarker',
    // A resource title (`"alpha"`, `'alpha'`, or `(alpha)`).
    // Includes `resourceTitleMarker` and optionally `resourceTitleString`.
    resourceTitle: 'resourceTitle',
    // A resource title marker (`"`, `'`, `(`, or `)`).
    resourceTitleMarker: 'resourceTitleMarker',
    // Resource destination title (`alpha`).
    // Includes string.
    resourceTitleString: 'resourceTitleString',
    // Whole setext heading:
    //
    // ```markdown
    // alpha
    // bravo
    // =====
    // ```
    //
    // Includes `setextHeadingText`, `lineEnding`, `linePrefix`, and
    // `setextHeadingLine`.
    setextHeading: 'setextHeading',
    // Content in a setext heading (`alpha\nbravo`).
    // Includes text.
    setextHeadingText: 'setextHeadingText',
    // Underline in a setext heading, including whitespace suffix (`==`).
    // Includes `setextHeadingLineSequence`.
    setextHeadingLine: 'setextHeadingLine',
    // Sequence of equals or dash characters in underline in a setext heading (`-`).
    setextHeadingLineSequence: 'setextHeadingLineSequence',
    // Strong (`**alpha**`).
    // Includes `strongSequence` and `strongText`.
    strong: 'strong',
    // Sequence of strong markers (`**` or `__`).
    strongSequence: 'strongSequence',
    // Strong text (`alpha`).
    // Includes text.
    strongText: 'strongText',
    // Whole thematic break:
    //
    // ```markdown
    // * * *
    // ```
    //
    // Includes `thematicBreakSequence` and `whitespace`.
    thematicBreak: 'thematicBreak',
    // A sequence of one or more thematic break markers (`***`).
    thematicBreakSequence: 'thematicBreakSequence',
    // Whole block quote:
    //
    // ```markdown
    // > a
    // >
    // > b
    // ```
    //
    // Includes `blockQuotePrefix` and flow.
    blockQuote: 'blockQuote',
    // The `>` or `> ` of a block quote.
    blockQuotePrefix: 'blockQuotePrefix',
    // The `>` of a block quote prefix.
    blockQuoteMarker: 'blockQuoteMarker',
    // The optional ` ` of a block quote prefix.
    blockQuotePrefixWhitespace: 'blockQuotePrefixWhitespace',
    // Whole ordered list:
    //
    // ```markdown
    // 1. a
    //    b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listOrdered: 'listOrdered',
    // Whole unordered list:
    //
    // ```markdown
    // - a
    //   b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listUnordered: 'listUnordered',
    // The indent of further list item lines.
    listItemIndent: 'listItemIndent',
    // A marker, as in, `*`, `+`, `-`, `.`, or `)`.
    listItemMarker: 'listItemMarker',
    // The thing that starts a list item, such as `1. `.
    // Includes `listItemValue` if ordered, `listItemMarker`, and
    // `listItemPrefixWhitespace` (unless followed by a line ending).
    listItemPrefix: 'listItemPrefix',
    // The whitespace after a marker.
    listItemPrefixWhitespace: 'listItemPrefixWhitespace',
    // The numerical value of an ordered item.
    listItemValue: 'listItemValue',
    // Internal types used for subtokenizers, compiled away
    chunkDocument: 'chunkDocument',
    chunkContent: 'chunkContent',
    chunkFlow: 'chunkFlow',
    chunkText: 'chunkText',
    chunkString: 'chunkString'
};
}),
"[project]/frontend/node_modules/streamdown/node_modules/micromark-util-symbol/lib/values.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This module is compiled away!
 *
 * While micromark works based on character codes, this module includes the
 * string versions of ’em.
 * The C0 block, except for LF, CR, HT, and w/ the replacement character added,
 * are available here.
 */ __turbopack_context__.s([
    "values",
    ()=>values
]);
const values = {
    ht: '\t',
    lf: '\n',
    cr: '\r',
    space: ' ',
    exclamationMark: '!',
    quotationMark: '"',
    numberSign: '#',
    dollarSign: '$',
    percentSign: '%',
    ampersand: '&',
    apostrophe: "'",
    leftParenthesis: '(',
    rightParenthesis: ')',
    asterisk: '*',
    plusSign: '+',
    comma: ',',
    dash: '-',
    dot: '.',
    slash: '/',
    digit0: '0',
    digit1: '1',
    digit2: '2',
    digit3: '3',
    digit4: '4',
    digit5: '5',
    digit6: '6',
    digit7: '7',
    digit8: '8',
    digit9: '9',
    colon: ':',
    semicolon: ';',
    lessThan: '<',
    equalsTo: '=',
    greaterThan: '>',
    questionMark: '?',
    atSign: '@',
    uppercaseA: 'A',
    uppercaseB: 'B',
    uppercaseC: 'C',
    uppercaseD: 'D',
    uppercaseE: 'E',
    uppercaseF: 'F',
    uppercaseG: 'G',
    uppercaseH: 'H',
    uppercaseI: 'I',
    uppercaseJ: 'J',
    uppercaseK: 'K',
    uppercaseL: 'L',
    uppercaseM: 'M',
    uppercaseN: 'N',
    uppercaseO: 'O',
    uppercaseP: 'P',
    uppercaseQ: 'Q',
    uppercaseR: 'R',
    uppercaseS: 'S',
    uppercaseT: 'T',
    uppercaseU: 'U',
    uppercaseV: 'V',
    uppercaseW: 'W',
    uppercaseX: 'X',
    uppercaseY: 'Y',
    uppercaseZ: 'Z',
    leftSquareBracket: '[',
    backslash: '\\',
    rightSquareBracket: ']',
    caret: '^',
    underscore: '_',
    graveAccent: '`',
    lowercaseA: 'a',
    lowercaseB: 'b',
    lowercaseC: 'c',
    lowercaseD: 'd',
    lowercaseE: 'e',
    lowercaseF: 'f',
    lowercaseG: 'g',
    lowercaseH: 'h',
    lowercaseI: 'i',
    lowercaseJ: 'j',
    lowercaseK: 'k',
    lowercaseL: 'l',
    lowercaseM: 'm',
    lowercaseN: 'n',
    lowercaseO: 'o',
    lowercaseP: 'p',
    lowercaseQ: 'q',
    lowercaseR: 'r',
    lowercaseS: 's',
    lowercaseT: 't',
    lowercaseU: 'u',
    lowercaseV: 'v',
    lowercaseW: 'w',
    lowercaseX: 'x',
    lowercaseY: 'y',
    lowercaseZ: 'z',
    leftCurlyBrace: '{',
    verticalBar: '|',
    rightCurlyBrace: '}',
    tilde: '~',
    replacementCharacter: '�'
};
}),
]);

//# sourceMappingURL=19xk_0xj9d1a._.js.map