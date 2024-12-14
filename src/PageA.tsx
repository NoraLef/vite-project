import { createThemeFromSourceColor, findSourceColorForPrimary } from "./helpers/createMaterial3Theme"
import { findSourceColorInBrowser } from "./helpers/findColorSourceBruteForceScript";

function PageA() {
  findSourceColorInBrowser("#FF4687").then((result) => {

    if(result) {
      console.log(createThemeFromSourceColor(result).light.primary)
    }
    else {
      console.log("Not Found 😵");
    }
  }).catch(() => console.log("Error"))

  return (
    <>
      <h1>Page A</h1>
      <p>
        Hey, Watch this !
      </p>
    </>
  )
}

export default PageA
