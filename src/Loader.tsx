import { MachineContext } from "./machine";
import { californiaUberAlles } from "./california-uber-alles";

const SOURCE_SONG = californiaUberAlles;

// console.log("SOURCE_SONG", SOURCE_SONG);

function Loader() {
  const { send } = MachineContext.useActorRef();

  return (
    <div>
      <h1>Loader</h1>
      <button
        onClick={() => {
          send({ type: "LOAD.SONG", sourceSong: SOURCE_SONG });
        }}
      >
        Load
      </button>
    </div>
  );
}

export default Loader;
