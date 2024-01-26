import { MachineContext } from "./machine";
import { californiaUberAlles } from "./california-uber-alles";

const SOURCE_SONG = californiaUberAlles;

function Loader() {
  const { send } = MachineContext.useActorRef();
  const state = MachineContext.useSelector((s) => s);
  console.log("state", state.value);

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
