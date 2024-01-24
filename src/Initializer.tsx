import { MachineContext } from "./machine";

function Initializer() {
  const { send } = MachineContext.useActorRef();
  const state = MachineContext.useSelector((state) => state);
  return (
    <div>
      <h1>Initializer</h1>
      <button
        onClick={() => {
          console.log("state.context", state.context);
          console.log("state", state.value);
        }}
      >
        Initialize
      </button>
    </div>
  );
}

export default Initializer;
