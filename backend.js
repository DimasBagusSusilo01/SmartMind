const SUPABASE_URL = "https://tlbctoielkmanpkzthwp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsYmN0b2llbGttYW5wa3p0aHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMTE0NTIsImV4cCI6MjEwMTc4NzQ1Mn0.9DsFYg6l5MF-Y6NRNGZIP8n_Axl_tV9Fjo1J4hBsYq0";

import { createClient } from 'https://esm.sh/@supabase/supabase-js';
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const kirim = document.getElementById("kirim").addEventListener("click", async () =>{
    //const mapel1 = document.getElementById("m1").value;
    //const mapel2 = document.getElementById("m2").value;
    //const mapel3 = document.getElementById("m3").value;
    //const mapel4 = document.getElementById("m4").value;
    //const mapel5 = document.getElementById("m5").value;
    //const mapel6 = document.getElementById("m6").value;

    const mapel = document.querySelectorAll("#m1, #m2, #m3, #m4, #m5, #m6");
    const listMapel = Array.from(mapel)
        .map(input => input.value.trim())
        .filter(val => val !== "");
    const stringMapel = listMapel.join(", ");

    //const alamat = document.getElementById("alamat").value;
    //const paket = document.getElementById("paket").value;
    //const nomor_wa = document.getElementById("nomor_wa").value;
    //const nama_ortu = document.getElementById("nama_ortu").value;
    //const nama_sekolah = document.getElementById("nama_sekolah").value;
    //const kelas = document.getElementById("kelas").value;
    //const nama_siswa = document.getElementById("nama_siswa").value;

    const { data, error } = await supabase
  .from('form_siswa')
  .insert([
    {
      nama_siswa: document.getElementById("nama_siswa").value,
      asal_sekolah: document.getElementById("nama_sekolah").value,
      kelas: document.getElementById("kelas").value,
      paket_belajar: document.getElementById("paket").value,
      mapel: stringMapel, // Hasil string gabungan dimasukkan ke sini
      alamat: document.getElementById("alamat").value,
      nama_ortu: document.getElementById("nama_ortu").value,
      nomor_ortu: document.getElementById("nomor_wa").value
    }
  ]);
});

