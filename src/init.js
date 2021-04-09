// @ts-check
import _ from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import DOMParser from 'dom-parser';
import render from './view.js';
import parseFeed from './parse.js';

const validate = (str, arr) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(arr);
  try {
    schema.validateSync(str);
    return {};
  } catch (err) {
    return err;
  }
};

export default () => {
  const arr = [];
  let i = 1;
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

  const timeOut = (url1) => {
    window.setTimeout(function getData() {
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url1)}&disableCache=true`)
        .then((response1) => {
          const domparser = new DOMParser();
          const parsedFeed1 = parseFeed(domparser.parseFromString(response1.data.contents, 'text/xml'), i);
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
          watchedState.searchForm.posts = result;
        })
        .catch(() => {
          watchedState.searchForm.errors = 'key1';
        });
      setTimeout(getData, 5000);
    }, 5000);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.UI.readOnly = true;
    const { input } = elements;
    const url = input.value.trim();
    watchedState.searchForm.valid = '';
    watchedState.searchForm.url = url;
    const errors = validate(watchedState.searchForm.url, arr);
    console.log(errors);
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
          const parsedFeed = parseFeed(domparser.parseFromString(response.data.contents, 'text/xml'), i);
          if (_.isEmpty(parsedFeed)) {
            watchedState.searchForm.errors = 'key8';
          } else {
            watchedState.searchForm.feeds = parsedFeed.feedParsed;
            watchedState.searchForm.posts = parsedFeed.postsParsed;
            watchedState.searchForm.valid = 'key3';
            i += 1;
            const posts = document.querySelector('.posts');
            const buttons = posts.querySelectorAll('.btn');
            Array.from(buttons).forEach((btn) => {
              btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('idpost'), 10);
                const { description } = parsedFeed.postsParsed.find((post) => post.idPost === id);
                const { title } = parsedFeed.postsParsed.find((post) => post.idPost === id);
                const modalUrl = parsedFeed.postsParsed.find((post) => post.idPost === id).url;
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
            timeOut(url);
          }
        })
        .catch((err) => {
          //watchedState.UI.readOnly = false;
          watchedState.searchForm.errors = err;
        });
    }
  });
};
