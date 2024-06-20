interface ApiMetaInfo {
  name: string;
  description: string;
  uid: string;
  parentUid?: string;
  isDir: boolean;
  createTime: number;
  updateTime: number;
  children?: ApiMetaInfo[];
}
