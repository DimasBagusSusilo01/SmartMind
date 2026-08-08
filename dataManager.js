/* ================================================
   DATA MANAGER - Manage tables & localStorage
   ================================================ */

// Render Siswa table
function renderSiswaTable() {
  const tbody = document.getElementById('siswaTbody');
  if (!tbody) return;
  
  const siswa = getDataFromStorage('sm-siswa');
  tbody.innerHTML = '';
  
  siswa.forEach((s, idx) => {
    const row = document.createElement('tr');
    row.id = `row-${s.id}`;
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td><code>SM2024${String(s.id).padStart(3, '0')}</code></td>
      <td><strong>${s.nama}</strong><br/><small style="color:var(--text-muted);">${s.email}</small></td>
      <td>${s.kelas}</td>
      <td>${s.mata_pelajaran}</td>
      <td><span style="background:rgba(21,101,192,0.1);color:#1565C0;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600;">Paket ${s.kelas.includes('SD') ? 'SD' : s.kelas.includes('SMP') ? 'SMP' : 'SMA'}</span></td>
      <td>${s.nomorHP || '-'}</td>
      <td><span class="badge-status ${s.status_pembayaran === 'lunas' ? 'badge-lunas' : 'badge-pending'}">${s.status_pembayaran === 'lunas' ? 'Lunas' : s.status_pembayaran === 'pending' ? 'Pending' : 'Overdue'}</span></td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn-icon" title="Edit" onclick="editData(${s.id}, 'sm-siswa', 'modalEditSiswa', 'formEditSiswa')" style="width:30px;height:30px;font-size:13px;border:none;background:transparent;cursor:pointer;">✏️</button>
          <button class="btn-icon btn-delete" title="Hapus" style="width:30px;height:30px;font-size:13px;border:none;background:transparent;cursor:pointer;" onclick="deleteRow('tableSiswa', ${s.id}, 'sm-siswa')">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Render Tutor table
function renderTutorTable() {
  const tbody = document.getElementById('tutorTbody');
  if (!tbody) return;
  
  const tutor = getDataFromStorage('sm-tutor');
  tbody.innerHTML = '';
  
  tutor.forEach((t, idx) => {
    const row = document.createElement('tr');
    row.id = `row-${t.id}`;
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${t.nama}</strong><br/><small style="color:var(--text-muted);">${t.email}</small></td>
      <td>${t.mata_pelajaran}</td>
      <td>${formatRp(t.gaji_per_jam)}/jam</td>
      <td>${t.nomorHP || '-'}</td>
      <td><span class="badge-status badge-aktif">${t.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span></td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn-icon" title="Edit" onclick="editData(${t.id}, 'sm-tutor', 'modalEditTutor', 'formEditTutor')" style="width:30px;height:30px;font-size:13px;border:none;background:transparent;cursor:pointer;">✏️</button>
          <button class="btn-icon btn-delete" title="Hapus" style="width:30px;height:30px;font-size:13px;border:none;background:transparent;cursor:pointer;" onclick="deleteRow('tableTutor', ${t.id}, 'sm-tutor')">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Render Pembayaran table
function renderPembayaranTable() {
  const tbody = document.getElementById('pembayaranTbody');
  if (!tbody) return;
  
  const pembayaran = getDataFromStorage('sm-pembayaran');
  tbody.innerHTML = '';
  
  pembayaran.forEach((p, idx) => {
    const row = document.createElement('tr');
    row.id = `row-${p.id}`;
    const statusBadge = p.status === 'lunas' ? 'badge-lunas' : p.status === 'pending' ? 'badge-pending' : 'badge-overdue';
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td><code>${p.nomor_invoice}</code></td>
      <td>${p.siswa_nama}</td>
      <td>${formatRp(p.jumlah)}</td>
      <td>${p.periode}</td>
      <td><span class="badge-status ${statusBadge}">${p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span></td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn-icon" title="Edit" onclick="editData(${p.id}, 'sm-pembayaran', 'modalEditPembayaran', 'formEditPembayaran')" style="width:30px;height:30px;font-size:13px;border:none;background:transparent;cursor:pointer;">✏️</button>
          <button class="btn-icon btn-delete" title="Hapus" style="width:30px;height:30px;font-size:13px;border:none;background:transparent;cursor:pointer;" onclick="deleteRow('tablePembayaran', ${p.id}, 'sm-pembayaran')">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Render all tables
function renderAllTables() {
  renderSiswaTable();
  renderTutorTable();
  renderPembayaranTable();
}

// Auto render tables on page load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    renderAllTables();
  }, 100);
});
