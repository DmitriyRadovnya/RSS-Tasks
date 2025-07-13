import React from 'react';
import './backup-ui.css';

export default class BackupUI extends React.Component {
  handleReload = () => {
    window.location.reload();
  };

  render() {
    return (
      <div className="errorContainer">
        <h2 style={{ color: 'red' }}>
          Oh no, all the Pokemon have gone into hibernation.
        </h2>
        <p>Let&apos;s rewind time to catch all the Pokemon?</p>
        <button onClick={this.handleReload} className="reloadButton">
          Rewind time!
        </button>
      </div>
    );
  }
}
