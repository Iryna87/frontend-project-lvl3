// @ts-nocheck
import _ from 'lodash';
import onChange from 'on-change';
import render from './view.js';
import validate from './validate.js';
import displayErrors from './displayErrors.js';
import loadData from './loadData.js';
import elements from './elements.js';
import timeOut from './timeOut.js';

export default () => {
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
    watchedState.formProcess.error = null;
    watchedState.loadingProcess.status = 'waiting';
    watchedState.loadingProcess.error = null;
    const { url } = Object.fromEntries(new FormData(e.target));
    const urls = state.feeds.map((feed) => feed.url);
    const validationError = validate(url, urls);
    if (!_.isEmpty(validationError)) {
      displayErrors(validationError, watchedState);
      return;
    }
    loadData(watchedState, url);
    timeOut(watchedState, state);
  });
  postsContainer.addEventListener('click', (el) => {
    if (el.target.dataset.id) {
      watchedState.UI.modalPostId = el.target.dataset.id;
      watchedState.UI.seenPostsId.push(state.UI.modalPostId);
    }
  });
};
