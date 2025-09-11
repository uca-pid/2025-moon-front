import { useState } from "react"
import { Button } from "./components/ui/button"

export const App = () => {
  const [isClicked, setIsClicked] = useState(false)
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className='bg-blue-500 p-10 rounded-lg flex flex-col gap-4'>
        <h1 className='text-3xl text-white'>TEST</h1>
        <Button onClick={() => setIsClicked(!isClicked)}>Click me</Button>
        {isClicked && <p className='text-white'>Funciona shadcn</p>}
      </div>
    </div>
  )
}

export default App
