import { Button } from "@/components/ui/button";
import { Navigate, Outlet } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import Header from "./components/custom/Header";
import { Toaster } from "sonner";

function App() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isSignedIn && isLoaded) {
    return <Navigate to={"auth/sign-in"} />;
  }

  return (
    <>
      <Header />
      <Outlet />
      <Toaster richColors position="top-center"/>
     
    </>
  );
}

export default App;
