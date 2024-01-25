import Loader from "./Loader";
import { MachineContext } from "./machine";

function App() {
  return (
    <MachineContext.Provider>
      <Loader />
    </MachineContext.Provider>
  );
}

export default App;
