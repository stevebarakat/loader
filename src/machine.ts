import { assign, createMachine, fromCallback } from "xstate";
import { createActorContext } from "@xstate/react";

type Context = {
  audioContext: AudioContext | undefined;
};

export const machine = createMachine(
  {
    context: {
      audioContext: undefined,
    },
    initial: "unavailable",
    states: {
      unavailable: {
        invoke: {
          src: "INITIALIZER",
        },
        on: {
          "INITIALIZE.AUDIO": {
            target: "available",
            actions: {
              type: "setAudioContext",
            },
          },
        },
      },
      available: {
        type: "final",
      },
    },
    types: {
      context: {} as Context,
      events: {} as { type: "INITIALIZE.AUDIO" },
    },
  },
  {
    actions: {
      setAudioContext: assign(() => ({
        audioContext: new AudioContext(),
      })),
    },
    actors: {
      INITIALIZER: fromCallback(({ sendBack }) => {
        function handler() {
          const audioContext = new AudioContext();
          sendBack({ type: "INITIALIZE.AUDIO", audioContext });
        }
        document.body.addEventListener("click", handler);
        return () => {
          document.body.removeEventListener("click", handler);
        };
      }),
    },
    guards: {},
    delays: {},
  }
);

export const MachineContext = createActorContext(machine);
