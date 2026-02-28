import { RouterProvider } from "react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";

import { AuthProvider } from "./providers/AuthProvider";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
