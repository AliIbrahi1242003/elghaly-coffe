export interface Governorate {
  id: number;
  name: string;
  cities: string[];
}

export const egyptianGovernorates: Governorate[] = [
  {
    id: 1,
    name: "Cairo",
    cities: ["Cairo", "Helwan", "6th of October City"],
  },
  {
    id: 2,
    name: "Alexandria",
    cities: ["Alexandria", "New Alexandria"],
  },
  {
    id: 3,
    name: "Giza",
    cities: ["Giza", "6th of October City", "Sheikh Zayed City"],
  },
  {
    id: 4,
    name: "Qalyubia",
    cities: ["Benha", "Qalyub", "Shubra El-Khayma", "Baraq"],
  },
  {
    id: 5,
    name: "Gharbia",
    cities: ["Tanta", "Kafr El-Sheikh", "Al-Mahallah Al-Kubra", "Samannoud"],
  },
  {
    id: 6,
    name: "Sharkia",
    cities: ["Zagazig", "Sammanud", "Bilbeis", "Minya Al-Qamh", "Abu Kabir"],
  },
  {
    id: 7,
    name: "Dakahlia",
    cities: ["Mansoura", "Mit Ghamr", "Talkha", "Sinbellawain"],
  },
  {
    id: 8,
    name: "Damietta",
    cities: ["Damietta", "New Damietta"],
  },
  {
    id: 9,
    name: "Port Said",
    cities: ["Port Said", "Port Fuad"],
  },
  {
    id: 10,
    name: "Ismailia",
    cities: ["Ismailia", "Port Ibrahim"],
  },
  {
    id: 11,
    name: "Suez",
    cities: ["Suez", "Ain Sukhna"],
  },
  {
    id: 12,
    name: "Kafr El-Sheikh",
    cities: ["Kafr El-Sheikh", "Sidi Salem", "Baltim"],
  },
  {
    id: 13,
    name: "Beheira",
    cities: ["Damanhur", "Rashid", "Kafr El-Dawwar", "Shibrakhit"],
  },
  {
    id: 14,
    name: "Monufia",
    cities: ["Shibin El-Kom", "Menouf", "Ashmun"],
  },
  {
    id: 15,
    name: "Fayoum",
    cities: ["Fayoum", "Ibshawai", "Tunis"],
  },
  {
    id: 16,
    name: "Beni Suef",
    cities: ["Beni Suef", "Nasser", "Fashn"],
  },
  {
    id: 17,
    name: "Minya",
    cities: ["Minya", "Beni Mazar", "Samalut"],
  },
  {
    id: 18,
    name: "Asyut",
    cities: ["Asyut", "Abydos", "Dayr al-Gabrawi"],
  },
  {
    id: 19,
    name: "Sohag",
    cities: ["Sohag", "Akhmim", "Tahta"],
  },
  {
    id: 20,
    name: "Qena",
    cities: ["Qena", "Dendera", "Nag Hammadi"],
  },
  {
    id: 21,
    name: "Luxor",
    cities: ["Luxor", "Karnak"],
  },
  {
    id: 22,
    name: "Aswan",
    cities: ["Aswan", "Abu Simbel", "Edfu"],
  },
  {
    id: 23,
    name: "Red Sea",
    cities: ["Hurghada", "Safaga", "Marsa Alam"],
  },
  {
    id: 24,
    name: "New Valley",
    cities: ["Kharga", "Dakhla"],
  },
  {
    id: 25,
    name: "Matrouh",
    cities: ["Marsa Matruh", "Al-Alamein", "Siwa"],
  },
  {
    id: 26,
    name: "North Sinai",
    cities: ["Arish", "Rafah", "Sheikh Zuwaid"],
  },
  {
    id: 27,
    name: "South Sinai",
    cities: ["Sharm El-Sheikh", "Dahab", "Nuweiba"],
  },
];

export const getCitiesByGovernorate = (governorateId: number): string[] => {
  const governorate = egyptianGovernorates.find((g) => g.id === governorateId);
  return governorate?.cities || [];
};
