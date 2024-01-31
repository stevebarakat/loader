import { MachineContext } from "./machine";
import { californiaUberAlles } from "./california-uber-alles";
import { TrackContext } from "./machines/trackMachine";
import Track from "./Track";

const SOURCE_SONG = californiaUberAlles;

export default function Mixer() {
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
      {SOURCE_SONG.tracks.map((track) => (
        <TrackContext.Provider key={track.id}>
          <Track />
        </TrackContext.Provider>
      ))}
    </div>
  );
}
