// @ts-check
import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import render from './view.js';
import parseFeed from './parse.js';
import validate from './validate.js';
import timeOut from './timeOut.js';

export default () => {
  const elements = {
    form: document.querySelector('.form'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    input: document.getElementById('input'),
    button: document.querySelector('.button'),
    feedback: document.querySelector('.feedback'),
    modal: document.getElementById('modal'),
    fade: document.querySelector('.fade'),
    tModal: document.getElementById('title'),
    dModal: document.getElementById('description'),
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
      modalHidden: false,
      seenPostsId: [],
    },
  };

  const watchedState = onChange(state, (path, value) => render(state, path, value, elements));

  const { form } = elements;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.loadingProcess.status = 'loading';
    watchedState.formProcess.status = 'waiting';
    const { input } = elements;
    const url = input.value.trim();
    const urls = state.feeds.map((feed) => feed.url);
    const errors = validate(url, urls);
    if (!_.isEmpty(errors)) {
      if (_.includes('ValidationError: this must be a valid URL', errors)) {
        watchedState.loadingProcess.status = 'finished';
        watchedState.formProcess.error = 'key4';
      } if (_.includes(`ValidationError: this must not be one of the following values: ${url}`, errors)) {
        watchedState.loadingProcess.status = 'finished';
        watchedState.formProcess.error = 'key2';
      }
    } else {
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`)
        .then((response) => {
          watchedState.loadingProcess.status = 'finished';
          const idFeed = _.uniqueId();
          const parsedFeed = parseFeed(response.data.contents, url, idFeed);
          if (_.isEmpty(parsedFeed)) {
            watchedState.loadingProcess.error = 'key8';
          } else {
            watchedState.feeds.push(parsedFeed.feedsParsed);
            watchedState.posts.push(parsedFeed.postsParsed);
            watchedState.formProcess.status = 'key3';
            timeOut(watchedState, state);
            const buttons = document.querySelectorAll('.btn');
            Array.from(buttons).forEach((btn) => {
              btn.addEventListener('click', () => {
                watchedState.UI.modalPostId = parseInt(btn.getAttribute('idpost'), 10);
                watchedState.UI.seenPostsId.push(state.UI.modalPostId);
              });
            });
            const description = document.getElementById('description');
            const dismissBtns = document.querySelectorAll('button[data-dismiss="modal"]');
            const readBtn = document.querySelector('button[data="read"]');
            readBtn.addEventListener('click', () => {
              const href = description.getAttribute('href');
              window.open(href);
              watchedState.UI.modalHidden = false;
              watchedState.UI.modalHidden = true;
            });
            Array.from(dismissBtns).forEach((dismissBtn) => {
              dismissBtn.addEventListener('click', () => {
                watchedState.UI.modalPostId = null;
                watchedState.UI.modalHidden = false;
                watchedState.UI.modalHidden = true;
              });
            });
          }
        })
        .catch(() => {
          watchedState.loadingProcess.status = 'finished';
          watchedState.formProcess.error = 'key1';
        });
    }
  });
};
