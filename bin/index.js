#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))
const puppeteer = require('puppeteer')
const { exec } = require('child_process')

;(async () => {
  let resolution
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(argv._[0])

  switch (argv._[1]) {
    case '240p':
      resolution = '--vid=4'
      break
    case '360p':
      resolution = '--vid=5'
      break
    case '480p':
      resolution = '--vid=2'
      break
    case '720p':
      resolution = '--vid=1'
      break
    case '1080p':
      resolution = '--vid=3'
      break
    default:
      resolution = '--vid=1'
  }

  const string = await page.$eval(
    "script[src='//vwrjffrka3.gjirafa.net/storage/scripts/signalr-hubs.js'",
    (el) => el.nextElementSibling.innerHTML.slice(42, -3)
  )

  const video_obj = JSON.parse(string)
  const video_id = video_obj.VpVideoId

  await browser.close()

  exec(
    `mpv https://agmipnzv.captain.vpplayer.net/encode/${video_id}/hls/master_file.m3u8 ${resolution}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
    }
  )
})()
