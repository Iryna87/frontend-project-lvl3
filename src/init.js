// @ts-check
import _ from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import DOMParser from 'dom-parser';
import render from './view.js';
import parseFeed from './parse.js';

const schema = yup.object().shape({
  url: yup.string().url(),
});

export default () => {
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
      modalModus: 'on',
      modalPostUrl: '',
      modalPostTitle: '',
      modalPostDescription: '',
    },
  };

  const watchedState = onChange(state, (path, value) => render(path, value));
  const form = document.querySelector('.form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('input').value;
    watchedState.searchForm.valid = '';
    watchedState.searchForm.url = url;
    schema
      .validate({ url: watchedState.searchForm.url })
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
              watchedState.searchForm.errors = doubleValidation;
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
            }
          })
          .then(() => {
            window.setTimeout(function getData() {
              axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
                .then((response1) => {
                  const domparser = new DOMParser();
                  const parsedFeed1 = parseFeed(domparser.parseFromString(response1.data.contents, 'text/xml'), i);
                  const newArr = parsedFeed1.postsParsed;
                  const posts = document.getElementsByTagName('a');
                  const oldArr = [];
                  Array.from(posts).forEach((post) => {
                    if (post.href.slice(0, 6) === url.slice(0, 6)) {
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
          })
          .catch((err) => {
            watchedState.searchForm.errors = err;
          });
      })
      .catch(() => {
        watchedState.searchForm.errors = 'key4';
      });
  });
};
