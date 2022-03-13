
const unformat = (x) => {
  const withoutCommas = x.replaceAll(',', '')
  const [beforeDecimal, afterDecimal] = withoutCommas.split('.')
  if (!afterDecimal || afterDecimal.length === 0) return Number(beforeDecimal) * 100
  if (afterDecimal.length === 1) return Number(beforeDecimal) * 100 + Number(afterDecimal) * 10
  if (afterDecimal.length === 2) return Number(beforeDecimal) * 100 + Number(afterDecimal)
  if (afterDecimal.length > 2) return Number(beforeDecimal) * 100 + Number(afterDecimal.slice(0, 2))
}

describe('Formatted number to actul number', () => {
  it('Get number from decimals', () => {
    expect(unformat('1,235')).toBe(123500)
    expect(unformat('1,235.')).toBe(123500)
    expect(unformat('1,235.4')).toBe(123540)
    expect(unformat('1,235.42')).toBe(123542)
    expect(unformat('1,235.423')).toBe(123542)
    expect(unformat('1,235.4235')).toBe(123542)
  })
})
