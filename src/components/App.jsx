import { supabase } from "./lib/supabase"

import { useEffect } from "react"

function App() {

  useEffect(() => {
    console.log("Supabase Client:", supabase)
  }, [])

  return <h1>Testing Supabase</h1>
}

export default App