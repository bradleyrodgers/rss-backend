const express = require('express');
const RSSParser = require('rss-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const parser = new RSSParser();

app.use(cors());

app.get('/feed', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Missing RSS feed URL' });
  }

  try {
    const feed = await parser.parseURL(url);
    const items = feed.items.map(item => ({
      title: item.title,
      pubDate: item.pubDate,
      link: item.link,
      description: item.contentSnippet || item.content || '',
      sourceTitle: feed.title
    }));

    res.json(items);
  } catch (err) {
    console.error('Error fetching RSS:', err.message);
    res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
});

app.listen(PORT, () => {
  console.log(`RSS fetcher running at http://localhost:${PORT}`);
});