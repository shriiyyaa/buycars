const db = require('./database');

const count = db.prepare('SELECT COUNT(*) as c FROM oem_specs').get();
if (count.c === 0) {
  const insert = db.prepare(`INSERT INTO oem_specs 
    (brand, model, year, list_price, colors, mileage_kmpl, power_bhp, max_speed_kmph) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

  const oems = [
    ['Honda','City',2015,850000,'White,Silver,Red,Blue',17.4,118.4,180],
    ['Honda','City',2018,950000,'White,Black,Golden,Red',17.8,119.0,185],
    ['Maruti','Swift',2016,550000,'White,Red,Blue,Grey',22.0,82.0,160],
    ['Maruti','Swift',2019,620000,'White,Silver,Orange,Blue',23.2,83.1,165],
    ['Hyundai','Creta',2017,1100000,'White,Black,Red,Blue,Brown',17.0,121.0,180],
    ['Hyundai','i20',2016,680000,'White,Silver,Red,Grey',18.6,82.0,165],
    ['Toyota','Innova',2015,1500000,'White,Silver,Grey',11.4,134.0,170],
    ['Tata','Nexon',2019,750000,'White,Blue,Red,Orange',17.0,108.5,180],
    ['BMW','3 Series',2016,3500000,'White,Black,Silver,Blue',14.0,252.0,230],
    ['Audi','A4',2017,4000000,'White,Black,Grey,Red',13.9,187.0,235],
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  insertMany(oems);
  console.log('OEM data seeded');
}