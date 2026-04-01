import { getConfig, saveConfig, resetConfig, defaultConfig } from './drum_config';
import type { DrumKeyConfig } from './drum_config';

let rebuildAppUI: () => void;
let reattachAppListeners: () => void;
let isInitialized = false; 

export function initCustomizeMode(rebuildUI: () => void, reattachListeners: () => void) {
  rebuildAppUI = rebuildUI;
  reattachAppListeners = reattachListeners;
  if (isInitialized === false) {
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn !== null) {
      cancelEditBtn.addEventListener('click', function() {
        const modal = document.getElementById('editModal');
        if (modal !== null) {
          modal.style.display = 'none';
        }
      });
    }
    const saveEditBtn = document.getElementById('saveEditBtn');
    if (saveEditBtn !== null) {
      saveEditBtn.addEventListener('click', saveEditedKey);
    }
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if (cancelDeleteBtn !== null) {
      cancelDeleteBtn.addEventListener('click', function() {
        const modal = document.getElementById('deleteModal');
        if (modal !== null) {
          modal.style.display = 'none';
        }
      });
    }
    const saveDeleteBtn = document.getElementById('saveDeleteBtn');
    if (saveDeleteBtn !== null) {
      saveDeleteBtn.addEventListener('click', saveDeletedKeys);
    }
    isInitialized = true;
  }
}
export function handleRestoreDefault(rebuildUI: () => void, reattachListeners: () => void) {
  resetConfig();
  rebuildUI();
  reattachListeners();
}
export function openEditModal() {
  const currentConfig = getConfig();
  const container = document.getElementById('editInputContainer');
  const errorMsg = document.getElementById('editError');
  const template = document.getElementById('edit-row-template') as HTMLTemplateElement;
  
  if (errorMsg !== null) {
    errorMsg.style.display = 'none'; 
  }
  
  if (container === null || template === null) {
    return;
  }
  container.innerHTML = ''; 
  for (let i = 0; i < currentConfig.length; i++) {
    const item = currentConfig[i];
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const label = clone.querySelector('.edit-label') as HTMLLabelElement;
    const input = clone.querySelector('.edit-key-input') as HTMLInputElement;
    const hint = clone.querySelector('.edit-sound-hint') as HTMLSpanElement;

    if (label !== null) {
      label.textContent = item.keyChar;
    }
    if (hint !== null) {
      hint.textContent = "(" + item.soundName + ")"; 
    }
    if (input !== null) {
      input.dataset.originalId = item.keyCode;
      input.value = item.keyChar;
    }
    container.appendChild(clone);
  }
  const modal = document.getElementById('editModal');
  if (modal !== null) {
    modal.style.display = 'flex';
  }
}

function saveEditedKey() {
  const currentConfig = getConfig();
  const inputs = document.querySelectorAll('.edit-key-input') as NodeListOf<HTMLInputElement>;
  const errorMsg = document.getElementById('editError');
  const typedValues: string[] = [];
  let hasEmpty = false;
  let hasDuplicates = false;

  for (let i = 0; i < inputs.length; i++) {
    const val = inputs[i].value.trim().toUpperCase();
    if (val === "") {
      hasEmpty = true;
    }
    typedValues.push(val);
  }
  for (let i = 0; i < typedValues.length; i++) {
    for (let j = i + 1; j < typedValues.length; j++) {
      if (typedValues[i] === typedValues[j]) {
        hasDuplicates = true;
      }
    }
  }

  if (hasEmpty === true || hasDuplicates === true) {
    if (errorMsg !== null) {
      errorMsg.style.display = 'block';
    }
    return; 
  }
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const originalId = input.dataset.originalId;
    
    if (originalId !== undefined) {
      const newChar = input.value.trim().toUpperCase();
      const newCode = newChar.charCodeAt(0).toString();
      for (let j = 0; j < currentConfig.length; j++) {
        if (currentConfig[j].keyCode === originalId) {
          currentConfig[j].keyChar = newChar;
          currentConfig[j].keyCode = newCode;
        }
      }
    }
  }
  saveConfig(currentConfig);
  const modal = document.getElementById('editModal');
  if (modal !== null) {
    modal.style.display = 'none';
  }
  rebuildAppUI();
  reattachAppListeners();
}

export function openDeleteModal() {
  const currentConfig = getConfig();
  const container = document.getElementById('deleteCheckboxContainer');
  const template = document.getElementById('delete-row-template') as HTMLTemplateElement;
  if (container === null || template === null) {
    return;
  }
  container.innerHTML = ''; 
  for (let i = 0; i < defaultConfig.length; i++) {
    const originalKey = defaultConfig[i];
    let isChecked = false;
    
    for (let j = 0; j < currentConfig.length; j++) {
      if (currentConfig[j].keyCode === originalKey.keyCode) {
        isChecked = true;
        break;
      }
    }
  const clone = template.content.cloneNode(true) as DocumentFragment;
  const checkbox = clone.querySelector('.delete-checkbox') as HTMLInputElement;
  const label = clone.querySelector('label') as HTMLLabelElement;

    if (checkbox !== null) {
      checkbox.value = originalKey.keyCode;
      checkbox.checked = isChecked;
    }
    if (label !== null) {
      label.textContent = "Key " + originalKey.keyChar + " (" + originalKey.soundName + ")";
    }
    container.appendChild(clone);
  }
  
  const modal = document.getElementById('deleteModal');
  if (modal !== null) {
    modal.style.display = 'flex';
  }
}

function saveDeletedKeys() {
  const checkboxes = document.querySelectorAll('.delete-checkbox') as NodeListOf<HTMLInputElement>;
  const currentConfig = getConfig();
  const keysToKeep: string[] = [];
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked === true) {
      keysToKeep.push(checkboxes[i].value);
    }
  }
  const newConfig: DrumKeyConfig[] = [];
  for (let i = 0; i < defaultConfig.length; i++) {
    const original = defaultConfig[i];
    if (keysToKeep.indexOf(original.keyCode) !== -1) {
      let foundMatch = false;
      for (let j = 0; j < currentConfig.length; j++) {
        if (currentConfig[j].keyCode === original.keyCode) {
          newConfig.push(currentConfig[j]);
          foundMatch = true;
          break;
        }
      }
      if (foundMatch === false) {
        newConfig.push(original);
      }
    }
  }
  saveConfig(newConfig);
  const modal = document.getElementById('deleteModal');
  if (modal !== null) {
    modal.style.display = 'none';
  }
  rebuildAppUI();
  reattachAppListeners();
}