import { useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignUp() {

  const { signIn, errors, fetchStatus } = useSignIn();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";


  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    
    });

    if (error) {
      // console.error(JSON.stringify(error.message, null, 2));
      alert(error.message);
      return;
    }
     if(signIn.status === "complete") {
       await signIn.finalize({
      navigate:({ session, decorateUrl })=>{
        if(session?.currentTask){
          console.log(session?.currentTask);
          return;
        }
        const url = decorateUrl("/");
        router.replace(url as any);
      },
    });
     }
    else if (signIn.status === "needs_second_factor"){
      await signIn.mfa.sendPhoneCode();
     }
     else if(signIn.status === "needs_client_trust"){
     const emailCodeFactor =  signIn.supportedSecondFactors.find((factor) =>factor.strategy === "email_code",);
      if(emailCodeFactor){
        await signIn.mfa.sendEmailCode();
      }
     }
     else {
      console.error("Sign-in attempt not complete:", signIn);
     }
  
  };

  const onVerifyPress = async () =>{
   await signIn.mfa.verifyEmailCode({code});
   if(signIn.status === "complete"){
     await signIn.finalize({
       navigate:({ session, decorateUrl })=>{
        if(session?.currentTask){
          console.log(session?.currentTask);
          return;
        }
        const url = decorateUrl("/");
        router.replace(url as any);
       },
     });
   }
  };

 if ( signIn.status === "needs_client_trust")

   {

  return( 
   <View className="flex-1 justify-center px-6 py-10">

        {/* Logo */}
        <View className="items-center mb-6">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-56 h-32"
            resizeMode="contain"
          />
        </View>

        {/* Heading */}
        <Text className="text-3xl font-bold text-gray-800 mb-2">
         Verify your account{" "}
        </Text>

        <Text className="text-gray-800 mb-7 font-bold">
          We sent a code to {email}
        </Text>

        {/* Verfiacation code */}
        

          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Enter verification code"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          
          />

          {errors.fields.code && (
            <Text className="text-red-500 mb-4">
              {errors.fields.code.message}
            </Text>
          )}

           <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
            verify
            </Text>
          )}
        </TouchableOpacity>

          <TouchableOpacity onPress={()=> signIn.mfa.sendEmailCode()}
            className="py-2">
              <Text className="text-bule-600">I Nedd a new code</Text>

          </TouchableOpacity>
        
      </View>
     
  );

}


  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-10">

        {/* Logo */}
        <View className="items-center mb-6">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-56 h-32"
            resizeMode="contain"
          />
        </View>

        {/* Heading */}
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back
        </Text>

        <Text className="text-gray-800 mb-7 font-bold">
          Sign in to your account
        </Text>

        

         

        {/* Email */}
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
          placeholder="Email address"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Email Error */}
        {errors?.fields.identifier && (
          <Text className="text-red-500 mb-3">
            {errors.fields.identifier.message}
          </Text>
        )}

        {/* Password */}
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Password Error */}
        {errors.fields.password && (
          <Text className="text-red-500 mb-4">
            {errors.fields.password.message}
          </Text>
        )}

        {/* Sign Up Button */}
        <TouchableOpacity
           onPress={onSignInPress}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign In */}
        <View className="flex-row justify-center">
          <Text className="text-gray-500">
            Don't have an account?
          </Text>

          <Link href="/sign-up">
            <Text className="text-blue-600 font-semibold">
              {" "}Sign Up
            </Text>
          </Link>
        </View>

        {/* CAPTCHA */}
        <View nativeID="clerk-captcha" />

      </View>
    </ScrollView>
  );
}