import express from 'express'
import tmp from 'tmp-promise'
import fs from 'fs'
import readline from 'readline'
import { $ } from 'execa'
import VCF from '@gmod/vcf'

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

app.get('/', async (req, res, next) => {
  try {
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
    console.log('fetching', ref, start, end, url)

    const vcfname = tmp.tmpNameSync({ prefix: 'vcf' })
    const outputname = tmp.tmpNameSync({ prefix: 'plink' })
    await $({ stdout: { file: vcfname } })(settings.tabix, [
      '-p',
      'vcf',
      '-h',
      `${url}`,
      ref + ':' + start + '-' + end,
    ])
    console.log('done tabix')

    await $(settings.plink, [
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
    ])
    console.log('done plink')
    const snps = new Set(
      fs.readFileSync(outputname + '.snplist', 'utf8').split('\n'),
    )
    console.log('done snps')
    const rl = readline.createInterface({
      input: fs.createReadStream(vcfname),
    })

    let header = [] as string[]
    let elts = [] as any[]
    let parser = undefined as VCF | undefined

    let i = 0
    for await (const line of rl) {
      if (line.startsWith('#')) {
        header.push(line)
        continue
      } else if (!parser) {
        parser = new VCF({ header: header.join('\n') })
      }
      const elt = parser.parseLine(line)
      if (elt.ID && snps.has(elt.ID?.join(';'))) {
        elts.push({
          refName: elt.CHROM,
          uniqueId: `snp-${i++}`,
          name: elt.ID?.join(';'),
          start: elt.POS - 1,
          end: elt.POS,
        })
      }
    }

    res.send(
      JSON.stringify({
        snps: elts,
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
    next(e)
  }
})

const p = process.env.PORT || 4730
app.listen(p)
console.log(`listening on ${p}`)
