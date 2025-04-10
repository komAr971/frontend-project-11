import axios from 'axios';
import _ from 'lodash';

import rssParser from './rssParser.js';

const update = (state) => {
  const { feedUrlList } = state;
  feedUrlList.forEach(({ feedId, url }) => {
    const maxPostPubDate = _.maxBy(
      state.posts.filter((post) => post.feedId === feedId),
      'pubDate',
    ).pubDate;

    axios
      .get(
        `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`,
      )
      .then((result) => {
        const { posts } = rssParser(result.data.contents);
        const newPosts = posts.filter((post) => post.pubDate > maxPostPubDate);
        const newPostWithFeedId = newPosts.map((post) => ({ ...post, feedId }));
        
        if (newPostWithFeedId.length > 0) {
          state.unreadPosts.push(...newPostWithFeedId.map((post) => post.id));
          state.posts.push(...newPostWithFeedId);
        }
      });
  });
  setTimeout(() => update(state), 5000);
};

export default update;
