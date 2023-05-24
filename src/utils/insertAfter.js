/**
 * @param {HTMLElement} newNode
 * @param {HTMLElement} existingNode
 */
export default (newNode, existingNode) => {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
};
