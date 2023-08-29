import {
  defaultBlockTheme,
  defaultBlockGroups,
} from "../../components/block/block.schema";
import { defaultTextTheme } from "../../components/text/text.schema";
import { defaultTitleTheme } from "../../components/title/title.schema";
import { defaultBlockTools } from "../../studio/schemas/objects/tools";
import { optionsToList } from "../../studio/utils/fields/optionsToList";
import { COLUMN_OPTIONS, GAP_OPTIONS } from "./block18.options";
import { Grid } from "@vectopus/atlas-icons-react";
import React from "react";
import { defineField, defineType } from "sanity";

const schema = defineType({
  name: "block.block18",
  title: "Card grid",
  type: "object",
  icon: () => <Grid weight="thin" />,
  description: "Flexible grid or slider with styleable cards.",
  preview: {
    select: {
      title: "title",
    },
    prepare({ title = "Card grid" }: any) {
      return {
        title: title,
      };
    },
  },
  groups: defaultBlockGroups,
  fields: [
    ...defaultBlockTools,
    defineField({
      name: "title",
      title: "Title",
      type: "text",
      rows: 2,
      group: "content",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "portabletext.full",
      group: "content",
    }),

    defineField({
      name: "buttons",
      title: "Buttons",
      type: "buttongroup",
      group: "content",
    }),
    defineField({
      name: "items",
      title: "Cards",
      type: "array",
      description: "One or more cards",
      group: ["content"],
      of: [{ type: "card.composable" }, { type: "card.testimonial" }],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "portabletext.full",
      group: "content",
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "object",
      group: "theme",
      fields: [
        defaultBlockTheme,
        defineField({
          name: "grid",
          type: "styles",
          title: "Grid",
          options: {
            fields: [
              defineField({
                name: "columns",
                type: "select",
                options: {
                  list: optionsToList(COLUMN_OPTIONS),
                },
              }),
              defineField({
                name: "gapHorizontal",
                type: "select",
                options: {
                  list: optionsToList(GAP_OPTIONS),
                },
              }),
              defineField({
                name: "gapVertical",
                type: "select",
                options: {
                  list: optionsToList(GAP_OPTIONS),
                },
              }),
            ],
          },
        }),
        defaultTitleTheme,
        defaultTextTheme,
        { ...defaultTextTheme, name: "footer", title: "Footer" },
        defineField({
          name: "slider",
          type: "styles",
          title: "Slider",
          options: {
            fields: [
              defineField({
                name: "mobile",
                type: "boolean",
              }),
              defineField({
                name: "desktop",
                type: "boolean",
              }),
              defineField({
                name: "color",
                type: "color",
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "decorations",
      title: "Decorations",
      type: "decorations",
      group: "decorations",
    }),
  ],
});

export default schema;