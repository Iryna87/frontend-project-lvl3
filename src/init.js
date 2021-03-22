// @ts-check
import _ from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import DOMParser from 'dom-parser';
import render from './view.js';
import parseFeed from './parse.js';
import './style.css';

const schema = yup.object().shape({
  url: yup.string().url(),
});

export default () => {
  let i = 1;
  const state = {
    serchForm: {
      url: '',
      feeds: [],
      posts: [],
      errors: {},
      valid: '',
    },
  };

  const watchedState = onChange(state, (path, value) => render(path, value));

  const form = document.querySelector('.form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = e.target.name.value;
    watchedState.serchForm.valid = '';
    watchedState.serchForm.url = url;
    schema
      .validate({ url: watchedState.serchForm.url })
      .then(() => {
        axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
          .then((response) => {
            const domparser = new DOMParser();
            const parsedFeed = parseFeed(domparser.parseFromString(response.data.contents, 'text/xml'), i);
            const validation = parsedFeed.feedParsed.title;
            const arr = [];
            let doubleValidation = '';
            const elements = document.querySelectorAll('.feed');
            Array.from(elements).forEach((feed) => {
              arr.push(feed.textContent.trim());
              if (_.includes(arr, validation.trim())) {
                doubleValidation = 'key2';
              }
            });
            if (doubleValidation !== '') {
              watchedState.serchForm.errors = doubleValidation;
            } else {
              watchedState.serchForm.feeds = parsedFeed.feedParsed;
              watchedState.serchForm.posts = parsedFeed.postsParsed;
              watchedState.serchForm.valid = 'key3';
              i += 1;
            }
          })
          .then(() => {
            window.setTimeout(function getData() {
              axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
                .then((response1) => {
                  const domparser = new DOMParser();
                  const parsedFeed1 = parseFeed(domparser.parseFromString(response1.data.contents, 'text/xml'), i);
                  const addedPosts = parsedFeed1.postsParsed;
                  const posts = document.getElementsByTagName('a');
                  const existingPosts = [];
                  Array.from(posts).forEach((post) => {
                    if (post.href.slice(0, 6) === url.slice(0, 6)) {
                      existingPosts.push({
                        title: post.textContent.trim(),
                        url: post.href.trim(),
                        idFeed: post.getAttribute('myAttr2'),
                        idPost: post.getAttribute('myAttr1'),
                      });
                    }
                  });
                  // eslint-disable-next-line max-len
                  const resultA = existingPosts.filter((elm) => !addedPosts.map((elm1) => elm1.title.trim()).includes(elm.title.trim()));
                  // eslint-disable-next-line max-len
                  const resultB = addedPosts.filter((elm) => !existingPosts.map((elm1) => elm1.title.trim()).includes(elm.title.trim()));
                  const difference = [...resultA, ...resultB];
                  watchedState.serchForm.posts = difference;
                })
                .catch(() => {
                  watchedState.serchForm.errors = 'key1';
                });
              setTimeout(getData, 5000);
            }, 5000);
          })
          .catch((err) => {
            watchedState.serchForm.errors = err;
          });
      })
      .catch(() => {
        watchedState.serchForm.errors = 'key4';
      });
  });
};
