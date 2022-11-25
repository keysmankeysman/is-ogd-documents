class Node {
  constructor (data) {
    for (const key of Object.keys(data)) {
      this[key] = data[key]
    }
    this.children = data.child || []
  }
  add (data) {
    this.children.push(new Node(data))
  }
  remove (data) {
    this.children = this.children.filter(el => {
      el.id !== data.id
    })
  }
}

class Tree {
  constructor () {
    this.root = []
  }
  traverseBF (cb) {
    const arr = Array.isArray(this.root) ? this.root : [this.root]
    for (let i = 0; i < arr.length; i++) {
      const node = arr[i]
      cb(node)
      arr.push(...node.children)
    }
  }
}

class TreeBuilder {
  constructor (source, cb) {
    this.tree = new Tree()
    this.source = source
    this.notNullItems = []
    // eslint-disable-next-line no-unneeded-ternary
    this.callback = cb ? cb : item => {
      for (const sourceItem of this.source) {
        if (sourceItem.parentId === item.id) {
          this.notNullItems = this.notNullItems.filter(el => el.id !== sourceItem.id)
          item.add(sourceItem)
        }
      }
    }
  }
  // построение дерева
  buildTree () {
    for (const item of this.source) {
      if (item.parentId === null || item && item.root === true) {
        this.tree.root.push(new Node(item))
      } else {
        this.notNullItems.push(new Node(item))
      }
    }
    // for (const item of this.source) {
    //   if (item.parentId === null || item.prototype.hasOwnProperty('root') && item.root === true) {
    //     this.tree.root.push(new Node(item))
    //   } else {
    //     this.notNullItems.push(new Node(item))
    //   }
    // }
    this.tree.traverseBF(this.callback)
    this.tree.root = this.tree.root.filter(el => el.root === true || el.parentId === null)
    return this.tree
  }
  // обход
  walk () {
    this.tree = new Tree()
    this.tree.root = this.source
    this.tree.traverseBF(this.callback)
    return this.tree
  }
  /**
   * @param {Object} el
   * @param {String} property
   */
  async search (el, property) {
    this.tree = new Tree()
    this.tree.root = this.source
    return new Promise((resolve) => {
      this.tree.traverseBF(item => {
        if (item[property] === el[property]) {
          resolve(item)
        }
      })
    })
  }

  multipleSearch (el, property) {
    this.tree = new Tree()
    this.tree.root = this.source
    let result = []
    this.tree.traverseBF(item => {
      if (item[property] === el[property]) {
        result.push(item)
      }
    })
    return result
  }

  /**
   * @param {Object} tree
   */
  buildListFromTree () {
    let list = []
    this.tree = new Tree()
    this.tree.root = this.source
    this.tree.traverseBF(item => {
      list.push(item)
    })
    for (const item of list) {
      item.children = []
    }
    return list
  }
}

export { TreeBuilder }
