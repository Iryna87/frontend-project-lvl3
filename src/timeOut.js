/* eslint no-param-reassign: ["error", { "props": false }] */
import axios from 'axios';
import _ from 'lodash';
import parseFeed from './parse.js';

export default (urls, watchedState, state) => {
  window.setTimeout(function getData(url1) {
    watchedState.loadingProcess.status = 'loading';
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url1)}&disableCache=true`)
      .then((response1) => {
        watchedState.loadingProcess.status = 'finished';
        const domparser = new DOMParser();
        const parsedFeed = parseFeed(domparser.parseFromString(response1.data.contents, 'text/xml'));
        if (_.isEmpty(parsedFeed)) {
          watchedState.loadingProcess.error = 'key8';
        } else {
          const newArr = parsedFeed.feedsParsed;
          const { idFeed } = newArr[0];
          const arrSortedById = _.flatten(state.posts).filter((post) => post.idFeed === idFeed);
          watchedState.posts.push(_.uniq(_.flatten(state.posts.push(arrSortedById))));
        }
      })
      .catch(() => {
        watchedState.loadingProcess.status = 'finished';
        watchedState.formProcess.errors = 'key1';
      });
    setTimeout(_.uniq(urls).forEach((url) => getData(url), 5000));
  }, 5000);
};
