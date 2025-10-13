// seed.ts
import 'dotenv/config';
import mongoose, { Schema, model } from 'mongoose';
import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';

const AirportSchema = new Schema({
  _id: String, // gunakan 'id' dari CSV sebagai _id
  name: String,
  iata_code: String,
  icao_code: String,
  iso_country: String,
  municipality: String,
  lat: Number,
  lon: Number,
});
const Airport = model('Airport', AirportSchema);

async function main() {
  await mongoose.connect(process.env.MONGO_URI!);

  const url = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
  const res = await fetch(url);
  const csv = await res.text();
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  // Ambil field penting saja (menghemat DB)
  const docs = records.map((r: any) => ({
    _id: r.id,
    name: r.name,
    iata_code: r.iata_code || null,
    icao_code: r.ident || null,
    iso_country: r.iso_country,
    municipality: r.municipality || null,
    lat: r.latitude_deg ? Number(r.latitude_deg) : null,
    lon: r.longitude_deg ? Number(r.longitude_deg) : null,
  }));

  await Airport.deleteMany({});
  await Airport.insertMany(docs);
  console.log('Seeded', docs.length, 'airports');

  // (opsional) buat text index untuk search sederhana
  await Airport.collection.createIndex({ name: 'text', municipality: 'text', iata_code: 'text' });

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});