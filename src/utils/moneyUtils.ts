import accounting from 'accounting'
export const format = (money: number) => accounting.formatMoney(money / 100)
export const unformat = (x: string): number => {
  let sign = 1
  if (x.length === 0) return 0
  if (x[0] === '-') {
    x = x.slice(1)
    sign = -1
  }
  if (isNaN(Number(x[0]))) x = x.slice(1)
  const withoutCommas = x.replaceAll(',', '')
  const [beforeDecimal, afterDecimal] = withoutCommas.split('.')
  if (!afterDecimal || afterDecimal.length === 0) return sign * (Number(beforeDecimal) * 100)
  if (afterDecimal.length === 1) return sign * (Number(beforeDecimal) * 100 + Number(afterDecimal) * 10)
  if (afterDecimal.length === 2) return sign * (Number(beforeDecimal) * 100 + Number(afterDecimal))
  return sign * (Number(beforeDecimal) * 100 + Number(afterDecimal.slice(0, 2)))
}
