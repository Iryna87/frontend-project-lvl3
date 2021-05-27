/* eslint no-param-reassign: ["error", { "props": false }] */
import axios from 'axios';
import _ from 'lodash';
import parseFeed from './parse.js';
import proxifyURL from './proxifyURL.js';

export default (watchedState, url) => {
  axios.get(proxifyURL(url))
    .then((response) => {
      watchedState.formProcess.status = 'finished';
      const parsedFeed = parseFeed(response.data.contents, url);
      if (_.isEmpty(parsedFeed)) {
        watchedState.loadingProcess.error = 'loading_content_error';
        return;
      }
      watchedState.feeds.unshift(parsedFeed.feedsParsed);
      watchedState.posts.unshift(...parsedFeed.postsParsed);
      watchedState.loadingProcess.status = 'loading_success';
    })
    .catch(() => {
      watchedState.formProcess.error = 'network_error';
      watchedState.formProcess.status = 'finished';
    });
};
