import { Block } from "./Block";

export class PathsBlock extends Block {
  // 分支子节点
  children: Block[] = [];

  /**
   * 查询子节点索引值
   * @param item 子节点
   * @returns 子节点索引值，未查找到返回 -1
   */
  findChildIndex(item: Block) {
    return this.children.findIndex((it) => it === item);
  }

  /**
   * 查询是否包含子节点
   * @param item 子节点
   * @returns 是否有子节点
   */
  hasChild(item: Block) {
    return this.children.indexOf(item) !== -1;
  }

  /**
   * 添加子节点
   * @param item 子节点
   * @param index 子节点插入位置
   * @returns 子节点
   */
  addChild(item: Block, index: number = this.children.length) {
    this.children.splice(index, 0, item);
    // 初始化
    item.setParentProperty(this);
    this.updateNode();
    return item;
  }

  /**
   * 删除子节点
   * @param item 子节点
   * @returns 是否删除成功
   */
  deleteChild(item: Block) {
    const i = this.findChildIndex(item);
    // 存在则删除
    if (i !== -1) {
      this.children.splice(i, 1);
      item.setParentProperty(undefined);
      this.updateNode();
      return true;
    }
    return false;
  }
}
