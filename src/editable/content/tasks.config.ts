import type { TaskKey } from "@/lib/site-config";

export const slot4TaskSupport = {
  article: false,
  classified: false,
  sbm: true,
  profile: true,
  pdf: false,
  listing: false,
  image: false,
} satisfies Record<TaskKey, boolean>;

export const slot4TaskNotes = {
  article: "Reading room — long-form resources",
  classified: "Notice board — time-boxed listings",
  sbm: "The Library — curated finds and collections",
  profile: "Curator identity (functional; hidden from public UI)",
  pdf: "Documents and downloadable references",
  listing: "Directory-style entries",
  image: "Visual gallery",
} satisfies Record<TaskKey, string>;
