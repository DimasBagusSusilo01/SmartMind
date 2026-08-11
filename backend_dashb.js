import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://tlbctoielkmanpkzthwp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsYmN0b2llbGttYW5wa3p0aHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMTE0NTIsImV4cCI6MjEwMTc4NzQ1Mn0.9DsFYg6l5MF-Y6NRNGZIP8n_Axl_tV9Fjo1J4hBsYq0";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ======================================================
// LOAD DASHBOARD
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Dashboard backend dimulai...");

    await loadDashboard();

});


// ======================================================
// LOAD SEMUA DATA DASHBOARD
// ======================================================

async function loadDashboard() {

    await Promise.all([
        loadTotalSiswa(),
        loadTotalTutor(),
        loadPemasukan(),
        loadJadwalHariIni(),
        loadPendaftarBaru()
    ]);

}


// ======================================================
// TOTAL SISWA
// ======================================================

async function loadTotalSiswa() {

    const { count, error } = await supabase
        .from("siswa")
        .select("*", {
            count: "exact",
            head: true
        });

    if (error) {
        console.error("Gagal mengambil jumlah siswa:", error);
        return;
    }

    const element = document.getElementById("totalSiswa");

    if (element) {
        element.textContent = count ?? 0;
    }

}


// ======================================================
// TOTAL TUTOR
// ======================================================

async function loadTotalTutor() {

    const { count, error } = await supabase
        .from("tutor")
        .select("*", {
            count: "exact",
            head: true
        });

    if (error) {
        console.error("Gagal mengambil jumlah tutor:", error);
        return;
    }

    const element = document.getElementById("totalTutor");

    if (element) {
        element.textContent = count ?? 0;
    }

}


// ======================================================
// TOTAL PEMASUKAN
// ======================================================

async function loadPemasukan() {

    const { data, error } = await supabase
        .from("pembayaran")
        .select("nominal");

    if (error) {
        console.error("Gagal mengambil pembayaran:", error);
        return;
    }

    const total = (data ?? []).reduce(
        (jumlah, pembayaran) => {
            return jumlah + Number(pembayaran.nominal || 0);
        },
        0
    );

    const element = document.getElementById("totalPemasukan");

    if (element) {
        element.textContent = formatRupiah(total);
    }

}


// ======================================================
// JADWAL HARI INI
// ======================================================

async function loadJadwalHariIni() {

    const sekarang = new Date();

    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
    const tanggal = String(sekarang.getDate()).padStart(2, "0");

    const hariIni = `${tahun}-${bulan}-${tanggal}`;

    const { data, error } = await supabase
        .from("jadwal")
        .select(`
            uuid_siswa,
            uuid_tutor,
            hari,
            jam_mulai,
            jam_selesai
        `)
        .eq("hari", hariIni);

    if (error) {
        console.error("Gagal mengambil jadwal hari ini:", error);
        return;
    }

    const element = document.getElementById("totalJadwalHariIni");

    if (element) {
        element.textContent = data?.length ?? 0;
    }

    console.log("Jadwal hari ini:", data);

}


// ======================================================
// PENDAFTAR BARU
// ======================================================

async function loadPendaftarBaru() {

    /*
     * form_siswa belum mempunyai created_at.
     *
     * Jadi kita belum bisa menentukan mana yang
     * benar-benar paling baru berdasarkan waktu.
     *
     * Untuk sementara ambil 3 data.
     */

    const { data, error } = await supabase
        .from("form_siswa")
        .select(`
            uuid_siswa,
            nama_siswa,
            kelas,
            paket_belajar
        `)
        .limit(3);

    if (error) {
        console.error("Gagal mengambil pendaftar:", error);
        return;
    }

    const container = document.getElementById("newStudentList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!data || data.length === 0) {

        container.innerHTML = `
            <div style="
                padding:20px;
                text-align:center;
                color:var(--text-muted);
            ">
                Belum ada pendaftar.
            </div>
        `;

        return;
    }


    data.forEach((siswa) => {

        const nama = siswa.nama_siswa || "Tanpa Nama";

        const huruf = nama
            .trim()
            .charAt(0)
            .toUpperCase();

        const paket = formatPaket(
            siswa.paket_belajar
        );

        container.innerHTML += `

            <div style="
                display:flex;
                align-items:center;
                gap:12px;
                padding:10px 20px;
                border-bottom:1px solid var(--border);
            ">

                <div style="
                    width:38px;
                    height:38px;
                    border-radius:50%;
                    background:linear-gradient(
                        135deg,
                        #1565C0,
                        #42A5F5
                    );
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    color:#fff;
                    font-weight:700;
                    font-size:14px;
                    flex-shrink:0;
                ">
                    ${escapeHTML(huruf)}
                </div>

                <div style="flex:1;">

                    <strong style="font-size:13px;">
                        ${escapeHTML(nama)}
                    </strong>

                    <p style="
                        font-size:11px;
                        color:var(--text-muted);
                        margin:0;
                    ">
                        ${escapeHTML(siswa.kelas || "-")}
                        ·
                        ${escapeHTML(paket)}
                    </p>

                </div>

            </div>

        `;

    });

}


// ======================================================
// FORMAT PAKET
// ======================================================

function formatPaket(paket) {

    switch (paket) {

        case "sd":
            return "Paket SD";

        case "smp":
            return "Paket SMP";

        case "sma":
            return "Paket SMA";

        default:
            return paket || "-";
    }

}


// ======================================================
// FORMAT RUPIAH
// ======================================================

function formatRupiah(angka) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(angka);

}


// ======================================================
// MENCEGAH HTML INJECTION
// ======================================================

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}