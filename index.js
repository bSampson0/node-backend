const express = require('express')
const cheerio = require("cheerio")
const axios = require("axios")

const url = "https://en.wikipedia.org/wiki/List_of_current_UFC_fighters"
const PORT = 6969
const finalData = [];

const getData = async () => {
  const resp = await axios.get(url);
  const $ = cheerio.load(resp.data);

  $("table.wikitable").each((index, ttable) => {
    let tableRows = $(ttable).find('tr')
    let tableData = []

    tableRows.each((index, row) => {
      let rowData = $(row).text().trim().replace(/(\r?\n|\r)/gm, " ").split("  ")
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

const app = express()

app.get('/releases', async (req, res) => {
  const releases = {
    title: "Recent releases and retirements",
    data: finalData[0]
  }
  res.send(releases)
})

app.get('/signings', async (req, res) => {
  const signings = {
    title: "Recent signings",
    data: finalData[1]
  }
  console.log(signings.data.length)
  res.send(signings)
})

app.get('/suspensions', async (req, res) => {
  const suspensions = {
    title: "Suspensions",
    data: finalData[2]
  }
  console.log(suspensions.length)
  res.send(suspensions)
})

app.get('/heavyweights', async (req, res) => {
  const fighters = {
    title: 'Heavyweights',
    data: finalData[8]
  }
  res.send(fighters)
})

app.get('/light-heavyweights', async (req, res) => {
  const fighters = {
    title: 'Light Heavyweights',
    data: finalData[9]
  }
  res.send(fighters)
})

app.get('/middleweights', async (req, res) => {
  const fighters = {
    title: 'Middleweights',
    data: finalData[10]
  }
  res.send(fighters)
})

app.get('/welterweights', async (req, res) => {
  const fighters = {
    title: 'Welterweights',
    data: finalData[11]
  }
  res.send(fighters)
})

app.get('/lightweights', async (req, res) => {
  const fighters = {
    title: 'Lightweights',
    data: finalData[12]
  }
  res.send(fighters)
})

app.get('/featherweights', async (req, res) => {
  const fighters = {
    title: 'Featherweights',
    data: finalData[13]
  }
  res.send(fighters)
})

app.get('/bantamweights', async (req, res) => {
  const fighters = {
    title: 'Bantamweights',
    data: finalData[14]
  }
  res.send(fighters)
})

app.get('/flyweights', async (req, res) => {
  const fighters = {
    title: 'Flyweights',
    data: finalData[15]
  }
  res.send(fighters)
})

app.get('/', async (req, res) => {
  res.send(finalData)
})

app.listen(PORT, async () => {
  await getData();
  console.log(`Listening on port ${PORT}`)
})