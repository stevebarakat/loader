import { MachineContext } from "./machine";

function Initializer() {
  const { send } = MachineContext.useActorRef();
  const state = MachineContext.useSelector((state) => state);
  return (
    <div>
      <h1>Loader</h1>
      <button
        onClick={() => {
          send({ type: "LOAD.SONG", url: "/dk/drums.ogg" });
          console.log("state.context", state.context);
          console.log("state", state.value);
        }}
      >
        Load
      </button>
    </div>
  );
}

export default Initializer;
