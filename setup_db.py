#!/usr/bin/env python
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartmind.settings')
sys.path.insert(0, '/home/pramudita/smartmind')
django.setup()

from apps.siswa.models import Siswa
from apps.tutor.models import Tutor
from apps.pembayaran.models import Pembayaran
from datetime import datetime, timedelta

# Clear existing data
Siswa.objects.all().delete()
Tutor.objects.all().delete()
Pembayaran.objects.all().delete()

# Create Sample Tutors
tutors_data = [
    {'nama': 'Sari Dewi, S.Pd', 'email': 'sari@smartmind.id', 'mata_pelajaran': 'Matematika', 'gaji_per_jam': 100000},
    {'nama': 'Doni Pratama, M.Si', 'email': 'doni@smartmind.id', 'mata_pelajaran': 'IPA/Fisika', 'gaji_per_jam': 120000},
    {'nama': 'Rina Safitri, S.S', 'email': 'rina@smartmind.id', 'mata_pelajaran': 'B. Inggris', 'gaji_per_jam': 90000},
    {'nama': 'Budi Santoso, S.Si', 'email': 'budi@smartmind.id', 'mata_pelajaran': 'Kimia', 'gaji_per_jam': 110000},
]

tutors = []
for tutor_data in tutors_data:
    tutor = Tutor.objects.create(**tutor_data)
    tutors.append(tutor)
    print(f'✅ Tutor created: {tutor.nama}')

# Create Sample Students
siswa_data = [
    {'nama': 'Ahmad Fauzi', 'email': 'ahmad@student.id', 'kelas': '9 SMP', 'tutor_nama': 'Sari Dewi, S.Pd', 'mata_pelajaran': 'Matematika', 'status_pembayaran': 'lunas'},
    {'nama': 'Siti Rahma', 'email': 'siti@student.id', 'kelas': '6 SD', 'tutor_nama': 'Sari Dewi, S.Pd', 'mata_pelajaran': 'Matematika', 'status_pembayaran': 'lunas'},
    {'nama': 'Budi Hartono', 'email': 'budi@student.id', 'kelas': '12 SMA', 'tutor_nama': 'Budi Santoso, S.Si', 'mata_pelajaran': 'Kimia', 'status_pembayaran': 'pending'},
    {'nama': 'Dewi Lestari', 'email': 'dewi@student.id', 'kelas': '11 SMA', 'tutor_nama': 'Doni Pratama, M.Si', 'mata_pelajaran': 'IPA/Fisika', 'status_pembayaran': 'lunas'},
    {'nama': 'Rizky Aditya', 'email': 'rizky@student.id', 'kelas': '8 SMP', 'tutor_nama': 'Doni Pratama, M.Si', 'mata_pelajaran': 'IPA/Fisika', 'status_pembayaran': 'overdue'},
]

siswa_list = []
for siswa_d in siswa_data:
    siswa = Siswa.objects.create(**siswa_d)
    siswa_list.append(siswa)
    print(f'✅ Siswa created: {siswa.nama}')

# Create Sample Payments
pembayaran_data = [
    {'siswa': siswa_list[0], 'nomor_invoice': 'INV-20240601-001', 'jumlah': 350000, 'periode': 'Juni 2024', 'status': 'lunas'},
    {'siswa': siswa_list[0], 'nomor_invoice': 'INV-20240501-002', 'jumlah': 350000, 'periode': 'Mei 2024', 'status': 'lunas'},
    {'siswa': siswa_list[1], 'nomor_invoice': 'INV-20240601-003', 'jumlah': 280000, 'periode': 'Juni 2024', 'status': 'lunas'},
    {'siswa': siswa_list[2], 'nomor_invoice': 'INV-20240601-004', 'jumlah': 450000, 'periode': 'Juni 2024', 'status': 'pending'},
    {'siswa': siswa_list[3], 'nomor_invoice': 'INV-20240601-005', 'jumlah': 400000, 'periode': 'Juni 2024', 'status': 'lunas'},
    {'siswa': siswa_list[4], 'nomor_invoice': 'INV-20240601-006', 'jumlah': 400000, 'periode': 'Juni 2024', 'status': 'overdue'},
]

for pembayaran_d in pembayaran_data:
    pembayaran = Pembayaran.objects.create(**pembayaran_d)
    print(f'✅ Pembayaran created: {pembayaran.nomor_invoice}')

print('\n✅ Database initialized dengan sample data!')
print(f'Total Siswa: {Siswa.objects.count()}')
print(f'Total Tutor: {Tutor.objects.count()}')
print(f'Total Pembayaran: {Pembayaran.objects.count()}')
