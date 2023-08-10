import { sanityClient } from "../sanity-client";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message?: string;
  changedBlockKey?: string;
};

export type ApiBody = {
  id: string;
  blocks: any;
  changedBlockKey: string;
  replacesBlockKey: string;
  newBlocksOrder: string[];
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: string;
}

const handler = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>,
) => {
  if (req.method !== "POST") return res.status(405).end();

  const { id, changedBlockKey, replacesBlockKey, newBlocksOrder }: ApiBody =
    JSON.parse(JSON.stringify(req.body));

  console.log(JSON.parse(JSON.stringify(req.body)));

  // https://nextjs.org/docs/advanced-features/preview-mode#works-with-api-routes
  if (!req.preview) {
    return res.status(400).json({ message: `Not in preview mode` });
  }

  if (!id) {
    return res.status(400).json({ message: `No page id` });
  }

  if (!changedBlockKey || !newBlocksOrder) {
    return res.status(400).json({ message: `No blocks to patch` });
  }

  const blockData = await sanityClient.fetch(`
  *[_id == "${id}"] { 
    "block": blocks[_key == "${changedBlockKey}"][0] 
  }[0].block`);

  if (!blockData) {
    return res.status(400).json({ message: `Failed to fetch block data` });
  }

  const position =
    newBlocksOrder.indexOf(changedBlockKey) >
    newBlocksOrder.indexOf(replacesBlockKey)
      ? "before"
      : "after";

  console.log(changedBlockKey, position, replacesBlockKey);

  blockData._key = nanoid();

  await sanityClient
    .patch(id)
    .unset([`blocks[_key=="${changedBlockKey}"]`])
    .insert(position, `blocks[_key=="${replacesBlockKey}"]`, [blockData])
    .commit({
      autoGenerateArrayKeys: false,
    });

  return res.status(200).json({
    message: `Successfully patched blocks for ${id}`,
    changedBlockKey: blockData._key,
  });
};
