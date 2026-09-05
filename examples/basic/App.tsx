import { useState } from 'react'
import {
  Button,
  MaterialThemeProvider,
  Slider,
  Switch,
  WavyProgress,
} from 'material-3-expressive-for-react'
import 'material-3-expressive-for-react/styles.css'

export function App() {
  const [enabled, setEnabled] = useState(true)
  const [progress, setProgress] = useState(42)

  return (
    <MaterialThemeProvider seed={{ primary: '#6750a4' }}>
      <Button variant="filled">Create monster</Button>
      <Switch
        aria-label="Enable notifications"
        checked={enabled}
        onChange={(event) => setEnabled(event.currentTarget.checked)}
      />
      <Slider
        aria-label="Progress"
        min={0}
        max={100}
        value={progress}
        valueIndicator="always"
        onChange={(event) => setProgress(event.currentTarget.valueAsNumber)}
      />
      <WavyProgress label="Progress" value={progress / 100} />
    </MaterialThemeProvider>
  )
}
