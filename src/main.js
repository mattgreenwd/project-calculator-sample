import './style.css'

const PRICING = {
  perRound: 275,
  design: {
    template: { label: '“Make it pop”', amount: 650 },
    custom: { label: '“Like Apple, but cheaper”', amount: 1800 },
  },
  logoBigger: { label: 'Make the logo bigger', amount: 420 },
  matchPdf: { label: '“Can you make it look like this PDF?”', amount: 750 },
}

const MOODS = [
  { max: 1500, text: 'Optimistic. Naïve, even.' },
  { max: 2500, text: 'Mildly cursed. Surviveable.' },
  { max: 3500, text: 'Therapist on speed dial.' },
  { max: 4500, text: 'Update the LinkedIn. Quietly.' },
  { max: Infinity, text: 'Send flowers to your future self.' },
]

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const form = document.querySelector('.controls')
const pagesInput = document.querySelector('#pages')
const pagesDisplay = document.querySelector('#pages-display')
const logoBiggerInput = document.querySelector('#logo-bigger')
const matchPdfInput = document.querySelector('#match-pdf')
const totalEl = document.querySelector('#total')
const breakdownEl = document.querySelector('#breakdown')
const moodEl = document.querySelector('#mood')

function getSelectedDesign() {
  const selected = form.querySelector('input[name="design"]:checked')
  return selected?.value ?? 'template'
}

function getMood(total) {
  return MOODS.find((mood) => total <= mood.max)?.text ?? MOODS.at(-1).text
}

function getEstimate() {
  const rounds = Number(pagesInput.value)
  const design = PRICING.design[getSelectedDesign()]
  const roundsCost = rounds * PRICING.perRound

  const lines = [
    {
      label: `Tiny tweak rounds (${rounds} × ${currency.format(PRICING.perRound)})`,
      amount: roundsCost,
    },
    {
      label: design.label,
      amount: design.amount,
    },
  ]

  if (logoBiggerInput.checked) {
    lines.push({
      label: PRICING.logoBigger.label,
      amount: PRICING.logoBigger.amount,
      optional: true,
    })
  }

  if (matchPdfInput.checked) {
    lines.push({
      label: PRICING.matchPdf.label,
      amount: PRICING.matchPdf.amount,
      optional: true,
    })
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0)

  return { rounds, lines, total }
}

function pulse(element) {
  if (!element) return
  element.classList.remove('is-updating')
  void element.offsetWidth
  element.classList.add('is-updating')
}

function renderBreakdown(lines) {
  breakdownEl.replaceChildren(
    ...lines.map((line) => {
      const item = document.createElement('li')
      if (line.optional) item.className = 'is-optional'

      const label = document.createElement('span')
      label.textContent = line.label

      const amount = document.createElement('span')
      amount.textContent = currency.format(line.amount)

      item.append(label, amount)
      return item
    }),
  )
}

function renderEstimate() {
  const { rounds, lines, total } = getEstimate()

  pagesDisplay.textContent = String(rounds)
  pagesInput.setAttribute('aria-valuenow', String(rounds))
  totalEl.textContent = currency.format(total)
  if (moodEl) moodEl.textContent = getMood(total)
  renderBreakdown(lines)

  pulse(pagesDisplay)
  pulse(totalEl)
  pulse(moodEl)
}

function bindEvents() {
  // One listener covers slider, radios, and checkboxes.
  form.addEventListener('input', renderEstimate)
  form.addEventListener('change', renderEstimate)
}

bindEvents()
renderEstimate()
