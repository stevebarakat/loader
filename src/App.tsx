import Initializer from "./Initializer";
import { MachineContext } from "./machine";

function App() {
  return (
    <MachineContext.Provider>
      <Initializer />
    </MachineContext.Provider>
  );
}

export default App;
