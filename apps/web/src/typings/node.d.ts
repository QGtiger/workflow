interface FlowNode {
  id: string;
  connectorCode: string;
  connectorName: string;
  logo: string;
  version: string;
  actionCode: string;
  actionName: string;

  authId?: string;
  needAuth?: boolean;

  children?: string[];
  parent?: string;
  next?: string;

  inputs?: any;
  outputs?: any;
}
