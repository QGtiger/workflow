import {
  ArgsProps,
  NotificationInstance,
} from "antd/es/notification/interface";

export const NotificationRef = {
  current: null as unknown as NotificationInstance,
};

export function createNotification(args: ArgsProps) {
  return NotificationRef.current.open(args);
}

export function createSucNotification(args: ArgsProps) {
  return createNotification({
    ...args,
    type: "success",
  });
}
