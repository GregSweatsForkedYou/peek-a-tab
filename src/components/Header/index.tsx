// components
import Search from "../Search";
// import InteractionButton from "../Settings";

// styles
import "./styles.css";

// type Props = {};

function Header({ totalTabsCount }: { totalTabsCount: number }) {
  return (
    <div className="header">
      <Search totalTabsCount={totalTabsCount} />
      {/* <InteractionButton /> */}
    </div>
  );
}

export default Header;
