import { assign, createMachine, fromPromise } from "xstate";
import { createActorContext } from "@xstate/react";
import { californiaUberAlles } from "./california-uber-alles";

type SourceSong = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  year: string;
  studio: string;
  location: string;
  bpm: number;
  tracks: SourceTrack[];
};

type SourceTrack = {
  id: string;
  name: string;
  file: string;
};

type Context = {
  sourceSong: SourceSong | undefined;
};

export const machine = createMachine(
  {
    context: {
      sourceSong: undefined,
    },
    initial: "idle",
    states: {
      idle: {
        on: {
          "LOAD.SONG": {
            target: "loading",
            actions: {
              type: "setSong",
            },
          },
        },
      },
      loading: {
        invoke: {
          src: "LOADER",
          input: { sourceSong: californiaUberAlles },
          onDone: {
            target: "idle",
            actions: ({ event }) => console.log("snapshot", event),
          },
        },
      },
    },
    types: {
      context: {} as Context,
      events: {} as {
        type: "LOAD.SONG";
        sourceSong: SourceSong;
      },
    },
  },
  {
    actions: {
      setSong: assign(({ event }) => ({
        sourceSong: event.sourceSong,
      })),
    },
    actors: {
      LOADER: fromPromise(async ({ input }) => {
        const actx = new AudioContext();
        const file = californiaUberAlles.tracks[0].file;
        console.log("file", file);
        async function decodeAudio(file: string) {
          try {
            const response = await fetch("/california-uber-alles/01.kick.ogg");
            return actx.decodeAudioData(await response.arrayBuffer());
          } catch (err) {
            if (err instanceof Error) {
              console.error(
                `Error: ${err.message} the audio file at: ${file} `
              );
            }
          }
        }
        try {
          return await decodeAudio(file);
        } catch (error) {
          console.error("error", error);
        }
      }),
    },
    guards: {},
    delays: {},
  }
);

export const MachineContext = createActorContext(machine);
