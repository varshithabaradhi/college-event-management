// College Event Management System - Firebase Client Application

// Local state & cache
let state = {
  currentUser: null, // { email, role: 'student'|'admin', name, rollNo, dept }
  events: [],
  registrations: [],
  venues: []
};

// Initialize State from Storage or Defaults
function initState() {
  const savedEvents = localStorage.getItem('cem_events');
  state.events = savedEvents ? JSON.parse(savedEvents) : DEFAULT_EVENTS;

  const savedVenues = localStorage.getItem('cem_venues');
  state.venues = savedVenues ? JSON.parse(savedVenues) : DEFAULT_VENUES;

  const savedRegs = localStorage.getItem('cem_registrations');
  state.registrations = savedRegs ? JSON.parse(savedRegs) : [
    {
      id: 'reg-1',
      eventId: 'evt-101',
      eventTitle: 'HackSphere 2026: Annual Inter-College Hackathon',
      eventDate: '2026-10-24',
      eventTime: '09:00 AM',
      venue: 'Sir MV Seminar Hall',
      studentName: 'Varshitha Reddy',
      studentEmail: 'student@college.edu',
      studentRoll: '22CS101',
      studentDept: 'Computer Science & Engineering',
      ticketCode: 'TKT-HS26-90412',
      status: 'Approved',
      registeredAt: '2026-10-07 14:20:00'
    },
    {
      id: 'reg-2',
      eventId: 'evt-103',
      eventTitle: 'Generative AI & Agentic Systems Workshop',
      eventDate: '2026-10-18',
      eventTime: '10:30 AM',
      venue: 'APJ Abdul Kalam Auditorium',
      studentName: 'Varshitha Reddy',
      studentEmail: 'student@college.edu',
      studentRoll: '22CS101',
      studentDept: 'Computer Science & Engineering',
      ticketCode: 'TKT-AI26-38194',
      status: 'Attended',
      registeredAt: '2026-10-08 11:15:00',
      attendedAt: '2026-10-08 11:30:00'
    }
  ];

  // Try checking existing saved user session
  const savedUser = localStorage.getItem('cem_user');
  if (savedUser) {
    state.currentUser = JSON.parse(savedUser);
  } else {
    // Default logged in as demo student for smooth experience
    state.currentUser = {
      name: 'Varshitha Reddy',
      email: 'student@college.edu',
      role: 'student',
      rollNo: '22CS101',
      dept: 'Computer Science & Engineering'
    };
    localStorage.setItem('cem_user', JSON.stringify(state.currentUser));
  }

  // Attempt sync with Firestore if online and collection exists
  syncWithFirestore();
}

// Sync with Cloud Firestore
async function syncWithFirestore() {
  if (!db) return;
  try {
    const eventsSnapshot = await db.collection('events').get();
    if (!eventsSnapshot.empty) {
      const remoteEvents = [];
      eventsSnapshot.forEach(doc => remoteEvents.push({ id: doc.id, ...doc.data() }));
      state.events = remoteEvents;
      localStorage.setItem('cem_events', JSON.stringify(state.events));
      renderEvents();
      renderHome();
    }
  } catch (err) {
    console.log('Operating in local-first mode with Firebase ready:', err.message);
  }
}

// Save helpers
function saveRegistrations() {
  localStorage.setItem('cem_registrations', JSON.stringify(state.registrations));
}
function saveEvents() {
  localStorage.setItem('cem_events', JSON.stringify(state.events));
}

// View Routing
function showView(viewId) {
  document.querySelectorAll('.app-view').forEach(v => v.classList.add('d-none'));
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.remove('d-none');
    window.scrollTo(0, 0);
  }

  // Update active state in nav
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const navBtn = document.querySelector(`[data-target="${viewId}"]`);
  if (navBtn) navBtn.classList.add('active');

  // Trigger view renders
  if (viewId === 'view-home') renderHome();
  if (viewId === 'view-events') renderEvents();
  if (viewId === 'view-dashboard') renderStudentDashboard();
  if (viewId === 'view-admin') renderAdminDashboard();
}

// Render User Navigation Header
function renderAuthNav() {
  const userNavContainer = document.getElementById('userNavContainer');
  if (!state.currentUser) {
    userNavContainer.innerHTML = `
      <button class="btn btn-outline-light me-2" onclick="openLoginModal('student')">
        <i class="bi bi-box-arrow-in-right me-1"></i>Sign In
      </button>
      <button class="btn btn-warning fw-semibold" onclick="openRegisterModal()">
        <i class="bi bi-person-plus-fill me-1"></i>Register
      </button>
    `;
    document.querySelectorAll('.student-only').forEach(e => e.classList.add('d-none'));
    document.querySelectorAll('.admin-only').forEach(e => e.classList.add('d-none'));
  } else {
    const isAdm = state.currentUser.role === 'admin';
    if (isAdm) {
      document.querySelectorAll('.admin-only').forEach(e => e.classList.remove('d-none'));
      document.querySelectorAll('.student-only').forEach(e => e.classList.add('d-none'));
    } else {
      document.querySelectorAll('.student-only').forEach(e => e.classList.remove('d-none'));
      document.querySelectorAll('.admin-only').forEach(e => e.classList.add('d-none'));
    }

    userNavContainer.innerHTML = `
      <div class="dropdown">
        <button class="btn ${isAdm ? 'btn-warning' : 'btn-outline-light'} dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
          <i class="bi ${isAdm ? 'bi-shield-lock-fill' : 'bi-person-circle'}"></i>
          <span>${state.currentUser.name}</span>
          <span class="badge ${isAdm ? 'bg-dark' : 'bg-primary'}">${isAdm ? 'Admin' : state.currentUser.rollNo}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow">
          <li><h6 class="dropdown-header">${state.currentUser.dept || state.currentUser.role}</h6></li>
          ${!isAdm ? `
            <li><a class="dropdown-item" href="javascript:void(0)" onclick="showView('view-dashboard')"><i class="bi bi-speedometer2 me-2"></i>My Dashboard</a></li>
          ` : `
            <li><a class="dropdown-item" href="javascript:void(0)" onclick="showView('view-admin')"><i class="bi bi-grid-1x2-fill me-2"></i>Admin Panel</a></li>
            <li><a class="dropdown-item" href="javascript:void(0)" onclick="showView('view-scanner')"><i class="bi bi-qr-code-scan me-2"></i>QR Scanner</a></li>
          `}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="logoutUser()"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
        </ul>
      </div>
    `;
  }
}

// User Actions: Login / Register / Switch
function loginAs(role) {
  if (role === 'admin') {
    state.currentUser = {
      name: 'Faculty Coordinator',
      email: 'admin@college.edu',
      role: 'admin',
      dept: 'College Administration'
    };
    showToast('Signed in as Administrator!', 'success');
  } else {
    state.currentUser = {
      name: 'Varshitha Reddy',
      email: 'student@college.edu',
      role: 'student',
      rollNo: '22CS101',
      dept: 'Computer Science & Engineering'
    };
    showToast('Signed in as Student (Varshitha Reddy)!', 'success');
  }
  localStorage.setItem('cem_user', JSON.stringify(state.currentUser));
  renderAuthNav();
  bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
  if (state.currentUser.role === 'admin') {
    showView('view-admin');
  } else {
    showView('view-dashboard');
  }
}

function logoutUser() {
  state.currentUser = null;
  localStorage.removeItem('cem_user');
  renderAuthNav();
  showToast('You have signed out.', 'info');
  showView('view-home');
}

// Render Home View
function renderHome() {
  document.getElementById('statTotalEvents').innerText = state.events.length + '+';
  document.getElementById('statTotalRegs').innerText = state.registrations.length;

  const featured = state.events.slice(0, 3);
  const container = document.getElementById('homeFeaturedEvents');
  container.innerHTML = featured.map(e => createEventCardHtml(e)).join('');
}

// Event Card Template
function createEventCardHtml(e) {
  const regCount = state.registrations.filter(r => r.eventId === e.id && r.status !== 'Cancelled').length;
  const isRegistered = state.currentUser && state.registrations.some(r => r.eventId === e.id && r.studentEmail === state.currentUser.email && r.status !== 'Cancelled');

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card event-card h-100 position-relative shadow-sm">
        <img src="${e.banner}" class="card-img-top event-card-img" alt="${e.title}">
        <span class="event-category-badge">${e.category}</span>

        <div class="card-body d-flex flex-column">
          <div class="d-flex align-items-center gap-2 small text-muted mb-2">
            <span><i class="bi bi-calendar3 me-1 text-primary"></i>${e.date}</span>
            <span>&bull;</span>
            <span><i class="bi bi-clock me-1 text-primary"></i>${e.time}</span>
          </div>

          <h5 class="card-title fw-bold text-dark mb-2">${e.title}</h5>
          <p class="card-text text-muted small mb-3 flex-grow-1">${e.description.substring(0, 110)}...</p>

          <div class="border-top pt-3 mt-auto">
            <div class="d-flex justify-content-between align-items-center mb-2 small">
              <span class="text-secondary text-truncate" style="max-width: 60%;">
                <i class="bi bi-geo-alt-fill text-danger me-1"></i>${e.venue}
              </span>
              <span class="badge ${regCount >= e.maxParticipants ? 'bg-danger' : 'bg-light text-dark border'}">
                ${regCount} / ${e.maxParticipants} slots
              </span>
            </div>

            <div class="d-flex gap-2">
              <button onclick="openEventDetails('${e.id}')" class="btn btn-outline-primary btn-sm flex-grow-1 fw-semibold">
                <i class="bi bi-info-circle me-1"></i> Details
              </button>
              ${isRegistered ? `
                <span class="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center px-2">
                  <i class="bi bi-check2-circle me-1"></i> Registered
                </span>
              ` : `
                <button onclick="registerForEvent('${e.id}')" class="btn btn-primary btn-sm px-3 fw-bold">
                  Register
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Events Catalog
function renderEvents() {
  const searchInput = document.getElementById('searchEventInput')?.value.toLowerCase() || '';
  const categoryFilter = document.getElementById('categoryFilter')?.value || 'All';

  const filtered = state.events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchInput) || e.description.toLowerCase().includes(searchInput) || e.organizer.toLowerCase().includes(searchInput);
    const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const container = document.getElementById('eventsCatalogContainer');
  if (filtered.length > 0) {
    container.innerHTML = filtered.map(e => createEventCardHtml(e)).join('');
  } else {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search fs-1 text-muted mb-2 d-block"></i>
        <h5 class="fw-bold text-dark">No Events Match Your Filters</h5>
        <p class="text-muted small">Try adjusting your keyword or reset categories.</p>
      </div>
    `;
  }
}

// Open Event Details Modal
function openEventDetails(eventId) {
  const e = state.events.find(x => x.id === eventId);
  if (!e) return;

  const regCount = state.registrations.filter(r => r.eventId === e.id && r.status !== 'Cancelled').length;
  const isRegistered = state.currentUser && state.registrations.some(r => r.eventId === e.id && r.studentEmail === state.currentUser.email && r.status !== 'Cancelled');

  const content = document.getElementById('eventModalBody');
  content.innerHTML = `
    <div class="mb-3">
      <img src="${e.banner}" class="w-100 rounded-3" style="max-height: 250px; object-fit: cover;">
    </div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="badge bg-primary">${e.category}</span>
      <span class="badge bg-success">${e.status}</span>
    </div>
    <h4 class="fw-bold text-dark mb-2">${e.title}</h4>
    <p class="text-secondary small mb-3">${e.description}</p>

    <div class="row g-2 p-3 bg-light rounded-3 small mb-3">
      <div class="col-sm-6"><strong><i class="bi bi-calendar-event text-primary me-1"></i> Date:</strong> ${e.date} (${e.time})</div>
      <div class="col-sm-6"><strong><i class="bi bi-geo-alt text-danger me-1"></i> Venue:</strong> ${e.venue}</div>
      <div class="col-sm-6"><strong><i class="bi bi-building text-info me-1"></i> Organizer:</strong> ${e.organizer}</div>
      <div class="col-sm-6"><strong><i class="bi bi-people text-warning me-1"></i> Capacity:</strong> ${regCount} / ${e.maxParticipants}</div>
      <div class="col-12 text-danger"><strong><i class="bi bi-alarm me-1"></i> Registration Deadline:</strong> ${e.deadline}</div>
    </div>
  `;

  const footerAction = document.getElementById('eventModalActionBtn');
  if (isRegistered) {
    footerAction.className = 'btn btn-success fw-bold disabled';
    footerAction.innerText = 'Already Registered';
    footerAction.onclick = null;
  } else {
    footerAction.className = 'btn btn-primary fw-bold';
    footerAction.innerText = 'Register for this Event';
    footerAction.onclick = () => {
      bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal'))?.hide();
      registerForEvent(e.id);
    };
  }

  const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
  modal.show();
}

// Student Registration for Event
function registerForEvent(eventId) {
  if (!state.currentUser || state.currentUser.role !== 'student') {
    openLoginModal('student');
    showToast('Please sign in as a student to register.', 'warning');
    return;
  }

  const e = state.events.find(x => x.id === eventId);
  if (!e) return;

  const existing = state.registrations.find(r => r.eventId === eventId && r.studentEmail === state.currentUser.email && r.status !== 'Cancelled');
  if (existing) {
    showToast('You are already registered for this event.', 'info');
    return;
  }

  const randomCode = Math.floor(10000 + Math.random() * 90000);
  const ticketCode = `TKT-${e.category.substring(0, 2).toUpperCase()}${randomCode}`;

  const newReg = {
    id: 'reg-' + Date.now(),
    eventId: e.id,
    eventTitle: e.title,
    eventDate: e.date,
    eventTime: e.time,
    venue: e.venue,
    studentName: state.currentUser.name,
    studentEmail: state.currentUser.email,
    studentRoll: state.currentUser.rollNo,
    studentDept: state.currentUser.dept,
    ticketCode: ticketCode,
    status: 'Approved',
    registeredAt: new Date().toLocaleString()
  };

  state.registrations.unshift(newReg);
  saveRegistrations();

  showToast(`Successfully registered! Your Ticket Code is ${ticketCode}`, 'success');
  renderEvents();
  renderHome();
  showView('view-dashboard');
}

// Student Dashboard View
function renderStudentDashboard() {
  if (!state.currentUser) return;
  document.getElementById('dashStudentName').innerText = state.currentUser.name;
  document.getElementById('dashStudentRoll').innerText = state.currentUser.rollNo;
  document.getElementById('dashStudentDept').innerText = state.currentUser.dept;

  const myRegs = state.registrations.filter(r => r.studentEmail === state.currentUser.email);
  const attendedCount = myRegs.filter(r => r.status === 'Attended').length;

  document.getElementById('dashTotalRegs').innerText = myRegs.length;
  document.getElementById('dashTotalAttended').innerText = attendedCount;

  const container = document.getElementById('myRegistrationsList');
  if (myRegs.length > 0) {
    container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Ticket Code</th>
              <th>Event Title</th>
              <th>Date & Venue</th>
              <th>Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${myRegs.map(r => `
              <tr>
                <td class="font-monospace fw-bold text-primary">${r.ticketCode}</td>
                <td>
                  <strong class="text-dark">${r.eventTitle}</strong>
                </td>
                <td class="small">
                  <div><i class="bi bi-calendar3 me-1 text-primary"></i> ${r.eventDate}</div>
                  <span class="text-muted"><i class="bi bi-geo-alt me-1 text-danger"></i> ${r.venue}</span>
                </td>
                <td>
                  <span class="badge ${r.status === 'Attended' ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-success-subtle text-success border border-success-subtle'}">
                    ${r.status}
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-dark me-1" onclick="openTicketModal('${r.ticketCode}')" title="View QR Pass">
                    <i class="bi bi-qr-code"></i> Pass
                  </button>
                  ${r.status === 'Attended' || r.status === 'Approved' ? `
                    <button class="btn btn-sm btn-outline-success me-1" onclick="openCertificateModal('${r.ticketCode}')" title="Certificate">
                      <i class="bi bi-award-fill"></i> Certificate
                    </button>
                  ` : ''}
                  <button class="btn btn-sm btn-outline-danger" onclick="cancelRegistration('${r.id}')" title="Cancel">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="p-5 text-center text-muted">
        <i class="bi bi-ticket-perforated fs-1 mb-2 d-block"></i>
        <h6>No event registrations found.</h6>
        <button class="btn btn-primary btn-sm mt-2" onclick="showView('view-events')">Explore Events</button>
      </div>
    `;
  }
}

// Cancel Registration
function cancelRegistration(regId) {
  if (!confirm('Are you sure you want to cancel this registration?')) return;
  state.registrations = state.registrations.filter(r => r.id !== regId);
  saveRegistrations();
  showToast('Registration cancelled.', 'info');
  renderStudentDashboard();
  renderEvents();
}

// Open Digital QR Ticket Modal
function openTicketModal(ticketCode) {
  const reg = state.registrations.find(r => r.ticketCode === ticketCode);
  if (!reg) return;

  document.getElementById('ticketModalTitle').innerText = reg.eventTitle;
  document.getElementById('ticketModalCode').innerText = reg.ticketCode;
  document.getElementById('ticketModalStudent').innerText = `${reg.studentName} (${reg.studentRoll})`;
  document.getElementById('ticketModalDept').innerText = reg.studentDept;
  document.getElementById('ticketModalDate').innerText = `${reg.eventDate} at ${reg.eventTime}`;
  document.getElementById('ticketModalVenue').innerText = reg.venue;
  document.getElementById('ticketModalStatus').innerText = reg.status;

  // Clear previous QR and generate new
  const qrBox = document.getElementById('ticketModalQr');
  qrBox.innerHTML = '';
  new QRCode(qrBox, {
    text: JSON.stringify({ ticketCode: reg.ticketCode, roll: reg.studentRoll }),
    width: 200,
    height: 200,
    colorDark: "#0f172a",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  const modal = new bootstrap.Modal(document.getElementById('ticketModal'));
  modal.show();
}

// Open Certificate Modal
function openCertificateModal(ticketCode) {
  const reg = state.registrations.find(r => r.ticketCode === ticketCode);
  if (!reg) return;

  document.getElementById('certStudentName').innerText = reg.studentName;
  document.getElementById('certRollNo').innerText = reg.studentRoll;
  document.getElementById('certDept').innerText = reg.studentDept;
  document.getElementById('certEventTitle').innerText = reg.eventTitle;
  document.getElementById('certDate').innerText = reg.eventDate;
  document.getElementById('certNumber').innerText = `CERT-2026-${reg.ticketCode.replace('TKT-', '')}`;

  const modal = new bootstrap.Modal(document.getElementById('certificateModal'));
  modal.show();
}

// Admin Dashboard View
function renderAdminDashboard() {
  document.getElementById('adminStatEvents').innerText = state.events.length;
  document.getElementById('adminStatRegs').innerText = state.registrations.length;
  document.getElementById('adminStatAttended').innerText = state.registrations.filter(r => r.status === 'Attended').length;

  // Render Admin Events Table
  const tbody = document.getElementById('adminEventsTableBody');
  tbody.innerHTML = state.events.map(e => {
    const regCount = state.registrations.filter(r => r.eventId === e.id).length;
    const attendedCount = state.registrations.filter(r => r.eventId === e.id && r.status === 'Attended').length;
    return `
      <tr>
        <td class="fw-bold text-dark">${e.title}</td>
        <td><span class="badge bg-secondary bg-opacity-10 text-secondary">${e.category}</span></td>
        <td class="small">${e.date}</td>
        <td class="small">${e.venue}</td>
        <td><strong>${regCount}</strong> / ${e.maxParticipants} (${attendedCount} attended)</td>
        <td><span class="badge bg-success">${e.status}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent('${e.id}')" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Render Admin Registrations Table
  const regTbody = document.getElementById('adminRegsTableBody');
  regTbody.innerHTML = state.registrations.map(r => `
    <tr>
      <td class="font-monospace fw-bold text-primary">${r.ticketCode}</td>
      <td><strong>${r.studentName}</strong> <span class="badge bg-light text-dark border">${r.studentRoll}</span></td>
      <td class="small text-truncate" style="max-width: 180px;">${r.eventTitle}</td>
      <td>
        <span class="badge ${r.status === 'Attended' ? 'bg-primary' : 'bg-success'}">${r.status}</span>
      </td>
      <td class="text-end">
        ${r.status !== 'Attended' ? `
          <button class="btn btn-sm btn-outline-primary" onclick="markAttendance('${r.ticketCode}')">
            Check In
          </button>
        ` : `
          <span class="text-muted small"><i class="bi bi-check2-all text-success"></i> Attended</span>
        `}
      </td>
    </tr>
  `).join('');
}

// Add New Event (Admin)
function handleAddEvent(form) {
  const newEvt = {
    id: 'evt-' + Date.now(),
    title: form.title.value.trim(),
    category: form.category.value,
    date: form.event_date.value,
    time: form.event_time.value,
    venue: form.venue.value,
    venueLocation: 'Campus Facility',
    organizer: form.organizer.value.trim(),
    maxParticipants: parseInt(form.max_participants.value),
    deadline: form.deadline.value,
    banner: form.banner_image.value.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: form.description.value.trim(),
    status: 'Upcoming'
  };

  state.events.unshift(newEvt);
  saveEvents();

  showToast('Event created successfully!', 'success');
  bootstrap.Modal.getInstance(document.getElementById('addEventModal'))?.hide();
  form.reset();
  renderAdminDashboard();
  renderEvents();
  renderHome();
}

function deleteEvent(eventId) {
  if (!confirm('Are you sure you want to delete this event?')) return;
  state.events = state.events.filter(e => e.id !== eventId);
  saveEvents();
  showToast('Event deleted.', 'info');
  renderAdminDashboard();
  renderEvents();
  renderHome();
}

// QR Code Attendance Verification
function verifyTicketCode(code) {
  const inputCode = code.trim();
  const reg = state.registrations.find(r => r.ticketCode === inputCode);

  const container = document.getElementById('scannerResult');
  container.classList.remove('d-none');

  if (!reg) {
    container.className = 'card border-danger bg-danger bg-opacity-10 p-4 rounded-4 mt-4';
    container.innerHTML = `
      <h5 class="text-danger fw-bold mb-1"><i class="bi bi-x-circle-fill me-2"></i>Invalid Ticket Code</h5>
      <p class="small text-muted mb-0">No registration found for code "${inputCode}".</p>
    `;
    return;
  }

  if (reg.status === 'Attended') {
    container.className = 'card border-warning bg-warning bg-opacity-10 p-4 rounded-4 mt-4';
    container.innerHTML = `
      <h5 class="text-warning-emphasis fw-bold mb-1"><i class="bi bi-exclamation-triangle-fill me-2"></i>Already Checked In</h5>
      <p class="small text-dark mb-0"><strong>${reg.studentName}</strong> (${reg.studentRoll}) has already been marked present.</p>
    `;
    return;
  }

  // Mark Attended
  reg.status = 'Attended';
  reg.attendedAt = new Date().toLocaleString();
  saveRegistrations();

  container.className = 'card border-success bg-success bg-opacity-10 p-4 rounded-4 mt-4';
  container.innerHTML = `
    <h5 class="text-success fw-bold mb-2"><i class="bi bi-check-circle-fill me-2"></i>ATTENDANCE VERIFIED & RECORDED</h5>
    <div class="bg-white p-3 rounded-3 border small">
      <div><strong>Student Name:</strong> ${reg.studentName}</div>
      <div><strong>Roll Number:</strong> ${reg.studentRoll}</div>
      <div><strong>Department:</strong> ${reg.studentDept}</div>
      <div><strong>Event:</strong> ${reg.eventTitle}</div>
      <div><strong>Ticket Code:</strong> <code class="fw-bold">${reg.ticketCode}</code></div>
    </div>
  `;
}

function markAttendance(code) {
  verifyTicketCode(code);
  renderAdminDashboard();
}

// Export CSV
function exportRegistrationsCsv() {
  let csv = 'Ticket Code,Student Name,Roll No,Department,Event,Status,Registered At\n';
  state.registrations.forEach(r => {
    csv += `"${r.ticketCode}","${r.studentName}","${r.studentRoll}","${r.studentDept}","${r.eventTitle}","${r.status}","${r.registeredAt}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'College_Event_Registrations.csv';
  a.click();
}

// Toast helper
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;
  const toastEl = document.createElement('div');
  toastEl.className = `alert alert-${type} shadow-lg py-2 px-3 mb-2 rounded-3 alert-dismissible fade show`;
  toastEl.innerHTML = `
    <div class="d-flex align-items-center small">
      <i class="bi bi-info-circle-fill me-2"></i>
      <div>${message}</div>
    </div>
  `;
  toastContainer.appendChild(toastEl);
  setTimeout(() => {
    toastEl.remove();
  }, 4000);
}

function openLoginModal(role) {
  const modal = new bootstrap.Modal(document.getElementById('loginModal'));
  modal.show();
}

function openRegisterModal() {
  const modal = new bootstrap.Modal(document.getElementById('registerModal'));
  modal.show();
}

// Page load initialization
document.addEventListener('DOMContentLoaded', () => {
  initState();
  renderAuthNav();
  showView('view-home');
});
