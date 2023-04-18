import clsx from "clsx";
import React, { ReactNode } from "react";

import { MylistTitle } from "~/components/common/MylistTitle";
import { VideoThumbnail } from "~/components/common/VideoThumbnail";
import { UserIcon } from "~/components/UserIcon";
import { FragmentType, graphql, useFragment } from "~/gql";

export const Fragment = graphql(`
  fragment UserMylistsPage_MylistsListItem on Mylist {
    ...MylistTitle
    ...MylistLinkSwitch
    id
    isLikeList
    range
    holder {
      ...UserIcon
      name
      displayName
    }
    registrations(first: 5, orderBy: { createdAt: DESC }) {
      nodes {
        id
        video {
          ...VideoThumbnail
          id
        }
      }
    }
  }
`);
export const MylistListItem: React.FC<{
  className?: string;
  fragment: FragmentType<typeof Fragment>;
  Link: React.FC<{ className?: string; children: ReactNode }>;
}> = ({ className, Link, ...props }) => {
  const fragment = useFragment(Fragment, props.fragment);
  const { holder, registrations } = fragment;
  return (
    <div
      className={clsx(
        className,
        ["border", "border-slate-300"],
        ["bg-slate-100"],
        ["py-3"],
        ["px-4"],
        ["flex", "items-center"],
        ["rounded"],
        ["group/mylist"]
      )}
    >
      <div className={clsx(["flex-grow"], ["flex-col"])}>
        <div>
          <Link>
            <MylistTitle fragment={fragment} />
          </Link>
        </div>
        <div className={clsx(["mt-1"], ["flex", "items-center"])}>
          <UserIcon fragment={holder} size={24} />
          <div className={clsx(["ml-1"], ["text-xs"])}>
            <span className={clsx(["text-slate-900"])}>
              {holder.displayName}
            </span>
            <span className={clsx(["ml-1"], ["text-slate-600"], ["font-mono"])}>
              @{holder.name}
            </span>
          </div>
        </div>
        <div className={clsx(["mt-1"], ["flex", "items-center", "gap-x-2"])}>
          <div className={clsx(["text-xs"], ["text-slate-600"])}>
            {fragment.range}
          </div>
        </div>
      </div>
      <div
        className={clsx(
          ["relative"],
          ["w-[512px]"],
          ["overflow-hidden"],
          ["border", "border-slate-300"],
          ["bg-slate-200"],
          ["px-4"],
          ["py-2"],
          ["rounded"]
        )}
      >
        <div className={clsx(["z-0"], ["flex", "gap-x-2"], ["h-[72px]"])}>
          {registrations.nodes.map(({ id, video }) => (
            <div key={id}>
              <VideoThumbnail
                className={clsx(["w-[96px]"], ["h-full"])}
                fragment={video}
                width={96}
                height={72}
              />
            </div>
          ))}
        </div>
        <div
          className={clsx(
            ["flex", "items-end"],
            ["z-1"],
            ["absolute"],
            ["inset-0"],
            ["px-4"],
            ["py-2"],
            ["bg-gradient-to-r", "from-transparent", "to-slate-200"]
          )}
        >
          <p className={clsx(["text-xs"], ["text-slate-700"])}>
            {registrations.nodes.length === 0 && (
              <>登録されている動画はありません。</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
