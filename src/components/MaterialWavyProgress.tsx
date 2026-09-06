import {
  MaterialLinearWavyProgressIndicator,
  type MaterialLinearWavyProgressIndicatorProps,
} from './MaterialProgressIndicator'

/** @deprecated Use MaterialLinearWavyProgressIndicator. */
export type MaterialWavyProgressProps = Omit<
  MaterialLinearWavyProgressIndicatorProps,
  'indeterminate'
> & {
  value: number
}

/** @deprecated Use MaterialLinearWavyProgressIndicator. */
export function MaterialWavyProgress(props: MaterialWavyProgressProps) {
  return <MaterialLinearWavyProgressIndicator animateProgress {...props} indeterminate={false} />
}
