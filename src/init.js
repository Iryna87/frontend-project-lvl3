// @ts-check
import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import DOMParser from 'dom-parser';
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
    url: '',
    feeds: {},
    posts: [],
    formProcess: {
      status: '',
      errors: {},
    },
    loadingProcess: {
      status: 'filling',
    },
    UI: {
      modalPostId: null,
      modalHidden: false,
      seenPostsId: [],
    },
  };

  const watchedState = onChange(state, (path, value) => render(state.posts, path, value, elements));

  const { form } = elements;
  const arr = [];

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { input } = elements;
    const url = input.value.trim();
    watchedState.loadingProcess.status = 'filling';
    watchedState.formProcess.status = '';
    watchedState.url = url;
    const errors = validate(watchedState.url, arr);
    if (!_.isEmpty(errors)) {
      if (_.includes('ValidationError: this must be a valid URL', errors)) {
        watchedState.loadingProcess.status = 'finished';
        watchedState.formProcess.errors = 'key4';
      } if (_.includes(`ValidationError: this must not be one of the following values: ${url}`, errors)) {
        watchedState.loadingProcess.status = 'finished';
        watchedState.formProcess.errors = 'key2';
      }
    } else {
      arr.push(url);
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`)
        .then((response) => {
          watchedState.loadingProcess.status = 'finished';
          const domparser = new DOMParser();
          const parsedFeed = parseFeed(domparser.parseFromString(response.data.contents, 'text/xml'));
          if (_.isEmpty(parsedFeed)) {
            watchedState.formProcess.errors = 'key8';
          } else {
            watchedState.feeds = parsedFeed.feedParsed;
            watchedState.posts = parsedFeed.postsParsed;
            watchedState.formProcess.status = 'key3';
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
            timeOut(url, watchedState);
          }
        })
        .catch(() => {
          watchedState.loadingProcess.status = 'finished';
          watchedState.formProcess.errors = 'key1';
        });
    }
  });
};
