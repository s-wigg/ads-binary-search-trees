class BSTNode {
  constructor({ key, value, parent, left, right }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(Node = BSTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  insert(key, value = true) {
    let node = this._root;
    let prev = node;
    if (!node) {
      this._root = new BSTNode({
        key,
        value,
        parent: null,
        left: null,
        right: null,
      });
      this._count++;
      return value;
    }

    while (node) {
      if (key < node.key) {
        prev = node;
        node = node.left;
      } else if (key > node.key) {
        prev = node;
        node = node.right;
      } else {
        // we wont insert duplicate keys, so just update value
        return (node.value = value);
      }
    }
    const newNode = new BSTNode({
      key,
      value,
      parent: prev,
      left: null,
      right: null,
    });
    this._count++;
    if (key > prev.key) {
      prev.right = newNode;
    } else {
      prev.left = newNode;
    }
  }

  lookup(key) {
    let node = this._root;

    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else {
        // equal
        return node.value;
      }
    }
  }

  _updateParentNode(parentNode, key, replacement) {
    if (parentNode) {
      if (parentNode?.left?.key === key) {
        parentNode.left = replacement;
      } else {
        parentNode.right = replacement;
      }
    } else {
      return null;
    }
  }

  _deleteNode(node, key) {
    if (!node) {
      return null;
    }

    if (key < node.key) {
      node.left = this._deleteNode(node.left, key);
      return node;
    } else if (key > node.key) {
      node.right = this._deleteNode(node.right, key);
      return node;
    } else {
      // key matches, this is the node to delete
      this._count--;
      if (!node.left && !node.right) {
        // no children
        node.parent = this._updateParentNode(node.parent, key, null);
        node = null;
        return node;
      } else if (!node.left) {
        // left child only
        node.parent = this._updateParentNode(node.parent, key, node.right);
        node = node.right;
        return node;
      } else if (!node.right) {
        // right child only
        node.parent = this._updateParentNode(node.parent, key, node.left);
        node = node.left;
        return node;
      } else {
        // 2 children
        let smallestNode = this._findSmallestValueNode(node.right);
        node.key = smallestNode.key;
        node.value = smallestNode.value;
        // hacky but increment the count because we're going to re-delete with the recursive call below
        this._count++;
        node.right = this._deleteNode(node.right, smallestNode.key);
        return node;
      }
    }
  }

  delete(key) {
    let node = this._root;
    let deletedNode = this.lookup(key);
    const returnedFromDelete = this._deleteNode(node, key);
    this._root = returnedFromDelete;
    return deletedNode;
  }

  _findSmallestValueNode(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  count() {
    return this._count;
  }

  forEach(callback) {
    // This is a little different from the version presented in the video.
    // The form is similar, but it invokes the callback with more arguments
    // to match the interface for Array.forEach:
    //   callback({ key, value }, i, this)
    const visitSubtree = (node, callback, i = 0) => {
      if (node) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    };
    visitSubtree(this._root, callback);
  }
}

export default BinarySearchTree;
