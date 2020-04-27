export default function (nodeOffsetFromBack) {
  let editorNode = document.querySelector(".editor");
  let newPreNodeChildren = editorNode.childNodes[0].childNodes;
  let newPreNodeChildrenLength = newPreNodeChildren.length;

  if (nodeOffsetFromBack > newPreNodeChildrenLength) {
    nodeOffsetFromBack = newPreNodeChildrenLength;
  }

  if (typeof nodeOffsetFromBack !== 'number') {
    nodeOffsetFromBack = 1;
  }

  return newPreNodeChildren[newPreNodeChildrenLength - nodeOffsetFromBack]
    .childNodes[0];
}