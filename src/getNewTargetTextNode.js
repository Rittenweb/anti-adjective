export default function (nodeOffsetFromBack) {
  debugger;
  let editorNode = document.querySelector(".editor");
  let newPreNodeChildren = editorNode.childNodes[0].childNodes;
  let newPreNodeChildrenLength = newPreNodeChildren.length;
  if (newPreNodeChildrenLength === 0) {
    return editorNode.childNodes[0];
  }

  if (nodeOffsetFromBack > newPreNodeChildrenLength) {
    nodeOffsetFromBack = newPreNodeChildrenLength;
  }

  if (typeof nodeOffsetFromBack !== 'number') {
    nodeOffsetFromBack = 1;
  }

  return newPreNodeChildren[newPreNodeChildrenLength - nodeOffsetFromBack]
    .childNodes[0];
}