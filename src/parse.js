import _ from 'lodash';
import DOMParser from 'dom-parser';

const parseFeed = (rss) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(rss, 'text/xml');
  const items = doc.getElementsByTagName('item');
  if (_.isEmpty(items)) {
    return {};
  }
  const channel = doc.getElementsByTagName('channel');
  const title = channel[0].getElementsByTagName('title')[0].textContent.trim();
  const description = channel[0].getElementsByTagName('description')[0].textContent.trim();
  const idFeed = _.uniqueId();
  const postsParsed = [];

  [...items].forEach((item) => {
    const descriptionPost = item.getElementsByTagName('description')[0];
    const titlePost = item.getElementsByTagName('title')[0];
    const arr = item.textContent.split('\n');
    const post = {
      title: titlePost.textContent.trim(),
      url: arr[3].trim(),
      description: descriptionPost.textContent.trim(),
      idPost: _.uniqueId(),
      idFeed,
    };
    postsParsed.push(post);
  });
  if (_.isEmpty(postsParsed)) {
    return {};
  }
  return {
    title,
    description,
    idFeed,
    postsParsed,
  };
};

export default parseFeed;
