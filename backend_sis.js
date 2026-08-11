import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL =
    "https://tlbctoielkmanpkzthwp.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsYmN0b2llbGttYW5wa3p0aHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMTE0NTIsImV4cCI6MjEwMTc4NzQ1Mn0.9DsFYg6l5MF-Y6NRNGZIP8n_Axl_tV9Fjo1J4hBsYq0";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// =====================================================
// STATE
// =====================================================

let semuaSiswa = [];


// =====================================================
// SAAT HALAMAN SELESAI DIMUAT
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Memuat data siswa...");

    await loadSiswa();

    setupSearch();

});


// =====================================================
// AMBIL DATA SISWA DARI SUPABASE
// =====================================================

async function loadSiswa() {

    const { data, error } = await supabase
        .from("form_siswa")
        .select(`
            uuid_siswa,
            nama_siswa,
            asal_sekolah,
            kelas,
            paket_belajar,
            mapel,
            alamat,
            nama_ortu,
            nomor_ortu,
            siswa (
                status
            )
        `)
        .order("nama_siswa", {
            ascending: true
        });

    if (error) {

        console.error(
            "Gagal mengambil data siswa:",
            error
        );

        showError(
            "Gagal mengambil data siswa dari database."
        );

        return;
    }

    console.log("Data siswa:", data);

    semuaSiswa = data ?? [];

    renderSiswa(semuaSiswa);

    updateStatistics(semuaSiswa);

}


// =====================================================
// RENDER TABLE
// =====================================================

function renderSiswa(data) {

    const tbody =
        document.getElementById("siswaTbody");

    if (!tbody) {
        console.error(
            "Element #siswaTbody tidak ditemukan."
        );
        return;
    }

    tbody.innerHTML = "";


    if (!data || data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9"
                    style="
                        text-align:center;
                        padding:30px;
                        color:var(--text-muted);
                    ">
                    Tidak ada data siswa.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach((siswa, index) => {

        /*
         * Karena siswa adalah relationship,
         * Supabase biasanya mengembalikan:
         *
         * siswa: {
         *     status: "Aktif"
         * }
         */

        const status =
            siswa.siswa?.status || "Aktif";


        const statusClass =
            status.toLowerCase() === "aktif"
                ? "badge-aktif"
                : "badge-nonaktif";


        const nama =
            siswa.nama_siswa || "-";


        const idSiswa =
            siswa.uuid_siswa || "-";


        const kelas =
            siswa.kelas || "-";


        const mapel =
            siswa.mapel || "-";


        const paket =
            formatPaket(
                siswa.paket_belajar
            );


        const nomorWA =
            siswa.nomor_ortu || "-";


        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>


            <td>
                <span
                    title="${escapeHTML(idSiswa)}"
                    style="
                        font-size:11px;
                        font-family:monospace;
                    "
                >
                    ${escapeHTML(
                        shortUUID(idSiswa)
                    )}
                </span>
            </td>


            <td>
                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    "
                >

                    <div
                        style="
                            width:34px;
                            height:34px;
                            border-radius:50%;
                            background:
                              linear-gradient(
                                135deg,
                                #1565C0,
                                #42A5F5
                              );
                            color:#fff;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-weight:700;
                            flex-shrink:0;
                        "
                    >
                        ${escapeHTML(
                            nama.charAt(0)
                                .toUpperCase()
                        )}
                    </div>

                    <strong>
                        ${escapeHTML(nama)}
                    </strong>

                </div>
            </td>


            <td>
                ${escapeHTML(kelas)}
            </td>


            <td>
                ${escapeHTML(mapel)}
            </td>


            <td>
                ${escapeHTML(paket)}
            </td>


            <td>
                ${
                    nomorWA !== "-"
                        ? `
                        <a
                            href="${createWhatsAppLink(
                                nomorWA
                            )}"
                            target="_blank"
                            style="
                                color:#16A34A;
                                text-decoration:none;
                                font-weight:600;
                            "
                        >
                            ${escapeHTML(
                                nomorWA
                            )}
                        </a>
                        `
                        : "-"
                }
            </td>


            <td>
                <span
                    class="badge-status ${statusClass}"
                >
                    ${escapeHTML(status)}
                </span>
            </td>


            <td>

                <div
                    style="
                        display:flex;
                        gap:5px;
                    "
                >

                    <button
                        class="btn btn-sm btn-outline-primary"
                        onclick="showDetailById('${idSiswa}')"
                        title="Detail"
                    >
                        👁️
                    </button>


                    <button
                        class="btn btn-sm btn-outline-secondary"
                        onclick="editSiswaById('${idSiswa}')"
                        title="Edit"
                    >
                        ✏️
                    </button>

                </div>

            </td>

        `;


        tbody.appendChild(row);

    });

}


// =====================================================
// STATISTIK
// =====================================================

function updateStatistics(data) {

    const total =
        data.length;


    const aktif =
        data.filter(siswa =>
            siswa.siswa?.status
                ?.toLowerCase() === "aktif"
        ).length;


    const nonaktif =
        data.filter(siswa =>
            siswa.siswa?.status
                ?.toLowerCase() === "non-aktif"
        ).length;


    const totalElement =
        document.getElementById(
            "totalSiswa"
        );

    const aktifElement =
        document.getElementById(
            "siswaAktif"
        );

    const nonaktifElement =
        document.getElementById(
            "siswaNonaktif"
        );


    if (totalElement) {
        totalElement.textContent =
            total;
    }


    if (aktifElement) {
        aktifElement.textContent =
            aktif;
    }


    if (nonaktifElement) {
        nonaktifElement.textContent =
            nonaktif;
    }


    // Belum tersedia karena
    // form_siswa belum memiliki created_at.
    const baruElement =
        document.getElementById(
            "siswaBaru"
        );

    if (baruElement) {
        baruElement.textContent = "-";
    }

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const search =
        document.getElementById(
            "searchSiswa"
        );

    if (!search) return;


    search.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .trim()
                    .toLowerCase();


            if (!keyword) {

                renderSiswa(
                    semuaSiswa
                );

                return;
            }


            const hasil =
                semuaSiswa.filter(
                    siswa => {

                        return (

                            siswa.nama_siswa
                                ?.toLowerCase()
                                .includes(keyword)

                            ||

                            siswa.kelas
                                ?.toLowerCase()
                                .includes(keyword)

                            ||

                            siswa.mapel
                                ?.toLowerCase()
                                .includes(keyword)

                            ||

                            siswa.paket_belajar
                                ?.toLowerCase()
                                .includes(keyword)

                            ||

                            siswa.nomor_ortu
                                ?.toLowerCase()
                                .includes(keyword)

                        );

                    }
                );


            renderSiswa(hasil);

        }
    );

}


// =====================================================
// FILTER
// =====================================================

window.filterTable = function () {

    const kelas =
        document.getElementById(
            "filterKelas"
        )?.value
        .trim()
        .toLowerCase() || "";


    const status =
        document.getElementById(
            "filterStatus"
        )?.value
        .trim()
        .toLowerCase() || "";


    const hasil =
        semuaSiswa.filter(
            siswa => {

                const kelasSiswa =
                    siswa.kelas
                        ?.toLowerCase() || "";


                const statusSiswa =
                    siswa.siswa?.status
                        ?.toLowerCase() || "";


                let cocokKelas = true;
                let cocokStatus = true;


                if (kelas) {

                    cocokKelas =
                        kelasSiswa.includes(
                            kelas
                        );

                }


                if (status) {

                    cocokStatus =
                        statusSiswa.includes(
                            status
                        );

                }


                return (
                    cocokKelas &&
                    cocokStatus
                );

            }
        );


    renderSiswa(hasil);

};


// =====================================================
// DETAIL SISWA
// =====================================================

window.showDetailById =
async function (uuid) {

    const siswa =
        semuaSiswa.find(
            data =>
                data.uuid_siswa === uuid
        );


    if (!siswa) {

        console.error(
            "Data siswa tidak ditemukan:",
            uuid
        );

        return;
    }


    const nama =
        siswa.nama_siswa || "-";


    document.getElementById(
        "detailNama"
    ).textContent = nama;


    document.getElementById(
        "detailAvatar"
    ).textContent =
        nama
            .charAt(0)
            .toUpperCase();


    const status =
        siswa.siswa?.status ||
        "Aktif";


    /*
     * Isi data detail.
     *
     * HTML-mu saat ini belum mempunyai
     * ID pada semua field detail.
     *
     * Jadi bagian ini hanya mengisi
     * elemen yang sudah memiliki ID.
     */


    const statusElement =
        document.querySelector(
            "#detailSiswaBody .badge-status"
        );


    if (statusElement) {

        statusElement.textContent =
            status;

    }


    const wa =
        siswa.nomor_ortu || "";


    const waLink =
        document.getElementById(
            "waLink"
        );


    if (waLink && wa) {

        waLink.href =
            createWhatsAppLink(wa);

    }


    openModal(
        "modalDetailSiswa"
    );

};


// =====================================================
// EDIT SISWA
// =====================================================

window.editSiswaById =
function (uuid) {

    const siswa =
        semuaSiswa.find(
            data =>
                data.uuid_siswa === uuid
        );


    if (!siswa) return;


    console.log(
        "Siswa yang akan diedit:",
        siswa
    );


    /*
     * Untuk tahap awal kita tampilkan
     * data siswa yang dipilih.
     *
     * Jangan menyimpan form edit lama
     * ke Supabase dulu karena field
     * formEditSiswa tidak sesuai schema.
     */

    const nama =
        siswa.nama_siswa || "";


    document.querySelector(
        "#formTambahSiswa input[type='text']"
    )?.focus();


    openModal(
        "modalTambahSiswa"
    );

};


// =====================================================
// FORMAT PAKET
// =====================================================

function formatPaket(paket) {

    if (!paket) {
        return "-";
    }


    switch (
        paket.toLowerCase()
    ) {

        case "sd":
            return "Paket SD";

        case "smp":
            return "Paket SMP";

        case "sma":
            return "Paket SMA";

        default:
            return paket;

    }

}


// =====================================================
// UUID PENDEK
// =====================================================

function shortUUID(uuid) {

    if (!uuid) {
        return "-";
    }


    return uuid.substring(
        0,
        8
    ) + "...";

}


// =====================================================
// WHATSAPP
// =====================================================

function createWhatsAppLink(
    nomor
) {

    let cleaned =
        String(nomor)
            .replace(/\D/g, "");


    if (
        cleaned.startsWith("0")
    ) {

        cleaned =
            "62" +
            cleaned.substring(1);

    }


    return (
        "https://wa.me/" +
        cleaned
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    return String(text ?? "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    const tbody =
        document.getElementById(
            "siswaTbody"
        );


    if (!tbody) return;


    tbody.innerHTML = `
        <tr>
            <td colspan="9"
                style="
                    text-align:center;
                    padding:30px;
                    color:#DC2626;
                ">
                ❌ ${escapeHTML(message)}
            </td>
        </tr>
    `;

}