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
  const arr = [];
  const state = {
    searchForm: {
      url: '',
      feeds: {},
      posts: [],
      errors: {},
      valid: '',
    },
    UI: {
      readOnly: false,
      modalModus: 'on',
      modalPostUrl: '',
      modalPostTitle: '',
      modalPostDescription: '',
    },
  };

  const elements = {
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    input: document.getElementById('input'),
    button: document.querySelector('.button'),
    modal: document.getElementById('modal'),
    fade: document.querySelector('.fade'),
    title: document.getElementById('title'),
    description: document.getElementById('description'),
    feedback: document.querySelector('.feedback'),
    feedElements: document.querySelectorAll('.feed'),
  };

  const watchedState = onChange(state, (path, value) => render(path, value, elements));
  const form = document.querySelector('.form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.UI.readOnly = true;
    const { input } = elements;
    const url = input.value.trim();
    watchedState.searchForm.valid = '';
    watchedState.searchForm.url = url;
    const errors = validate(watchedState.searchForm.url, arr);
    if (!_.isEmpty(errors)) {
      if (_.includes('ValidationError: this must be a valid URL', errors)) {
        watchedState.UI.readOnly = false;
        watchedState.searchForm.errors = 'key4';
      } if (_.includes(`ValidationError: this must not be one of the following values: ${url}`, errors)) {
        watchedState.UI.readOnly = false;
        watchedState.searchForm.errors = 'key2';
      }
    } else {
      arr.push(url);
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`)
        .then((response) => {
          watchedState.UI.readOnly = false;
          const domparser = new DOMParser();
          const parsedFeed = parseFeed(domparser.parseFromString(response.data.contents, 'text/xml'));
          if (_.isEmpty(parsedFeed)) {
            watchedState.searchForm.errors = 'key8';
          } else {
            watchedState.searchForm.feeds = parsedFeed.feedParsed;
            watchedState.searchForm.posts = parsedFeed.postsParsed;
            watchedState.searchForm.valid = 'key3';
            const posts = document.querySelector('.posts');
            const buttons = posts.querySelectorAll('.btn');
            Array.from(buttons).forEach((btn) => {
              btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('idpost'), 10);
                // eslint-disable-next-line max-len
                const { description } = parsedFeed.postsParsed.find((post) => parseInt(post.idPost, 10) === id);
                // eslint-disable-next-line max-len
                const { title } = parsedFeed.postsParsed.find((post) => parseInt(post.idPost, 10) === id);
                // eslint-disable-next-line max-len
                const modalUrl = parsedFeed.postsParsed.find((post) => parseInt(post.idPost, 10) === id).url;
                watchedState.UI.modalPostTitle = title;
                watchedState.UI.modalPostDescription = description;
                watchedState.UI.modalPostUrl = modalUrl;
              });
            });
            const dismissBtns = document.querySelectorAll('button[data-dismiss="modal"]');
            const readBtn = document.querySelector('button[data="read"]');
            const description = document.getElementById('description');
            readBtn.addEventListener('click', () => {
              const href = description.getAttribute('href');
              window.open(href);
              watchedState.UI.modalModus = 'off';
              watchedState.UI.modalModus = 'on';
            });
            Array.from(dismissBtns).forEach((dismissBtn) => {
              dismissBtn.addEventListener('click', () => {
                watchedState.UI.modalModus = 'off';
                watchedState.UI.modalModus = 'on';
              });
            });
            timeOut(url, watchedState);
          }
        })
        .catch(() => {
          watchedState.UI.readOnly = false;
          watchedState.searchForm.errors = 'key1';
        });
    }
  });
};
