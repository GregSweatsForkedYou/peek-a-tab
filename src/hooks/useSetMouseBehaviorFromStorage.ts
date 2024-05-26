import { useEffect } from "react";
import { useDispatch } from "react-redux";

// store
import { setMouseBehavior } from "../store/dataSlice";
import { chromeStorage } from "../store/chromeStorage";
import { MOUSE_BEHAVIOR_VALUE } from "../constants";

//
export function useSetMouseBehaviorFromStorage() {
  const dispatch = useDispatch();

  useEffect(() => {
    const setMouseBehaviorFromStorage = async () => {
      const storedMouseBehavior: MOUSE_BEHAVIOR_VALUE =
        await chromeStorage.getMouseBehavior();

      dispatch(setMouseBehavior(storedMouseBehavior));
    };

    setMouseBehaviorFromStorage();

    return () => {
      // this now gets called when the component unmounts
    };
  }, [dispatch]);
}
