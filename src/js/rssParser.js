import _ from 'lodash';

export default (content) => {
  const domParser = new DOMParser();
  const rss = domParser.parseFromString(
    content,
    'application/xml',
  ).firstElementChild;

  const rssVersion = rss.getAttribute('version');

  if (rssVersion !== '2.0') {
    throw new Error('Wrong rss version');
  }

  const channel = rss.querySelector('channel');

  const feed = {
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
  };

  const items = channel.querySelectorAll('item');

  const posts = [];
  items.forEach((item) => {
    const post = {
      id: _.uniqueId('post_'),
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      pubDate: new Date(item.querySelector('pubDate').textContent),
    };
    posts.push(post);
  });

  return {
    feed,
    posts,
  };
};
