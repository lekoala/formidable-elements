/**
 * @param {HTMLElement} newNode
 * @param {HTMLElement} existingNode
 */
export default function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
