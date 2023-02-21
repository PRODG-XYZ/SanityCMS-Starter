import { AnswersType } from ".";
import { prettierFile } from "../utils/prettier-file";
import { formatName } from "./format-name";
import { getStorySnippet } from "./templates/story";

/**
 * Create the schema file
 */
const fs = require("fs");
const path = require("path");

export function createStory(
  answers: Pick<AnswersType, "moduleName" | "fields">,
  WRITE = false,
) {
  let { moduleName, fields } = answers;
  let { lowerName, pascalName } = formatName(moduleName);
  const filePath = `${__dirname}/../../modules/${lowerName}/${lowerName}.stories.tsx`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const lines = getStorySnippet({ pascalName, fields });

  if (WRITE) {
    fs.writeFileSync(filePath, lines);
    prettierFile(filePath);
  }

  return lines;
}
