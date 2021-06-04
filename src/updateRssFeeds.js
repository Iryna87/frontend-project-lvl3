/* eslint no-param-reassign: ["error", { "props": false }] */
import axios from 'axios';
import _ from 'lodash';
import parseFeed from './parse.js';
import proxifyURL from './proxifyURL.js';

export default (watchedState) => {
  const getData = () => {
    const promises = watchedState.feeds.map((feed) => axios.get(proxifyURL(feed.url))
      .then((response) => {
        const parsedFeed = parseFeed(response.data.contents);
        const postsNew = parsedFeed.postsParsed;
        const posts = _.flatten(watchedState.posts).filter((post) => post.idFeed === feed.idFeed);
        const result = postsNew.filter((elm) => {
          const a = !posts.map((elm1) => elm1.title.trim()).includes(elm.title.trim());
          return a;
        });
        if (result.length !== 0) {
          watchedState.posts.unshift(result);
        }
        return null;
      }));
    return Promise.all(promises).then(() => setTimeout(getData, 5000));
  };
  setTimeout(getData, 5000);
};
