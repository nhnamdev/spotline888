import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/extracted_config_data.json', 'utf-8'));

for (const [tab, fields] of Object.entries(data)) {
  console.log(`\n=== TAB: ${tab} ===`);
  if (Array.isArray(fields)) {
    fields.forEach(f => {
      console.log(`- ${f.title} (${f.variable}) [${f.type}]: ${JSON.stringify(f.value)} ${f.radioOptions?.length ? JSON.stringify(f.radioOptions) : ''}`);
    });
  }
}
