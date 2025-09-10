import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { execSync } from "child_process";
import { setTimeout } from 'timers/promises'


async function loopDownload(urlImages: string[], chapter: string) {
  if (urlImages.length > fs.readdirSync(`./images/${chapter}`).length) {
    await downloadImages(urlImages, chapter)
    await setTimeout(5000)
    await loopDownload(urlImages, chapter)
  }
}
async function getUrlImages(page: string) {
  const { data } = await axios.get(page)

  const $ = cheerio.load(data)

  const images = $("img").map((_, el) => $(el).attr("src")).get()

  return images
}

async function createFolderImage(name: string) {
  if (!fs.existsSync('./images')) {
    fs.mkdirSync("./images")
  }

  if (!fs.existsSync(`./images/${name}`)) {
    fs.mkdirSync(`./images/${name}`)
  }

}

async function downloadImages(urls: string[], chapter: string) {

  const pathFile = `./images/${chapter}`
  if (!fs.existsSync(pathFile)) {
    fs.mkdirSync(pathFile)
  }
  urls.forEach(async (image, i) => {

    const file = pathFile + `/${i.toString().padStart(2, '0')}.jpg`


    if (fs.existsSync(file)) {
      return
    }

    const { data } = await axios.get(image, {
      responseType: "arraybuffer"
    })

    fs.writeFileSync(file, data)
  })

}

async function createEpub(anime: string, chapter: string) {


  const command = `
    cd images/${chapter} &&\
    mogrify -quality 52 *.jpg &&\
    img2pdf *.jpg -o ${anime}.pdf &&\
    ebook-convert ${anime}.pdf ${anime}.epub --cover 00.jpg 
    `

  execSync(command)

}

async function main() {

  const name = 'kaiju-n-8-1'
  const page = 'https://www.kaijuchapters.com/manga/jujutsu-kaisen-chapter-1-2/'

  await createFolderImage(name)

  const urlImages = await getUrlImages(page)

  await loopDownload(urlImages, name)

  await createEpub(name)

  console.log('end')


}


main();
// loadImages()
