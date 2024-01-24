import { createMachine, fromCallback } from "xstate";
import { createActorContext } from "@xstate/react";

export const machine = createMachine(
  {
    context: {
      clicked: false,
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
          },
        },
      },
      available: {
        type: "final",
      },
    },
    types: { events: {} as { type: "INITIALIZE.AUDIO" } },
  },
  {
    actions: {},
    actors: {
      INITIALIZER: fromCallback(({ sendBack }) => {
        function handler() {
          sendBack({ type: "INITIALIZE.AUDIO" });
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
