import { assign, createMachine, fromPromise } from "xstate";
import { createActorContext } from "@xstate/react";

type Context = {
  audioContext: AudioContext | undefined;
  song: { url: string } | undefined;
};

export const machine = createMachine(
  {
    context: {
      audioContext: undefined,
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
          onDone: {
            actions: ({ event }) => console.log("snapshot", event.output),
          },
        },
      },
    },
    types: {
      context: {} as Context,
      events: {} as { type: "LOAD.SONG"; url: string },
    },
  },
  {
    actions: {
      setAudioContext: assign(() => ({
        audioContext: new AudioContext(),
      })),
      setSong: assign(({ context, event }) => ({
        ...context.song,
        url: event.url,
      })),
    },
    actors: {
      LOADER: fromPromise(async () => {
        // Simulate network request
        const promise = new Promise((resolve) =>
          setTimeout(() => resolve({ url: "/dk/drums.ogg" }), 1000)
        );
        return promise.then((resolve) => {
          console.log("resolve", resolve);
          return resolve;
        });
      }),
    },
    guards: {},
    delays: {},
  }
);

export const MachineContext = createActorContext(machine);
