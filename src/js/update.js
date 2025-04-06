import axios from "axios";

import rssParser from "./rssParser.js";

const update = (state) => {
  const feedUrlList = state.feedUrlList;
  feedUrlList.forEach((url) => {
    axios.get(
      `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`,
    ).then((result) => {
      const { feed, posts } = rssParser(result.data.contents);
      console.log(feed);
      console.log(posts);
    })
  })
  setTimeout(() => update(state), 5000);
};

export default update;