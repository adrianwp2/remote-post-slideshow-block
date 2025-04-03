const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor;
const {
    PanelBody,
    ToggleControl,
    TextControl,
    RangeControl,
    SelectControl,
    ColorPalette,
} = wp.components;
const el = wp.element.createElement;

const colors = [
    { name: "Black", color: "#000000" },
    { name: "White", color: "#ffffff" },
    { name: "Gray", color: "#888888" },
    { name: "Blue", color: "#0073aa" },
    { name: "Red", color: "#ff0000" },
];

function MarginControls(label, key, attributes, setAttributes) {
    return el(
        PanelBody,
        { title: label + " Margin", initialOpen: false },
        ["top", "right", "bottom", "left"].map((side) =>
            el(RangeControl, {
                label: side.charAt(0).toUpperCase() + side.slice(1),
                value: attributes[key]?.[side] || 0,
                min: 0,
                max: 100,
                onChange: (value) =>
                    setAttributes({
                        [key]: { ...attributes[key], [side]: value },
                    }),
            })
        )
    );
}

registerBlockType("custom/slideshow-block", {
    title: "Remote Post Slideshow Block",
    icon: "format-gallery",
    category: "widgets",
    attributes: {
        siteUrl: { type: "string", default: "https://wptavern.com" },
        showDate: { type: "boolean", default: true },
        showAuthor: { type: "boolean", default: true },
        autoScroll: { type: "boolean", default: false },
        interval: { type: "number", default: 5 },

        borderStyle: { type: "string", default: "solid" },
        borderColor: { type: "string", default: "#000000" },
        borderWidth: { type: "number", default: 1 },
        borderRadius: { type: "number", default: 10 },
        backgroundColor: { type: "string", default: "#ffffff" },
        contentPadding: { type: "number", default: 10 },

        titleColor: { type: "string", default: "#000000" },
        titleAlign: { type: "string", default: "left" },
        titleSize: { type: "number", default: 18 },
        titleMargin: {
            type: "object",
            default: { top: 0, right: 0, bottom: 0, left: 0 },
        },

        authorColor: { type: "string", default: "#333333" },
        authorAlign: { type: "string", default: "left" },
        authorSize: { type: "number", default: 14 },
        authorMargin: {
            type: "object",
            default: { top: 0, right: 0, bottom: 0, left: 0 },
        },

        dateColor: { type: "string", default: "#666666" },
        dateAlign: { type: "string", default: "left" },
        dateSize: { type: "number", default: 14 },
        dateMargin: {
            type: "object",
            default: { top: 0, right: 0, bottom: 0, left: 0 },
        },
    },
    edit: function (props) {
        const { attributes, setAttributes } = props;

        return el(
            wp.element.Fragment,
            {},
            el(
                InspectorControls,
                {},
                el(
                    PanelBody,
                    { title: "Slideshow Settings", initialOpen: true },
                    el(TextControl, {
                        label: "Source Site URL",
                        value: attributes.siteUrl,
                        onChange: (value) => setAttributes({ siteUrl: value }),
                    }),
                    el(ToggleControl, {
                        label: "Show Date Published",
                        checked: attributes.showDate,
                        onChange: (value) => setAttributes({ showDate: value }),
                    }),
                    el(ToggleControl, {
                        label: "Show Author",
                        checked: attributes.showAuthor,
                        onChange: (value) =>
                            setAttributes({ showAuthor: value }),
                    }),
                    el(ToggleControl, {
                        label: "Auto Scroll",
                        checked: attributes.autoScroll,
                        onChange: (value) =>
                            setAttributes({ autoScroll: value }),
                    }),
                    attributes.autoScroll &&
                        el(RangeControl, {
                            label: "Autoplay Interval (seconds)",
                            value: attributes.interval,
                            onChange: (value) =>
                                setAttributes({ interval: value }),
                            min: 1,
                            max: 10,
                        })
                ),

                el(
                    PanelBody,
                    { title: "Slide Style", initialOpen: false },
                    el(SelectControl, {
                        label: "Border Style",
                        value: attributes.borderStyle,
                        options: [
                            { label: "Solid", value: "solid" },
                            { label: "Dashed", value: "dashed" },
                            { label: "Dotted", value: "dotted" },
                            { label: "None", value: "none" },
                        ],
                        onChange: (value) =>
                            setAttributes({ borderStyle: value }),
                    }),
                    el(RangeControl, {
                        label: "Border Width (px)",
                        value: attributes.borderWidth,
                        onChange: (value) =>
                            setAttributes({ borderWidth: value }),
                        min: 0,
                        max: 10,
                    }),
                    el(RangeControl, {
                        label: "Border Radius (px)",
                        value: attributes.borderRadius,
                        onChange: (value) =>
                            setAttributes({ borderRadius: value }),
                        min: 0,
                        max: 50,
                    }),
                    el(
                        wp.components.BaseControl,
                        {
                            label: "Border Color",
                        },
                        el(ColorPalette, {
                            colors,
                            value: attributes.borderColor,
                            onChange: (value) =>
                                setAttributes({ borderColor: value }),
                        })
                    ),
                    el(
                        wp.components.BaseControl,
                        {
                            label: "Background Color",
                        },
                        el(ColorPalette, {
                            colors,
                            value: attributes.backgroundColor,
                            onChange: (value) =>
                                setAttributes({ backgroundColor: value }),
                        })
                    ),

                    el(RangeControl, {
                        label: "Content Padding",
                        help: "Padding inside the meta wrapper (title, author, date).",
                        value: attributes.contentPadding,
                        onChange: (value) =>
                            setAttributes({ contentPadding: value }),
                        min: 0,
                        max: 50,
                    })
                ),

                el(
                    PanelBody,
                    { title: "Meta Data Typography", initialOpen: false },

                    el("h4", {}, "Title Settings"),
                    el(ColorPalette, {
                        label: "Title Color",
                        colors,
                        value: attributes.titleColor,
                        onChange: (value) =>
                            setAttributes({ titleColor: value }),
                    }),
                    el(SelectControl, {
                        label: "Title Alignment",
                        value: attributes.titleAlign,
                        options: [
                            { label: "Left", value: "left" },
                            { label: "Center", value: "center" },
                            { label: "Right", value: "right" },
                        ],
                        onChange: (value) =>
                            setAttributes({ titleAlign: value }),
                    }),
                    el(RangeControl, {
                        label: "Title Font Size (px)",
                        value: attributes.titleSize,
                        onChange: (value) =>
                            setAttributes({ titleSize: value }),
                        min: 10,
                        max: 50,
                    }),

                    el("h4", {}, "Author Settings"),
                    el(ColorPalette, {
                        label: "Author Color",
                        colors,
                        value: attributes.authorColor,
                        onChange: (value) =>
                            setAttributes({ authorColor: value }),
                    }),
                    el(SelectControl, {
                        label: "Author Alignment",
                        value: attributes.authorAlign,
                        options: [
                            { label: "Left", value: "left" },
                            { label: "Center", value: "center" },
                            { label: "Right", value: "right" },
                        ],
                        onChange: (value) =>
                            setAttributes({ authorAlign: value }),
                    }),
                    el(RangeControl, {
                        label: "Author Font Size (px)",
                        value: attributes.authorSize,
                        onChange: (value) =>
                            setAttributes({ authorSize: value }),
                        min: 10,
                        max: 50,
                    }),

                    el("h4", {}, "Date Settings"),
                    el(ColorPalette, {
                        label: "Date Color",
                        colors,
                        value: attributes.dateColor,
                        onChange: (value) =>
                            setAttributes({ dateColor: value }),
                    }),
                    el(SelectControl, {
                        label: "Date Alignment",
                        value: attributes.dateAlign,
                        options: [
                            { label: "Left", value: "left" },
                            { label: "Center", value: "center" },
                            { label: "Right", value: "right" },
                        ],
                        onChange: (value) =>
                            setAttributes({ dateAlign: value }),
                    }),
                    el(RangeControl, {
                        label: "Date Font Size (px)",
                        value: attributes.dateSize,
                        onChange: (value) => setAttributes({ dateSize: value }),
                        min: 10,
                        max: 50,
                    })
                ),

                MarginControls(
                    "Title",
                    "titleMargin",
                    attributes,
                    setAttributes
                ),
                MarginControls(
                    "Author",
                    "authorMargin",
                    attributes,
                    setAttributes
                ),
                MarginControls("Date", "dateMargin", attributes, setAttributes)
            ),
            el("p", {}, "Slideshow Preview will appear on the frontend.")
        );
    },
    save: function () {
        return null;
    },
});
