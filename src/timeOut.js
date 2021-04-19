/* eslint no-param-reassign: ["error", { "props": false }] */
import axios from 'axios';
import _ from 'lodash';
import parseFeed from './parse.js';

export default (urls, watchedState, state) => {
  window.setTimeout(function getData() {
    watchedState.loadingProcess.status = 'loading';
    urls.forEach((url) => {
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`)
        .then((response1) => {
          watchedState.loadingProcess.status = 'finished';
          const domparser = new DOMParser();
          const parsedFeed = parseFeed(domparser.parseFromString(response1.data.contents, 'text/xml'));
          if (_.isEmpty(parsedFeed)) {
            watchedState.loadingProcess.error = 'key8';
          } else {
            const newArr = parsedFeed.postsParsed;
            console.log(_.uniq(_.flatten(state.posts.push(newArr))));
            watchedState.posts.push(_.uniq(_.flatten(state.posts.push(newArr))));
          }
        })
        .catch(() => {
          watchedState.loadingProcess.status = 'finished';
          watchedState.formProcess.errors = 'key1';
        });
      setTimeout(getData, 155000);
    });
  }, 5000);
};
