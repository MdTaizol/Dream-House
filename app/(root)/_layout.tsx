import { useUserSync } from "@/hooks/useUserSync";
import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";
export default function RootLayout(){
  const {isSignedIn, isLoaded } = useAuth();

  // Mone rakhis : sync Clerk user -> supabase ( we'll build this later)
 useUserSync();
  if(!isLoaded) return null;
  if(!isSignedIn) return <Redirect href="/sign-in"/>;

  return <Slot/>;
}