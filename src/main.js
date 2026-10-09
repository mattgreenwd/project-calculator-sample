import './style.css'

const PRICING = {
  perPage: 250,
  design: {
    template: { label: 'Template-based design', amount: 500 },
    custom: { label: 'Custom design', amount: 1500 },
  },
  seo: { label: 'SEO setup', amount: 500 },
  cms: { label: 'CMS integration', amount: 750 },
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const pagesInput = document.querySelector('#pages')
const pagesDisplay = document.querySelector('#pages-display')
const designInputs = document.querySelectorAll('input[name="design"]')
const seoInput = document.querySelector('#seo')
const cmsInput = document.querySelector('#cms')
const totalEl = document.querySelector('#total')
const breakdownEl = document.querySelector('#breakdown')

function getSelectedDesign() {
  const selected = document.querySelector('input[name="design"]:checked')
  return selected?.value ?? 'template'
}

function getEstimate() {
  const pages = Number(pagesInput.value)
  const designKey = getSelectedDesign()
  const design = PRICING.design[designKey]
  const pageCost = pages * PRICING.perPage

  const lines = [
    {
      label: `Pages (${pages} × ${currency.format(PRICING.perPage)})`,
      amount: pageCost,
    },
    {
      label: design.label,
      amount: design.amount,
    },
  ]

  if (seoInput.checked) {
    lines.push({
      label: PRICING.seo.label,
      amount: PRICING.seo.amount,
      optional: true,
    })
  }

  if (cmsInput.checked) {
    lines.push({
      label: PRICING.cms.label,
      amount: PRICING.cms.amount,
      optional: true,
    })
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0)

  return { pages, lines, total }
}

function pulse(element) {
  element.classList.remove('is-updating')
  // Force reflow so the animation can replay on rapid changes.
  void element.offsetWidth
  element.classList.add('is-updating')
}

function renderEstimate() {
  const { pages, lines, total } = getEstimate()

  pagesDisplay.textContent = String(pages)
  pagesInput.setAttribute('aria-valuenow', String(pages))
  totalEl.textContent = currency.format(total)

  breakdownEl.innerHTML = lines
    .map(
      (line) => `
        <li class="${line.optional ? 'is-optional' : ''}">
          <span>${line.label}</span>
          <span>${currency.format(line.amount)}</span>
        </li>
      `,
    )
    .join('')

  pulse(pagesDisplay)
  pulse(totalEl)
}

function bindEvents() {
  pagesInput.addEventListener('input', renderEstimate)
  designInputs.forEach((input) => {
    input.addEventListener('change', renderEstimate)
  })
  seoInput.addEventListener('change', renderEstimate)
  cmsInput.addEventListener('change', renderEstimate)
}

bindEvents()
renderEstimate()
