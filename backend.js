const SUPABASE_URL = "https://tlbctoielkmanpkzthwp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsYmN0b2llbGttYW5wa3p0aHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMTE0NTIsImV4cCI6MjEwMTc4NzQ1Mn0.9DsFYg6l5MF-Y6NRNGZIP8n_Axl_tV9Fjo1J4hBsYq0";

import { createClient } from 'https://esm.sh/@supabase/supabase-js';
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

document.addEventListener("DOMContentLoaded", () => {
    const tombolKirim = document.getElementById("kirim");

    if (!tombolKirim) return;

    tombolKirim.addEventListener("click", async (e) => {
        e.preventDefault();

        // 1. Ambil elemen DOM
        const elNamaSiswa = document.getElementById("nama_siswa");
        const elKelas = document.getElementById("kelas");
        const elNamaSekolah = document.getElementById("nama_sekolah");
        const elNamaOrtu = document.getElementById("nama_ortu");
        const elNomorWa = document.getElementById("nomor_wa");
        const elPaket = document.getElementById("paket");
        const elAlamat = document.getElementById("alamat");

        // 2. Ambil nilai (value) & hapus spasi tak terpakai
        const namaSiswa = elNamaSiswa ? elNamaSiswa.value.trim() : "";
        const kelas = elKelas ? elKelas.value : "";
        const namaSekolah = elNamaSekolah ? elNamaSekolah.value.trim() : "";
        const namaOrtu = elNamaOrtu ? elNamaOrtu.value.trim() : "";
        const nomorWa = elNomorWa ? elNomorWa.value.trim() : "";
        const paket = elPaket ? elPaket.value : "";
        const alamat = elAlamat ? elAlamat.value.trim() : "";

        // Debugging: Buka Console Browser (F12) untuk melihat nilai yang terbaca
        console.log("Data Input:", { namaSiswa, kelas, namaOrtu, nomorWa, paket });

        // 3. Validasi
        if (!namaSiswa || !kelas || !namaOrtu || !nomorWa || !paket) {
            alert("Harap pilih dan isi semua bidang yang wajib (*), termasuk memilih Kelas dan Paket Belajar!");
            return;
        }

        // 4. Ambil mata pelajaran yang dicentang saja
        const mapelChecked = document.querySelectorAll(".form-check-input:checked");
        const listMapel = Array.from(mapelChecked)
            .map(input => input.value.trim())
            .filter(val => val !== "");
        const stringMapel = listMapel.join(", ");

        // UI Loading
        tombolKirim.disabled = true;
        tombolKirim.innerText = "Mengirim...";

        try {
            const { data, error } = await supabase
              .from('form_siswa')
              .insert([
                {
                  nama_siswa: namaSiswa,
                  asal_sekolah: namaSekolah,
                  kelas: kelas,
                  paket_belajar: paket,
                  mapel: stringMapel,
                  alamat: alamat,
                  nama_ortu: namaOrtu,
                  nomor_ortu: nomorWa
                }
              ]);

            if (error) {
                alert("Gagal mengirim data: " + error.message);
            } else {
                alert("Pendaftaran berhasil!");
                const form = document.getElementById("formDaftar");
                if (form) form.reset();
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan sistem.");
        } finally {
            tombolKirim.disabled = false;
            tombolKirim.innerText = "🚀 Kirim Pendaftaran";
        }
    });
});