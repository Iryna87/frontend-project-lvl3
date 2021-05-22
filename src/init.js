// @ts-check
import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import render from './view.js';
import parseFeed from './parse.js';
import validate from './validate.js';
import displayErrors from './displayErrors.js';
import proxifyURL from './proxifyURL.js';
import timeOut from './timeOut.js';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    input: document.querySelector('input[name=url]'),
    button: document.querySelector('.rss-form [type=submit]'),
    feedback: document.querySelector('.feedback'),
    titleModal: document.querySelector('.modal-title'),
    descriptionModal: document.querySelector('.modal-body'),
    footerModal: document.querySelector('.modal-footer .btn'),
  };

  const state = {
    feeds: [],
    posts: [],
    formProcess: {
      status: 'waiting',
      error: null,
    },
    loadingProcess: {
      status: 'waiting',
      error: null,
    },
    UI: {
      modalPostId: null,
      seenPostsId: [],
    },
  };

  const watchedState = onChange(state, (path, value) => render(state, path, value, elements));

  const { form, postsContainer } = elements;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.formProcess.status = 'loading';
    watchedState.loadingProcess.status = 'waiting';
    const formData = new FormData(e.target);
    const { url } = Object.fromEntries(formData);
    const urls = state.feeds.map((feed) => feed.url);
    const validationError = validate(url, urls);
    if (!_.isEmpty(validationError)) {
      displayErrors(validationError, watchedState);
      return;
    }
    axios.get(proxifyURL(url))
      .then((response) => {
        watchedState.formProcess.status = 'finished';
        const idFeed = _.uniqueId();
        const parsedFeed = parseFeed(response.data.contents, url, idFeed);
        if (_.isEmpty(parsedFeed)) {
          watchedState.loadingProcess.error = 'loading_content_error';
        } else {
          watchedState.feeds.unshift(parsedFeed.feedsParsed);
          watchedState.posts.unshift(...parsedFeed.postsParsed);
          watchedState.loadingProcess.status = 'loading_success';
          timeOut(watchedState, state);
        }
      })
      .catch(() => {
        watchedState.loadingProcess.error = 'network_error';
        watchedState.formProcess.status = 'finished';
      });
  });
  postsContainer.addEventListener('click', (el) => {
    watchedState.UI.modalPostId = parseInt(el.target.dataset.id, 10);
    watchedState.UI.seenPostsId.push(state.UI.modalPostId);
  });
};
