import _ from 'lodash';

const parseFeed = (doc) => {
  const obj = {
    feedsParsed: {
      title: '',
      description: '',
      url: '',
      idFeed: '',
    },
    postsParsed: [],
  };

  const posts = doc.getElementsByTagName('item');
  const titles = doc.getElementsByTagName('title');
  const descriptions = doc.getElementsByTagName('description');
  const feedTitle = Array.from(titles)[0];
  const feedDescription = Array.from(descriptions)[0];
  const idFeed = _.uniqueId();
  Array.from(posts).forEach((item) => {
    const descrip = item.getElementsByTagName('description');
    const arr = item.textContent.split('\n');
    const post = {
      title: arr[1].trim(),
      url: arr[3].trim(),
      description: descrip[0].textContent,
      idPost: _.uniqueId(),
      idFeed,
    };
    obj.feedsParsed.title = feedTitle.textContent;
    obj.feedsParsed.description = feedDescription.textContent;
    obj.feedsParsed.idFeed = idFeed;
    obj.feedsParsed.url = arr[3].trim();
    obj.postsParsed.push(post);
  });
  if (_.isEmpty(posts)) {
    return {};
  }
  return obj;
};

export default parseFeed;
