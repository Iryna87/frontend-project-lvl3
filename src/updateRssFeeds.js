/* eslint no-param-reassign: ["error", { "props": false }] */
import _ from 'lodash';
import axios from 'axios';
import parseFeed from './parse.js';
import proxifyURL from './proxifyURL.js';

const compare = (item) => item.title;

export default (watchedState) => {
  const getData = () => {
    const promises = watchedState.feeds.map((feed) => axios.get(proxifyURL(feed.url))
      .then((response) => {
        const feedData = parseFeed(response.data.contents);
        const postsNew = feedData.posts;
        const { idFeed } = feed;
        const posts = watchedState.posts.filter((post) => post.idFeed === idFeed);
        const postsToAdd = _.differenceBy(postsNew, posts, compare);
        if (postsToAdd.length !== 0) {
          watchedState.posts.unshift(...postsToAdd.map((post) => (
            { ...post, idPost: _.uniqueId(), idFeed }
          )));
        }
        return null;
      })
      .catch((err) => {
        console.log(err);
      }));
    return Promise.all(promises).then(() => setTimeout(getData, 5000));
  };
  setTimeout(getData, 5000);
};
