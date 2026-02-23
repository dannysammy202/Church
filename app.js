const passageInput = document.getElementById('passageInput');
const translationSelect = document.getElementById('translationSelect');
const loadBtn = document.getElementById('loadBtn');
const projectBtn = document.getElementById('projectBtn');
const statusNode = document.getElementById('status');
const referenceTitle = document.getElementById('referenceTitle');
const versesNode = document.getElementById('verses');
const historyButtons = document.getElementById('historyButtons');

const historyState = [];

function setStatus(message, isError = false) {
  statusNode.textContent = message;
  statusNode.classList.toggle('error', isError);
}

function normalizePassage(passage) {
  return passage.trim().replace(/\s+/g, ' ');
}

function updateHistory(passage, translation) {
  const key = `${passage}|${translation}`;
  const withoutDuplicate = historyState.filter((entry) => entry.key !== key);
  historyState.splice(0, historyState.length, { key, passage, translation }, ...withoutDuplicate);

  if (historyState.length > 8) {
    historyState.length = 8;
  }

  historyButtons.innerHTML = '';
  historyState.forEach((entry) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${entry.passage} (${entry.translation.toUpperCase()})`;
    button.addEventListener('click', () => {
      passageInput.value = entry.passage;
      translationSelect.value = entry.translation;
      loadPassage();
    });
    historyButtons.appendChild(button);
  });
}

function renderPassage(data, translation) {
  referenceTitle.textContent = `${data.reference} (${translation.toUpperCase()})`;
  versesNode.innerHTML = '';

  data.verses.forEach((verse) => {
    const p = document.createElement('p');
    p.className = 'verse';

    const number = document.createElement('span');
    number.className = 'verse-number';
    number.textContent = `${verse.verse}.`;

    p.append(number, document.createTextNode(verse.text.trim()));
    versesNode.appendChild(p);
  });
}

async function loadPassage() {
  const passage = normalizePassage(passageInput.value);
  const translation = translationSelect.value;

  if (!passage) {
    setStatus('Enter a passage first (for example: Romans 8:28).', true);
    return;
  }

  loadBtn.disabled = true;
  setStatus('Loading passage...');

  try {
    const endpoint = `https://bible-api.com/${encodeURIComponent(passage)}?translation=${translation}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Unable to load passage (HTTP ${response.status}).`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.verses) || data.verses.length === 0) {
      throw new Error('No verses were returned for that passage.');
    }

    renderPassage(data, translation);
    updateHistory(passage, translation);
    setStatus(`Loaded ${data.reference} successfully.`);
  } catch (error) {
    setStatus(error.message || 'Unexpected error while loading passage.', true);
  } finally {
    loadBtn.disabled = false;
  }
}

function toggleProjectionMode() {
  const projectionEnabled = document.body.classList.toggle('projection');
  projectBtn.textContent = projectionEnabled ? 'Exit Projection Mode' : 'Projection Mode';
}

loadBtn.addEventListener('click', loadPassage);
projectBtn.addEventListener('click', toggleProjectionMode);

passageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    loadPassage();
  }
});

loadPassage();
