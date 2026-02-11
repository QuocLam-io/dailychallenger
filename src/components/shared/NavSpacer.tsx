//React
import { useEffect, useState } from "react";
//Styling
import "./NavSpacer.scss"


const NavSpacer = () => {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const nav = document.getElementById("navbar");
    if (nav) {
      const resizeObserver = new ResizeObserver(() => {
        setHeight(nav.offsetHeight);
      });
      resizeObserver.observe(nav);

      setHeight(nav.offsetHeight);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return <div  className="nav-spacer_wrapper" style={{ height }} aria-hidden="true" />;
};

export default NavSpacer;