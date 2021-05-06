/* eslint no-param-reassign: ["error", { "props": false }] */
import axios from 'axios';
import _ from 'lodash';
import parseFeed from './parse.js';

export default (watchedState, state) => {
  setTimeout(function getData() {
    state.feeds.forEach((feed) => {
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(feed.url)}&disableCache=true`)
        .then((response) => {
          const parsedFeed = parseFeed(response.data.contents, feed.url, feed.idFeed);
          const postsNew = parsedFeed.postsParsed;
          const posts = _.flatten(state.posts).filter((post) => post.idFeed === feed.idFeed);
          const result = postsNew.filter((elm) => {
            const a = !posts.map((elm1) => elm1.title.trim()).includes(elm.title.trim());
            return a;
          });
          watchedState.posts.push(result);
        });
      setTimeout(getData, 5000);
    });
  }, 5000);
};
