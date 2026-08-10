const SUPABASE_URL = "https://tlbctoielkmanpkzthwp.supabase.co";
const SUPABASE_ANON_KEY = "KEY_ANON_KAMU";

import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

document.addEventListener("DOMContentLoaded", () => {

    const tombolKirim = document.getElementById("kirim");

    if (!tombolKirim) return;

    tombolKirim.addEventListener("click", async (e) => {

        e.preventDefault();

        // Ambil elemen
        const elNamaSiswa = document.getElementById("nama_siswa");
        const elKelas = document.getElementById("kelas");
        const elNamaSekolah = document.getElementById("nama_sekolah");
        const elNamaOrtu = document.getElementById("nama_ortu");
        const elNomorWa = document.getElementById("nomor_wa");
        const elPaket = document.getElementById("paket");
        const elAlamat = document.getElementById("alamat");

        // Ambil value
        const namaSiswa = elNamaSiswa?.value.trim() ?? "";
        const kelas = elKelas?.value ?? "";
        const namaSekolah = elNamaSekolah?.value.trim() ?? "";
        const namaOrtu = elNamaOrtu?.value.trim() ?? "";
        const nomorWa = elNomorWa?.value.trim() ?? "";
        const paket = elPaket?.value ?? "";
        const alamat = elAlamat?.value.trim() ?? "";

        console.log("Data Input:", {
            namaSiswa,
            kelas,
            namaSekolah,
            namaOrtu,
            nomorWa,
            paket,
            alamat
        });

        // Validasi
        if (!namaSiswa || !kelas || !namaOrtu || !nomorWa || !paket) {
            alert("Harap isi semua bidang wajib!");
            return;
        }

        // Mapel
        const mapelChecked =
            document.querySelectorAll(".form-check-input:checked");

        const listMapel = Array.from(mapelChecked)
            .map(input => input.value.trim())
            .filter(value => value !== "");

        const stringMapel = listMapel.join(", ");

        // Loading
        tombolKirim.disabled = true;
        tombolKirim.innerText = "Mengirim...";

        try {

            const { data, error } = await supabase
                .from("form_siswa")
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
                ])
                .select();

            console.log("Supabase data:", data);
            console.log("Supabase error:", error);

            if (error) {
                console.error("Insert gagal:", error);
                alert("Gagal mengirim data: " + error.message);
                return;
            }

            alert("Pendaftaran berhasil!");

            const form = document.getElementById("formDaftar");

            if (form) {
                form.reset();
            }

        } catch (err) {

            console.error("ERROR:", err);

            alert(
                "Terjadi kesalahan sistem: " +
                (err?.message ?? err)
            );

        } finally {

            tombolKirim.disabled = false;
            tombolKirim.innerText = "🚀 Kirim Pendaftaran";

        }
    });
});