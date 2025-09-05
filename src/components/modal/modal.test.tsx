import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Modal } from './modal';

beforeEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Modal component', () => {
  it('does not render when isOpen is false', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={false} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByText('Content')).toBeNull();
  });

  it('renders children into document.body when isOpen is true (portal)', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div data-testid="modal-child">Modal Content</div>
      </Modal>
    );

    const child = document.body.querySelector('[data-testid="modal-child"]');
    expect(child).toBeInTheDocument();
    expect(screen.getByTestId('modal-child')).toHaveTextContent(
      'Modal Content'
    );
    expect(document.body.querySelector('.modal-wrapper')).toBeInTheDocument();
    expect(document.body.querySelector('.modal-content')).toBeInTheDocument();
  });

  it('clicking on overlay (outside content) calls onClose', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div data-testid="inside">Inside</div>
      </Modal>
    );

    const wrapper = document.body.querySelector(
      '.modal-wrapper'
    ) as HTMLElement;
    expect(wrapper).toBeTruthy();

    await userEvent.click(wrapper);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking inside modal-content does NOT call onClose (stopPropagation)', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <button data-testid="inside-button">Do not close</button>
      </Modal>
    );

    const insideButton = screen.getByTestId('inside-button');
    await userEvent.click(insideButton);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('pressing Escape key calls onClose', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(escEvent);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for other keys', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    const otherEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(otherEvent);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    unmount();

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(escEvent);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('allows focusing an element inside modal and Escape still closes', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <button data-testid="focus-btn">Focus me</button>
      </Modal>
    );

    const btn = screen.getByTestId('focus-btn') as HTMLButtonElement;
    btn.focus();
    expect(document.activeElement).toBe(btn);

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(escEvent);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
