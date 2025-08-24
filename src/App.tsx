import './App.css';
import { useState } from 'react';
import { HookForm } from './components/hook-form/hook-form';
import { Modal } from './components/modal/modal';

function App() {
  // const [isUncontrolledModalOpen, setIsUncontrolledModalOpen] =
  //   useState<boolean>(false);
  const [isHookModalOpen, setIsHookModalOpen] = useState<boolean>(false);

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
        <Modal
          isOpen={isHookModalOpen}
          onClose={() => setIsHookModalOpen(false)}
        >
          <HookForm />
        </Modal>
      </main>
      <footer className="footer">
        <p>RSSchool</p>
      </footer>
    </>
  );
}

export default App;
