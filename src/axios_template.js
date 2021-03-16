// @ts-check
import axios from 'axios';
import _ from 'lodash';
import DOMParser from 'dom-parser';

const parseFeed = (doc) => {
  const obj = {
    feedParsed: {
      title: '',
      description: '',
      idFeed: 1,
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
      idFeed: 1,
    };
    obj.postsParsed.push(post);
  });
  //console.table(obj.postsParsed[0].idFeed);
  return obj;
};

const state = {
  serchForm: {
    feeds: [
      {
        title: 'Заметки о WordPress',
        description: '',
        idFeed: 1,
      },
    ],
  },
};

const parsing = () => {
  const link = 'http://prihod.ru/category/zametki-o-wordpress/feed/';
  axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(link)}`)
    .then((response) => {
      const domparser = new DOMParser();
      const parsedFeed = parseFeed(domparser.parseFromString(response.data.contents, 'application/xml'));
      const validation = parsedFeed.feedParsed.title;
      state.serchForm.feeds.forEach((feed) => {
        console.log(feed, validation);
        if (_.includes(feed, validation)) {
          console.log('Validation error');
        } else {
          console.log('hei');
        }
      });
    })
    .catch((e) => console.log(e));
};
parsing();
