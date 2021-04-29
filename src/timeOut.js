/* eslint no-param-reassign: ["error", { "props": false }] */
import axios from 'axios';
import _ from 'lodash';
import parseFeed from './parse.js';

export default (watchedState, state) => {
  setTimeout(function getData() {
    state.feeds.forEach((feed) => {
      watchedState.loadingProcess.status = 'loading';
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(feed.url)}&disableCache=true`)
        .then((response) => {
          watchedState.loadingProcess.status = 'finished';
          const parsedFeed = parseFeed(response.data.contents, feed.url, feed.idFeed);
          if (_.isEmpty(parsedFeed)) {
            watchedState.loadingProcess.error = 'key8';
          } else {
            const postsNew = parsedFeed.postsParsed;
            const posts = _.flatten(state.posts).filter((post) => post.idFeed === feed.idFeed);
            const result = postsNew.filter((elm) => {
              const a = !posts.map((elm1) => elm1.title.trim()).includes(elm.title.trim());
              return a;
            });
            watchedState.posts.push(result);
          }
        })
        .catch(() => {
          watchedState.loadingProcess.status = 'finished';
          watchedState.formProcess.error = 'key1';
        });
      setTimeout(getData, 5000);
    });
  }, 5000);
};
