import AppProvider from "@/context/Appcontext";
import { Toaster } from "react-hot-toast";

export default function LoginLayout({ children }) {
  return (
    <AppProvider>
      {children}
      <Toaster position="top-right" />
    </AppProvider>
  );
}