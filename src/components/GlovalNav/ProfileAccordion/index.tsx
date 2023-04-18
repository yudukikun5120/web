"use client";

import { useAuth0 } from "@auth0/auth0-react";
import clsx from "clsx";
import React, { ReactNode } from "react";

import { NicovideoRegisterPageLink } from "~/app/editor/nicovideo/Link";
import { LinkRegisterSemitag } from "~/app/editor/semitags/Link";
import { TagRegisterPageLink } from "~/app/editor/tags/Link";
import { YouLikesPageLink } from "~/app/me/likes/Link";
import MyMylistsPageLink from "~/app/me/mylists/Link";
import NicovideoRequestPageLink from "~/app/request/nicovideo/Link";
import { FragmentType, graphql, useFragment } from "~/gql";

import AboutMe from "./AboutMe";
import Notifications from "./Notifications";

const MenuItem: React.FC<{
  className?: string;
  Wrapper: React.FC<{
    className?: string;
    children?: ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  }>;
  children: ReactNode;
}> = ({ className, Wrapper, children }) => {
  return (
    <Wrapper
      className={clsx(
        className,
        ["block"],
        ["py-2"],
        ["px-4"],
        ["bg-white/75", "hover:bg-sky-300/75"],
        ["text-slate-900", "group-hover/link:text-sky-900"],
        ["text-xs"]
      )}
      onClick={(e) => {
        e.currentTarget.blur();
      }}
    >
      {children}
    </Wrapper>
  );
};

export const Fragment = graphql(`
  fragment GlobalNav_ProfileAccordion on Query {
    ...GlobalNav_ProfileAccordion_AboutMe
    ...GlobalNav_ProfileAccordion_Notifications
    whoami {
      name
      isEditor: hasRole(role: EDITOR)
      isAdmin: hasRole(role: ADMIN)
    }
  }
`);
export default function ProfileAccordion({
  className,
  style,
  ...props
}: {
  className?: string;
  style?: React.CSSProperties;
  fragment: FragmentType<typeof Fragment>;
}) {
  const { logout } = useAuth0();
  const fragment = useFragment(Fragment, props.fragment);
  const { whoami } = fragment;

  return (
    <div
      style={style}
      className={clsx(
        className,
        ["divide-y", "divide-y-slate-400/75"],
        ["shadow"],
        ["flex", "flex-col"],
        ["rounded-md"],
        ["backdrop-blur-[6px]"],
        ["overflow-hidden"]
      )}
    >
      <AboutMe fragment={fragment} className={clsx(["py-3", "px-4"])} />
      <Notifications fragment={fragment} className={clsx(["py-3", "px-4"])} />
      <div className={clsx(["grid"], ["grid-cols-1"])}>
        <MenuItem Wrapper={(props) => <YouLikesPageLink {...props} />}>
          いいねした動画
        </MenuItem>
        <MenuItem Wrapper={(props) => <MyMylistsPageLink {...props} />}>
          マイリスト
        </MenuItem>
        <MenuItem Wrapper={(props) => <NicovideoRequestPageLink {...props} />}>
          動画のリクエスト
        </MenuItem>
      </div>
      {whoami.isEditor && (
        <div className={clsx(["grid"], ["grid-cols-2"])}>
          <MenuItem
            className={clsx(["col-span-2"])}
            Wrapper={(props) => <NicovideoRegisterPageLink {...props} />}
          >
            ニコニコ動画から登録
          </MenuItem>
          <MenuItem
            className={clsx(["col-span-1"])}
            Wrapper={(props) => <TagRegisterPageLink {...props} />}
          >
            タグの登録
          </MenuItem>
          <MenuItem
            className={clsx(["col-span-1"])}
            Wrapper={(props) => <LinkRegisterSemitag {...props} />}
          >
            仮タグの解決
          </MenuItem>
        </div>
      )}
      <div className={clsx(["flex"], ["py-2", "px-4"], ["bg-slate-300/75"])}>
        <button
          onClick={() => {
            logout();
          }}
          className={clsx(
            ["text-xs"],
            ["text-slate-700", "hover:text-slate-500"]
          )}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
