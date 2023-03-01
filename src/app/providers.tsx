"use client";

import { cacheExchange } from "@urql/exchange-graphcache";
import { ReactNode } from "react";
import {
  createClient as createUrqlClient,
  dedupExchange,
  fetchExchange,
  Provider as UrqlProvider,
} from "urql";

import { GraphCacheConfig } from "~/gql/graphql";
export const handlers = [];

const urqlClient = createUrqlClient({
  url: new URL("/graphql", process.env.NEXT_PUBLIC_API_ENDPOINT).toString(),
  fetchOptions: {
    credentials: "include",
    mode: "cors",
  },
  exchanges: [
    dedupExchange,
    cacheExchange<GraphCacheConfig>({
      keys: {
        SearchTagsPayload() {
          return null;
        },
        SearchTagsItem() {
          return null;
        },
        SearchVideosPayload() {
          return null;
        },
        SearchVideosItem() {
          return null;
        },
        TagConnection() {
          return null;
        },
        VideoConnection() {
          return null;
        },
        MylistRegistrationConnection() {
          return null;
        },
        VideoSimilarVideosPayload() {
          return null;
        },
        VideoSimilarity() {
          return null;
        },
        MylistRecommendedVideosPayload() {
          return null;
        },
        MylistVideoRecommendation() {
          return null;
        },
        SemitagConnection() {
          return null;
        },
        SigninSucceededPayload() {
          return null;
        },
        SigninFailedPayload() {
          return null;
        },
        SignupSucceededPayload() {
          return null;
        },
        FetchNicovideoPayload() {
          return null;
        },
        NicovideoOriginalSource() {
          return null;
        },
        NicovideoOriginalSourceTag() {
          return null;
        },
        NicovideoOriginalSourceTagSearchTagsItem() {
          return null;
        },
        NicovideoOriginalSourceTagSearchTagsPayload() {
          return null;
        },
        RequestNicovideoRegistrationSucceededPayload() {
          return null;
        },
      },
    }),
    fetchExchange,
  ],
});

export default function Providers({ children }: { children: ReactNode }) {
  return <UrqlProvider value={urqlClient}>{children}</UrqlProvider>;
}
