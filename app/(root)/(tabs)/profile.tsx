import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from 'react';

import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

export default function profile() {
  const router = useRouter();
   const {signOut} = useAuth();
   const handleSignout = async() => {

    try {
      await signOut();
      router.replace("/(auth)/sign-in");

    }
    catch( error) {
      console.error("Error signing out:", error);
    }
   };
  
  return (

    
      <SafeAreaView>
      <Text>profile</Text>
      <TouchableOpacity onPress={handleSignout}>
        signOut
      </TouchableOpacity>
      </SafeAreaView>
    
  )
}