import axios from 'axios';
import _ from 'lodash';
import parseFeed from './parse.js';

export default (url1, watchedState1) => {
  window.setTimeout(function getData() {
    // eslint-disable-next-line no-param-reassign
    watchedState1.loadingProcess.status = 'filling';
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url1)}&disableCache=true`)
      .then((response1) => {
        // eslint-disable-next-line no-param-reassign
        watchedState1.loadingProcess.status = 'finished';
        const domparser = new DOMParser();
        const parsedFeed1 = parseFeed(domparser.parseFromString(response1.data.contents, 'text/xml'));
        if (_.isEmpty(parsedFeed1)) {
          // eslint-disable-next-line no-param-reassign
          watchedState1.formProcess.errors = 'key8';
        } else {
          const newArr = parsedFeed1.postsParsed;
          const posts = document.getElementsByTagName('a');
          const oldArr = [];
          Array.from(posts).forEach((post) => {
            if (post.href.slice(0, 6) === url1.slice(0, 6)) {
              oldArr.push({
                title: post.textContent.trim(),
              });
            }
          });
          const result = newArr.filter((elm) => {
            const a = !oldArr.map((elm1) => elm1.title.trim()).includes(elm.title.trim());
            return a;
          });
          if (!_.isEmpty(result)) {
            // eslint-disable-next-line no-param-reassign
            watchedState1.posts = result;
          }
        }
      })
      .catch(() => {
        // eslint-disable-next-line no-param-reassign
        watchedState1.loadingProcess.status = 'finished';
        // eslint-disable-next-line no-param-reassign
        watchedState1.formProcess.errors = 'key1';
      });
    setTimeout(getData, 5000);
  }, 5000);
};
