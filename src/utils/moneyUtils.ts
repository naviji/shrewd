import accounting from 'accounting'
export const format = (money) => accounting.formatMoney(money / 100)
export const unformat = (x) => {
  const withoutCommas = x.replaceAll(',', '')
  const [beforeDecimal, afterDecimal] = withoutCommas.split('.')
  if (!afterDecimal || afterDecimal.length === 0) return Number(beforeDecimal) * 100
  if (afterDecimal.length === 1) return Number(beforeDecimal) * 100 + Number(afterDecimal) * 10
  if (afterDecimal.length === 2) return Number(beforeDecimal) * 100 + Number(afterDecimal)
  if (afterDecimal.length > 2) return Number(beforeDecimal) * 100 + Number(afterDecimal.slice(0, 2))
}
