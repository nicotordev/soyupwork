import "dotenv/config";

import Mux from "@mux/mux-node";

type DemoVideo = {
  key: string;
  envName: string;
  title: string;
  url: string;
};

const DEMO_VIDEOS: DemoVideo[] = [
  {
    key: "welcome",
    envName: "DEMO_VIDEO_WELCOME_PLAYBACK_ID",
    title: "Demo course - Bienvenida",
    url: "https://muxed.s3.amazonaws.com/leds.mp4",
  },
  {
    key: "job-selection",
    envName: "DEMO_VIDEO_JOB_SELECTION_PLAYBACK_ID",
    title: "Demo course - Matriz de priorizacion",
    url: "https://storage.googleapis.com/muxdemofiles/mux.mp4",
  },
  {
    key: "profile-audit",
    envName: "DEMO_VIDEO_PROFILE_AUDIT_PLAYBACK_ID",
    title: "Demo course - Auditoria de perfil",
    url: "https://muxed.s3.amazonaws.com/leds.mp4",
  },
  {
    key: "proposal-structure",
    envName: "DEMO_VIDEO_PROPOSAL_STRUCTURE_PLAYBACK_ID",
    title: "Demo course - Estructura de propuesta",
    url: "https://storage.googleapis.com/muxdemofiles/mux.mp4",
  },
  {
    key: "interview",
    envName: "DEMO_VIDEO_INTERVIEW_PLAYBACK_ID",
    title: "Demo course - Guion de entrevista",
    url: "https://muxed.s3.amazonaws.com/leds.mp4",
  },
  {
    key: "onboarding",
    envName: "DEMO_VIDEO_ONBOARDING_PLAYBACK_ID",
    title: "Demo course - Onboarding de cliente",
    url: "https://storage.googleapis.com/muxdemofiles/mux.mp4",
  },
];

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} debe estar configurado.`);
  }
  return value;
}

function isPersistentAssetRequested(): boolean {
  return process.env.DEMO_MUX_TEST_ASSETS === "false";
}

async function createDemoAsset(client: Mux, video: DemoVideo) {
  const asset = await client.video.assets.create({
    inputs: [{ url: video.url }],
    playback_policies: ["public"],
    video_quality: "basic",
    test: !isPersistentAssetRequested(),
    passthrough: video.key,
    meta: {
      title: video.title,
      external_id: `soyupwork-demo-${video.key}`,
      creator_id: "soyupwork-demo",
    },
  });
  const playbackId = asset.playback_ids?.[0]?.id;

  if (!playbackId) {
    throw new Error(`Mux no devolvio playback ID para ${video.key}.`);
  }

  return {
    assetId: asset.id,
    playbackId,
    status: asset.status,
  };
}

async function main() {
  const tokenId = requiredEnv("MUX_TOKEN_ID");
  const tokenSecret = requiredEnv("MUX_TOKEN_SECRET");
  const client = new Mux({ tokenId, tokenSecret });
  const persistent = isPersistentAssetRequested();

  console.log(
    persistent
      ? "Creating persistent Mux assets. This can incur Mux costs."
      : "Creating Mux test assets. They are watermarked and expire after 24 hours.",
  );

  const envLines: string[] = [];

  for (const video of DEMO_VIDEOS) {
    console.log(`\nCreating ${video.title} from ${video.url}`);
    const result = await createDemoAsset(client, video);
    console.log(
      `Created asset ${result.assetId} (${result.status}) with playback ${result.playbackId}`,
    );
    envLines.push(`${video.envName}=${result.playbackId}`);
  }

  console.log("\nAdd these values to your local env:");
  console.log(envLines.join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
