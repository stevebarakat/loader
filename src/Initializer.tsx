import { MachineContext } from "./machine";

function Initializer() {
  const { send } = MachineContext.useActorRef();
  const context = MachineContext.useSelector((state) => state.context);
  console.log("context", context);
  return (
    <div>
      <h1>Initializer</h1>
      <button onClick={() => send({ type: context.clicked })}>
        Initialize
      </button>
    </div>
  );
}

export default Initializer;
