import axios from 'axios';
import _ from 'lodash';

import rssParser from './rssParser.js';

const update = (state) => {
  const { feedUrlList } = state;

  const updatePromises = feedUrlList.map((feed) => {
    const currentFeedPosts = state.posts.filter((post) => post.feedId === feed.feedId);
    const maxPostPubDate = _.maxBy(currentFeedPosts, 'pubDate').pubDate;

    const url = new URL('https://allorigins.hexlet.app/get');
    url.searchParams.set('disableCache', 'true');
    url.searchParams.set('url', feed.url);

    return axios.get(url.toString())
      .then((response) => ({ feedId: feed.feedId, maxPostPubDate, response }));
  });

  Promise.all(updatePromises).then((results) => {
    results.forEach(({ feedId, maxPostPubDate, response }) => {
      const { posts } = rssParser(response.data.contents);
      const newPosts = posts.filter((post) => post.pubDate > maxPostPubDate);
      const newPostsWithId = newPosts.map((post) => ({ ...post, feedId, id: _.uniqueId('post_') }));

      if (newPostsWithId.length > 0) {
        state.unreadPosts.push(...newPostsWithId.map((post) => post.id));
        state.posts.push(...newPostsWithId);
      }
    });

    setTimeout(() => update(state), 5000);
  });
};

export default update;
