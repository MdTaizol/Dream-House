import { useAuth, useSignUp } from '@clerk/expo';
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

  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";
  if(signUp.status === "complete" || isSignedIn){
    return null;
  }

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      // console.error(JSON.stringify(error.message, null, 2));
      alert(error.message);
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const onVerifyPress = async () =>{
   await signUp.verifications.verifyEmailCode({
   code,
   });
   if(signUp.status === "complete"){
    await signUp.finalize({
      navigate:({ decorateUrl })=>{
        const url = decorateUrl("/");
        router.replace(url as any);
      },
    });
   }
  };

if (
  signUp.status === "missing_requirements" &&
  signUp.unverifiedFields.includes("email_address") &&
  signUp.missingFields.length === 0
) {

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

          <TouchableOpacity onPress={()=> signUp.verifications.sendEmailCode()}
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
          Create Account
        </Text>

        <Text className="text-gray-800 mb-7 font-bold">
          Find your Dream Home Today
        </Text>

        {/* First Name + Last Name */}
        <View className="flex-row gap-3 mb-4">

          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="First name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Last name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

        </View>

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
        {errors.fields.emailAddress && (
          <Text className="text-red-500 mb-3">
            {errors.fields.emailAddress.message}
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
          onPress={onSignUpPress}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign In */}
        <View className="flex-row justify-center">
          <Text className="text-gray-500">
            Already have an account?
          </Text>

          <Link href="/sign-in">
            <Text className="text-blue-600 font-semibold">
              {" "}Sign In
            </Text>
          </Link>
        </View>

        {/* CAPTCHA */}
        <View nativeID="clerk-captcha" />

      </View>
    </ScrollView>
  );
}