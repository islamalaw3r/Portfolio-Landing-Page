// Basic interactions: nav toggle, demo notes app, contact messages saved to localStorage

// Header nav toggle
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// set footer year
document.getElementById('year').textContent = new Date().getFullYear();

// -------------------- Notes demo logic (separate keys to not conflict with real project) --------------------
const demoInput = document.getElementById('demoNoteInput');
const demoAddBtn = document.getElementById('demoAddBtn');
const demoClearBtn = document.getElementById('demoClearBtn');
const demoNotesList = document.getElementById('demoNotesList');
const demoEmptyMsg = document.getElementById('demoEmptyMsg');

let demoNotes = JSON.parse(localStorage.getItem('demo_notes')) || [];
renderDemoNotes();

demoAddBtn.addEventListener('click', addDemoNote);
demoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addDemoNote(); });
demoClearBtn.addEventListener('click', () => {
  if (!confirm('Clear all demo notes?')) return;
  demoNotes = [];
  syncDemo();
});

function addDemoNote(){
  const text = demoInput.value.trim();
  if (!text) return;
  const note = { id: Date.now(), text, created: new Date().toISOString() };
  demoNotes.unshift(note);
  demoInput.value = '';
  syncDemo();
  demoInput.focus();
}

function createDemoNoteElem(note){
  const li = document.createElement('li');
  const left = document.createElement('div');
  left.textContent = note.text;
  const meta = document.createElement('small');
  meta.className = 'muted';
  meta.style.marginLeft = '12px';
  meta.textContent = new Date(note.created).toLocaleString('en-US', {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const right = document.createElement('div');
  const del = document.createElement('button');
  del.className = 'btn small';
  del.textContent = 'Delete';
  del.addEventListener('click', () => {
    if (!confirm('Delete this note?')) return;
    demoNotes = demoNotes.filter(n => n.id !== note.id);
    syncDemo();
  });

  right.appendChild(del);
  li.appendChild(left);
  li.appendChild(meta);
  li.appendChild(right);
  li.style.display = 'flex';
  li.style.justifyContent = 'space-between';
  li.style.gap = '12px';
  li.style.alignItems = 'center';

  return li;
}

function renderDemoNotes(){
  demoNotesList.innerHTML = '';
  if (demoNotes.length === 0){
    demoEmptyMsg.style.display = 'block';
    return;
  }
  demoEmptyMsg.style.display = 'none';
  demoNotes.forEach(n => demoNotesList.appendChild(createDemoNoteElem(n)));
}

function syncDemo(){
  localStorage.setItem('demo_notes', JSON.stringify(demoNotes));
  renderDemoNotes();
}

// open notes demo anchor: scroll into view
const openNotes = document.getElementById('openNotes');
if (openNotes){
  openNotes.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('notes-demo').scrollIntoView({ behavior: 'smooth' });
  });
}

// -------------------- Contact form (messages saved locally as demo) --------------------
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const messageInput = document.getElementById('messageInput');
const contactFeedback = document.getElementById('contactFeedback');
const clearMessagesBtn = document.getElementById('clearMessages');

let messages = JSON.parse(localStorage.getItem('contact_messages')) || [];

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  if (!name || !message){
    contactFeedback.style.display = 'block';
    contactFeedback.textContent = 'Please provide your name and message.';
    return;
  }
  messages.push({ id: Date.now(), name, email, message, created: new Date().toISOString() });
  localStorage.setItem('contact_messages', JSON.stringify(messages));
  contactFeedback.style.display = 'block';
  contactFeedback.textContent = 'Message saved locally. (This is a demo)';
  contactForm.reset();
  setTimeout(()=> contactFeedback.style.display='none', 2200);
});

clearMessagesBtn.addEventListener('click', () => {
  if (!confirm('Clear all saved messages?')) return;
  messages = [];
  localStorage.setItem('contact_messages', JSON.stringify(messages));
  contactFeedback.style.display = 'block';
  contactFeedback.textContent = 'All messages cleared.';
  setTimeout(()=> contactFeedback.style.display='none', 2000);
});
