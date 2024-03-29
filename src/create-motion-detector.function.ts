import { debounce } from '@merry-solutions/debounce';

export function createMotionDetector(onMotioNStart: Callback, onMotionEnd: Callback): (event: DeviceMotionEvent) => void {
  const current = { x: 0, y: 0 };
  let isMotionInProgress = false;

  const [debouncedShowAnswer] = debounce(onMotionEnd, 500);

  return (event) => {
    const hasSignificantVerticalMovement = Math.abs(current.y - (event.accelerationIncludingGravity?.y ?? 0)) > 10;

    if (hasSignificantVerticalMovement && !isMotionInProgress) {
      current.x = event.accelerationIncludingGravity?.x ?? 0;
      current.y = event.accelerationIncludingGravity?.y ?? 0;
      isMotionInProgress = true;
      onMotioNStart();
    } else if (isMotionInProgress) {
      debouncedShowAnswer();
      isMotionInProgress = false;
    }
  };
}

type Callback = () => void;
