import "server-only";

import { getMuxConfig } from "@/lib/mux/config";
import Mux from "@mux/mux-node";

let client: Mux | undefined;

export function getMuxClient(): Mux {
  if (!client) {
    const { tokenId, tokenSecret } = getMuxConfig();
    client = new Mux({ tokenId, tokenSecret });
  }

  return client;
}
