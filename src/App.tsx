import './App.css';
import { useState } from 'react';
import { HookForm } from './components/hook-form/hook-form';
import { Modal } from './components/modal/modal';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { UserTile } from './components/user-tile/user-tile';

function App() {
  // const [isUncontrolledModalOpen, setIsUncontrolledModalOpen] =
  //   useState<boolean>(false);
  const [isHookModalOpen, setIsHookModalOpen] = useState<boolean>(false);
  const users = useSelector((state: RootState) => state.users);

  const registrationHandler = () => {
    // setIsUncontrolledModalOpen(true);
    setIsHookModalOpen(false);
  };

  const hookRegistrationHandler = () => {
    setIsHookModalOpen(true);
    // setIsUncontrolledModalOpen(false);
  };

  return (
    <>
      <header className="header">
        <button onClick={registrationHandler}>Registration</button>
        <button onClick={hookRegistrationHandler}>
          Registration with HookForm
        </button>
      </header>
      <main className="main">
        {users.map((user, index) => (
          <UserTile key={`${user.name}/${index}`} data={user} />
        ))}
      </main>
      <footer className="footer">
        <p>RSSchool</p>
      </footer>
      <Modal isOpen={isHookModalOpen} onClose={() => setIsHookModalOpen(false)}>
        <HookForm />
      </Modal>
    </>
  );
}

export default App;
