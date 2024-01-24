import { MachineContext } from "./machine";

function Initializer() {
  const { send } = MachineContext.useActorRef();
  const state = MachineContext.useSelector((state) => state);
  return (
    <div>
      <h1>Initializer</h1>
      <button
        onClick={() => {
          send({ type: "INITIALIZE.AUDIO" });
          console.log("state", state);
        }}
      >
        Initialize
      </button>
    </div>
  );
}

export default Initializer;
