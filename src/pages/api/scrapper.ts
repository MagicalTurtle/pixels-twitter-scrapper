import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { TwitterApi } from 'twitter-api-v2';

// Instantiate with desired auth type (here's Bearer v2 auth)
const api = new TwitterApi(process.env.TWITTER_BEARER_TOKEN as string);

const client = api.readOnly;

export default async function scrapper(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  try {
    const replies = await client.v2.search(
      `(to:pixels_online is:reply) OR #wenpixel`,
      {
        sort_order: 'recency',
        max_results: 100,
        'tweet.fields': ['author_id', 'created_at', 'in_reply_to_user_id'],
      }
    );

    await replies.fetchLast(500);

    // const url = "https://pixels-data.xyz/wen";
    const url = 'https://642e67f18ca0fe3352cec88f.mockapi.io/wen';
    const post = await fetch(url, {
      method: 'POST',
      headers: {
        contentType: 'application/json',
      },
      body: JSON.stringify(
        replies.tweets.map((t) => ({
          id: t.id,
          tweetId: t.id,
          authorId: t.author_id,
        }))
      ),
    });

    if (!post.ok) {
      throw new Error(post.statusText);
    }

    res.status(200).json({ success: true, data: replies.tweets });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message });
  }
}
