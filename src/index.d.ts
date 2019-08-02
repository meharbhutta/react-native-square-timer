declare module 'react-native-sqaure-timer' {
  import { ViewStyle, TextStyle } from 'react-native';

  /**
   * Properties of the SquareTimer component.
   */
  interface SquareTimerProps {
    /**
     * The time in min is required.
     */
    min: number;

    /**
     * The height of the component.
     */
    height?: number;

    /**
     * The threshold width after which the remaining end color change. The default value is 10.
     */
    rermainingEndThreshold?: number;

    /**
     * The elapsed time indicator color. The default color is "#A8C3BC".
     */
    elapsedIndicatorColor?: string;

    /**
     * The remaining time indicator color. The default color is "#0E3657".
     */
    remainingIndicatorColor?: string;

    /**
     * The remaining end time indicator color after threshold. The default color is "#cc0000".
     */
    rermainingEndIndicatorColor?: string;

    /**
     * Style to override the default square timer style.
     */
    style?: ViewStyle;

    /**
     * Style to override the default text style.
     */
    textStyle?: TextStyle;

    /**
     * Callback for the timer end.
     */
    onTimeElapsed?(): void;
  }

  class SquareTimer extends React.Component<SquareTimerProps, {}> {}

  export default SquareTimer;
  export { SquareTimer };
}
