// hooks/useClickOutside.ts

import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

type UseClickOutsideHook = {
  ref: React.RefObject<HTMLInputElement>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const useClickOutside = (
  onClickOutside: () => Promise<void>
): UseClickOutsideHook => {
  const ref = useRef<HTMLInputElement>(null);
  const [isChanged, setIsChanged] = useState(false); // Track if the input was changed

  useOnClickOutside(ref, async () => {
    if (isChanged) {
      await onClickOutside(); // Dispatch the update only if the input was changed
      setIsChanged(false); // Reset the change tracker after dispatch
    }
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChanged(true); // Mark input as changed on any change event
  };

  return { ref, handleInputChange };
};

export default useClickOutside;
