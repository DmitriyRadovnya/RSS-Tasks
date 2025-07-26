import './backup-ui.css';

export default function BackupUI() {
  function handleReload() {
    window.location.reload();
  }

  return (
    <div className="errorContainer">
      <h2 style={{ color: 'red' }}>
        Oh no, all the Pokemon have gone into hibernation.
      </h2>
      <p>Let&apos;s rewind time to catch all the Pokemon?</p>
      <button onClick={() => handleReload()} className="reloadButton">
        Rewind time!
      </button>
    </div>
  );
}
