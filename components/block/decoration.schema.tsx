import { ArrayItemPreviewIndicator } from "../../studio/components/ArrayItemPreviewIndicator";
import {
  DecorationPositionInput,
  DecorationPositionInputWrapper,
} from "../../studio/components/Decorations/DecorationPositionInput";
import { optionsToList } from "../../studio/utils/fields/optionsToList";
import { DECORATION_OPTIONS } from "./decoration.options";
import { defineField } from "sanity";

export const decorations = defineField({
  name: "decorations",
  title: "Decorations",
  type: "array",
  of: [
    {
      type: "object",
      components: {
        item: ArrayItemPreviewIndicator,
      },
      preview: {
        select: {
          title: "title",
          mobile: "mobile",
          mobileImage: "mobile.image",
          mobileHTML: "mobile.html",
          tablet: "tablet",
          tabletImage: "tablet.image",
          tabletHTML: "tablet.html",
          desktop: "desktop",
          desktopImage: "desktop.image",
          desktopHTML: "desktop.html",
        },
        prepare({
          title,
          mobile = {},
          tablet = {},
          desktop = {},
          mobileImage,
          tabletImage,
          desktopImage,
          mobileHTML,
          tabletHTML,
          desktopHTML,
        }) {
          const isImage = Boolean(mobileImage || tabletImage || desktopImage);
          const isHTML = Boolean(mobileHTML || tabletHTML || desktopHTML);

          return {
            title:
              title ||
              (isImage && "Image") ||
              (isHTML && "HTML") ||
              "Decoration",
            media: mobileImage || tabletImage || desktopImage || (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor:
                    mobile?.background ||
                    tablet?.background ||
                    desktop?.background,
                }}
              />
            ),
          };
        },
      },
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          description:
            "A descriptive title for this decoration, used in the CMS.",
        }),
        defineField({
          name: "position",
          title: "Position",
          type: "string",
          options: {
            list: optionsToList(DECORATION_OPTIONS),
          },
          description: "Position the decoration inside or outside the block.",
        }),
        defineField({
          name: "breakout",
          title: "Breakout",
          type: "boolean",
          description:
            "Stay inside the border radius of the block or allow the decoration to break outside.",
          hidden: ({ parent, value }) =>
            !value && Boolean(parent?.position !== "inside"),
        }),
        defineField({
          name: "mobile",
          title: "Mobile",
          type: "decoration",
          description:
            'The base decoration, used on "mobile" breakpoints and higher.',
        }),
        defineField({
          name: "tablet",
          title: "Tablet",
          type: "decoration",
          options: { collapsible: true, collapsed: true },
          description:
            'Override the base decoration for "tablet" breakpoints and higher.',
        }),
        defineField({
          name: "desktop",
          title: "Desktop",
          type: "decoration",
          options: { collapsible: true, collapsed: true },
          description:
            'Override the base decoration for "desktop" breakpoints and higher.',
        }),
      ],
    },
  ],
});

export const decoration = defineField({
  name: "decoration",
  title: "Decoration",
  type: "object",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "position", title: "Position" },
    { name: "style", title: "Style" },
  ],
  fields: [
    defineField({
      name: "hidden",
      type: "boolean",
      description: "Hide this decoration on this breakpoint.",
      group: ["style", "position", "content"],
    }),
    ...["width", "height", "top", "right", "bottom", "left"].map((name) =>
      defineField({
        name,
        type: "string",
        description: `Use % or px. Use 'auto' to unset.`,
        group: "position",
        components: {
          input: DecorationPositionInput,
          field: DecorationPositionInputWrapper,
        },
      }),
    ),
    defineField({
      name: "background",
      type: "string",
      description: "Hex color code for the background of the decoration.",
      group: "style",
    }),
    defineField({
      name: "opacity",
      type: "number",
      description:
        "Number between 0 and 1 setting the opacity of the decoration.",
      group: "style",
    }),
    defineField({
      name: "image",
      type: "image",
      description: "Use an image as decoration",
      group: "content",
      hidden: ({ parent, value }) => !value && Boolean(parent?.html),
    }),
    defineField({
      name: "html",
      type: "text",
      description:
        "Use raw HTML. All potentially dangerous tags will be stripped.",
      rows: 4,
      group: "content",
      hidden: ({ parent, value }) => !value && Boolean(parent?.image),
    }),
  ],
});
