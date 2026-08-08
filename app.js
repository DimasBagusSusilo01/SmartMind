/* ================================================
   SMART MIND - app.js
   Logika utama: dark mode, sidebar, chart, CRUD
   ================================================ */

// ===== DARK MODE =====
const html = document.documentElement;
const darkBtn = document.getElementById('darkModeToggle');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('sm-theme', theme);
  if (darkBtn) darkBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

(function initTheme() {
  const saved = localStorage.getItem('sm-theme') || 'light';
  applyTheme(saved);
})();

if (darkBtn) {
  darkBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ===== SIDEBAR TOGGLE (mobile) =====
const sidebarEl   = document.getElementById('sidebar');
const overlayEl   = document.getElementById('sidebarOverlay');
const openSideBtn = document.getElementById('openSidebar');

function openSidebar()  { sidebarEl?.classList.add('open');    overlayEl?.classList.add('show'); }
function closeSidebar() { sidebarEl?.classList.remove('open'); overlayEl?.classList.remove('show'); }

openSideBtn?.addEventListener('click', openSidebar);
overlayEl?.addEventListener('click', closeSidebar);

// ===== ACTIVE NAV LINK =====
(function setActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
})();

// ===== SEARCH TABLE =====
function initTableSearch(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!input || !table) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}
initTableSearch('searchSiswa',      'tableSiswa');
initTableSearch('searchTutor',      'tableTutor');
initTableSearch('searchPembayaran', 'tablePembayaran');
initTableSearch('searchGaji',       'tableGaji');

// ===== TOAST NOTIFICATION =====
function showToast(msg, type = 'success') {
  const colors = { success: '#22C55E', danger: '#EF4444', warning: '#F59E0B', info: '#3B82F6' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${colors[type]};color:#fff;
    padding:14px 22px;border-radius:12px;
    font-size:14px;font-weight:600;
    box-shadow:0 8px 24px rgba(0,0,0,0.18);
    animation:slideIn .3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

const style = document.createElement('style');
style.textContent = `@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`;
document.head.appendChild(style);

// ===== CONFIRM DELETE =====
document.querySelectorAll('.btn-delete').forEach(btn => {
  btn.addEventListener('click', function () {
    const name = this.dataset.name || 'data ini';
    if (confirm(`Hapus ${name}? Tindakan ini tidak bisa dibatalkan.`)) {
      const row = this.closest('tr');
      row?.remove();
      showToast('Data berhasil dihapus.', 'danger');
    }
  });
});

// ===== EXPORT EXCEL (simulasi) =====
document.querySelectorAll('.btn-export-excel').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('Export Excel sedang diproses...', 'info');
    setTimeout(() => showToast('File Excel berhasil diunduh!', 'success'), 1500);
  });
});

// ===== EXPORT PDF (simulasi) =====
document.querySelectorAll('.btn-export-pdf').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('Export PDF sedang diproses...', 'info');
    setTimeout(() => showToast('File PDF berhasil diunduh!', 'success'), 1500);
  });
});

// ===== PRINT INVOICE =====
function printInvoice() {
  const el = document.getElementById('invoiceBox');
  if (!el) return;
  const w = window.open('', '', 'width=700,height=900');
  w.document.write('<html><head><title>Invoice SMART MIND</title>');
  w.document.write('<link rel="stylesheet" href="style.css">');
  w.document.write('</head><body style="padding:20px;">');
  w.document.write(el.innerHTML);
  w.document.write('</body></html>');
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); w.close(); }, 400);
}

// ===== MODAL HELPERS =====
function openModal(id)  { new bootstrap.Modal(document.getElementById(id)).show(); }
function closeModal(id) { bootstrap.Modal.getInstance(document.getElementById(id))?.hide(); }

// ===== NOMOR INDUK SISWA AUTO =====
function generateNIS() {
  const year  = new Date().getFullYear();
  const seq   = String(Math.floor(Math.random() * 900) + 100);
  return `SM${year}${seq}`;
}

// ===== NOMOR INVOICE AUTO =====
function generateInvoice() {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `INV-${ymd}-${seq}`;
}

// ===== FORMAT RUPIAH =====
function formatRp(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

// ===== KALKULASI GAJI TUTOR =====
function hitungGaji(pertemuan, honor) {
  return pertemuan * honor;
}

// ===== WHATSAPP NOTIF (Simulasi / Fonnte) =====
function kirimWA(nomor, pesan) {
  // Integrasi nyata: ganti dengan API Fonnte / WA gateway
  console.log(`[WA] Kirim ke ${nomor}: ${pesan}`);
  showToast(`Notifikasi WhatsApp dikirim ke ${nomor}`, 'info');
}

// ===== CHART: DASHBOARD =====
function initDashboardCharts() {
  // Bar chart siswa per bulan
  const ctxBar = document.getElementById('chartSiswa');
  if (ctxBar && typeof Chart !== 'undefined') {
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
        datasets: [{
          label: 'Siswa Aktif',
          data: [18,22,25,28,30,35,33,38,40,42,45,48],
          backgroundColor: 'rgba(21,101,192,0.75)',
          borderRadius: 8,
          borderSkipped: false,
        }, {
          label: 'Siswa Baru',
          data: [4,5,3,6,4,7,2,6,5,4,6,5],
          backgroundColor: 'rgba(255,193,7,0.80)',
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
        }
      }
    });
  }

  // Doughnut chart keuangan
  const ctxDough = document.getElementById('chartKeuangan');
  if (ctxDough && typeof Chart !== 'undefined') {
    new Chart(ctxDough, {
      type: 'doughnut',
      data: {
        labels: ['Pemasukan', 'Gaji Tutor', 'Operasional'],
        datasets: [{
          data: [12500000, 5000000, 1500000],
          backgroundColor: ['#1565C0', '#FFC107', '#EF4444'],
          borderWidth: 0, hoverOffset: 8,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '70%'
      }
    });
  }
}

// ===== CHART: KEUANGAN =====
function initKeuanganChart() {
  const ctxLine = document.getElementById('chartPemasukan');
  if (ctxLine && typeof Chart !== 'undefined') {
    new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
        datasets: [{
          label: 'Pemasukan',
          data: [8.5,9.2,10.5,11,12,13.5,12.8,14,15,14.5,16,17.5],
          borderColor: '#1565C0', backgroundColor: 'rgba(21,101,192,0.08)',
          fill: true, tension: 0.4, pointRadius: 5,
        }, {
          label: 'Pengeluaran',
          data: [5,5.5,6,6.2,6.5,7,6.8,7.2,7.5,7.8,8,8.5],
          borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.06)',
          fill: true, tension: 0.4, pointRadius: 5,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { callback: v => `${v}Jt` } }
        }
      }
    });
  }
}

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  initDashboardCharts();
  initKeuanganChart();

  // NIS auto di form siswa
  const nisInput = document.getElementById('inputNIS');
  if (nisInput && !nisInput.value) nisInput.value = generateNIS();

  // Invoice auto
  const invInput = document.getElementById('inputInvoice');
  if (invInput && !invInput.value) invInput.value = generateInvoice();

  // Kalkulasi gaji real-time
  const pertemuanInput = document.getElementById('inputPertemuan');
  const honorInput     = document.getElementById('inputHonor');
  const totalGajiEl    = document.getElementById('totalGaji');
  function updateGaji() {
    if (!pertemuanInput || !honorInput || !totalGajiEl) return;
    const total = hitungGaji(Number(pertemuanInput.value)||0, Number(honorInput.value)||0);
    totalGajiEl.textContent = formatRp(total);
  }
  pertemuanInput?.addEventListener('input', updateGaji);
  honorInput?.addEventListener('input', updateGaji);

  // Form daftar landing
  const formDaftar = document.getElementById('formDaftar');
  formDaftar?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Pendaftaran berhasil! Tim kami akan menghubungi Anda.', 'success');
    kirimWA('08123456789', 'Siswa baru telah mendaftar di SMART MIND. Segera tindak lanjuti!');
    formDaftar.reset();
  });

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const role = localStorage.getItem('sm-role');
  const user = localStorage.getItem('sm-user');
  const isLoginPage = currentPage === 'login.html';
  const isPublicPage = ['index.html', 'login.html'].includes(currentPage);

  function setUserRoleLabel() {
    const labels = { admin: 'Administrator', tutor: 'Tutor', siswa: 'Siswa' };
    document.querySelectorAll('.user-info strong').forEach(el => {
      el.textContent = labels[role] || 'Administrator';
    });
    document.querySelectorAll('.user-info small').forEach(el => {
      if (role) el.textContent = `${role}@smartmind.id`;
    });
  }

  const allowedLinksByRole = {
    admin: ['dashboard.html','siswa.html','tutor.html','jadwal.html','absensi.html','pembayaran.html','gaji.html','keuangan.html','index.html','login.html'],
    tutor: ['dashboard.html','tutor.html','jadwal.html','absensi.html','pembayaran.html','gaji.html','index.html','login.html'],
    siswa: ['dashboard.html','siswa.html','jadwal.html','pembayaran.html','index.html','login.html']
  };

  function applyRoleNavigation() {
    const allowed = allowedLinksByRole[role] || [];
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      link.style.display = allowed.includes(href) ? '' : 'none';
    });
  }

  function applyRoleContent() {
    document.querySelectorAll('[data-role-section]').forEach(el => {
      const allowedRoles = el.dataset.roleSection.split(',').map(r => r.trim());
      el.style.display = allowedRoles.includes(role) ? '' : 'none';
    });
  }

  function attachLogoutHandlers() {
    document.querySelectorAll('a[href="login.html"]').forEach(link => {
      link.addEventListener('click', () => {
        localStorage.removeItem('sm-role');
        localStorage.removeItem('sm-user');
      });
    });
  }

  const allowedPages = allowedLinksByRole[role] || [];
  if (!role && !isPublicPage) {
    window.location.href = 'login.html';
    return;
  }

  if (role && !isPublicPage && !allowedPages.includes(currentPage)) {
    window.location.href = allowedPages.includes('dashboard.html') ? 'dashboard.html' : allowedPages[0] || 'login.html';
    return;
  }

  if (role) {
    setUserRoleLabel();
    applyRoleNavigation();
    applyRoleContent();
  }

  attachLogoutHandlers();
});

// ===== DATA MANAGEMENT (LocalStorage) =====
// Initialize sample data if not exists
function initSampleData() {
  if (!localStorage.getItem('sm-siswa')) {
    const siswaSample = [
      {id:1, nama:'Ahmad Fauzi', email:'ahmad@student.id', kelas:'9 SMP', nomorHP:'081234567890', alamat:'Jl. Merdeka No.10', tutor_nama:'Sari Dewi, S.Pd', mata_pelajaran:'Matematika', status_pembayaran:'lunas'},
      {id:2, nama:'Siti Rahma', email:'siti@student.id', kelas:'6 SD', nomorHP:'081234567891', alamat:'Jl. Sultan No.25', tutor_nama:'Sari Dewi, S.Pd', mata_pelajaran:'Matematika', status_pembayaran:'lunas'},
      {id:3, nama:'Budi Hartono', email:'budi@student.id', kelas:'12 SMA', nomorHP:'081234567892', alamat:'Jl. Gatot No.15', tutor_nama:'Budi Santoso, S.Si', mata_pelajaran:'Kimia', status_pembayaran:'pending'},
      {id:4, nama:'Dewi Lestari', email:'dewi@student.id', kelas:'11 SMA', nomorHP:'081234567893', alamat:'Jl. Ahmad Yani No.8', tutor_nama:'Doni Pratama, M.Si', mata_pelajaran:'IPA/Fisika', status_pembayaran:'lunas'},
      {id:5, nama:'Rizky Aditya', email:'rizky@student.id', kelas:'8 SMP', nomorHP:'081234567894', alamat:'Jl. Sudirman No.20', tutor_nama:'Doni Pratama, M.Si', mata_pelajaran:'IPA/Fisika', status_pembayaran:'overdue'},
    ];
    localStorage.setItem('sm-siswa', JSON.stringify(siswaSample));
  }

  if (!localStorage.getItem('sm-tutor')) {
    const tutorSample = [
      {id:1, nama:'Sari Dewi, S.Pd', email:'sari@smartmind.id', mata_pelajaran:'Matematika', nomorHP:'082111111111', gaji_per_jam:100000, status:'aktif'},
      {id:2, nama:'Doni Pratama, M.Si', email:'doni@smartmind.id', mata_pelajaran:'IPA/Fisika', nomorHP:'082111111112', gaji_per_jam:120000, status:'aktif'},
      {id:3, nama:'Rina Safitri, S.S', email:'rina@smartmind.id', mata_pelajaran:'B. Inggris', nomorHP:'082111111113', gaji_per_jam:90000, status:'aktif'},
      {id:4, nama:'Budi Santoso, S.Si', email:'budi@smartmind.id', mata_pelajaran:'Kimia', nomorHP:'082111111114', gaji_per_jam:110000, status:'aktif'},
    ];
    localStorage.setItem('sm-tutor', JSON.stringify(tutorSample));
  }

  if (!localStorage.getItem('sm-pembayaran')) {
    const pembayaranSample = [
      {id:1, siswa_id:1, nomor_invoice:'INV-20240601-001', siswa_nama:'Ahmad Fauzi', jumlah:350000, periode:'Juni 2024', status:'lunas'},
      {id:2, siswa_id:1, nomor_invoice:'INV-20240501-002', siswa_nama:'Ahmad Fauzi', jumlah:350000, periode:'Mei 2024', status:'lunas'},
      {id:3, siswa_id:2, nomor_invoice:'INV-20240601-003', siswa_nama:'Siti Rahma', jumlah:280000, periode:'Juni 2024', status:'lunas'},
      {id:4, siswa_id:3, nomor_invoice:'INV-20240601-004', siswa_nama:'Budi Hartono', jumlah:450000, periode:'Juni 2024', status:'pending'},
      {id:5, siswa_id:4, nomor_invoice:'INV-20240601-005', siswa_nama:'Dewi Lestari', jumlah:400000, periode:'Juni 2024', status:'lunas'},
      {id:6, siswa_id:5, nomor_invoice:'INV-20240601-006', siswa_nama:'Rizky Aditya', jumlah:400000, periode:'Juni 2024', status:'overdue'},
    ];
    localStorage.setItem('sm-pembayaran', JSON.stringify(pembayaranSample));
  }
}

// Get data from LocalStorage
function getDataFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading from storage:', e);
    return [];
  }
}

// Save data to LocalStorage
function saveDataToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    showToast('Data berhasil disimpan!', 'success');
    return true;
  } catch (e) {
    console.error('Error saving to storage:', e);
    showToast('Gagal menyimpan data!', 'danger');
    return false;
  }
}

// Delete row
function deleteRow(tableId, id, storageKey) {
  if (!confirm('Yakin ingin menghapus data ini?')) return;
  
  let data = getDataFromStorage(storageKey);
  data = data.filter(item => item.id !== Number(id));
  
  if (saveDataToStorage(storageKey, data)) {
    const row = document.getElementById(`row-${id}`);
    if (row) row.remove();
    showToast('Data berhasil dihapus!', 'danger');
    
    // Refresh render functions
    if (storageKey === 'sm-siswa' && typeof renderSiswaTable === 'function') renderSiswaTable();
    if (storageKey === 'sm-tutor' && typeof renderTutorTable === 'function') renderTutorTable();
    if (storageKey === 'sm-pembayaran' && typeof renderPembayaranTable === 'function') renderPembayaranTable();
  }
}

// Open edit modal with data
function editData(id, storageKey, modalId, formId) {
  const data = getDataFromStorage(storageKey);
  const item = data.find(d => d.id === Number(id));
  
  if (!item) {
    showToast('Data tidak ditemukan!', 'danger');
    return;
  }
  
  // Fill form with data
  const form = document.getElementById(formId);
  if (form) {
    // Clear previous values
    form.reset();
    
    // Fill all form fields
    Object.keys(item).forEach(key => {
      const input = form.elements[key];
      if (input) {
        input.value = item[key];
      }
    });
    
    // Store ID for update
    form.dataset.editId = id;
    form.dataset.storageKey = storageKey;
  }
  
  openModal(modalId);
}

// Save edit form without reload
function saveEditForm(formId, modalId, storageKey) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  const editId = form.dataset.editId;
  if (!editId) return;
  
  // Validate form
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  let data = getDataFromStorage(storageKey);
  const itemIndex = data.findIndex(d => d.id === Number(editId));
  
  if (itemIndex !== -1) {
    const formData = new FormData(form);
    const updatedItem = {
      id: Number(editId),
      ...Object.fromEntries(formData)
    };
    
    data[itemIndex] = updatedItem;
    
    if (saveDataToStorage(storageKey, data)) {
      closeModal(modalId);
      
      // Refresh render functions without page reload
      if (storageKey === 'sm-siswa' && typeof renderSiswaTable === 'function') renderSiswaTable();
      if (storageKey === 'sm-tutor' && typeof renderTutorTable === 'function') renderTutorTable();
      if (storageKey === 'sm-pembayaran' && typeof renderPembayaranTable === 'function') renderPembayaranTable();
    }
  }
}

// Add new data
function addNewData(formId, modalId, storageKey) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  // Validate form
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  let data = getDataFromStorage(storageKey);
  const formData = new FormData(form);
  
  const newId = Math.max(...data.map(d => d.id || 0), 0) + 1;
  const newItem = {
    id: newId,
    ...Object.fromEntries(formData)
  };
  
  data.push(newItem);
  
  if (saveDataToStorage(storageKey, data)) {
    closeModal(modalId);
    form.reset();
    
    // Refresh render functions
    if (storageKey === 'sm-siswa' && typeof renderSiswaTable === 'function') renderSiswaTable();
    if (storageKey === 'sm-tutor' && typeof renderTutorTable === 'function') renderTutorTable();
    if (storageKey === 'sm-pembayaran' && typeof renderPembayaranTable === 'function') renderPembayaranTable();
  }
}

// Initialize data on page load
document.addEventListener('DOMContentLoaded', () => {
  initSampleData();
}, {once: true});
