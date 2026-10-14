// Small inline icons drawn in the style of SF Symbols: round caps, 1.8px strokes at 24px,
// coloured with currentColor so they take the colour of the text around them.

type IconProps = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: false,
} as const

/** checkmark.circle.fill */
export function CheckCircle({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M7.5 12.3l3 3 6-6.3"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** arrow.left.arrow.right */
export function Swap({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        d="M4 8.5h15M15.5 5l3.5 3.5-3.5 3.5M20 15.5H5M8.5 12L5 15.5 8.5 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
