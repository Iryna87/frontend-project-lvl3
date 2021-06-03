import _ from 'lodash';

const parseFeed = (rss) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(rss, 'text/xml');
  const items = doc.getElementsByTagName('item');
  if (_.isEmpty(items)) {
    return {};
  }
  const title = doc.querySelector('title').textContent.trim();
  const description = doc.querySelector('description').textContent.trim();
  const idFeed = _.uniqueId();
  const postsParsed = [];

  [...items].forEach((item) => {
    const descriptionPost = item.querySelector('description');
    const titlePost = item.querySelector('title');
    const urlPost = item.querySelector('link');
    const post = {
      title: titlePost.textContent.trim(),
      url: urlPost.textContent.trim(),
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
