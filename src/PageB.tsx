import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { SelectScrollable } from "@/SelectScrollable"

function PageB() {
  return (
    <>
      <h1>Page B</h1>
      <p>
        Bye bye !
      </p>
      <Button>Click me</Button>
      <SelectScrollable />
      <Link to="/PageC">PageC</Link>
    </>
  )
}

export default PageB
