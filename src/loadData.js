/* eslint no-param-reassign: ["error", { "props": false }] */
import axios from 'axios';
import _ from 'lodash';
import parseFeed from './parse.js';
import proxifyURL from './proxifyURL.js';

export default (watchedState, url) => {
  axios.get(proxifyURL(url))
    .then((response) => {
      watchedState.loadingProcess.status = 'finished';
      const parsed = parseFeed(response.data.contents);
      const { title, description, idFeed } = parsed;
      const parsedFeed = {
        title,
        description,
        idFeed,
        url,
      };
      if (_.isEmpty(parsed)) {
        watchedState.loadingProcess.error = 'loading_content_error';
        return;
      }
      watchedState.feeds.unshift(parsedFeed);
      watchedState.posts.unshift(...parsed.postsParsed);
      watchedState.loadingProcess.status = 'loading_success';
    })
    .catch(() => {
      watchedState.loadingProcess.error = 'network_error';
      watchedState.loadingProcess.status = 'finished';
    });
};
