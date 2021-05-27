import _ from 'lodash';
import DOMParser from 'dom-parser';

const parseFeed = (rss, url) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(rss, 'text/xml');
  const idFeed = _.uniqueId();
  console.log(doc);
  const obj = {
    feedsParsed: {},
    postsParsed: [],
  };
  console.log(obj);

  const items = doc.getElementsByTagName('item');
  const titles = doc.getElementsByTagName('title');
  const descriptions = doc.getElementsByTagName('description');
  const title = Array.from(titles)[0];
  const description = Array.from(descriptions)[0];
  Array.from(items).forEach((item) => {
    const descrip = item.getElementsByTagName('description');
    const arr = item.textContent.split('\n');
    const post = {
      title: arr[1].trim(),
      url: arr[3].trim(),
      description: descrip[0].textContent,
      idPost: _.uniqueId(),
      idFeed,
    };
    obj.feedsParsed.title = title.textContent;
    obj.feedsParsed.description = description.textContent;
    obj.feedsParsed.idFeed = idFeed;
    obj.feedsParsed.url = url;
    obj.postsParsed.push(post);
  });
  if (_.isEmpty(items)) {
    return {};
  }
  return obj;
};

export default parseFeed;
