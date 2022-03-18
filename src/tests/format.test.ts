import { unformat } from '../utils/moneyUtils'

describe('Formatted number to actul number', () => {
  it('Get number from decimals', () => {
    expect(unformat('1,235')).toBe(123500)
    expect(unformat('1,235.')).toBe(123500)
    expect(unformat('1,235.4')).toBe(123540)
    expect(unformat('1,235.42')).toBe(123542)
    expect(unformat('1,235.423')).toBe(123542)
    expect(unformat('1,235.4235')).toBe(123542)
    expect(unformat('$1,235.4235')).toBe(123542)
    expect(unformat('-$1,123,456.00')).toBe(-112345600)
  })
})
