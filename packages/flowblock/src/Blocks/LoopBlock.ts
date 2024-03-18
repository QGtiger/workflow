import { Block } from "./Block";

export class LoopBlock extends Block {
  innerBlock?: Block;

  /**
   * 设置 innerBlock, 原先的 innerBlock 会被释放
   * @param item
   * @returns
   */
  setInnerBlock(item?: Block) {
    // 释放内存 清除innerBlock 内节点
    this.innerBlock && this.innerBlock.unlinkMemory();

    this.innerBlock = item;
    item && item.setParentProperty(this);

    this.updateNode();
    return item;
  }

  /**
   * 插入 innerBlock
   * @param item
   * @returns
   */
  insertBeforeInnerBlock(item: Block) {
    this.innerBlock && this.innerBlock.setParentProperty(item);

    item.lastBlock.setNextProperty(this.innerBlock);

    this.innerBlock = item;
    item.setParentProperty(this);

    this.updateNode();
    return item;
  }
}
