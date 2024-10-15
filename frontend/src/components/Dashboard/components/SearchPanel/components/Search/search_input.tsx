import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { AppStatus } from 'redux/provider'
import { Input } from 'components/UI/input'

export default function SearchInput({ onSearch, value, appStatus }) {
  const [query, setQuery] = useState<string>(value)
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!!query.length) {
      onSearch(query)
    }
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value)
  useEffect(() => {
    setQuery(value)
  }, [value])
  return (
    <form onSubmit={handleSubmit}>
      <div className="relative mt-1 flex items-center h-14 gap-2">
        <input
          type="search"
          className={`truncate dark:focus:bg-darkTheme-hoverLight dark:focus:bg-opacity-10 border-none dark:bg-darkTheme-light bg-lightTheme-navLight focus:bg-lightTheme-itemHover outline-none focus:outline-none focus:ring-0 w-full h-14 rounded-full px-3 py-2.5 pl-12 text-base font-medium placeholder-gray-600 pr-20 $`}
          value={query}
          onChange={handleChange}
          placeholder="Search here or click suggestioned queries below"
        />
        <Search className="pointer-events-none absolute left-3 w-6 h-6 text-lightTheme-textTitle dark:text-darkTheme-white" />

        <button
          className="disabled:hover:bg-inherit hover:bg-gray-300 disabled:cursor-not-allowed opacity-75 p-2 flex items-center absolute right-2 z-10 rounded-full"
          type="submit"
          disabled={!query.length}
        >
          <ArrowRight className="disabled:cursor-not-allowed w-[24px] h-[24px] text-lightTheme-textTitle dark:text-darkTheme-white" />
        </button>
      </div>
    </form>
    // </div>
  )
}
