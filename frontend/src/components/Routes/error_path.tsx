/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TvhKfm9NiRk
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Link } from 'react-router-dom'
export const ErrorPage = () => {
  return (
    <div className="flex min-h-[100dvh] w-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <SpaceIcon className="mx-auto h-24 w-24 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops, looks like you've landed on the wrong page!
        </h1>
        <p className="mt-4 text-muted-foreground">
          But don't worry, we've got your back!
        </p>
        <div className="mt-6 flex flex-col justify-center items-center gap-4">
          <Link
            to={'/'}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Take me back home
          </Link>
        </div>
      </div>
    </div>
  )
}

function SpaceIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
    </svg>
  )
}
