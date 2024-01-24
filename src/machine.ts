import { createMachine } from "xstate";
import { createActorContext } from "@xstate/react";

export const machine = createMachine(
  {
    context: {
      clicked: false,
    },
    initial: "First State",
    states: {
      uninitialized: {
        on: {
          INITIALIZE: {
            target: "initialized",
            actions: {
              type: "setInitialized",
            },
          },
        },
      },
      initialized: {
        invoke: {
          src: "INITIALIZER",
        },
      },
    },
    types: { events: {} as { type: "INITIALIZE" } },
  },
  {
    actions: {},
    actors: {},
    guards: {},
    delays: {},
  }
);

export const MachineContext = createActorContext(machine);
