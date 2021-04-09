import _ from 'lodash';

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
  Array.from(posts).forEach((item) => {
    const descrip = item.getElementsByTagName('description');
    const arr = item.textContent.split('\n');
    const post = {
      title: arr[1].trim(),
      url: arr[3].trim(),
      description: descrip[0].textContent,
      idFeed: 1,
      idPost: j,
    };
    obj.feedParsed.title = feedTitle.textContent;
    obj.feedParsed.description = feedDescription.textContent;
    obj.postsParsed.push(post);
    j += 1;
  });
  if (_.isEmpty(posts)) {
    return {};
  }
  return obj;
};

export default parseFeed;
