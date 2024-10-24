import { Link } from "react-router-dom"

function PageB() {
  return (
    <>
      <h1>Page B</h1>
      <p>
        Bye bye !
      </p>
      <Link to="/PageC">PageC</Link>
    </>
  )
}

export default PageB
