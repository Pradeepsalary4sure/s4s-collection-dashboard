import { ThemeProvider } from "./context/ThemeContext";
import AnimatedBackground from "./components/ui/AnimatedBackground";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <ThemeProvider>
      <AnimatedBackground />
      <Dashboard />
    </ThemeProvider>
  );
}

