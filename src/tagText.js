export default function tagText(nlpObject, mode) {

  let matchNum = 0;
  let textWithMatches;

  if (mode) {
    matchNum += nlpObject.match('#Adjective').out('array').length;
    textWithMatches = nlpObject.html({
      '#Adjective': `adjective`,
    });
  } else {
    matchNum += nlpObject.match('#Verb #Adverb+').out('array').length;
    matchNum += nlpObject.match('#Adverb+ #Verb').out('array').length;
    matchNum += nlpObject.match('#Adjective+ #Noun').out('array').length;
    textWithMatches = nlpObject.html({
      '#Verb #Adverb+': 'adjective',
      '#Adverb+ #Verb': 'adjective',
      '#Adjective+ #Noun': 'adjective',
    });
  }

  return [matchNum, textWithMatches]
}