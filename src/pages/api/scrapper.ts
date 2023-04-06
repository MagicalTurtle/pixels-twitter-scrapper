import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { TwitterApi } from 'twitter-api-v2';

// Instantiate with desired auth type (here's Bearer v2 auth)
const api = new TwitterApi(process.env.TWITTER_BEARER_TOKEN as string);

const client = api.readOnly;

const jsonStoreUrl = 'https://api.npoint.io/7d68630b64c84d863d33/';

const getLastTweetId = () => {
  return fetch(jsonStoreUrl)
    .then(async (res) => {
      if (!res.ok) return '';
      const json = (await res.json()) as any;
      return json.lastTweetId;
    })
    .catch((e) => {
      console.error(e);
      return '';
    });
};

const storeLastTweetId = (lastTweetId: string) => {
  return fetch(jsonStoreUrl, {
    method: 'POST',
    headers: {
      contentType: 'application/json',
    },
    body: JSON.stringify({
      lastTweetId,
    }),
  }).catch(console.error);
};

export default async function scrapper(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if (req.method !== 'POST') {
  //   res.status(405).send({ message: 'Only POST requests allowed' });
  //   return;
  // }

  try {
    const lastTweetId = await getLastTweetId();

    const replies = await client.v2.search(
      `(to:pixels_online is:reply) OR #wenpixel`,
      {
        sort_order: 'recency',
        since_id: lastTweetId ? lastTweetId : undefined,
        max_results: 100,
        'tweet.fields': ['author_id', 'created_at', 'in_reply_to_user_id'],
      }
    );

    await replies.fetchLast(1000);

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

    // Store the last tweet id
    if (replies.tweets.length > 0) {
      await storeLastTweetId(replies.tweets.at(0)?.id ?? '');
    }

    res.status(200).json({ success: true, data: replies.tweets });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message });
  }
}
