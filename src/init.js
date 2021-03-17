// @ts-check
import _ from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import DOMParser from 'dom-parser';
import view from './view.js';

const schema = yup.object().shape({
  url: yup.string().url(),
});

let j = 1;

const parseFeed = (doc, i) => {
  const obj = {
    feedParsed: {
      title: '',
      description: '',
      idFeed: i,
    },
    postsParsed: [],
  };

  const posts = doc.getElementsByTagName('item');
  const titles = doc.getElementsByTagName('title');
  const descriptions = doc.getElementsByTagName('description');
  const feedTitle = Array.from(titles)[0];
  const feedDescription = Array.from(descriptions)[0];
  obj.feedParsed.title = feedTitle.textContent;
  obj.feedParsed.description = feedDescription.textContent;
  Array.from(posts).forEach((item) => {
    const arr = item.textContent.split('\n');
    const post = {
      title: arr[1].trim(),
      url: arr[3].trim(),
      idFeed: i,
      idPost: j,
    };
    obj.postsParsed.push(post);
    j += 1;
  });
  console.log(obj);
  return obj;
};

export default () => {
  let i = 1;
  const state = {
    serchForm: {
      url: '',
      feeds: [],
      posts: [],
      errors: {},
      valid: false,
    },
  };

  const watchedState = onChange(state, (path, value) => view(path, value));

  const form = document.querySelector('.form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = e.target.name.value;
    watchedState.serchForm.valid = false;
    watchedState.serchForm.url = url;
    schema
      .validate({ url: watchedState.serchForm.url })
      .then(() => {
        axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
          .then((response) => {
            const domparser = new DOMParser();
            const parsedFeed = parseFeed(domparser.parseFromString(response.data.contents, 'application/xml'), i);
            // eslint-disable-next-line max-len
            const validation = parsedFeed.feedParsed.title;
            const arr = [];
            let doubleValidation = '';
            const elements = document.querySelectorAll('.feed');
            Array.from(elements).forEach((feed) => {
              arr.push(feed.textContent.trim());
              if (_.includes(arr, validation.trim())) {
                doubleValidation = 'This URL is aleready added';
              }
            });
            if (doubleValidation !== '') {
              watchedState.serchForm.errors = doubleValidation;
            } else {
              watchedState.serchForm.feeds = parsedFeed.feedParsed;
              watchedState.serchForm.posts = parsedFeed.postsParsed;
              watchedState.serchForm.valid = true;
              i += 1;
            }
          })
          .catch(() => {
            watchedState.serchForm.errors = 'Network error';
          });
      })
      .catch((err) => {
        watchedState.serchForm.errors = err;
      });
  });
};
