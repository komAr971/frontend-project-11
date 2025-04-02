export default (content) => {
  const domParser = new DOMParser();
  const rss = domParser.parseFromString(content, 'application/xml').firstElementChild

  const rssVersion = rss.getAttribute('version');

  if (rssVersion !== '2.0') {
    throw "Wrong rss version"
  }

  const channel = rss.querySelector('channel');
  
  const feedTitle = channel.querySelector('title');
  const feedDescription = channel.querySelector('description');

  const feed = {
    title: feedTitle.textContent,
    description: feedDescription.textContent,
  }

  return {
    feed: feed,
    posts: [1, 2, 3, 4, 5]
  }
}