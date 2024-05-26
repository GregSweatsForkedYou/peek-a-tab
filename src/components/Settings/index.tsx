import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { IconContext } from "react-icons";
import FocusLock from "react-focus-lock";

// styles
import "./styles.css";

// images
// import { FiSidebar } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";

// store
import { RootState } from "../../store/store";
import { setMouseBehavior } from "../../store/dataSlice.ts";

// constants
import { MOUSE_BEHAVIOR, MOUSE_BEHAVIOR_VALUE } from "../../constants.ts";

// types

/**
 *
 * @param param0
 * @returns
 */
function Settings() {
  const [isSettingsModalVisible, setSettingsModalVisibility] = useState(false);

  const dispatch = useDispatch();
  const selectedMouseBehavior = useSelector(
    (state: RootState) => state.data.mouseBehavior
  );

  const onMouseBehaviorChange = (behaviorName: MOUSE_BEHAVIOR_VALUE) => {
    dispatch(setMouseBehavior(behaviorName));
  };

  const toggleSettingsModal = () => {
    setSettingsModalVisibility(!isSettingsModalVisible);
  };

  const MouseBehaviorOption = ({
    behaviorName,
    name,
    text,
  }: {
    behaviorName: MOUSE_BEHAVIOR_VALUE;
    name: string;
    text: string;
  }) => {
    const onClick = () => {
      onMouseBehaviorChange(behaviorName);
    };
    return (
      <button
        onClick={onClick}
        className={`mouseBehaviorOption ${
          behaviorName == selectedMouseBehavior ? "selected" : ""
        }`}
      >
        <p className="mouseBehaviorOptionName">{name}</p>
        <p className="mouseBehaviorOptionText">{text}</p>
      </button>
    );
  };

  return (
    <IconContext.Provider value={{ size: "16px" }}>
      {/* <div className="interaction-buttons">
        <button className="interaction-button">
          <FiSidebar />
        </button>
      </div> */}
      <div className="settings">
        <button onClick={toggleSettingsModal} className="settings-button">
          <FiSettings />
        </button>

        {isSettingsModalVisible ? (
          <FocusLock>
            <div className="settingsModalContainer">
              <div
                className="settingsModalOverlay"
                onClick={toggleSettingsModal}
              ></div>
              <div className="settingsModal">
                <h3 className="settingsHeadline">Mouse Behavior</h3>
                <div className="settingsBlock">
                  {" "}
                  <MouseBehaviorOption
                    behaviorName={MOUSE_BEHAVIOR.DOUBLE_CLICK}
                    name="Double Click"
                    text="Tab change on single click, tab change and close the list on double click."
                  />
                  <MouseBehaviorOption
                    behaviorName={MOUSE_BEHAVIOR.SINGLE_CLICK}
                    name="Single Click"
                    text="Tab change and close the list on single click."
                  />
                  <MouseBehaviorOption
                    behaviorName={MOUSE_BEHAVIOR.HOVER}
                    name="Hover"
                    text="Tab change on hover, tab change and close the list on single click."
                  />
                </div>
              </div>
            </div>
          </FocusLock>
        ) : null}
      </div>
    </IconContext.Provider>
  );
}

export default Settings;
