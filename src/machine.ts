import { assign, createMachine, fromPromise } from "xstate";
import { createActorContext } from "@xstate/react";

type Context = {
  song: { url: string } | undefined;
};

export const machine = createMachine(
  {
    context: {
      song: { url: "" },
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
          input: { url: "/dk/drums.ogg" },
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
        url: string;
      },
    },
  },
  {
    actions: {
      setSong: assign(({ context, event }) => ({
        song: {
          ...context.song,
          url: event.url,
        },
      })),
    },
    actors: {
      LOADER: fromPromise(async ({ input }) => {
        const actx = new AudioContext();
        const url = input?.url;
        async function decodeAudio(url: string) {
          try {
            const response = await fetch(url);
            return actx.decodeAudioData(await response.arrayBuffer());
          } catch (err) {
            if (err instanceof Error) {
              console.error(`Error: ${err.message} the audio file at: ${url} `);
            }
          }
        }
        try {
          return await decodeAudio(url);
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
