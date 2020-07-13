'use strict';

const fs = require(`fs`).promises;

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    return [];
  }
};

module.exports.readContentJSON = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);

    if (!content.trim().length) {
      return [];
    }

    return JSON.parse(content);
  } catch (err) {
    return [];
  }
};

module.exports.printNumWithLead0 = (number) => number < 10 ? `0${number}` : number;

module.exports.getMostDiscussedOffers = (offers) => {
  return offers.filter((offer) => offer.comments.length > 0)
                .sort((a, b) => b.comments.length - a.comments.length)
                .slice(0, 8);
};
