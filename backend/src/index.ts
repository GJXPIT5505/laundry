import { Hono } from 'hono'
import { cors } from 'hono/cors'

export type Env = {
  // Bindings removed since we are proxying Google Sheets now
}

const app = new Hono<{ Bindings: Env }>()

// Enable CORS
app.use('/api/*', cors({ origin: '*', credentials: true }))

app.get('/', (c) => {
  return c.text('Welcome to RFID Laundry Dashboard API!')
})

const SHEET_ID = '1Pf8Gf3YNh2cJlrJ5dVPzVtx8ll0tXWm99b-IoI8yD-Q';

async function fetchSheetData(sheetName: string, range: string) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&headers=0&range=${range}`;
  const response = await fetch(url);
  const text = await response.text();
  
  // Extract JSON from the JSONP response
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}') + 1;
  const jsonString = text.substring(jsonStart, jsonEnd);
  
  const data = JSON.parse(jsonString);
  return data.table.rows;
}

function parseRow(row: any, index: number) {
  // Columns: C=0 (RFID), D=1 (Nama), E=2 (Kelas) because of range=C5:E
  const rfid = row.c[0]?.v || '';
  const nama = row.c[1]?.v || '';
  const kelas = row.c[2]?.v || '';
  
  // Simulate status based on odd/even rows (0-indexed, so we add 1 for 1-based logic)
  const isOdd = (index + 1) % 2 !== 0;
  const status = isOdd ? 'Diproses' : 'Selesai';
  
  // Simulate timestamp (last 24 hours randomly or just now for simplicity)
  // The user requested timestamp when fetched, but for charts to work, maybe slightly distributed?
  // User: "Waktu tap tidak tersedia di sheet saat ini, gunakan timestamp saat data diambil sebagai simulasi"
  // Let's create a timestamp based on the index so it looks realistic, minus some minutes.
  const time = new Date(Date.now() - index * 60000 * 15).toISOString(); // each older row is 15 mins older

  return { rfid, nama, kelas, status, time };
}

app.get('/api/sheets/log', async (c) => {
  try {
    const rows = await fetchSheetData('Data Siswa', 'C5:E');
    // "Data mulai baris 5" -> rows[4] onwards. But sometimes gviz omits empty top rows.
    // Let's filter out rows that don't have RFID/Nama.
    const validRows = rows.map((r: any, idx: number) => parseRow(r, idx)).filter((r: any) => r.rfid !== '' && r.nama !== '');
    
    // Sort so newest is at the top (index 0 is newest if we assume latest append)
    // Actually, gviz returns them in top-to-bottom order. The newest log is usually at the bottom.
    // So we should reverse it to put the newest at the top.
    const reversed = validRows.reverse();
    
    // Recalculate timestamps so the top ones are the newest
    const finalData = reversed.map((r: any, idx: number) => ({
      ...r,
      time: new Date(Date.now() - idx * 60000 * 5).toISOString() // 5 minutes apart
    }));

    return c.json(finalData);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
})

app.get('/api/sheets/master', async (c) => {
  try {
    const rows = await fetchSheetData('Master Siswa', 'C5:E');
    // Filter out rows without data
    const validRows = rows.map((r: any, idx: number) => parseRow(r, idx)).filter((r: any) => r.rfid !== '' && r.nama !== '');
    
    // For master, maybe we just want to list them.
    return c.json(validRows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
})

export default app
