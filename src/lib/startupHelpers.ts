export function envFromArgs (args) {
  if (!args) return 'prod'
  const envIndex = args.indexOf('--env')
  const devIndex = args.indexOf('dev')
  if (envIndex === devIndex - 1) return 'dev'
  return 'prod'
}

// We want to know if a profile is specified early, in particular
// to save the window state data.
export function profilePathFromArgs (args) {
  if (!args) return null
  const profileIndex = args.indexOf('--profile')
  if (profileIndex <= 0 || profileIndex >= args.length - 1) return null
  const profileValue = args[profileIndex + 1]
  return profileValue || null
}

export function isDebugMode (args) {
  return !!args && args.indexOf('--debug') >= 0
}
