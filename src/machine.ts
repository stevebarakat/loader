import { assign, createMachine, fromPromise } from "xstate";
import { createActorContext } from "@xstate/react";
import { roxanne } from "./assets/songs/roxanne";
const styles = "background: green; padding: 0.5rem;";

type SourceSong = typeof roxanne;
type SourceTrack = (typeof roxanne.tracks)[0];
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
        },
        onDone: {
          target: "idle",
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
        console.log(`%c${input.title} - loaded ${0}% `, styles);
        async function decodeAudio(path: string) {
          const response = await fetch(path);
          return actx?.decodeAudioData(await response.arrayBuffer());
        }
        async function createAudioBuffers(tracks: SourceTrack[]) {
          let audioBuffers: (AudioBuffer | undefined)[] = [];
          let progress: number = 0;

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
            } finally {
              const files = tracks.length;
              progress = Math.ceil((progress += 100 / files));

              if (progress > 100) progress = 100;

              console.log(`%c${track.name} - loaded ${progress}% `, styles);
            }
          }
          return { audioBuffers };
        }
        createAudioBuffers(input?.tracks);
      }),
    },
  }
);

export const MachineContext = createActorContext(machine);
