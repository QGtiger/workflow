import classNames from "classnames";

import { CommonFormFieldProps } from "../../typings";

const AuthTypeEnum: Record<
  string,
  {
    title: string;
    desc: string;
  }
> = {
  api_key: {
    title: "API Key",
    desc: "API Key 是一种简单的授权方式，通过在请求头中添加 API Key 来进行授权",
  },
  session_auth: {
    title: "Session Auth",
    desc: "Session Auth 是一种基于 Session 的授权方式，通过在请求头中添加 Session 来进行授权",
  },
  oauth2: {
    title: "OAuth2",
    desc: "OAuth2 是一种开放标准，允许用户授权第三方应用访问他们存储在另外的服务提供者上的信息，而不需要分享他们的访问权限",
  },
};

export default function AuthType({
  value,
  onChange,
}: CommonFormFieldProps<string>) {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(AuthTypeEnum).map(([key, { title, desc }]) => {
        const isSelected = value === key;
        return (
          <div
            key={key}
            className={classNames(
              "rounded-md border  border-solid px-[16px] pt-[8px] pb-[14px] relative flex-col justify-between cursor-pointer overflow-hidden  transition-all duration-300 ease-in-out",
              {
                "border-[#ECEDEF] hover:bg-[#F6F8FB]": !isSelected,
                "bg-[#EFF4FF] border-[#3170FA] hover:bg-[#EFF4FF]": isSelected,
              }
            )}
            onClick={() => {
              if (!isSelected) {
                onChange(key);
              }
            }}
          >
            <div className="text-[#09090B]">{title}</div>
            <div className="text-xs text-[#888F9D]">{desc}</div>
            {isSelected && (
              <div className="absolute right-0 top-0 w-0 h-0 border-solid border-t-[16px] border-transparent border-l-[16px] border-r-[16px] border-b-[16px] border-r-[#3170FA] border-t-[#3170FA]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 10 7"
                  fill="red"
                  className="absolute top-[-13px] right-[-13px]"
                >
                  <path
                    d="M0.999893 2.64664C1.09366 2.55291 1.22081 2.50025 1.35339 2.50025C1.48598 2.50025 1.61313 2.55291 1.70689 2.64664L3.74289 4.68164L8.27789 0.146643C8.32433 0.100155 8.37947 0.0632755 8.44017 0.0381134C8.50087 0.0129512 8.56594 0 8.63164 0C8.69735 0 8.76241 0.0129512 8.82311 0.0381134C8.88381 0.0632755 8.93896 0.100155 8.98539 0.146643L9.33839 0.500143C9.43213 0.593907 9.48479 0.721061 9.48479 0.853643C9.48479 0.986225 9.43213 1.11338 9.33839 1.20714L4.09639 6.45014C4.04996 6.49663 3.99481 6.53351 3.93411 6.55867C3.87341 6.58384 3.80835 6.59679 3.74264 6.59679C3.67694 6.59679 3.61187 6.58384 3.55117 6.55867C3.49047 6.53351 3.43533 6.49663 3.38889 6.45014L0.646393 3.70764C0.552658 3.61388 0.5 3.48673 0.5 3.35414C0.5 3.22156 0.552658 3.09441 0.646393 3.00064L0.999893 2.64664Z"
                    fill="white"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
