import nlp from 'compromise';

const fetchAlternatesAdj = function (matches, matchAlternates) {

  matches.forEach((match, index) => {
    let matchText = match.innerText.replace(/[^a-zA-Z\s]/g, "");
    console.log('called');
    let alternatesArr = [];
    fetch(`https://api.datamuse.com/words?rel_jja=${matchText}`, {
        cache: 'no-cache',
      })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        let nounsArr = [];
        data.forEach((alternate) => {
          nounsArr.push(alternate.word);
        });
        alternatesArr.push(nounsArr);
        return fetch(`https://api.datamuse.com/words?ml=${matchText}`);
      })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        let verbsArr = [];
        data.forEach((alternate) => {
          if (alternate.tags && alternate.tags.includes('v')) {
            let lexicon = {};
            lexicon[`${alternate.word}`] = 'Verb';
            let infinitive = nlp(alternate.word, lexicon)
              .verbs()
              .toInfinitive()
              .text();
            let newWord = infinitive ? infinitive : alternate.word;
            if (!verbsArr.includes(newWord)) {
              verbsArr.push(newWord);
            }
          }
        });
        alternatesArr.push(verbsArr);
        matchAlternates[match.innerText] = alternatesArr;
      });
  });

  return matchAlternates;
}

const fetchAlternatesAdv = function (matches, matchAlternates) {

  matches.forEach((match, index) => {
    let matchText = nlp(match.innerText).verbs().toInfinitive().all().text().replace(/[^a-zA-Z\s]/g, "");
    console.log('called');
    let alternatesArr = [];
    fetch(`https://api.datamuse.com/words?ml=${matchText}`, {
        cache: 'no-cache',
      })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        let nounsArr = [];
        let verbsArr = [];
        data.forEach((alternate) => {
          if (alternate.tags) {
            if (alternate.tags.includes('n')) {
              nounsArr.push(alternate.word);
            }
            if (alternate.tags.includes('v')) {
              let lexicon = {};
              lexicon[`${alternate.word}`] = 'Verb';
              let infinitive = nlp(alternate.word, lexicon)
                .verbs()
                .toInfinitive()
                .text();
              let newWord = infinitive ? infinitive : alternate.word;
              if (!verbsArr.includes(newWord)) {
                verbsArr.push(newWord);
              }
            }
          }
        });
        alternatesArr.push(nounsArr);
        alternatesArr.push(verbsArr);
        matchAlternates[match.innerText] = alternatesArr;
      })
  });

  return matchAlternates;
}

export {
  fetchAlternatesAdj,
  fetchAlternatesAdv
};