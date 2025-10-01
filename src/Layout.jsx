// App.jsx (Layout component)
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Outlet /> {/* renders child routes like Quiz */}
    </div>
  );
}
