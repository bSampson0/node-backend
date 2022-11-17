const cheerio = require("cheerio")
const axios = require("axios")
const url = "https://en.wikipedia.org/wiki/List_of_current_UFC_fighters"
const PORT = 6969
const finalData = [];
let testFinal = []

const { Pool, Client } = require('pg')
const connectionString = process.env.POSTGRES_URL

const getData = async () => {
  const resp = await axios.get(url);
  const $ = cheerio.load(resp.data);

  $("table.wikitable").each((index, ttable) => {
    let tableRows = $(ttable).find('tr')
    let tableData = []

    tableRows.each((index, row) => {
      let rowData = $(row).text().replace(/(\r?\n|\r)/gm, "|").split("|")
      tableData.push(rowData)
    })

    let fighters = []

    for (let i = 0; i < tableData.length - 1; i++) {
      let object = {}
      for (let j = 0; j < tableData[0].length; j++) {
        let key = tableData[0][j].toLowerCase().split(" ").join("_"); 
        let value = tableData[i+1][j]
        object[key] = value;
        }
        fighters.push(object)
      }
      finalData.push(fighters)
  })
}

const main = () => {

  const combinedDivisions = cleanData([...finalData[8], ...finalData[9], 
    ...finalData[10], ...finalData[11], ...finalData[12], ...finalData[13], 
    ...finalData[14], ...finalData[15], ...finalData[16], ...finalData[17], 
    ...finalData[18], ...finalData[19]]);

  const pool = new Pool({
    connectionString,
  }) 


  if (finalData.length > 0) {
    pool.query('CREATE TABLE fighters (name varchar(40), age varchar(40), height varchar(40), nickname varchar(40), ufc_record varchar(40), mma_record varchar(40)) ', (err, res) => {
    })
    
    combinedDivisions.forEach(row => {
      let values = [row.name, row.age, row.height, row.nickname, row.ufc_record, row.mma_record]
      pool.query(`INSERT INTO fighters (name, age, height, nickname, ufc_record, mma_record) 
                  VALUES ($1, $2, $3, $4, $5, $6)`, values )
    })
    
    
    pool.query('SELECT * FROM fighters', (err, res) => {
      console.log(res.rows)
      pool.end()
    })
  }
}

const cleanData = (fightersArray) => {
  return fightersArray.map(fighter => {
    return { 
      name: fighter.name,
      age: fighter.age,
      height: fighter["ht."],
      nickname: fighter.nickname,
      ufc_record: fighter.endeavor_record,
      mma_record: fighter.mma_record,
    }
  })
}

const runApp = async () => {
  await getData().then(() => {
    main();
  });
}

runApp();