import { assign, createMachine, fromPromise } from "xstate";
import { createActorContext } from "@xstate/react";
import { extractFileName, capitalizeFirstLetter } from "./utils";

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
  path: string;
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
          input: ({ context }) => context.sourceSong,
          onDone: {
            target: "idle",
            actions: ({ event }) => console.log("snapshot", event),
          },
        },
      },
    },
    types: {
      input: {} as SourceSong,
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
        let audioBuffers: (AudioBuffer | undefined)[] = [];

        async function decodeAudio(path: string) {
          console.log("path", path);
          const response = await fetch(`california-uber-alles/${path}`);
          return actx?.decodeAudioData(await response.arrayBuffer());
        }
        async function createAudioBuffers(tracks: SourceTrack[]) {
          for (const track of tracks) {
            try {
              const buffer: AudioBuffer | undefined = await decodeAudio(
                track.path
              );
              audioBuffers = [buffer, ...audioBuffers];
            } catch (err) {
              if (err instanceof Error)
                console.error(
                  `Error: ${err.message} for file at: ${track.path} `
                );
            }
          }
          return audioBuffers;
        }
        createAudioBuffers(input?.tracks);
      }),
    },
    guards: {},
    delays: {},
  }
);

export const MachineContext = createActorContext(machine);
