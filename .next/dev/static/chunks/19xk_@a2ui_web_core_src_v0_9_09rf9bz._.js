(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/basic_catalog/components/basic_components.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AudioPlayerApi",
    ()=>AudioPlayerApi,
    "BASIC_COMPONENTS",
    ()=>BASIC_COMPONENTS,
    "ButtonApi",
    ()=>ButtonApi,
    "CardApi",
    ()=>CardApi,
    "CheckBoxApi",
    ()=>CheckBoxApi,
    "ChoicePickerApi",
    ()=>ChoicePickerApi,
    "ColumnApi",
    ()=>ColumnApi,
    "DateTimeInputApi",
    ()=>DateTimeInputApi,
    "DividerApi",
    ()=>DividerApi,
    "IconApi",
    ()=>IconApi,
    "ImageApi",
    ()=>ImageApi,
    "ListApi",
    ()=>ListApi,
    "ModalApi",
    ()=>ModalApi,
    "RowApi",
    ()=>RowApi,
    "SliderApi",
    ()=>SliderApi,
    "TabsApi",
    ()=>TabsApi,
    "TextApi",
    ()=>TextApi,
    "TextFieldApi",
    ()=>TextFieldApi,
    "VideoApi",
    ()=>VideoApi
]);
/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/schema/common-types.js [app-client] (ecmascript)");
;
;
const CommonProps = {
    accessibility: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccessibilityAttributesSchema"].optional(),
    weight: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional()
};
const TextApi = {
    name: 'Text',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        text: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The text content to display. While simple Markdown formatting is supported (i.e. without HTML, images, or links), utilizing dedicated UI components is generally preferred for a richer and more structured presentation.'),
        variant: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'caption',
            'body'
        ]).default('body').describe('A hint for the base text style.').optional()
    }).strict()
};
const ImageApi = {
    name: 'Image',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        url: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The URL of the image to display.'),
        description: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The accessibility description of the image.').optional(),
        fit: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'contain',
            'cover',
            'fill',
            'none',
            'scaleDown'
        ]).default('fill').describe("Specifies how the image should be resized to fit its container. This corresponds to the CSS 'object-fit' property.").optional(),
        variant: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'icon',
            'avatar',
            'smallFeature',
            'mediumFeature',
            'largeFeature',
            'header'
        ]).default('mediumFeature').describe('A hint for the image size and style.').optional()
    }).strict()
};
const ICON_NAMES = [
    'accountCircle',
    'add',
    'arrowBack',
    'arrowForward',
    'attachFile',
    'calendarToday',
    'call',
    'camera',
    'check',
    'close',
    'delete',
    'download',
    'edit',
    'event',
    'error',
    'fastForward',
    'favorite',
    'favoriteOff',
    'folder',
    'help',
    'home',
    'info',
    'locationOn',
    'lock',
    'lockOpen',
    'mail',
    'menu',
    'moreVert',
    'moreHoriz',
    'notificationsOff',
    'notifications',
    'pause',
    'payment',
    'person',
    'phone',
    'photo',
    'play',
    'print',
    'refresh',
    'rewind',
    'search',
    'send',
    'settings',
    'share',
    'shoppingCart',
    'skipNext',
    'skipPrevious',
    'star',
    'starHalf',
    'starOff',
    'stop',
    'upload',
    'visibility',
    'visibilityOff',
    'volumeDown',
    'volumeMute',
    'volumeOff',
    'volumeUp',
    'warning'
];
const IconApi = {
    name: 'Icon',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(ICON_NAMES),
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                svgPath: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('Custom SVG path data')
            }).strict(),
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                path: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
            }).strict()
        ]).describe('The name of the icon to display.')
    }).strict()
};
const VideoApi = {
    name: 'Video',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        url: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The URL of the video to display.')
    }).strict()
};
const AudioPlayerApi = {
    name: 'AudioPlayer',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        url: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The URL of the audio to be played.'),
        description: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('A description of the audio, such as a title or summary.').optional()
    }).strict()
};
const RowApi = {
    name: 'Row',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        children: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChildListSchema"].describe('Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID.'),
        justify: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'center',
            'end',
            'spaceAround',
            'spaceBetween',
            'spaceEvenly',
            'start',
            'stretch'
        ]).default('start').describe("Defines the arrangement of children along the main axis (horizontally). Use 'spaceBetween' to push items to the edges, or 'start'/'end'/'center' to pack them together.").optional(),
        align: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'start',
            'center',
            'end',
            'stretch'
        ]).default('stretch').describe("Defines the alignment of children along the cross axis (vertically). This is similar to the CSS 'align-items' property, but uses camelCase values (e.g., 'start').").optional()
    }).strict().describe('A layout component that arranges its children horizontally. To create a grid layout, nest Columns within this Row.')
};
const ColumnApi = {
    name: 'Column',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        children: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChildListSchema"].describe('Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID.'),
        justify: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'start',
            'center',
            'end',
            'spaceBetween',
            'spaceAround',
            'spaceEvenly',
            'stretch'
        ]).default('start').describe("Defines the arrangement of children along the main axis (vertically). Use 'spaceBetween' to push items to the edges (e.g. header at top, footer at bottom), or 'start'/'end'/'center' to pack them together.").optional(),
        align: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'center',
            'end',
            'start',
            'stretch'
        ]).default('stretch').describe("Defines the alignment of children along the cross axis (horizontally). This is similar to the CSS 'align-items' property.").optional()
    }).strict().describe('A layout component that arranges its children vertically. To create a grid layout, nest Rows within this Column.')
};
const ListApi = {
    name: 'List',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        children: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChildListSchema"].describe('Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list.'),
        direction: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'vertical',
            'horizontal'
        ]).default('vertical').describe('The direction in which the list items are laid out.').optional(),
        align: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'start',
            'center',
            'end',
            'stretch'
        ]).default('stretch').describe('Defines the alignment of children along the cross axis.').optional(),
        listStyle: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'ordered',
            'unordered',
            'none'
        ]).describe('The style of the list (ordered, unordered, or none).').optional()
    }).strict()
};
const CardApi = {
    name: 'Card',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        child: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComponentIdSchema"].describe("The ID of the single child component to be rendered inside the card. To display multiple elements, you MUST wrap them in a layout component (like Column or Row) and pass that container's ID here. Do NOT pass multiple IDs or a non-existent ID. Do NOT define the child component inline.")
    }).strict()
};
const TabsApi = {
    name: 'Tabs',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        tabs: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            title: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The tab title.'),
            child: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComponentIdSchema"].describe('The ID of the child component. Do NOT define the component inline.')
        }).strict()).min(1).describe('An array of objects, where each object defines a tab with a title and a child component.')
    }).strict()
};
const ModalApi = {
    name: 'Modal',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        trigger: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComponentIdSchema"].describe('The ID of the component that opens the modal when interacted with (e.g., a button). Do NOT define the component inline.'),
        content: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComponentIdSchema"].describe('The ID of the component to be displayed inside the modal. Do NOT define the component inline.')
    }).strict()
};
const DividerApi = {
    name: 'Divider',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        axis: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'horizontal',
            'vertical'
        ]).default('horizontal').describe('The orientation of the divider.').optional()
    }).strict()
};
const ButtonApi = {
    name: 'Button',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        child: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComponentIdSchema"].describe("The ID of the child component. Use a 'Text' component for a labeled button. Only use an 'Icon' if the requirements explicitly ask for an icon-only button. Do NOT define the child component inline."),
        variant: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'default',
            'primary',
            'borderless'
        ]).default('default').describe("A hint for the button style. If omitted, a default button style is used. 'primary' indicates this is the main call-to-action button. 'borderless' means the button has no visual border or background, making its child content appear like a clickable link.").optional(),
        action: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionSchema"],
        checks: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckableSchema"].shape.checks
    }).strict()
};
const TextFieldApi = {
    name: 'TextField',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        label: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The text label for the input field.'),
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The value of the text field.').optional(),
        variant: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'longText',
            'number',
            'shortText',
            'obscured'
        ]).default('shortText').describe('The type of input field to display.').optional(),
        validationRegexp: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('A regular expression used for client-side validation of the input.').optional(),
        checks: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckableSchema"].shape.checks
    }).strict()
};
const CheckBoxApi = {
    name: 'CheckBox',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        label: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The text to display next to the checkbox.'),
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicBooleanSchema"].describe('The current state of the checkbox (true for checked, false for unchecked).'),
        checks: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckableSchema"].shape.checks
    }).strict()
};
const ChoicePickerApi = {
    name: 'ChoicePicker',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        label: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The label for the group of options.').optional(),
        variant: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'multipleSelection',
            'mutuallyExclusive'
        ]).default('mutuallyExclusive').describe('A hint for how the choice picker should be displayed and behave.').optional(),
        options: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            label: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The text to display for this option.'),
            value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The stable value associated with this option.')
        }).strict()).describe('The list of available options to choose from.'),
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringListSchema"].describe('The list of currently selected values. This should be bound to a string array in the data model.'),
        displayStyle: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'checkbox',
            'chips'
        ]).default('checkbox').describe('The display style of the component.').optional(),
        filterable: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false).describe('If true, displays a search input to filter the options.').optional(),
        checks: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckableSchema"].shape.checks
    }).strict().describe('A component that allows selecting one or more options from a list.')
};
const SliderApi = {
    name: 'Slider',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        label: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The label for the slider.').optional(),
        min: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().default(0).describe('The minimum value of the slider.').optional(),
        max: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe('The maximum value of the slider.'),
        step: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe('The granularity or step size of the slider.').optional(),
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicNumberSchema"].describe('The current value of the slider.'),
        checks: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckableSchema"].shape.checks
    }).strict()
};
const DateTimeInputApi = {
    name: 'DateTimeInput',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...CommonProps,
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The selected date and/or time value in ISO 8601 format. If not yet set, initialize with an empty string.'),
        enableDate: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false).describe('If true, allows the user to select a date.').optional(),
        enableTime: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false).describe('If true, allows the user to select a time.').optional(),
        min: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"],
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().date(),
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().time(),
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().datetime()
        ]).describe('The minimum allowed date/time in ISO 8601 format.').optional(),
        max: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"],
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().date(),
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().time(),
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().datetime()
        ]).describe('The maximum allowed date/time in ISO 8601 format.').optional(),
        label: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicStringSchema"].describe('The text label for the input field.').optional(),
        checks: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$common$2d$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckableSchema"].shape.checks
    }).strict()
};
const BASIC_COMPONENTS = [
    TextApi,
    ImageApi,
    IconApi,
    VideoApi,
    AudioPlayerApi,
    RowApi,
    ColumnApi,
    ListApi,
    CardApi,
    TabsApi,
    ModalApi,
    DividerApi,
    ButtonApi,
    TextFieldApi,
    CheckBoxApi,
    ChoicePickerApi,
    SliderApi,
    DateTimeInputApi
];
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/basic_catalog/expressions/expression_parser.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExpressionParser",
    ()=>ExpressionParser
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/errors.js [app-client] (ecmascript)");
;
class ExpressionParser {
    /** The maximum allowed recursion depth for nested expressions to prevent stack overflows. */ static{
        this.MAX_DEPTH = 10;
    }
    /**
     * Parses an input string into an array of DynamicValues.
     * If the input contains no interpolation, it returns the raw string as a single literal.
     */ parse(input, depth = 0) {
        if (depth > ExpressionParser.MAX_DEPTH) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"]('Max recursion depth reached in parse');
        }
        if (!input || !input.includes('${')) {
            return [
                input
            ];
        }
        const parts = [];
        const scanner = new Scanner(input);
        while(!scanner.isAtEnd()){
            if (scanner.matches('${')) {
                scanner.advance(2);
                const content = this.extractInterpolationContent(scanner);
                const parsed = this.parseExpression(content, depth + 1);
                if (parsed !== null) {
                    parts.push(parsed);
                }
            } else if (scanner.peek() === '\\' && scanner.peek(1) === '$' && scanner.peek(2) === '{') {
                scanner.advance();
                parts.push('${');
                scanner.advance(2);
            } else {
                const start = scanner.pos;
                while(!scanner.isAtEnd()){
                    if (scanner.matches('${')) {
                        break;
                    }
                    if (scanner.peek() === '\\' && scanner.peek(1) === '$' && scanner.peek(2) === '{') {
                        break;
                    }
                    scanner.advance();
                }
                parts.push(scanner.input.substring(start, scanner.pos));
            }
        }
        return parts.filter((p)=>p !== null && p !== '');
    }
    extractInterpolationContent(scanner) {
        const start = scanner.pos;
        let braceBalance = 1;
        while(!scanner.isAtEnd() && braceBalance > 0){
            const char = scanner.advance();
            if (char === '{') {
                braceBalance++;
            } else if (char === '}') {
                braceBalance--;
            } else if (char === "'" || char === '"') {
                const quote = char;
                while(!scanner.isAtEnd()){
                    const c = scanner.advance();
                    if (c === '\\') {
                        scanner.advance();
                    } else if (c === quote) {
                        break;
                    }
                }
            }
        }
        if (braceBalance > 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"]("Unclosed interpolation: missing '}'");
        }
        return scanner.input.substring(start, scanner.pos - 1);
    }
    /**
     * Parses a single expression string into a DynamicValue.
     *
     * Unlike `parse()`, which handles mixed literal text and interpolations,
     * this assumes the entire string is a single expression (e.g., as found inside `${...}`).
     *
     * @param expr The expression string to parse.
     * @param depth The current recursion depth.
     * @returns The resolved DynamicValue.
     */ parseExpression(expr, depth = 0) {
        expr = expr.trim();
        if (!expr) return '';
        const scanner = new Scanner(expr);
        const result = this.parseExpressionInternal(scanner, depth);
        if (!scanner.isAtEnd()) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"](`Unexpected characters at end of expression: '${scanner.input.substring(scanner.pos)}'`);
        }
        return result;
    }
    parseExpressionInternal(scanner, depth) {
        scanner.skipWhitespace();
        if (scanner.isAtEnd()) return '';
        // 0. Nested Interpolation (Block)
        if (scanner.matches('${')) {
            scanner.advance(2);
            const content = this.extractInterpolationContent(scanner);
            return this.parseExpression(content, depth + 1);
        }
        // 1. Literals
        if (scanner.matchesString("'") || scanner.matchesString('"')) {
            return this.parseStringLiteral(scanner);
        }
        if (this.isDigit(scanner.peek())) {
            return this.parseNumberLiteral(scanner);
        }
        if (scanner.matchesKeyword('true')) return true;
        if (scanner.matchesKeyword('false')) return false;
        if (scanner.matchesKeyword('null')) return '';
        // 2. Identifiers (Function calls or Path starts)
        const token = this.scanPathOrIdentifier(scanner);
        scanner.skipWhitespace();
        if (scanner.peek() === '(') {
            return this.parseFunctionCall(token, scanner, depth);
        } else {
            if (!token) {
                return '';
            }
            return {
                path: token
            };
        }
    }
    scanPathOrIdentifier(scanner) {
        const start = scanner.pos;
        while(!scanner.isAtEnd()){
            const c = scanner.peek();
            if (this.isAlnum(c) || c === '/' || c === '.' || c === '_' || c === '-') {
                scanner.advance();
            } else {
                break;
            }
        }
        return scanner.input.substring(start, scanner.pos);
    }
    parseFunctionCall(funcName, scanner, depth) {
        scanner.match('(');
        scanner.skipWhitespace();
        const args = {};
        while(!scanner.isAtEnd() && scanner.peek() !== ')'){
            const argName = this.scanIdentifier(scanner);
            scanner.skipWhitespace();
            if (!scanner.match(':')) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"](`Expected ':' after argument name '${argName}' in function '${funcName}'`);
            }
            scanner.skipWhitespace();
            args[argName] = this.parseExpressionInternal(scanner, depth);
            scanner.skipWhitespace();
            if (scanner.peek() === ',') {
                scanner.advance();
                scanner.skipWhitespace();
            }
        }
        if (!scanner.match(')')) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"](`Expected ')' after function arguments for '${funcName}'`);
        }
        return {
            call: funcName,
            args,
            returnType: 'any'
        };
    }
    scanIdentifier(scanner) {
        const start = scanner.pos;
        while(!scanner.isAtEnd() && (this.isAlnum(scanner.peek()) || scanner.peek() === '_')){
            scanner.advance();
        }
        return scanner.input.substring(start, scanner.pos);
    }
    parseStringLiteral(scanner) {
        const quote = scanner.advance();
        let result = '';
        while(!scanner.isAtEnd()){
            const c = scanner.advance();
            if (c === '\\') {
                const next = scanner.advance();
                if (next === 'n') result += '\n';
                else if (next === 't') result += '\t';
                else if (next === 'r') result += '\r';
                else result += next;
            } else if (c === quote) {
                break;
            } else {
                result += c;
            }
        }
        return result;
    }
    parseNumberLiteral(scanner) {
        const start = scanner.pos;
        while(!scanner.isAtEnd() && (this.isDigit(scanner.peek()) || scanner.peek() === '.')){
            scanner.advance();
        }
        return Number(scanner.input.substring(start, scanner.pos));
    }
    isAlnum(c) {
        return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c >= '0' && c <= '9';
    }
    isDigit(c) {
        return c >= '0' && c <= '9';
    }
}
class Scanner {
    constructor(input){
        this.input = input;
        this.pos = 0;
    }
    isAtEnd() {
        return this.pos >= this.input.length;
    }
    peek(offset = 0) {
        if (this.pos + offset >= this.input.length) return '\0';
        return this.input[this.pos + offset];
    }
    advance(count = 1) {
        const char = this.input.substring(this.pos, this.pos + count);
        this.pos += count;
        return char;
    }
    match(expected) {
        if (this.peek() === expected) {
            this.advance();
            return true;
        }
        return false;
    }
    matches(expected) {
        if (this.input.startsWith(expected, this.pos)) {
            return true;
        }
        return false;
    }
    matchesString(expected) {
        return this.peek() === expected;
    }
    matchesKeyword(keyword) {
        if (this.input.startsWith(keyword, this.pos)) {
            const next = this.peek(keyword.length);
            if (!/[a-zA-Z0-9_]/.test(next)) {
                this.advance(keyword.length);
                return true;
            }
        }
        return false;
    }
    skipWhitespace() {
        while(!this.isAtEnd() && /\s/.test(this.peek())){
            this.advance();
        }
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/basic_catalog/functions/basic_functions.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddImplementation",
    ()=>AddImplementation,
    "AndImplementation",
    ()=>AndImplementation,
    "BASIC_FUNCTIONS",
    ()=>BASIC_FUNCTIONS,
    "ContainsImplementation",
    ()=>ContainsImplementation,
    "DivideImplementation",
    ()=>DivideImplementation,
    "EmailImplementation",
    ()=>EmailImplementation,
    "EndsWithImplementation",
    ()=>EndsWithImplementation,
    "EqualsImplementation",
    ()=>EqualsImplementation,
    "FormatCurrencyImplementation",
    ()=>FormatCurrencyImplementation,
    "FormatDateImplementation",
    ()=>FormatDateImplementation,
    "FormatNumberImplementation",
    ()=>FormatNumberImplementation,
    "FormatStringImplementation",
    ()=>FormatStringImplementation,
    "GreaterThanImplementation",
    ()=>GreaterThanImplementation,
    "LengthImplementation",
    ()=>LengthImplementation,
    "LessThanImplementation",
    ()=>LessThanImplementation,
    "MultiplyImplementation",
    ()=>MultiplyImplementation,
    "NotEqualsImplementation",
    ()=>NotEqualsImplementation,
    "NotImplementation",
    ()=>NotImplementation,
    "NumericImplementation",
    ()=>NumericImplementation,
    "OpenUrlImplementation",
    ()=>OpenUrlImplementation,
    "OrImplementation",
    ()=>OrImplementation,
    "PluralizeImplementation",
    ()=>PluralizeImplementation,
    "RegexImplementation",
    ()=>RegexImplementation,
    "RequiredImplementation",
    ()=>RequiredImplementation,
    "StartsWithImplementation",
    ()=>StartsWithImplementation,
    "SubtractImplementation",
    ()=>SubtractImplementation,
    "createBasicCatalogFunctions",
    ()=>createBasicCatalogFunctions,
    "createFormatCurrencyImplementation",
    ()=>createFormatCurrencyImplementation,
    "createFormatNumberImplementation",
    ()=>createFormatNumberImplementation,
    "createPluralizeImplementation",
    ()=>createPluralizeImplementation
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$expressions$2f$expression_parser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/basic_catalog/expressions/expression_parser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/reactivity/signals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/catalog/types.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/basic_catalog/functions/basic_functions_api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/errors.js [app-client] (ecmascript)");
;
;
;
;
;
;
const AddImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddApi"], (args)=>args.a + args.b);
const SubtractImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubtractApi"], (args)=>args.a - args.b);
const MultiplyImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MultiplyApi"], (args)=>args.a * args.b);
const DivideImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DivideApi"], (args)=>{
    const a = args.a;
    const b = args.b;
    if (a === undefined || a === null || b === undefined || b === null) {
        return NaN;
    }
    const numA = Number(a);
    const numB = Number(b);
    if (Number.isNaN(numA) || Number.isNaN(numB)) {
        return NaN;
    }
    if (numB === 0) {
        return Infinity;
    }
    return numA / numB;
});
const EqualsImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EqualsApi"], (args)=>args.a === args.b);
const NotEqualsImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotEqualsApi"], (args)=>args.a !== args.b);
const GreaterThanImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GreaterThanApi"], (args)=>args.a > args.b);
const LessThanImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LessThanApi"], (args)=>args.a < args.b);
const AndImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AndApi"], (args)=>{
    return args.values.every((v)=>!!v);
});
const OrImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrApi"], (args)=>{
    return args.values.some((v)=>!!v);
});
const NotImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotApi"], (args)=>!args.value);
const ContainsImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContainsApi"], (args)=>args.string.includes(args.substring));
const StartsWithImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StartsWithApi"], (args)=>args.string.startsWith(args.prefix));
const EndsWithImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EndsWithApi"], (args)=>args.string.endsWith(args.suffix));
const RequiredImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RequiredApi"], (args)=>{
    const val = args.value;
    if (val === null || val === undefined) return false;
    if (typeof val === 'string' && val === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
});
const RegexImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RegexApi"], (args)=>{
    try {
        return new RegExp(args.pattern).test(args.value);
    } catch (e) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"](`Invalid regex pattern: ${args.pattern}`, 'regex', e);
    }
});
const LengthImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LengthApi"], (args)=>{
    const val = args.value;
    let len = 0;
    if (typeof val === 'string' || Array.isArray(val)) {
        len = val.length;
    }
    if (args.min !== undefined && !isNaN(args.min) && len < args.min) return false;
    if (args.max !== undefined && !isNaN(args.max) && len > args.max) return false;
    return true;
});
const NumericImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NumericApi"], (args)=>{
    if (isNaN(args.value)) return false;
    if (args.min !== undefined && !isNaN(args.min) && args.value < args.min) return false;
    if (args.max !== undefined && !isNaN(args.max) && args.value > args.max) return false;
    return true;
});
const EmailImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmailApi"], (args)=>{
    // TODO(gspencergoog): Use a "real" email validation function, preferably
    // from an existing package. This is woefully insufficient, real email
    // validation can't be done with a regex.
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(args.value);
});
// Formatting
/**
 * Coerces a value to a string following the a2ui_protocol.md §"Type conversion" rules:
 * - Numbers/Booleans: Standard string representation.
 * - null/undefined: An empty string "".
 * - Objects/Arrays: Stringified as JSON.
 */ function coerceToString(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value) ?? String(value);
        } catch  {
            return String(value);
        }
    }
    return String(value);
}
const FormatStringImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormatStringApi"], (args, context)=>{
    const template = args.value;
    const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$expressions$2f$expression_parser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExpressionParser"]();
    const parts = parser.parse(template);
    if (parts.length === 0) return '';
    const dynamicParts = parts.map((part)=>{
        // If it's a literal string (or number/boolean/etc), keep it as is
        if (typeof part !== 'object' || part === null || Array.isArray(part)) {
            return part;
        }
        return context.resolveSignal(part);
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computed"])(()=>{
        return dynamicParts.map((p)=>{
            const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSignal"])(p) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getValue"])(p) : p;
            return coerceToString(resolved);
        }).join('');
    });
});
const numberFormatCache = new Map();
function getNumberFormat(locale, decimals, grouping) {
    const key = `${locale ?? 'default'}:${decimals ?? 'undef'}:${grouping ?? 'true'}`;
    let formatter = numberFormatCache.get(key);
    if (!formatter) {
        formatter = new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            useGrouping: grouping
        });
        numberFormatCache.set(key, formatter);
    }
    return formatter;
}
function createFormatNumberImplementation(locale) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormatNumberApi"], (args)=>{
        if (isNaN(args.value)) return '';
        try {
            return getNumberFormat(locale, args.decimals, args.grouping).format(args.value);
        } catch (e) {
            console.warn('Error formatting number:', e);
            return args.decimals !== undefined ? args.value.toFixed(args.decimals) : String(args.value);
        }
    });
}
const FormatNumberImplementation = createFormatNumberImplementation();
const currencyFormatCache = new Map();
function getCurrencyFormat(locale, currency, decimals, grouping) {
    const key = `${locale ?? 'default'}:${currency}:${decimals ?? 'undef'}:${grouping ?? 'true'}`;
    let formatter = currencyFormatCache.get(key);
    if (!formatter) {
        formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            useGrouping: grouping
        });
        currencyFormatCache.set(key, formatter);
    }
    return formatter;
}
function createFormatCurrencyImplementation(locale) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormatCurrencyApi"], (args)=>{
        if (isNaN(args.value)) return '';
        try {
            return getCurrencyFormat(locale, args.currency, args.decimals, args.grouping).format(args.value);
        } catch (e) {
            console.warn('Error formatting currency:', e);
            return args.value.toFixed(args.decimals ?? 2);
        }
    });
}
const FormatCurrencyImplementation = createFormatCurrencyImplementation();
const FormatDateImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormatDateApi"], (args)=>{
    if (!args.value) return '';
    const date = new Date(args.value);
    if (isNaN(date.getTime())) return '';
    try {
        if (args.format === 'ISO') return date.toISOString();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, args.format);
    } catch (e) {
        console.warn('Error formatting date:', e);
        return date.toISOString();
    }
});
const pluralRulesCache = new Map();
function getPluralRules(locale) {
    const key = locale ?? 'default';
    let rules = pluralRulesCache.get(key);
    if (!rules) {
        rules = new Intl.PluralRules(locale);
        pluralRulesCache.set(key, rules);
    }
    return rules;
}
function createPluralizeImplementation(locale) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluralizeApi"], (args)=>{
        try {
            const rule = getPluralRules(locale).select(args.value);
            return String(args[rule] ?? args.other ?? '');
        } catch (e) {
            console.warn('Error in pluralize:', e);
            return String(args.other ?? '');
        }
    });
}
const PluralizeImplementation = createPluralizeImplementation();
const OpenUrlImplementation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$catalog$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFunctionImplementation"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$basic_catalog$2f$functions$2f$basic_functions_api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OpenUrlApi"], (args)=>{
    if (args.url && typeof window !== 'undefined' && window.open) {
        const baseHref = typeof window.location !== 'undefined' && window.location.href ? window.location.href : undefined;
        let url;
        try {
            url = baseHref ? new URL(args.url, baseHref) : new URL(args.url);
        } catch (e) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"](`Invalid URL specified: ${args.url}`, 'openUrl', e);
        }
        // Strict protocol allowlist: Only HTTP and HTTPS are permitted.
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"](`Unsupported URL scheme: ${url.protocol}`, 'openUrl');
        }
        // Always use noopener and noreferrer to prevent reverse tab-nabbing
        window.open(url.href, '_blank', 'noopener,noreferrer');
    }
});
function createBasicCatalogFunctions(options) {
    const locale = options?.locale;
    return [
        AddImplementation,
        SubtractImplementation,
        MultiplyImplementation,
        DivideImplementation,
        EqualsImplementation,
        NotEqualsImplementation,
        GreaterThanImplementation,
        LessThanImplementation,
        AndImplementation,
        OrImplementation,
        NotImplementation,
        ContainsImplementation,
        StartsWithImplementation,
        EndsWithImplementation,
        RequiredImplementation,
        RegexImplementation,
        LengthImplementation,
        NumericImplementation,
        EmailImplementation,
        FormatStringImplementation,
        createFormatNumberImplementation(locale),
        createFormatCurrencyImplementation(locale),
        FormatDateImplementation,
        createPluralizeImplementation(locale),
        OpenUrlImplementation
    ];
}
const BASIC_FUNCTIONS = createBasicCatalogFunctions();
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/basic_catalog/functions/basic_functions_api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddApi",
    ()=>AddApi,
    "AndApi",
    ()=>AndApi,
    "BASIC_FUNCTION_APIS",
    ()=>BASIC_FUNCTION_APIS,
    "ContainsApi",
    ()=>ContainsApi,
    "DivideApi",
    ()=>DivideApi,
    "EmailApi",
    ()=>EmailApi,
    "EndsWithApi",
    ()=>EndsWithApi,
    "EqualsApi",
    ()=>EqualsApi,
    "FormatCurrencyApi",
    ()=>FormatCurrencyApi,
    "FormatDateApi",
    ()=>FormatDateApi,
    "FormatNumberApi",
    ()=>FormatNumberApi,
    "FormatStringApi",
    ()=>FormatStringApi,
    "GreaterThanApi",
    ()=>GreaterThanApi,
    "LengthApi",
    ()=>LengthApi,
    "LessThanApi",
    ()=>LessThanApi,
    "MultiplyApi",
    ()=>MultiplyApi,
    "NotApi",
    ()=>NotApi,
    "NotEqualsApi",
    ()=>NotEqualsApi,
    "NumericApi",
    ()=>NumericApi,
    "OpenUrlApi",
    ()=>OpenUrlApi,
    "OrApi",
    ()=>OrApi,
    "PluralizeApi",
    ()=>PluralizeApi,
    "RegexApi",
    ()=>RegexApi,
    "RequiredApi",
    ()=>RequiredApi,
    "StartsWithApi",
    ()=>StartsWithApi,
    "SubtractApi",
    ()=>SubtractApi
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
;
const AddApi = {
    name: 'add',
    returnType: 'number',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        a: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number()),
        b: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number())
    })
};
const SubtractApi = {
    name: 'subtract',
    returnType: 'number',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        a: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number()),
        b: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number())
    })
};
const MultiplyApi = {
    name: 'multiply',
    returnType: 'number',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        a: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number()),
        b: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number())
    })
};
const DivideApi = {
    name: 'divide',
    returnType: 'number',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        a: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number()),
        b: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number())
    })
};
const EqualsApi = {
    name: 'equals',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        a: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().refine((v)=>v !== undefined, 'Required'),
        b: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().refine((v)=>v !== undefined, 'Required')
    })
};
const NotEqualsApi = {
    name: 'not_equals',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        a: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().refine((v)=>v !== undefined, 'Required'),
        b: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().refine((v)=>v !== undefined, 'Required')
    })
};
const GreaterThanApi = {
    name: 'greater_than',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        a: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number()),
        b: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number())
    })
};
const LessThanApi = {
    name: 'less_than',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        a: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number()),
        b: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === null ? undefined : v, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number())
    })
};
const AndApi = {
    name: 'and',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        values: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).min(2)
    })
};
const OrApi = {
    name: 'or',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        values: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).min(2)
    })
};
const NotApi = {
    name: 'not',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().refine((v)=>v !== undefined, 'Required')
    })
};
const ContainsApi = {
    name: 'contains',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        string: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === undefined ? undefined : String(v), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
        substring: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === undefined ? undefined : String(v), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
    })
};
const StartsWithApi = {
    name: 'starts_with',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        string: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === undefined ? undefined : String(v), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === undefined ? undefined : String(v), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
    })
};
const EndsWithApi = {
    name: 'ends_with',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        string: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === undefined ? undefined : String(v), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
        suffix: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === undefined ? undefined : String(v), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
    })
};
const RequiredApi = {
    name: 'required',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().refine((v)=>v !== undefined, 'Required')
    })
};
const RegexApi = {
    name: 'regex',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === undefined ? undefined : String(v), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
        pattern: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === undefined ? undefined : String(v), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
    })
};
const LengthApi = {
    name: 'length',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().refine((v)=>v !== undefined, 'Required'),
        min: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().optional(),
        max: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().optional()
    }).refine((data)=>data.min !== undefined || data.max !== undefined, {
        message: "Must provide either 'min' or 'max'"
    })
};
const NumericApi = {
    name: 'numeric',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number(),
        min: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().optional(),
        max: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().optional()
    }).refine((data)=>data.min !== undefined || data.max !== undefined, {
        message: "Must provide either 'min' or 'max'"
    })
};
const EmailApi = {
    name: 'email',
    returnType: 'boolean',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === undefined ? undefined : String(v), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
    })
};
const FormatStringApi = {
    name: 'formatString',
    returnType: 'any',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.string()
    })
};
const FormatNumberApi = {
    name: 'formatNumber',
    returnType: 'string',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number(),
        decimals: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().optional(),
        grouping: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true)
    })
};
const FormatCurrencyApi = {
    name: 'formatCurrency',
    returnType: 'string',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number(),
        currency: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.string(),
        decimals: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().optional(),
        grouping: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true)
    })
};
const FormatDateApi = {
    name: 'formatDate',
    returnType: 'string',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().refine((v)=>v !== undefined, 'Required'),
        format: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.string()
    })
};
const PluralizeApi = {
    name: 'pluralize',
    returnType: 'string',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number(),
        zero: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.string().optional(),
        one: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.string().optional(),
        two: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.string().optional(),
        few: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.string().optional(),
        many: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.string().optional(),
        other: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.string()
    })
};
const OpenUrlApi = {
    name: 'openUrl',
    returnType: 'void',
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        url: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].preprocess((v)=>v === undefined ? undefined : String(v), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
    })
};
const BASIC_FUNCTION_APIS = [
    AddApi,
    SubtractApi,
    MultiplyApi,
    DivideApi,
    EqualsApi,
    NotEqualsApi,
    GreaterThanApi,
    LessThanApi,
    AndApi,
    OrApi,
    NotApi,
    ContainsApi,
    StartsWithApi,
    EndsWithApi,
    RequiredApi,
    RegexApi,
    LengthApi,
    NumericApi,
    EmailApi,
    FormatStringApi,
    FormatNumberApi,
    FormatCurrencyApi,
    FormatDateApi,
    PluralizeApi,
    OpenUrlApi
];
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/catalog/types.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Catalog",
    ()=>Catalog,
    "createFunctionImplementation",
    ()=>createFunctionImplementation
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/errors.js [app-client] (ecmascript)");
;
;
function createFunctionImplementation(api, execute) {
    return {
        name: api.name,
        returnType: api.returnType,
        schema: api.schema,
        execute: execute
    };
}
class Catalog {
    constructor(id, components, functions = [], themeSchema){
        this.id = id;
        const compMap = new Map();
        for (const comp of components){
            compMap.set(comp.name, comp);
        }
        this.components = compMap;
        const funcMap = new Map();
        for (const fn of functions){
            funcMap.set(fn.name, fn);
        }
        this.functions = funcMap;
        this.themeSchema = themeSchema;
        this.invoker = (name, rawArgs, ctx, abortSignal)=>{
            const fn = this.functions.get(name);
            if (!fn) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"](`Function not found in catalog '${this.id}': ${name}`, name);
            }
            // Provides runtime safety: Coerces and strips invalid arguments before execute()
            try {
                const safeArgs = fn.schema.parse(rawArgs);
                return fn.execute(safeArgs, ctx, abortSignal);
            } catch (e) {
                if (e?.name === 'ZodError' || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"](`Validation failed for function '${name}': ${e.message}`, name, e.errors ?? e.issues);
                }
                throw e;
            }
        };
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/common/events.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Internal implementation used by the model.
 * Implements EventSource but also provides the 'emit' method.
 */ __turbopack_context__.s([
    "EventEmitter",
    ()=>EventEmitter
]);
class EventEmitter {
    constructor(){
        this.listeners = new Set();
    }
    /**
     * Subscribes to the event.
     *
     * @param listener The listener function to call when the event is emitted.
     * @returns A subscription object that can be used to unsubscribe.
     */ subscribe(listener) {
        this.listeners.add(listener);
        return {
            unsubscribe: ()=>this.listeners.delete(listener)
        };
    }
    /**
     * Emits an event to all subscribers.
     *
     * @param data The data to pass to subscribers.
     */ async emit(data) {
        for (const listener of this.listeners){
            try {
                await listener(data);
            } catch (e) {
                console.error('EventEmitter error:', e);
            }
        }
    }
    /**
     * Removes all listeners.
     */ dispose() {
        this.listeners.clear();
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Base class for all A2UI specific errors.
 *
 * Includes a machine-readable `code` for categorical handling and ensures
 * proper stack trace capturing.
 */ __turbopack_context__.s([
    "A2uiDataError",
    ()=>A2uiDataError,
    "A2uiError",
    ()=>A2uiError,
    "A2uiExpressionError",
    ()=>A2uiExpressionError,
    "A2uiStateError",
    ()=>A2uiStateError,
    "A2uiValidationError",
    ()=>A2uiValidationError
]);
class A2uiError extends Error {
    constructor(message, code = 'UNKNOWN_ERROR'){
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
class A2uiValidationError extends A2uiError {
    constructor(message, details){
        super(message, 'VALIDATION_ERROR');
        this.details = details;
    }
}
class A2uiDataError extends A2uiError {
    constructor(message, path){
        super(message, 'DATA_ERROR');
        this.path = path;
    }
}
class A2uiExpressionError extends A2uiError {
    constructor(message, expression, details){
        super(message, 'EXPRESSION_ERROR');
        this.expression = expression;
        this.details = details;
    }
}
class A2uiStateError extends A2uiError {
    constructor(message){
        super(message, 'STATE_ERROR');
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/processing/message-processor.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageProcessor",
    ()=>MessageProcessor
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$surface$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/state/surface-model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$surface$2d$group$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/state/surface-group-model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$component$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/state/component-model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/zod-to-json-schema/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$zodToJsonSchema$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/errors.js [app-client] (ecmascript)");
;
;
;
;
;
class MessageProcessor {
    /**
     * Creates a new message processor.
     *
     * @param catalogs A list of available catalogs.
     * @param actionHandler A global handler for actions from all surfaces.
     */ constructor(catalogs, actionHandler){
        this.catalogs = catalogs;
        this.actionHandler = actionHandler;
        this.model = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$surface$2d$group$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SurfaceGroupModel"]();
        if (this.actionHandler) {
            this.model.onAction.subscribe(this.actionHandler);
        }
    }
    /**
     * Generates the a2uiClientCapabilities object for the current processor.
     *
     * @param options Configuration for capability generation.
     * @returns The capabilities object.
     */ getClientCapabilities(options) {
        const capabilities = {
            'v0.9': {
                supportedCatalogIds: this.catalogs.map((c)=>c.id)
            }
        };
        if (options?.includeInlineCatalogs) {
            capabilities['v0.9'].inlineCatalogs = this.catalogs.map((c)=>this.generateInlineCatalog(c));
        }
        return capabilities;
    }
    generateInlineCatalog(catalog) {
        const components = {};
        for (const [name, api] of catalog.components.entries()){
            const zodSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$zodToJsonSchema$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodToJsonSchema"])(api.schema, {
                target: 'jsonSchema2019-09'
            });
            // Clean up Zod-specific artifacts and process REF: tags
            this.processRefs(zodSchema);
            // Wrap in standard A2UI component envelope (ComponentCommon)
            components[name] = {
                allOf: [
                    {
                        $ref: 'common_types.json#/$defs/ComponentCommon'
                    },
                    {
                        properties: {
                            component: {
                                const: name
                            },
                            ...zodSchema.properties
                        },
                        required: [
                            'component',
                            ...zodSchema.required || []
                        ]
                    }
                ]
            };
        }
        const functions = [];
        for (const api of catalog.functions.values()){
            const zodSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$zodToJsonSchema$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodToJsonSchema"])(api.schema, {
                target: 'jsonSchema2019-09'
            });
            this.processRefs(zodSchema);
            functions.push({
                name: api.name,
                description: api.schema.description,
                returnType: api.returnType,
                parameters: zodSchema
            });
        }
        let theme;
        if (catalog.themeSchema) {
            const zodSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$zodToJsonSchema$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodToJsonSchema"])(catalog.themeSchema, {
                target: 'jsonSchema2019-09'
            });
            this.processRefs(zodSchema);
            theme = zodSchema.properties;
        }
        return {
            catalogId: catalog.id,
            components,
            functions: functions.length > 0 ? functions : undefined,
            theme
        };
    }
    processRefs(node) {
        if (typeof node !== 'object' || node === null) return;
        // If the node itself is a REF target, transform it and stop recursion.
        if (typeof node.description === 'string' && node.description.startsWith('REF:')) {
            const parts = node.description.substring(4).split('|');
            const ref = parts[0];
            const desc = parts[1] || '';
            // Clear the node of all other properties.
            for (const k of Object.keys(node)){
                delete node[k];
            }
            // Re-add only the $ref and an optional description.
            node['$ref'] = ref;
            if (desc) {
                node['description'] = desc;
            }
            return;
        }
        // If not a REF target, recurse into its children.
        if (Array.isArray(node)) {
            for (const item of node){
                this.processRefs(item);
            }
        } else {
            for (const key of Object.keys(node)){
                this.processRefs(node[key]);
            }
        }
    }
    /**
     * Returns the aggregated data model for all surfaces that have 'sendDataModel' enabled.
     */ getClientDataModel() {
        const surfaces = {};
        for (const surface of this.model.surfacesMap.values()){
            if (surface.sendDataModel) {
                surfaces[surface.id] = surface.dataModel.get('/');
            }
        }
        if (Object.keys(surfaces).length === 0) {
            return undefined;
        }
        return {
            version: 'v0.9',
            surfaces
        };
    }
    /**
     * Subscribes to surface creation events.
     */ onSurfaceCreated(handler) {
        return this.model.onSurfaceCreated.subscribe(handler);
    }
    /**
     * Subscribes to surface deletion events.
     */ onSurfaceDeleted(handler) {
        return this.model.onSurfaceDeleted.subscribe(handler);
    }
    /**
     * Processes a list of messages or a messages wrapper.
     *
     * @param messages The messages or messages wrapper to process.
     */ processMessages(messages) {
        const messageList = Array.isArray(messages) ? messages : messages.messages;
        for (const message of messageList){
            this.processMessage(message);
        }
    }
    processMessage(message) {
        const updateTypes = [
            'createSurface',
            'updateComponents',
            'updateDataModel',
            'deleteSurface'
        ].filter((k)=>k in message);
        if (updateTypes.length > 1) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiValidationError"](`Message contains multiple update types: ${updateTypes.join(', ')}.`);
        }
        if ('createSurface' in message) {
            this.processCreateSurfaceMessage(message);
            return;
        }
        if ('deleteSurface' in message) {
            this.processDeleteSurfaceMessage(message);
            return;
        }
        if ('updateComponents' in message) {
            this.processUpdateComponentsMessage(message);
            return;
        }
        if ('updateDataModel' in message) {
            this.processUpdateDataModelMessage(message);
            return;
        }
    }
    processCreateSurfaceMessage(message) {
        const payload = message.createSurface;
        const { surfaceId, catalogId, theme, sendDataModel } = payload;
        // Find catalog
        const catalog = this.catalogs.find((c)=>c.id === catalogId);
        if (!catalog) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiStateError"](`Catalog not found: ${catalogId}`);
        }
        if (this.model.getSurface(surfaceId)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiStateError"](`Surface ${surfaceId} already exists.`);
        }
        const surface = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$surface$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SurfaceModel"](surfaceId, catalog, theme, sendDataModel ?? false);
        this.model.addSurface(surface);
    }
    processDeleteSurfaceMessage(message) {
        const payload = message.deleteSurface;
        if (!payload.surfaceId) return;
        this.model.deleteSurface(payload.surfaceId);
    }
    processUpdateComponentsMessage(message) {
        const payload = message.updateComponents;
        if (!payload.surfaceId) return;
        const surface = this.model.getSurface(payload.surfaceId);
        if (!surface) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiStateError"](`Surface not found for message: ${payload.surfaceId}`);
        }
        for (const comp of payload.components){
            const { id, component, ...properties } = comp;
            if (!id) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiValidationError"](`Component '${component}' is missing an 'id'.`);
            }
            const existing = surface.componentsModel.get(id);
            if (existing) {
                if (component && component !== existing.type) {
                    // Recreate component if type changes
                    surface.componentsModel.removeComponent(id);
                    const newComponent = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$component$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComponentModel"](id, component, properties);
                    surface.componentsModel.addComponent(newComponent);
                } else {
                    existing.properties = properties;
                }
            } else {
                if (!component) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiValidationError"](`Cannot create component ${id} without a type.`);
                }
                const newComponent = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$component$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComponentModel"](id, component, properties);
                surface.componentsModel.addComponent(newComponent);
            }
        }
    }
    processUpdateDataModelMessage(message) {
        const payload = message.updateDataModel;
        if (!payload.surfaceId) return;
        const surface = this.model.getSurface(payload.surfaceId);
        if (!surface) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiStateError"](`Surface not found for message: ${payload.surfaceId}`);
        }
        const path = payload.path || '/';
        const value = payload.value;
        surface.dataModel.set(path, value);
    }
    /**
     * Resolves a relative path against a context path.
     *
     * @param path The path to resolve.
     * @param contextPath The base path (optional).
     */ resolvePath(path, contextPath) {
        if (path.startsWith('/')) {
            return path;
        }
        if (contextPath) {
            const base = contextPath.endsWith('/') ? contextPath : `${contextPath}/`;
            return `${base}${path}`;
        }
        return `/${path}`;
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/reactivity/signals.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "_PRIVATE_DEFAULT_SIGNAL_IMPLEMENTATION",
    ()=>_PRIVATE_DEFAULT_SIGNAL_IMPLEMENTATION,
    "batchWrite",
    ()=>batchWrite,
    "computed",
    ()=>computed,
    "effect",
    ()=>effect,
    "getValue",
    ()=>getValue,
    "isSignal",
    ()=>isSignal,
    "peekValue",
    ()=>peekValue,
    "setSignalImplementation",
    ()=>setSignalImplementation,
    "setValue",
    ()=>setValue,
    "signal",
    ()=>signal
]);
/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$preact$2f$signals$2d$core$2f$dist$2f$signals$2d$core$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@preact/signals-core/dist/signals-core.module.js [app-client] (ecmascript)");
;
let signalImpl;
let computedImpl;
let effectImpl;
let batchWriteImpl;
let isSignalImpl;
let getValueImpl;
let setValueImpl;
let peekValueImpl;
const _PRIVATE_DEFAULT_SIGNAL_IMPLEMENTATION = {
    signal: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$preact$2f$signals$2d$core$2f$dist$2f$signals$2d$core$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signal"],
    computed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$preact$2f$signals$2d$core$2f$dist$2f$signals$2d$core$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computed"],
    effect: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$preact$2f$signals$2d$core$2f$dist$2f$signals$2d$core$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["effect"],
    batchWrite: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$preact$2f$signals$2d$core$2f$dist$2f$signals$2d$core$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["batch"],
    isSignal: (val)=>!!val && typeof val === 'object' && 'value' in val && 'peek' in val,
    getValue: (signal)=>signal.value,
    setValue: (signal, value)=>{
        if (!(signal instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$preact$2f$signals$2d$core$2f$dist$2f$signals$2d$core$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Computed"])) {
            signal.value = value;
        }
    },
    peekValue: (signal)=>signal.peek()
};
setSignalImplementation(_PRIVATE_DEFAULT_SIGNAL_IMPLEMENTATION);
function setSignalImplementation(impl) {
    // Intentionally only store the functions so we ignore any mutations of the implementation.
    signalImpl = impl.signal;
    computedImpl = impl.computed;
    effectImpl = impl.effect;
    batchWriteImpl = impl.batchWrite;
    isSignalImpl = impl.isSignal;
    getValueImpl = impl.getValue;
    setValueImpl = impl.setValue;
    peekValueImpl = impl.peekValue;
}
function signal(initialValue) {
    return signalImpl(initialValue);
}
function computed(computeFn) {
    return computedImpl(computeFn);
}
function effect(effectFn) {
    return effectImpl(effectFn);
}
function batchWrite(batchFn) {
    return batchWriteImpl(batchFn);
}
function isSignal(val) {
    return isSignalImpl(val);
}
function getValue(signal) {
    return getValueImpl(signal);
}
function setValue(signal, value) {
    setValueImpl(signal, value);
}
function peekValue(signal) {
    return peekValueImpl(signal);
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/rendering/component-context.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComponentContext",
    ()=>ComponentContext
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$rendering$2f$data$2d$context$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/rendering/data-context.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/errors.js [app-client] (ecmascript)");
;
;
class ComponentContext {
    /**
     * Creates a new component context.
     *
     * @param surface The surface model the component belongs to.
     * @param componentId The ID of the component.
     * @param dataModelBasePath The base path for data model access (default: '/').
     */ constructor(surface, componentId, dataModelBasePath = '/'){
        const model = surface.componentsModel.get(componentId);
        if (!model) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiStateError"](`Component not found: ${componentId}`);
        }
        this.componentModel = model;
        this.surfaceComponents = surface.componentsModel;
        this.theme = surface.theme;
        this.dataContext = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$rendering$2f$data$2d$context$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataContext"](surface, dataModelBasePath);
        this._actionDispatcher = (action)=>surface.dispatchAction(action, this.componentModel.id);
    }
    /**
     * Dispatches an action from the component.
     *
     * @param action The action to dispatch.
     */ dispatchAction(action) {
        return this._actionDispatcher(action);
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/rendering/data-context.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataContext",
    ()=>DataContext
]);
// Force rebuild by wireit
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/reactivity/signals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/errors.js [app-client] (ecmascript)");
;
;
;
class DataContext {
    /**
     * Initializes a new DataContext.
     *
     * @param surface The surface model this context belongs to.
     * @param path The absolute path in the DataModel that this context is scoped to (its "current working directory").
     */ constructor(surface, path){
        this.surface = surface;
        this.path = path;
        this.dataModel = surface.dataModel;
        this.functionInvoker = surface.catalog.invoker;
    }
    /**
     * Mutates the underlying DataModel at the specified path.
     *
     * This is the primary method for components to push state changes (e.g. user input)
     * back up to the global model.
     *
     * @param path A JSON pointer path. If relative, it is resolved against this context's `path`.
     * @param value The new value to store in the DataModel.
     */ set(path, value) {
        const absolutePath = this.resolvePath(path);
        this.dataModel.set(absolutePath, value);
    }
    /**
     * Synchronously evaluates a `DynamicValue` (a literal, a path binding, or a function call)
     * into its concrete runtime value.
     *
     * **Note:** This method evaluates the value *once* at the current moment in time.
     * It does not create any reactive subscriptions. If the underlying data changes later,
     * this result will not automatically update. Use `subscribeDynamicValue` for reactive updates.
     *
     * @param value The DynamicValue object from the A2UI JSON payload.
     * @returns The synchronously resolved value.
     */ resolveDynamicValue(value) {
        // 1. Literal check (excluding arrays and objects)
        if (value === null || typeof value !== 'object' || Array.isArray(value)) {
            return value;
        }
        // 2. Path Check: { path: "..." }
        if ('path' in value) {
            const absolutePath = this.resolvePath(value.path);
            return this.dataModel.get(absolutePath);
        }
        // 3. Function Call: { call: "...", args: ... }
        if ('call' in value) {
            const call = value;
            const args = {};
            for (const [key, argVal] of Object.entries(call.args)){
                args[key] = this.resolveDynamicValue(argVal);
            }
            const abortController = new AbortController();
            const result = this.evaluateFunctionReactive(call.call, args, abortController.signal);
            if (result === undefined) {
                return undefined;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSignal"])(result) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["peekValue"])(result) : result;
        }
        return value;
    }
    /**
     * Reactively listens to changes in a `DynamicValue`.
     *
     * This is the core reactive binding mechanism. Whenever the underlying data changes
     * (or if a function call's dependencies change), the `onChange` callback will be fired
     * with the freshly evaluated result.
     *
     * @template V The expected type of the resolved value.
     * @param value The DynamicValue to evaluate and observe.
     * @param onChange A callback fired whenever the evaluated result changes.
     * @returns A `DataSubscription` containing the initial synchronously-resolved value, along with an `unsubscribe` method to clean up the listener.
     */ subscribeDynamicValue(value, onChange) {
        const sig = this.resolveSignal(value);
        let isSync = true;
        let currentValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["peekValue"])(sig);
        const dispose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["effect"])(()=>{
            const val = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getValue"])(sig);
            currentValue = val;
            if (!isSync) {
                onChange(val);
            }
        });
        isSync = false;
        return {
            get value () {
                return currentValue;
            },
            unsubscribe: ()=>{
                dispose();
                sig.unsubscribe?.();
            }
        };
    }
    /**
     * Returns a Preact Signal representing the reactive dynamic value.
     *
     * This method recursively resolves any nested path bindings or function calls into a
     * single, reactive `Signal`. Any changes to the underlying data or function dependencies
     * will cause this signal's value to update.
     *
     * @param value The DynamicValue to evaluate and observe.
     * @returns A Preact Signal containing the reactive result of the evaluation.
     */ resolveSignal(value) {
        // 1. Literal
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signal"])(value);
        }
        // 2. Path Check
        if ('path' in value) {
            const absolutePath = this.resolvePath(value.path);
            return this.dataModel.getSignal(absolutePath);
        }
        // 3. Function Call
        if ('call' in value) {
            const call = value;
            const argSignals = {};
            for (const [key, argVal] of Object.entries(call.args)){
                argSignals[key] = this.resolveSignal(argVal);
            }
            if (Object.keys(argSignals).length === 0) {
                const abortController = new AbortController();
                const result = this.evaluateFunctionReactive(call.call, {}, abortController.signal);
                const sig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSignal"])(result) ? result : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signal"])(result);
                sig.unsubscribe = ()=>abortController.abort();
                return sig;
            }
            const keys = Object.keys(argSignals);
            const resultSig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signal"])(undefined);
            let abortController;
            let innerUnsubscribe;
            const argsSig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computed"])(()=>{
                const argsRecord = {};
                for(let i = 0; i < keys.length; i++){
                    argsRecord[keys[i]] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getValue"])(argSignals[keys[i]]);
                }
                return argsRecord;
            });
            const stopper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["effect"])(()=>{
                try {
                    const args = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getValue"])(argsSig);
                    if (abortController) abortController.abort();
                    if (innerUnsubscribe) {
                        innerUnsubscribe();
                        innerUnsubscribe = undefined;
                    }
                    abortController = new AbortController();
                    const res = this.evaluateFunctionReactive(call.call, args, abortController.signal);
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSignal"])(res)) {
                        innerUnsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["effect"])(()=>{
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(resultSig, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getValue"])(res));
                        });
                    } else {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(resultSig, res);
                    }
                } catch (e) {
                    this.dispatchExpressionError(e, call.call);
                    // In reactive mode, we should not throw. Instead, reset the signal value.
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(resultSig, undefined);
                }
            });
            resultSig.unsubscribe = ()=>{
                stopper();
                if (innerUnsubscribe) innerUnsubscribe();
                if (abortController) abortController.abort();
                for(let i = 0; i < keys.length; i++){
                    argSignals[keys[i]].unsubscribe?.();
                }
            };
            return resultSig;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signal"])(value);
    }
    /**
     * Resolves an action by evaluating its top-level dynamic values.
     *
     * For event actions, it resolves each value in the context map.
     * For function call actions, it evaluates the call.
     *
     * This is non-recursive: it only resolves one level deep for the context record,
     * in accordance with the schema specification that requires values to be single
     * DynamicValue types and prevents arbitrary nesting.
     */ resolveAction(action) {
        if ('event' in action) {
            const resolvedContext = {};
            if (action.event.context) {
                for (const [key, value] of Object.entries(action.event.context)){
                    resolvedContext[key] = this.resolveDynamicValue(value);
                }
            }
            return {
                event: {
                    ...action.event,
                    context: resolvedContext
                }
            };
        }
        if ('functionCall' in action) {
            return this.resolveDynamicValue(action.functionCall);
        }
        return action;
    }
    evaluateFunctionReactive(name, args, abortSignal) {
        try {
            return this.functionInvoker(name, args, this, abortSignal);
        } catch (e) {
            this.dispatchExpressionError(e, name);
            return undefined;
        }
    }
    dispatchExpressionError(e, name) {
        if (e?.name === 'ZodError' || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            const err = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"](`Validation failed for function '${name}': ${e.message}`, name, e.errors ?? e.issues);
            this.surface.dispatchError({
                code: 'EXPRESSION_ERROR',
                message: err.message,
                expression: name,
                details: err.details
            });
        } else if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiExpressionError"]) {
            this.surface.dispatchError({
                code: 'EXPRESSION_ERROR',
                message: e.message,
                expression: e.expression,
                details: e.details
            });
        } else {
            this.surface.dispatchError({
                code: 'EXPRESSION_ERROR',
                message: e.message ?? `An unexpected error occurred in function ${name}.`,
                expression: name,
                details: {
                    stack: e.stack
                }
            });
        }
    }
    /**
     * Creates a new, child `DataContext` scoped to a deeper path.
     *
     * This is used when a component (like a List or a Card) wants to provide a targeted
     * data scope for its children, so children can use relative paths like `./title`.
     *
     * @param relativePath The path relative to the *current* context's path.
     * @returns A new `DataContext` instance pointing to the resolved absolute path.
     */ nested(relativePath) {
        const newPath = this.resolvePath(relativePath);
        return new DataContext(this.surface, newPath);
    }
    resolvePath(path) {
        if (path.startsWith('/')) {
            return path;
        }
        if (path === '' || path === '.') {
            return this.path;
        }
        let base = this.path;
        if (base.endsWith('/') && base.length > 1) {
            base = base.slice(0, -1);
        }
        if (base === '/') base = '';
        return `${base}/${path}`;
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/rendering/generic-binder.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Traverses a Zod schema tree to build a `BehaviorNode` map.
 *
 * This allows the Generic Binder to know *how* to handle a piece of raw JSON
 * data without needing hardcoded logic for every specific component type.
 * It identifies core A2UI primitives (Dynamic values, Actions, ChildLists) by
 * inspecting the shape of ZodUnion objects defined in `common-types.ts`.
 */ __turbopack_context__.s([
    "GenericBinder",
    ()=>GenericBinder,
    "scrapeSchemaBehavior",
    ()=>scrapeSchemaBehavior
]);
function scrapeSchemaBehavior(schema) {
    return getFieldBehavior(schema);
}
function getFieldBehavior(type, propertyName) {
    let current = type;
    // Unwrap optionals/nullables/defaults
    while(current._def.typeName === 'ZodOptional' || current._def.typeName === 'ZodNullable' || current._def.typeName === 'ZodDefault'){
        current = current._def.innerType;
    }
    if (propertyName === 'checks') {
        return {
            type: 'CHECKABLE'
        };
    }
    // Structural matching for A2UI primitives using typeName to avoid dual-module instanceof issues
    if (current._def.typeName === 'ZodUnion') {
        const options = current._def.options;
        // ActionSchema is a union containing { event: ... }
        const isAction = options.some((o)=>o._def.typeName === 'ZodObject' && o._def.shape().event);
        if (isAction) return {
            type: 'ACTION'
        };
        // Dynamic strings/values are unions containing DataBindingSchema { path: ... } but NOT { componentId: ... }
        const isDynamic = options.some((o)=>o._def.typeName === 'ZodObject' && o._def.shape().path && !o._def.shape().componentId);
        if (isDynamic) return {
            type: 'DYNAMIC'
        };
        // ChildList is a union containing an array and an object with { componentId, path }
        const isChildList = options.some((o)=>o._def.typeName === 'ZodObject' && o._def.shape().componentId && o._def.shape().path);
        if (isChildList) return {
            type: 'STRUCTURAL'
        };
    } else if (current._def.typeName === 'ZodString') {
    // ComponentId falls back to STATIC since we can't perfectly identify it, which is fine because STATIC returns strings as-is.
    }
    // Recursive array scraping
    if (current._def.typeName === 'ZodArray') {
        return {
            type: 'ARRAY',
            element: getFieldBehavior(current._def.type)
        };
    }
    // Recursive object scraping
    if (current._def.typeName === 'ZodObject') {
        const shape = {};
        const objShape = current._def.shape();
        for (const [key, value] of Object.entries(objShape)){
            shape[key] = getFieldBehavior(value, key);
        }
        return {
            type: 'OBJECT',
            shape
        };
    }
    // Fallback
    return {
        type: 'STATIC'
    };
}
class GenericBinder {
    constructor(context, schema){
        this.dataListeners = [];
        this.propsListeners = [];
        this.currentProps = {};
        this.isConnected = false;
        this.context = context;
        this.behaviorTree = scrapeSchemaBehavior(schema);
        if (this.behaviorTree.type !== 'OBJECT') {
            this.behaviorTree = {
                type: 'OBJECT',
                shape: {}
            };
        }
        this.resolveInitialProps();
    }
    resolveInitialProps() {
        const props = this.context.componentModel.properties;
        const resolved = this.resolveAndBind(props, this.behaviorTree, [], true);
        this.currentProps = {
            ...this.currentProps,
            ...resolved
        };
    }
    connect() {
        if (this.isConnected) return;
        this.isConnected = true;
        const sub = this.context.componentModel.onUpdated.subscribe(()=>{
            this.rebuildAllBindings();
        });
        this.compUnsub = ()=>sub.unsubscribe();
        this.rebuildAllBindings();
    }
    rebuildAllBindings() {
        this.dataListeners.forEach((l)=>l());
        this.dataListeners = [];
        const props = this.context.componentModel.properties;
        const resolved = this.resolveAndBind(props, this.behaviorTree, [], false);
        this.currentProps = {
            ...this.currentProps,
            ...resolved
        };
        this.notify();
    }
    resolveAndBind(value, behavior, path, isSync) {
        if (value === undefined || value === null) return value;
        switch(behavior.type){
            case 'DYNAMIC':
                {
                    const bound = this.context.dataContext.subscribeDynamicValue(value, (newVal)=>{
                        this.updateDeepValue(path, newVal);
                        this.notify();
                    });
                    if (!isSync) {
                        this.dataListeners.push(()=>bound.unsubscribe());
                    } else {
                        bound.unsubscribe();
                    }
                    return bound.value;
                }
            case 'ACTION':
                {
                    return ()=>{
                        const resolveDeepSync = (val)=>{
                            if (typeof val !== 'object' || val === null) return val;
                            if ('path' in val || 'call' in val) return this.context.dataContext.resolveDynamicValue(val);
                            if (Array.isArray(val)) return val.map(resolveDeepSync);
                            const res = {};
                            for (const [k, v] of Object.entries(val))res[k] = resolveDeepSync(v);
                            return res;
                        };
                        this.context.dispatchAction(resolveDeepSync(value));
                    };
                }
            case 'STRUCTURAL':
                {
                    if (value && typeof value === 'object' && value.path && value.componentId) {
                        const bound = this.context.dataContext.subscribeDynamicValue({
                            path: value.path
                        }, (newVal)=>{
                            const arr = Array.isArray(newVal) ? newVal : [];
                            const listContext = this.context.dataContext.nested(value.path);
                            const resolvedChildren = arr.map((_, i)=>({
                                    id: value.componentId,
                                    basePath: listContext.nested(String(i)).path
                                }));
                            this.updateDeepValue(path, resolvedChildren);
                            this.notify();
                        });
                        if (!isSync) {
                            this.dataListeners.push(()=>bound.unsubscribe());
                        } else {
                            bound.unsubscribe();
                        }
                        const currentArr = Array.isArray(bound.value) ? bound.value : [];
                        const listContext = this.context.dataContext.nested(value.path);
                        return currentArr.map((_, i)=>({
                                id: value.componentId,
                                basePath: listContext.nested(String(i)).path
                            }));
                    }
                    return value;
                }
            case 'CHECKABLE':
                {
                    const rules = Array.isArray(value) ? value : [];
                    const ruleResults = rules.map(()=>({
                            valid: true,
                            message: ''
                        }));
                    const parentPath = path.slice(0, -1);
                    const updateValidationState = ()=>{
                        const errors = ruleResults.filter((r)=>!r.valid).map((r)=>r.message);
                        this.updateDeepValue([
                            ...parentPath,
                            'isValid'
                        ], errors.length === 0);
                        this.updateDeepValue([
                            ...parentPath,
                            'validationErrors'
                        ], errors);
                        this.notify();
                    };
                    rules.forEach((rule, index)=>{
                        const condition = rule.condition || rule; // Support both {condition, message} and direct logic expr if message is missing
                        const message = rule.message || 'Validation failed';
                        ruleResults[index].message = message;
                        const bound = this.context.dataContext.subscribeDynamicValue(condition, (newVal)=>{
                            ruleResults[index].valid = !!newVal;
                            updateValidationState();
                        });
                        if (!isSync) {
                            this.dataListeners.push(()=>bound.unsubscribe());
                        } else {
                            bound.unsubscribe();
                        }
                        ruleResults[index].valid = !!bound.value;
                    });
                    // Set initial state
                    const initialErrors = ruleResults.filter((r)=>!r.valid).map((r)=>r.message);
                    this.updateDeepValue([
                        ...parentPath,
                        'isValid'
                    ], initialErrors.length === 0);
                    this.updateDeepValue([
                        ...parentPath,
                        'validationErrors'
                    ], initialErrors);
                    return value; // The 'checks' property itself remains as the original rules array
                }
            case 'STATIC':
                return value;
            case 'ARRAY':
                {
                    if (!Array.isArray(value)) return value;
                    return value.map((item, index)=>this.resolveAndBind(item, behavior.element, [
                            ...path,
                            index.toString()
                        ], isSync));
                }
            case 'OBJECT':
                {
                    if (typeof value !== 'object') return value;
                    const result = {};
                    // 1. Resolve all provided properties
                    for (const [k, v] of Object.entries(value)){
                        const childBehavior = behavior.shape[k] || {
                            type: 'STATIC'
                        };
                        result[k] = this.resolveAndBind(v, childBehavior, [
                            ...path,
                            k
                        ], isSync);
                    }
                    // 2. Ensure all dynamic setters exist, even if the property wasn't provided in the payload
                    for (const [k, childBehavior] of Object.entries(behavior.shape)){
                        if (childBehavior.type === 'DYNAMIC') {
                            const setterName = `set${k.charAt(0).toUpperCase() + k.slice(1)}`;
                            const rawPropValue = value[k];
                            result[setterName] = (newValue)=>{
                                if (rawPropValue && typeof rawPropValue === 'object' && 'path' in rawPropValue) {
                                    this.context.dataContext.set(rawPropValue.path, newValue);
                                }
                            };
                        }
                    }
                    return result;
                }
        }
    }
    updateDeepValue(path, newValue) {
        this.currentProps = this.cloneAndUpdate(this.currentProps, path, newValue);
    }
    cloneAndUpdate(obj, path, newValue) {
        if (path.length === 0) return newValue;
        const [key, ...rest] = path;
        if (Array.isArray(obj)) {
            const newArr = [
                ...obj
            ];
            newArr[Number(key)] = this.cloneAndUpdate(newArr[Number(key)], rest, newValue);
            return newArr;
        } else {
            return {
                ...obj || {},
                [key]: this.cloneAndUpdate((obj || {})[key], rest, newValue)
            };
        }
    }
    dispose() {
        if (!this.isConnected) return;
        this.isConnected = false;
        this.dataListeners.forEach((l)=>l());
        this.dataListeners = [];
        if (this.compUnsub) {
            this.compUnsub();
            this.compUnsub = undefined;
        }
    }
    notify() {
        this.propsListeners.forEach((l)=>l(this.currentProps));
    }
    subscribe(listener) {
        if (this.propsListeners.length === 0) {
            this.connect();
        }
        this.propsListeners.push(listener);
        return {
            unsubscribe: ()=>{
                this.propsListeners = this.propsListeners.filter((l)=>l !== listener);
                if (this.propsListeners.length === 0) {
                    this.dispose();
                }
            }
        };
    }
    get snapshot() {
        return this.currentProps;
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/schema/client-to-server.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "A2uiClientActionSchema",
    ()=>A2uiClientActionSchema,
    "A2uiClientDataModelSchema",
    ()=>A2uiClientDataModelSchema,
    "A2uiClientErrorSchema",
    ()=>A2uiClientErrorSchema,
    "A2uiClientMessageListSchema",
    ()=>A2uiClientMessageListSchema,
    "A2uiClientMessageListWrapperSchema",
    ()=>A2uiClientMessageListWrapperSchema,
    "A2uiClientMessageSchema",
    ()=>A2uiClientMessageSchema,
    "A2uiGenericErrorSchema",
    ()=>A2uiGenericErrorSchema,
    "A2uiValidationErrorSchema",
    ()=>A2uiValidationErrorSchema
]);
/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
;
const A2uiClientActionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("The name of the action, taken from the component's action.event.name property."),
    surfaceId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The id of the surface where the event originated.'),
    sourceComponentId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The id of the component that triggered the event.'),
    timestamp: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().datetime().describe('An ISO 8601 timestamp of when the event occurred.'),
    context: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).describe("A JSON object containing the key-value pairs from the component's action.event.context, after resolving all data bindings.")
}).strict();
const A2uiValidationErrorSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    code: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('VALIDATION_FAILED'),
    surfaceId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The id of the surface where the error occurred.'),
    path: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("The JSON pointer to the field that failed validation (e.g. '/components/0/text')."),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('A short one or two sentence description of why validation failed.')
}).strict();
const A2uiGenericErrorSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    code: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().refine((c)=>c !== 'VALIDATION_FAILED'),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('A short one or two sentence description of why the error occurred.'),
    surfaceId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The id of the surface where the error occurred.')
}).passthrough();
const A2uiClientErrorSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    A2uiValidationErrorSchema,
    A2uiGenericErrorSchema
]);
const A2uiClientMessageSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    version: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('v0.9')
}).and(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        action: A2uiClientActionSchema
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        error: A2uiClientErrorSchema
    })
]));
const A2uiClientDataModelSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    version: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('v0.9'),
    surfaces: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({}).passthrough()).describe('A map of surface IDs to their current data models.')
}).strict();
const A2uiClientMessageListSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(A2uiClientMessageSchema).describe('A list of client messages.');
const A2uiClientMessageListWrapperSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    messages: A2uiClientMessageListSchema
}).strict().describe('An object wrapping a list of client messages.');
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/schema/common-types.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccessibilityAttributesSchema",
    ()=>AccessibilityAttributesSchema,
    "ActionSchema",
    ()=>ActionSchema,
    "AnyComponentSchema",
    ()=>AnyComponentSchema,
    "CheckRuleSchema",
    ()=>CheckRuleSchema,
    "CheckableSchema",
    ()=>CheckableSchema,
    "ChildListSchema",
    ()=>ChildListSchema,
    "CommonSchemas",
    ()=>CommonSchemas,
    "ComponentIdSchema",
    ()=>ComponentIdSchema,
    "DataBindingSchema",
    ()=>DataBindingSchema,
    "DynamicBooleanSchema",
    ()=>DynamicBooleanSchema,
    "DynamicNumberSchema",
    ()=>DynamicNumberSchema,
    "DynamicStringListSchema",
    ()=>DynamicStringListSchema,
    "DynamicStringSchema",
    ()=>DynamicStringSchema,
    "DynamicValueSchema",
    ()=>DynamicValueSchema,
    "FunctionCallSchema",
    ()=>FunctionCallSchema
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
;
const DataBindingSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    path: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('A JSON Pointer path to a value in the data model.')
}).describe('REF:common_types.json#/$defs/DataBinding|A JSON Pointer path to a value in the data model.');
const FunctionCallSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    call: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The name of the function to call.'),
    args: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).describe('Arguments passed to the function.'),
    returnType: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'string',
        'number',
        'boolean',
        'array',
        'object',
        'any',
        'void'
    ]).default('boolean')
}).describe('REF:common_types.json#/$defs/FunctionCall|Invokes a named function on the client.');
const DynamicBooleanSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    DataBindingSchema,
    FunctionCallSchema
]).describe('REF:common_types.json#/$defs/DynamicBoolean|A boolean value that can be a literal, a path, or a function call returning a boolean.');
const DynamicStringSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    DataBindingSchema,
    // FunctionCall returning string (simplified schema for Zod, stricter in JSON Schema)
    FunctionCallSchema
]).describe('REF:common_types.json#/$defs/DynamicString|Represents a string');
const DynamicNumberSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    DataBindingSchema,
    FunctionCallSchema
]).describe('REF:common_types.json#/$defs/DynamicNumber|Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number.');
const DynamicStringListSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    DataBindingSchema,
    FunctionCallSchema
]).describe('REF:common_types.json#/$defs/DynamicStringList|Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array.');
const DynamicValueSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()),
    DataBindingSchema,
    FunctionCallSchema
]).describe('REF:common_types.json#/$defs/DynamicValue|A value that can be a literal, a path, or a function call returning any type.');
const ComponentIdSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('REF:common_types.json#/$defs/ComponentId|The unique identifier for a component.');
const ChildListSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(ComponentIdSchema).describe('A static list of child component IDs.'),
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        componentId: ComponentIdSchema,
        path: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The path to the list of component property objects in the data model.')
    }).describe('A template for generating a dynamic list of children.')
]).describe('REF:common_types.json#/$defs/ChildList');
const ActionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        event: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            name: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            context: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(DynamicValueSchema).optional()
        })
    }).describe('Triggers a server-side event.'),
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        functionCall: FunctionCallSchema
    }).describe('Executes a local client-side function.')
]).describe('REF:common_types.json#/$defs/Action');
const CheckRuleSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    condition: DynamicBooleanSchema,
    message: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The error message to display if the check fails.')
}).describe('REF:common_types.json#/$defs/CheckRule|A check rule consisting of a condition and an error message.');
const CheckableSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    checks: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CheckRuleSchema).optional().describe('A list of checks to perform.')
}).describe('REF:common_types.json#/$defs/Checkable|Properties for components that support client-side checks.');
const AccessibilityAttributesSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    label: DynamicStringSchema.optional().describe('REF:common_types.json#/$defs/DynamicString|A short string used by assistive technologies to convey the purpose of an element.'),
    description: DynamicStringSchema.optional().describe('REF:common_types.json#/$defs/DynamicString|Additional information provided by assistive technologies about an element.')
}).describe('REF:common_types.json#/$defs/AccessibilityAttributes|Attributes to enhance accessibility.');
const AnyComponentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The type name of the component.'),
    id: ComponentIdSchema.optional(),
    weight: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional()
}).passthrough().describe('A generic A2UI component definition.');
const CommonSchemas = {
    ComponentId: ComponentIdSchema,
    ChildList: ChildListSchema,
    DataBinding: DataBindingSchema,
    DynamicValue: DynamicValueSchema,
    DynamicString: DynamicStringSchema,
    DynamicNumber: DynamicNumberSchema,
    DynamicBoolean: DynamicBooleanSchema,
    DynamicStringList: DynamicStringListSchema,
    FunctionCall: FunctionCallSchema,
    CheckRule: CheckRuleSchema,
    Checkable: CheckableSchema,
    Action: ActionSchema,
    AccessibilityAttributes: AccessibilityAttributesSchema,
    AnyComponent: AnyComponentSchema
};
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/state/component-model.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComponentModel",
    ()=>ComponentModel
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/common/events.js [app-client] (ecmascript)");
;
class ComponentModel {
    /**
     * Creates a new component model.
     *
     * @param id The unique identifier for this component.
     * @param type The component type name.
     * @param initialProperties The initial properties for the component.
     */ constructor(id, type, initialProperties){
        this.id = id;
        this.type = type;
        this._onUpdated = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventEmitter"]();
        /**
         * Fires whenever the component's properties are updated.
         */ this.onUpdated = this._onUpdated;
        this._properties = initialProperties;
    }
    /**
     * The current properties of the component.
     */ get properties() {
        return this._properties;
    }
    set properties(newProperties) {
        this._properties = newProperties;
        this._onUpdated.emit(this);
    }
    /**
     * Disposes of the component and its resources.
     */ dispose() {
        this._onUpdated.dispose();
    }
    /**
     * Returns a JSON representation of the component tree.
     */ get componentTree() {
        return {
            id: this.id,
            type: this.type,
            ...this._properties
        };
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/state/data-model.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataModel",
    ()=>DataModel
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/reactivity/signals.js [app-client] (ecmascript)");
;
;
function isNumeric(value) {
    return /^\d+$/.test(value);
}
class DataModel {
    /**
     * Creates a new data model.
     *
     * @param initialData The initial data for the model. Defaults to an empty object.
     */ constructor(initialData = {}){
        this.data = {};
        this.signals = new Map();
        this.subscriptions = new Set(); // To track direct subscriptions for dispose
        this.data = initialData;
    }
    /**
     * Retrieves a Preact Signal for a specific data path.
     *
     * This provides a reactive way to access a value. If the value at the path changes via `set()`,
     * the signal will automatically be updated.
     *
     * @param path The JSON pointer path to create or retrieve a signal for.
     * @returns A Preact Signal representing the value at the specified path.
     */ getSignal(path) {
        const normalizedPath = this.normalizePath(path);
        if (!this.signals.has(normalizedPath)) {
            this.signals.set(normalizedPath, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signal"])(this.get(normalizedPath)));
        }
        return this.signals.get(normalizedPath);
    }
    /**
     * Updates the model at the specific path and notifies all relevant signals.
     * If path is '/' or empty, replaces the entire root.
     *
     * Note on `undefined` values:
     * - For objects: Setting a property to `undefined` removes the key from the object.
     * - For arrays: Setting an index to `undefined` sets that index to `undefined` but preserves the array length (sparse array).
     */ set(path, value) {
        if (path === null || path === undefined) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiDataError"]('Path cannot be null or undefined.');
        }
        if (path === '/' || path === '') {
            this.data = value;
            this.notifyAllSignals();
            return this;
        }
        const segments = this.parsePath(path);
        const lastSegment = segments.pop();
        if (!this.data) {
            this.data = {};
        }
        let current = this.data;
        for(let i = 0; i < segments.length; i++){
            const segment = segments[i];
            if (Array.isArray(current) && !isNumeric(segment)) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiDataError"](`Cannot use non-numeric segment '${segment}' on an array in path '${path}'.`, path);
            }
            // If we encounter a primitive where a container is expected, we cannot proceed.
            // We allow undefined/null to be overwritten by a new container.
            if (current[segment] !== undefined && current[segment] !== null && typeof current[segment] !== 'object') {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiDataError"](`Cannot set path '${path}': segment '${segment}' is a primitive value.`, path);
            }
            if (current[segment] === undefined || current[segment] === null) {
                const nextSegment = i < segments.length - 1 ? segments[i + 1] : lastSegment;
                current[segment] = isNumeric(nextSegment) ? [] : {};
            }
            current = current[segment];
        }
        if (Array.isArray(current) && !isNumeric(lastSegment)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiDataError"](`Cannot use non-numeric segment '${lastSegment}' on an array in path '${path}'.`, path);
        }
        if (value === undefined) {
            if (Array.isArray(current)) {
                current[parseInt(lastSegment, 10)] = undefined;
            } else {
                delete current[lastSegment];
            }
        } else {
            current[lastSegment] = value;
        }
        this.notifySignals(path);
        return this;
    }
    /**
     * Retrieves data at a specific JSON pointer path.
     *
     * @param path The JSON pointer path to read from.
     * @returns The value at the specified path, or undefined if not found.
     */ get(path) {
        if (path === null || path === undefined) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiDataError"]('Path cannot be null or undefined.');
        }
        if (path === '/' || path === '') {
            return this.data;
        }
        const segments = this.parsePath(path);
        let current = this.data;
        for (const segment of segments){
            if (current === undefined || current === null) {
                return undefined;
            }
            current = current[segment];
        }
        return current;
    }
    /**
     * Subscribes to changes at the specified data path.
     *
     * This is a backwards-compatible layer using Preact Signals internally. It allows
     * listeners to be notified whenever the value at the specified path (or any of its
     * ancestors/descendants) changes.
     *
     * @param path The JSON pointer path to observe.
     * @param onChange A callback fired whenever the value changes.
     * @returns A `DataSubscription` containing the initial value and an `unsubscribe` method.
     */ subscribe(path, onChange) {
        const sig = this.getSignal(path);
        let isSync = true;
        let currentValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["peekValue"])(sig);
        const dispose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["effect"])(()=>{
            const val = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getValue"])(sig);
            currentValue = val;
            if (!isSync) {
                onChange(val);
            }
        });
        isSync = false;
        this.subscriptions.add(dispose);
        return {
            get value () {
                return currentValue;
            },
            unsubscribe: ()=>{
                dispose();
                this.subscriptions.delete(dispose);
            }
        };
    }
    /**
     * Clears all internal subscriptions.
     */ dispose() {
        for (const dispose of this.subscriptions){
            dispose();
        }
        this.subscriptions.clear();
        this.signals.clear();
    }
    normalizePath(path) {
        if (path.length > 1 && path.endsWith('/')) {
            return path.slice(0, -1);
        }
        return path || '/';
    }
    parsePath(path) {
        return path.split('/').filter((p)=>p.length > 0).map((p)=>p.replace(/~([01])/g, (_, g)=>g === '1' ? '/' : '~'));
    }
    notifySignals(path) {
        const normalizedPath = this.normalizePath(path);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["batchWrite"])(()=>{
            this.updateSignal(normalizedPath);
            // Notify Ancestors
            let parentPath = normalizedPath;
            while(parentPath !== '/' && parentPath !== ''){
                parentPath = parentPath.substring(0, parentPath.lastIndexOf('/')) || '/';
                this.updateSignal(parentPath);
            }
            // Notify Descendants
            for (const subPath of this.signals.keys()){
                if (this.isDescendant(subPath, normalizedPath)) {
                    this.updateSignal(subPath);
                }
            }
        });
    }
    updateSignal(path) {
        const sig = this.signals.get(path);
        if (sig) {
            const val = this.get(path);
            if (Array.isArray(val)) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(sig, [
                    ...val
                ]);
            } else if (typeof val === 'object' && val !== null) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(sig, {
                    ...val
                });
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setValue"])(sig, val);
            }
        }
    }
    notifyAllSignals() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$reactivity$2f$signals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["batchWrite"])(()=>{
            for (const path of this.signals.keys()){
                this.updateSignal(path);
            }
        });
    }
    isDescendant(childPath, parentPath) {
        if (parentPath === '/' || parentPath === '') {
            return childPath !== '/';
        }
        return childPath.startsWith(parentPath + '/');
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/state/surface-components-model.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SurfaceComponentsModel",
    ()=>SurfaceComponentsModel
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/common/events.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/errors.js [app-client] (ecmascript)");
;
;
class SurfaceComponentsModel {
    constructor(){
        this.components = new Map();
        this._onCreated = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventEmitter"]();
        this._onDeleted = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventEmitter"]();
        /** Fires when a new component is added to the model. */ this.onCreated = this._onCreated;
        /** Fires when a component is removed, providing the ID of the deleted component. */ this.onDeleted = this._onDeleted;
    }
    /**
     * Retrieves a component by its ID.
     *
     *
     * @param id The ID of the component to retrieve.
     * @returns The component model, or undefined if not found.
     */ get(id) {
        return this.components.get(id);
    }
    /**
     * Returns an iterator over the components in the model.
     */ get entries() {
        return this.components.entries();
    }
    /**
     * Adds a component to the model.
     * Throws an error if a component with the same ID already exists.
     *
     * @param component The component to add.
     */ addComponent(component) {
        if (this.components.has(component.id)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiStateError"](`Component with id '${component.id}' already exists.`);
        }
        this.components.set(component.id, component);
        this._onCreated.emit(component);
    }
    /**
     * Removes a component from the model by its ID.
     * Disposes of the component upon removal.
     *
     * @param id The ID of the component to remove.
     */ removeComponent(id) {
        const component = this.components.get(id);
        if (component) {
            this.components.delete(id);
            component.dispose();
            this._onDeleted.emit(id);
        }
    }
    /**
     * Disposes of the model and all its components.
     */ dispose() {
        for (const component of this.components.values()){
            component.dispose();
        }
        this.components.clear();
        this._onCreated.dispose();
        this._onDeleted.dispose();
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/state/surface-group-model.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SurfaceGroupModel",
    ()=>SurfaceGroupModel
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/common/events.js [app-client] (ecmascript)");
;
class SurfaceGroupModel {
    constructor(){
        this.surfaces = new Map();
        this.surfaceUnsubscribers = new Map();
        this._onSurfaceCreated = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventEmitter"]();
        this._onSurfaceDeleted = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventEmitter"]();
        this._onAction = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventEmitter"]();
        /** Fires when a new surface is added. */ this.onSurfaceCreated = this._onSurfaceCreated;
        /** Fires when a surface is removed. */ this.onSurfaceDeleted = this._onSurfaceDeleted;
        /** Fires when an action is dispatched from ANY surface in the group. */ this.onAction = this._onAction;
    }
    /**
     * Adds a surface to the group.
     * Ignores if a surface with the same ID already exists.
     *
     * @param surface The surface model to add.
     */ addSurface(surface) {
        if (this.surfaces.has(surface.id)) {
            console.warn(`Surface ${surface.id} already exists. Ignoring.`);
            return;
        }
        this.surfaces.set(surface.id, surface);
        // Subscribe to surface actions and propagate
        const sub = surface.onAction.subscribe((action)=>this._onAction.emit(action));
        this.surfaceUnsubscribers.set(surface.id, sub);
        this._onSurfaceCreated.emit(surface);
    }
    /**
     * Removes a surface from the group by its ID.
     * Disposes of the surface upon removal.
     *
     * @param id The ID of the surface to remove.
     */ deleteSurface(id) {
        const surface = this.surfaces.get(id);
        if (surface) {
            const sub = this.surfaceUnsubscribers.get(id);
            if (sub) {
                sub.unsubscribe();
                this.surfaceUnsubscribers.delete(id);
            }
            this.surfaces.delete(id);
            surface.dispose();
            this._onSurfaceDeleted.emit(id);
        }
    }
    /**
     * Retrieves a surface by its ID.
     *
     *
     * @param id The ID of the surface to retrieve.
     * @returns The surface model, or undefined if not found.
     */ getSurface(id) {
        return this.surfaces.get(id);
    }
    /**
     * Returns a readonly map of all active surfaces.
     */ get surfacesMap() {
        return this.surfaces;
    }
    /**
     * Disposes of the group and all its surfaces.
     */ dispose() {
        for (const id of Array.from(this.surfaces.keys())){
            this.deleteSurface(id);
        }
        this._onSurfaceCreated.dispose();
        this._onSurfaceDeleted.dispose();
        this._onAction.dispose();
    }
}
}),
"[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/state/surface-model.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SurfaceModel",
    ()=>SurfaceModel
]);
/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$data$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/state/data-model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$surface$2d$components$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/state/surface-components-model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/common/events.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$client$2d$to$2d$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@a2ui/web_core/src/v0_9/schema/client-to-server.js [app-client] (ecmascript)");
;
;
;
;
class SurfaceModel {
    /**
     * Creates a new surface model.
     *
     * @param id The unique identifier for this surface.
     * @param catalog The component catalog used by this surface.
     * @param theme The theme to apply to this surface.
     * @param sendDataModel If true, the client will send the full data model.
     */ constructor(id, catalog, theme = {}, sendDataModel = false){
        this.id = id;
        this.catalog = catalog;
        this.theme = theme;
        this.sendDataModel = sendDataModel;
        this._onAction = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventEmitter"]();
        this._onError = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$common$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventEmitter"]();
        /** Fires whenever an action is dispatched from this surface. */ this.onAction = this._onAction;
        /** Fires whenever an error occurs on this surface. */ this.onError = this._onError;
        this.dataModel = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$data$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataModel"]({});
        this.componentsModel = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$state$2f$surface$2d$components$2d$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SurfaceComponentsModel"]();
    }
    /**
     * Dispatches an action from this surface to listeners.
     *
     * @param payload The action payload (name and context) to dispatch.
     * @param sourceComponentId The ID of the component that triggered the action.
     */ async dispatchAction(payload, sourceComponentId) {
        if (payload && typeof payload === 'object' && 'event' in payload && payload.event) {
            const actionToValidate = {
                name: payload.event.name,
                surfaceId: this.id,
                sourceComponentId,
                timestamp: new Date().toISOString(),
                context: payload.event.context || {}
            };
            const validationResult = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$a2ui$2f$web_core$2f$src$2f$v0_9$2f$schema$2f$client$2d$to$2d$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A2uiClientActionSchema"].safeParse(actionToValidate);
            if (validationResult.success) {
                await this._onAction.emit(validationResult.data);
            } else {
                console.error('A2UI: Invalid action payload dispatched.', validationResult.error.format());
            }
        }
    // Note: local functionCall actions are currently handled by the renderer or binder
    // and do not necessarily need to be emitted here if they are not intended for the server.
    }
    /**
     * Dispatches an error from this surface to listeners.
     *
     * @param error The error object to dispatch, conforming to client_to_server schema.
     */ async dispatchError(error) {
        await this._onError.emit({
            ...error,
            surfaceId: this.id
        });
    }
    /**
     * Disposes of the surface and its resources.
     */ dispose() {
        this.dataModel.dispose();
        this.componentsModel.dispose();
        this._onAction.dispose();
        this._onError.dispose();
    }
}
}),
]);

//# sourceMappingURL=19xk_%40a2ui_web_core_src_v0_9_09rf9bz._.js.map