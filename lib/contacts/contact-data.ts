export interface ContactPerson {
  id: number;
  branch: string;
  name: string;
  phone: string;
  position: string;
  address: string;
}

export const contactData: ContactPerson[] = [
  { id: 1, branch: "Branch Ambon", name: "Moh. Syaogi", phone: "0822-8323-4963", position: "Branch Location Manager", address: "Jl. Sisingamangaraja No. 88, Kel. Passo, Kec. Baguala, Kota Ambon" },
  { id: 2, branch: "Branch Bekasi", name: "Arip Risnawan", phone: "0813-8077-6268", position: "Branch Location Specialist", address: "Jl. Jababeka VI Blok L3 No.5, Harja Mekar, Cikarang Utara, Bekasi, Jawa Barat 17530" },
  { id: 3, branch: "Branch Bekasi", name: "Faan Muslimin", phone: "0812-4774-6751", position: "Branch Location Manager", address: "Jl. Jababeka VI Blok L3 No.5, Harja Mekar, Cikarang Utara, Bekasi, Jawa Barat 17530" },
  { id: 4, branch: "Branch Bekasi", name: "Badru Sofa", phone: "0813-8076-2019", position: "Branch Location Specialist", address: "Jl. Jababeka VI Blok L3 No.5, Harja Mekar, Cikarang Utara, Bekasi, Jawa Barat 17530" },
  { id: 5, branch: "Branch Bitung", name: "Frengky Arfianto", phone: "0813-8076-8098", position: "Branch location Manager", address: "Jl. Industri Raya 1 Kp No.KM 12 RT.003, Bunder, Cikupa, Tangerang, Banten 15710" },
  { id: 6, branch: "Branch Bitung", name: "Anditia", phone: "0856-9333-7001", position: "Branch location Specialist", address: "Jl. Industri Raya 1 Kp No.KM 12 RT.003, Bunder, Cikupa, Tangerang, Banten 15710" },
  { id: 7, branch: "Branch Bitung", name: "Suharlin", phone: "0813-1483-6076", position: "Branch location Specialist", address: "Jl. Industri Raya 1 Kp No.KM 12 Rt.003, Bunder, Kec. Cikupa, Kab. Tangerang, Banten, 15710" },
  { id: 8, branch: "Branch Bitung (Area Sumatera Bagian Selatan)", name: "Imanuddin Ahmad", phone: "0821-9126-6196", position: "Branch Location Manager", address: "Jl. Industri Raya 1 Kp No.KM 12 RT.003, Bunder, Kec. Cikupa, Kab. Tangerang, Banten, 15710" },
  { id: 9, branch: "Branch Bitung (Area Sumatera Bagian Selatan)", name: "Yufsar Alfian Harahap", phone: "0813-1547-7244", position: "Branch Location Specialist", address: "Jl. Industri Raya 1 Kp No.KM 12 Rt.003, Bunder, Kec. Cikupa, Kab. Tangerang, Banten, 15710" },
  { id: 10, branch: "Branch Boyolali", name: "Muhlis Munajat", phone: "0812-9314-2115", position: "Branch Location Specialist", address: "Jl. Semarang Boyolali KM1 Desa Winong, Kec. Boyolali, Kab. Boyolali, Jawa Tengah" },
  { id: 11, branch: "Branch Jayapura", name: "Moh. Sholihin", phone: "0812-1279-5083", position: "Branch Location Specialist", address: "Jl. Baru Tobati Hamadi Pantai, RT 005/RW 007, Kel. Hamadi, Kec. Jayapura Selatan, Kota Jayapura, Papua" },
  { id: 12, branch: "Branch Kendari", name: "Medio Febrizal", phone: "0813-8077-7473", position: "Branch Location Manager", address: "Jalan Pierre Tendean RT.01/ RW.01 Kel. Watubangga Kec. Baruga Kota Kendari Kodepos : 93116" },
  { id: 13, branch: "Branch Kendari", name: "Deddy Chandra", phone: "0822-8753-8411", position: "Branch Location Specialist", address: "Jalan Pierre Tendean RT.01/ RW.01 Kel. Watubangga Kec. Baruga Kota Kendari Kodepos : 93116" },
  { id: 14, branch: "Branch Makassar", name: "Untung Cornelis Siregar", phone: "0813-8076-2100", position: "Branch Location Manager", address: "Kawasan Industri Makassar, Jl. Kima 8 Blok SS No.23, Daya, Makassar, Kota Makassar, Sulawesi Selatan 90241" },
  { id: 15, branch: "Branch Makassar", name: "Azwar", phone: "0813-8076-4939", position: "Branch Location Specialist", address: "Kawasan Industri Makassar, Jl. Kima 8 Blok SS No.23, Daya, Makassar, Kota Makassar, Sulawesi Selatan 90241" },
  { id: 16, branch: "Branch Makassar", name: "Abdul Haris", phone: "0813-8076-8049", position: "Branch Location Specialist", address: "Kawasan Industri Makassar, Jl. Kima 8 Blok SS No.23, Daya, Makassar, Kota Makassar, Sulawesi Selatan 90241" },
  { id: 17, branch: "Branch Manado", name: "Catur Setia Darmo", phone: "0813-8076-6071", position: "Branch Location Manager", address: "Kompleks Pergudangan Olympic Group Jl. Raya Manado-Bitung Km.15, Kolongan, Kalawat Jaga VI, Minahasa Utara" },
  { id: 18, branch: "Branch Medan", name: "Andri Kamaludin", phone: "0813-8076-9823", position: "Branch Location Manager", address: "Jl. M.G. Manurung, Timbang Deli, Kec. Medan Amplas, Kota Medan, Sumatera Utara 20149" },
  { id: 19, branch: "Branch Medan", name: "Mahardin Sinaga", phone: "0813-8076-2077", position: "Branch Location Specialist", address: "Jl. M.G. Manurung, Timbang Deli, Kec. Medan Amplas, Kota Medan, Sumatera Utara 20149" },
  { id: 20, branch: "Branch Palu", name: "Christopher Matheos", phone: "0813-8076-2489", position: "Branch Location Manager", address: "Jl. Karanja Lembah, Kalukubula, Sigi Biromaru, Kabupaten Sigi, Sulawesi Tengah 94235" },
  { id: 21, branch: "Branch Palu", name: "Fikri B Daeng Mananti", phone: "0813-8076-8239", position: "Branch Location Specialist", address: "Jl. Karanja Lembah, Kalukubula, Sigi Biromaru, Kabupaten Sigi, Sulawesi Tengah 94235" },
  { id: 22, branch: "Branch Pasuruan", name: "Sukma Nossy", phone: "0821-4062-9318", position: "Branch Location Specialist", address: "Jl. Raya Bakalan No.37, Turen, Beji, Kec. Beji, Pasuruan, Jawa Timur 67154" },
  { id: 23, branch: "Branch Pasuruan", name: "Andika Kolopaking", phone: "0813-8076-2431", position: "Branch Location Manager", address: "Jl. Raya Bakalan No.37, Turen, Beji, Kec. Beji, Pasuruan, Jawa Timur 67154" },
  { id: 24, branch: "Branch Samarinda", name: "Mochammad Angga Aji Pratama", phone: "0852-5095-9593", position: "Branch Location Specialist", address: "Jl. P. Suryanata, Bukit Pinang, Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur 75131" },
  { id: 25, branch: "Branch Samarinda", name: "Arie Luckianto", phone: "0859-4653-7732", position: "Branch Location Manager", address: "Jl. P. Suryanata, Bukit Pinang, Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur 75131" },
];
