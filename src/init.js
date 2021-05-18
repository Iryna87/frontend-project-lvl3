// @ts-check
import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import render from './view.js';
import parseFeed from './parse.js';
import validate from './validate.js';
import validateErrors from './validateErrors.js';
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

  const { form, postsContainer, descriptionModal } = elements;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.loadingProcess.status = 'loading';
    watchedState.formProcess.status = 'waiting';
    const formData = new FormData(e.target);
    const { url } = Object.fromEntries(formData);
    const urls = state.feeds.map((feed) => feed.url);
    const validationError = validate(url, urls);
    if (!_.isEmpty(validationError)) {
      validateErrors(validationError, watchedState);
    } else {
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`)
        .then((response) => {
          watchedState.loadingProcess.status = 'finished';
          const idFeed = _.uniqueId();
          const parsedFeed = parseFeed(response.data.contents, url, idFeed);
          if (_.isEmpty(parsedFeed)) {
            watchedState.loadingProcess.error = 'validation_content_error';
          } else {
            watchedState.feeds.unshift(parsedFeed.feedsParsed);
            watchedState.posts.unshift(parsedFeed.postsParsed);
            watchedState.formProcess.status = 'loading_success';
            postsContainer.addEventListener('click', (el) => {
              watchedState.UI.modalPostId = parseInt(el.target.getAttribute('idpost'), 10);
              watchedState.UI.seenPostsId.push(state.UI.modalPostId);
            });
            const readBtn = document.querySelector('.full-article');
            readBtn.addEventListener('click', () => {
              const href = descriptionModal.getAttribute('href');
              readBtn.setAttribute('href', href);
            });
            timeOut(watchedState, state);
          }
        })
        .catch(() => {
          watchedState.loadingProcess.status = 'finished';
          watchedState.formProcess.error = 'network_error';
        });
    }
  });
};
