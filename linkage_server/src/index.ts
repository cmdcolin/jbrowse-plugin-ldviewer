import express from 'express'
import tmp from 'tmp-promise'
import fs from 'fs'
import child from 'child_process'

const app = express()

const settings = {
  plink: 'plink', // can be full path
  tabix: 'tabix', // can be full path,
  deleteFiles: 0,
}

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

app.get('/', function (req, res) {
  const { query } = req
  const { maf: maf2, url, start: start2, ref, end: end2 } = query
  if (
    url === undefined ||
    start2 === undefined ||
    end2 === undefined ||
    ref === undefined
  ) {
    throw new Error('Failed to read query')
  }
  const start = Math.round(+start2)
  const end = Math.round(+end2)
  const maf = maf2 || 0.01
  console.log({ ref, start, end, url })
  const proc = child.spawn(settings.tabix, [
    '-p',
    'vcf',
    '-h',
    `${url}`,
    ref + ':' + start + '-' + end,
  ])

  proc.stderr.on('data', function (data) {
    console.error(data.toString('utf8'))
  })
  const vcfname = tmp.tmpNameSync({ prefix: 'vcf' })
  const outputname = tmp.tmpNameSync({ prefix: 'plink' })
  const tabixvcf = fs.createWriteStream(vcfname, { flags: 'w' })
  proc.stdout.pipe(tabixvcf)
  proc.stderr.pipe(process.stderr)
  proc.on('exit', function () {
    console.log(vcfname)
    const params = [
      '--vcf',
      vcfname,
      '--r2',
      'triangle',
      '--out',
      outputname,
      '--allow-extra-chr',
      '--write-snplist',
      '--maf',
      maf,
    ]
    const p = child.spawn(settings.plink, params)
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
    p.on('exit', function () {
      try {
        res.send(
          JSON.stringify({
            snps: fs.readFileSync(outputname + '.snplist', 'utf8'),
            ld: fs.readFileSync(outputname + '.ld', 'utf8'),
          }),
        )
        if (settings.deleteFiles) {
          fs.unlinkSync(vcfname)
          fs.unlinkSync(outputname + '.nosex')
          fs.unlinkSync(outputname + '.snplist')
          fs.unlinkSync(outputname + '.log')
          fs.unlinkSync(outputname + '.ld')
        }
      } catch (e) {
        console.error(e)
        res.send('break')
      }
    })
  })
})

app.listen(process.env.PORT || 4730)
