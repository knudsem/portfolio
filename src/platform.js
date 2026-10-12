// Apple keyboards say Cmd where others say Ctrl.
export const IS_APPLE = /Mac|iPhone|iPad|iPod/i.test(
  navigator.userAgentData?.platform || navigator.platform || navigator.userAgent,
)

export const SHORTCUT = IS_APPLE ? ['⌘', 'K'] : ['Ctrl', 'K']
