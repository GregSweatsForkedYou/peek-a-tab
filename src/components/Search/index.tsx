import { useSelector, useDispatch } from "react-redux";

// styles
import "./styles.css";

// store
import { RootState } from "../../store/store.ts";
import { setSearchInputText } from "../../store/dataSlice.ts";
import { useEffect, useRef } from "react";

// types

/**
 *
 * @param param0
 * @returns
 */
function Search({ totalTabsCount }: { totalTabsCount: number }) {
  const ref = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const searchInputText = useSelector(
    (state: RootState) => state.data.searchInputText
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!ref.current) {
        return;
      }
      if (
        (event.key.length === 1 ||
          (event.key == "Backspace" && !event.shiftKey && !event.metaKey)) &&
        document.activeElement != ref.current
      ) {
        ref.current.focus();
        ref.current.value + event.key;
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref.current]);

  return (
    <input
      ref={ref}
      className="search-input"
      value={searchInputText}
      placeholder={`Search ${totalTabsCount || ""} tabs`}
      onChange={(e) => {
        dispatch(setSearchInputText(e.target.value));
      }}
    />
  );
}

export default Search;
