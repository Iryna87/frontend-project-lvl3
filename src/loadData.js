/* eslint no-param-reassign: ["error", { "props": false }] */
import axios from 'axios';
import _ from 'lodash';
import parseFeed from './parse.js';
import proxifyURL from './proxifyURL.js';

export default (watchedState, url) => {
  axios.get(proxifyURL(url))
    .then((response) => {
      watchedState.loading.status = 'finished';
      const feedData = parseFeed(response.data.contents);
      const idFeed = _.uniqueId();
      watchedState.feeds.unshift(({ ...(_.pick(feedData, 'title', 'description')), idFeed, url }));
      watchedState.posts.unshift(...(_.pick(feedData, 'posts').posts).map((post) => ({ ...post, idPost: _.uniqueId(), idFeed })));
      watchedState.loading.status = 'loading_success';
    })
    .catch((err) => {
      if (err.code === 'parse_error') {
        watchedState.loading.error = 'loading_content_error';
        watchedState.loading.status = 'finished';
      } if (err.isAxiosError) {
        watchedState.loading.error = 'network_error';
        watchedState.loading.status = 'finished';
      }
    });
};
