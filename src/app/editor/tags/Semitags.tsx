"use client";

import "client-only";

import clsx from "clsx";
import React, { useEffect, useMemo } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { useQuery } from "urql";

import { FragmentType, graphql, useFragment } from "~/gql";
import { RegisterTagPage_Semitags_SelectedDocument } from "~/gql/graphql";

import { FormSchema } from "./FormSchema";

graphql(`
  query RegisterTagPage_Semitags_Selected($id: ID!) {
    getSemitag(id: $id) {
      id
      name
      video {
        id
        title
      }
    }
  }
`);
export const Selected: React.FC<{
  className?: string;
  semitagId: string;
  remove(): void;
  disabled: boolean;
}> = ({ className, semitagId, remove, disabled }) => {
  const [{ data }] = useQuery({
    query: RegisterTagPage_Semitags_SelectedDocument,
    variables: { id: semitagId },
  });

  return (
    <button
      type="button"
      className={clsx(
        className,
        ["px-4", "py-1"],
        ["hover:bg-blue-200"],
        ["grid", "grid-cols-2"]
      )}
      onClick={() => remove()}
      disabled={disabled || !data}
    >
      {data && (
        <>
          <div className={clsx(["flex"])}>
            <div className={clsx(["text-xs"])}>{data.getSemitag.name}</div>
          </div>
          <div className={clsx(["flex"])}>
            <div className={clsx(["text-xs"])}>
              {data.getSemitag.video.title}
            </div>
          </div>
        </>
      )}
    </button>
  );
};

const Fragment = graphql(`
  fragment RegisterTagPage_Semitags_Unselected on Semitag {
    id
    name
    video {
      id
      title
    }
  }
`);
export const UnselectedRaw: React.FC<{
  className?: string;
  append(): void;
  fragment: FragmentType<typeof Fragment>;
  disabled: boolean;
}> = ({ className, append, disabled, ...props }) => {
  const fragment = useFragment(Fragment, props.fragment);
  return (
    <button
      type="button"
      className={clsx(
        className,
        ["group"],
        ["px-4", "py-1"],
        ["grid", "grid-cols-2"],
        ["disabled:bg-slate-200", "hover:bg-blue-200"]
      )}
      onClick={() => append()}
      disabled={disabled}
    >
      <div
        className={clsx(
          ["text-xs"],
          ["text-slate-900", "group-disabled:text-slate-300"],
          ["text-left"]
        )}
      >
        {fragment.name}
      </div>
      <div
        className={clsx(
          ["text-xs"],
          ["text-slate-900", "group-disabled:text-slate-300"],
          ["text-left"]
        )}
      >
        {fragment.video.title}
      </div>
    </button>
  );
};

const Query = graphql(`
  query RegisterTagPage_Semitags_FindSemitags {
    findSemitags(checked: false) {
      nodes {
        ...RegisterTagPage_Semitags_Unselected
        id
        name
        video {
          id
          title
        }
      }
    }
  }
`);
export const Semitags: React.FC<{
  className?: string;
  fields: FieldArrayWithId<FormSchema, "resolveSemitags", "id">[];
  append: UseFieldArrayAppend<FormSchema, "resolveSemitags">;
  remove: UseFieldArrayRemove;
  setTemporaryPrimaryTitle(name: string): void;
}> = ({ className, fields, append, remove, setTemporaryPrimaryTitle }) => {
  const selectedIds = useMemo(
    () => fields.map(({ semitagId }) => semitagId),
    [fields]
  );
  const [{ data, fetching }, refetch] = useQuery({
    query: Query,
    variables: {
      // except: selectedIds
    },
    requestPolicy: "network-only",
  });
  useEffect(() => refetch(), [fields, refetch]);

  return (
    <div className={clsx(className, ["flex", "flex-col", ["gap-y-4"]])}>
      <div>
        <div>
          <div className={clsx(["text-xs"])}>解決される仮タグ</div>
        </div>
        <div
          className={clsx(
            ["mt-2"],
            ["flex-grow"],
            ["bg-slate-100"],
            ["h-24"],
            ["overflow-y-scroll"],
            ["border", "border-slate-300"]
          )}
        >
          <div
            className={clsx(
              ["divide-y", "divide-slate-300"],
              ["flex", "flex-col"]
            )}
          >
            {fields.map(({ id, semitagId }, index) => (
              <Selected
                key={id}
                semitagId={semitagId}
                remove={() => {
                  remove(index);
                }}
                disabled={fetching}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={clsx(["flex-grow"], ["flex", "flex-col"])}>
        <div className={clsx(["flex-shrink-0"])}>
          <div className={clsx(["text-xs"])}>仮タグを選択</div>
        </div>
        <div
          className={clsx(
            ["mt-2"],
            ["flex-grow"],
            ["bg-slate-100"],
            ["h-72"],
            ["overflow-y-scroll"],
            ["border", "border-slate-300"]
          )}
        >
          <div
            className={clsx(
              ["divide-y", "divide-slate-300"],
              ["flex", "flex-col"]
            )}
          >
            {data?.findSemitags.nodes.map((semitag) => (
              <UnselectedRaw
                key={semitag.id}
                fragment={semitag}
                append={() => {
                  append({ semitagId: semitag.id });
                  setTemporaryPrimaryTitle(semitag.name);
                }}
                disabled={selectedIds.includes(semitag.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
