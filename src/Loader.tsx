import { songs } from "./assets/songs";
import { MachineContext } from "./machine";
import { californiaUberAlles } from "./california-uber-alles";

function Loader() {
  const { send } = MachineContext.useActorRef();
  const state = MachineContext.useSelector((s) => s);
  console.log("state", state.value);

  function handleSongSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    const song = songs.find((song) => song.slug === event.target.value);
    if (song) send({ type: "LOAD.SONG", sourceSong: song });
  }

  return (
    <div>
      <h1>Loader</h1>
      <select
        name="songs"
        onChange={handleSongSelect}
        value={state.context.sourceSong?.slug ?? ""}
      >
        <option value="" disabled>
          Choose a song :
        </option>
        {songs.map((song) => (
          <option key={song.id} value={song.slug}>
            {song.artist} - {song.title}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Loader;
