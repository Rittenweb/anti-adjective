export default function getNodeOffsetFromBack(currentSelection) {

  let preNodeChildren = [];
  let editorNode = document.querySelector(".editor");

  for (let i = 0; i < editorNode.childNodes.length; i++) {
    preNodeChildren = preNodeChildren.concat(
      ...editorNode.childNodes[i].childNodes
    );
  }

  for (let i = preNodeChildren.length - 1; i >= 0; i--) {
    let currentChildTextNode = preNodeChildren[i].childNodes[0];

    if (currentChildTextNode === currentSelection.anchorNode) {
      return preNodeChildren.length - i;
    }
  }
}