import './App.css';
import { useState } from 'react';
import { Modal } from './components/modal/modal';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { UserTile } from './components/user-tile/user-tile';
import { UncontrolledForm } from './components/forms/uncontrolled-form/uncontrolled-form';
import { HookForm } from './components/forms/hook-form/hook-form';

function App() {
  const [isUncontrolledModalOpen, setIsUncontrolledModalOpen] =
    useState<boolean>(false);
  const [isHookModalOpen, setIsHookModalOpen] = useState<boolean>(false);
  const users = useSelector((state: RootState) => state.users);

  const registrationHandler = () => {
    setIsUncontrolledModalOpen(true);
  };

  const hookRegistrationHandler = () => {
    setIsHookModalOpen(true);
  };

  return (
    <div className="app">
      <header className="header">
        <button onClick={registrationHandler}>useRef Form</button>
        <button onClick={hookRegistrationHandler}>React-Hook-Form</button>
      </header>
      <main className="main">
        <ul className="user-list">
          {users.map((user, index) => (
            <UserTile key={`${user.name}/${index}`} data={user} />
          ))}
        </ul>
      </main>
      <footer className="footer">
        <p>RSSchool</p>
      </footer>
      <Modal isOpen={isHookModalOpen} onClose={() => setIsHookModalOpen(false)}>
        <HookForm onClose={() => setIsHookModalOpen(false)} />
      </Modal>
      <Modal
        isOpen={isUncontrolledModalOpen}
        onClose={() => setIsUncontrolledModalOpen(false)}
      >
        <UncontrolledForm onClose={() => setIsUncontrolledModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default App;
