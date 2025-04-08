import axios from "axios";
import _ from 'lodash';

import rssParser from "./rssParser.js";

const update = (state) => {
  const feedUrlList = state.feedUrlList;
  feedUrlList.forEach(({feedId, url}) => {
    const maxPostPubDate = _.maxBy(state.posts.filter((post) => post.feedId === feedId), 'pubDate').pubDate;

    axios.get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`,
    ).then((result) => {
      const { posts } = rssParser(result.data.contents);
      console.log(posts);
      const newPosts = posts.filter((post) => post.pubDate > maxPostPubDate)
      newPosts.forEach((post) => {
        post.feedId = feedId;
      })
      console.log(newPosts);
      if (newPosts.length > 0) {
        state.posts.push(...newPosts);
      }
    })
  })
  setTimeout(() => update(state), 5000);
};

export default update;