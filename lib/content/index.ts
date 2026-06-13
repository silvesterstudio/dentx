import { ro } from "./ro";
import { ru } from "./ru";
import type { Content, Lang } from "./types";

export type { Content, Lang };

export const dictionaries: Record<Lang, Content> = { ro, ru };

export const LANGS: Lang[] = ["ro", "ru"];
