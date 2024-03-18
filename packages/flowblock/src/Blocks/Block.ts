import { EventsDispatcher } from "../EventsDispatcher";

let uid = 1;
// 默认Block 可以理解为单个 block 基类
export class Block extends EventsDispatcher<{
  update: any;
}> {
  nid: number = uid++;

  next?: Block;
  parent?: Block;

  setNextProperty<T extends Block>(item?: T) {
    return (this.next = item);
  }

  setParentProperty<T extends Block>(item?: T) {
    return (this.parent = item);
  }

  /**
   * 派发更新事件
   */
  updateNode() {
    this.dispathcEvent("update");
  }

  get lastBlock() {
    let c: Block = this;
    let n = c.next;
    while (n) {
      c = n;
      n = n.next;
    }
    return c;
  }

  setLastNext<T extends Block>(item: T) {
    return this.lastBlock.setNext(item);
  }

  /**
   * 插入节点
   * @param item 节点
   * @returns 插入节点
   */
  setNext<T extends Block>(item: T) {
    const _lastItemBlock = item.lastBlock;
    this.next &&
      _lastItemBlock.setNextProperty(this.next) &&
      this.next.setParentProperty(_lastItemBlock);

    this.next = item;
    item.parent = this;

    this.updateNode();
    return item;
  }

  /**
   * 删除节点
   */
  break() {
    const { parent, next } = this;
    parent && parent.setNextProperty(next);
    next && next.setParentProperty(parent);

    this.unlinkMemory();
    this.updateNode();
  }

  // 删除引用，便于GC
  unlinkMemory() {
    this.next = undefined;
    this.parent = undefined;
  }

  // 删除当前节点的next指向
  unlinkNext() {
    if (!this.next) return;
    this.next.setParentProperty(undefined);
    this.setNextProperty(undefined);
    this.updateNode();
  }
}
