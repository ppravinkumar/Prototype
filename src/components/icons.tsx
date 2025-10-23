interface IconProps {
  className?: string
}

export function RocketIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.3 7.29C12.8 7.11 13.35 7 14 7C17.31 7 20 9.69 20 13V14.6L21.41 16.01C21.78 16.38 22 16.88 22 17.41V20C22 20.55 21.55 21 21 21H3C2.45 21 2 20.55 2 20V17.41C2 16.88 2.22 16.38 2.59 16.01L4 14.6V13C4 9.69 6.69 7 10 7C10.65 7 11.2 7.11 11.7 7.29M14 9C12.34 9 11 10.34 11 12V14H13V12C13 11.45 13.45 11 14 11C14.55 11 15 11.45 15 12V14H17V12C17 10.34 15.66 9 14 9M10 9C8.34 9 7 10.34 7 12V14H9V12C9 11.45 9.45 11 10 11C10.55 11 11 11.45 11 12V14H13V12C13 10.34 11.66 9 10 9M13 15H11V17H9V15H7V17H5V19H19V17H17V15H15V17H13V15Z" fill="currentColor"/>
    </svg>
  )
}

export function HandIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 4C13 3.45 12.55 3 12 3C11.45 3 11 3.45 11 4V12H9V2C9 1.45 8.55 1 8 1C7.45 1 7 1.45 7 2V12H5V4C5 3.45 4.55 3 4 3C3.45 3 3 3.45 3 4V12C3 14.21 4.79 16 7 16H9V22C9 22.55 9.45 23 10 23H14C14.55 23 15 22.55 15 22V16H17C19.21 16 21 14.21 21 12V8C21 7.45 20.55 7 20 7C19.45 7 19 7.45 19 8V12H17V4C17 3.45 16.55 3 16 3C15.45 3 15 3.45 15 4V12H13V4Z" fill="currentColor"/>
    </svg>
  )
}

export function BotIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 15.5C17.5 16.33 16.83 17 16 17H8C7.17 17 6.5 16.33 6.5 15.5C6.5 14.67 7.17 14 8 14H16C16.83 14 17.5 14.67 17.5 15.5ZM8.5 11.5C8.5 10.67 9.17 10 10 10C10.83 10 11.5 10.67 11.5 11.5C11.5 12.33 10.83 13 10 13C9.17 13 8.5 12.33 8.5 11.5ZM12.5 11.5C12.5 10.67 13.17 10 14 10C14.83 10 15.5 10.67 15.5 11.5C15.5 12.33 14.83 13 14 13C13.17 13 12.5 12.33 12.5 11.5ZM12 2C12.55 2 13 2.45 13 3V4.05C16.39 4.53 19 7.36 19 20.85V21.15C19 21.62 18.62 22 18.15 22H5.85C5.38 22 5 21.62 5 21.15V20.85C5 7.36 7.61 4.53 11 4.05V3C11 2.45 11.45 2 12 2Z" fill="currentColor"/>
    </svg>
  )
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 13.4L8.1 11L7 12.1L10.5 15.6L17 9.1L15.9 8L10.5 13.4ZM12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="currentColor"/>
    </svg>
  )
}
