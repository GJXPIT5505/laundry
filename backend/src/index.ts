import { Hono } from 'hono'
import { cors } from 'hono/cors'

export type Env = {}

const app = new Hono<{ Bindings: Env }>()

app.use('/api/*', cors({ origin: '*', credentials: true }))

app.get('/', (c) => {
  return c.text('Welcome to RFID Laundry Dashboard API!')
})

const SHEET_ID = '1Pf8Gf3YNh2cJlrJ5dVPzVtx8ll0tXWm99b-IoI8yD-Q';

async function fetchSheetData(sheetName: string, range: string) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&headers=0&range=${range}`;
  const response = await fetch(url);
  const text = await response.text();
  
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}') + 1;
  const jsonString = text.substring(jsonStart, jsonEnd);
  
  const data = JSON.parse(jsonString);
  return data.table.rows;
}

app.get('/api/sheets/log', async (c) => {
  try {
    const rows = await fetchSheetData('Data Siswa', 'C5:E');
    
    // Filter valid rows
    const validRows = rows.filter((r: any) => r.c[0]?.v && r.c[1]?.v);
    
    // Calculate status sequentially: odd tap = Diproses, even tap = Selesai
    const tapCounts: Record<string, number> = {};
    const processedLogs = validRows.map((r: any, index: number) => {
      const rfid = r.c[0]?.v || '';
      const nama = r.c[1]?.v || '';
      const kelas = r.c[2]?.v || '';
      
      tapCounts[rfid] = (tapCounts[rfid] || 0) + 1;
      const isOdd = tapCounts[rfid] % 2 !== 0;
      const status = isOdd ? 'Diproses' : 'Selesai';
      
      return { rfid, nama, kelas, status };
    });
    
    // Reverse to put newest at the top
    const reversed = processedLogs.reverse();
    
    // Assign simulated timestamps so the top is the newest
    // 5 seconds apart to simulate real-time tapping log
    const finalData = reversed.map((r: any, idx: number) => ({
      ...r,
      time: new Date(Date.now() - idx * 5000).toISOString() 
    }));

    return c.json(finalData);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
})

app.get('/api/sheets/master', async (c) => {
  try {
    const rows = await fetchSheetData('Master Siswa', 'B5:D');
    const validRows = rows
      .filter((r: any) => r.c[0]?.v && r.c[1]?.v)
      .map((row: any) => ({
        rfid: row.c[0]?.v || '',
        nama: row.c[1]?.v || '',
        kelas: row.c[2]?.v || ''
      }));
    
    return c.json(validRows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
})

export default app
