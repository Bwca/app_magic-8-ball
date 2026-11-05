import { SettingsMenuStyle } from './settings-menu.style.enum';
import './settings-menu.style.scss';

const GEAR_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="3"></circle>
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
</svg>`;

export interface SettingsMenuOptions {
  isAiEnabled: boolean;
  onAiEnabledChange: (isEnabled: boolean) => void;
}

/**
 * Mounts the settings gear + panel. Clicks on the menu (and the click that closes it) never reach the
 * document-level click listener that shakes the ball.
 */
export function createSettingsMenu(host: HTMLElement, { isAiEnabled, onAiEnabledChange }: SettingsMenuOptions): void {
  const root = document.createElement('nav');
  root.className = SettingsMenuStyle.Root;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = SettingsMenuStyle.Button;
  button.title = 'Settings';
  button.setAttribute('aria-label', 'Settings');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = GEAR_ICON;

  const panel = document.createElement('div');
  panel.className = SettingsMenuStyle.Panel;
  panel.id = 'settings-menu-panel';
  button.setAttribute('aria-controls', panel.id);

  const toggle = document.createElement('label');
  toggle.className = SettingsMenuStyle.Toggle;

  const toggleText = document.createElement('span');
  toggleText.textContent = 'Generate answers with Chrome AI';

  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  toggleInput.className = SettingsMenuStyle.ToggleInput;
  toggleInput.checked = isAiEnabled;
  toggleInput.addEventListener('change', () => onAiEnabledChange(toggleInput.checked));

  const toggleSwitch = document.createElement('span');
  toggleSwitch.className = SettingsMenuStyle.ToggleSwitch;
  toggleSwitch.setAttribute('aria-hidden', 'true');

  toggle.append(toggleText, toggleInput, toggleSwitch);

  const note = document.createElement('p');
  note.className = SettingsMenuStyle.Note;
  note.textContent =
    "Answers are made up on your device by Chrome's built-in AI instead of picked from the classic set. " +
    'If the AI cannot come up with a fitting answer, the ball will ask you to try again.';

  panel.append(toggle, note);
  root.append(button, panel);
  host.appendChild(root);

  const setOpen = (isOpen: boolean): void => {
    root.classList.toggle(SettingsMenuStyle.IsOpen, isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
  };
  const isMenuOpen = (): boolean => root.classList.contains(SettingsMenuStyle.IsOpen);

  button.addEventListener('click', () => setOpen(!isMenuOpen()));
  root.addEventListener('click', (event) => event.stopPropagation());

  // Capture phase: a click outside the open menu only closes it, it doesn't also ask the ball.
  document.addEventListener(
    'click',
    (event) => {
      if (isMenuOpen() && !root.contains(event.target as Node)) {
        event.stopPropagation();
        setOpen(false);
      }
    },
    true
  );
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen()) {
      setOpen(false);
      button.focus();
    }
  });
}
