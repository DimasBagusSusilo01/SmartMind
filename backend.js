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

        // Ambil elemen input
        const namaSiswa = document.getElementById("nama_siswa").value.trim();
        const kelas = document.getElementById("kelas").value;
        const namaSekolah = document.getElementById("nama_sekolah").value.trim();
        const namaOrtu = document.getElementById("nama_ortu").value.trim();
        const nomorWa = document.getElementById("nomor_wa").value.trim();
        const paket = document.getElementById("paket").value;
        const alamat = document.getElementById("alamat").value.trim();

        // Validasi
        if (!namaSiswa || !kelas || !namaOrtu || !nomorWa || !paket) {
            alert("Harap lengkapi semua bidang yang wajib diisi (*)");
            return;
        }

        // Ambil mata pelajaran yang dicentang saja
        const mapelChecked = document.querySelectorAll(".form-check-input:checked");
        const listMapel = Array.from(mapelChecked)
            .map(input => input.value.trim())
            .filter(val => val !== "");
        const stringMapel = listMapel.join(", ");

        // Loading state
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
                document.getElementById("formDaftar").reset();
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