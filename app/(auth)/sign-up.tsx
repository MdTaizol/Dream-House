
import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  // ============================
  // SIGN UP
  // ============================
  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  };

  // ============================
  // VERIFY EMAIL
  // ============================
  const onVerifyPress = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({
      code,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  // ==================================================
  // EMAIL VERIFICATION SCREEN
  // ==================================================
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full items-center px-5 py-8">
          
          {/* Card */}
          <View className="w-full max-w-md bg-white rounded-3xl px-6 py-7 shadow-sm">

            {/* Logo */}
            <View className="items-center mb-4">
              <Image
                source={require("../../assets/images/logo.png")}
                className="w-40 h-24"
                resizeMode="contain"
              />
            </View>

            {/* Heading */}
            <Text className="text-2xl font-bold text-gray-800 text-center">
              Verify your account
            </Text>

            <Text className="text-gray-500 text-center mt-2">
              Enter the verification code we sent to
            </Text>

            <Text className="text-gray-800 font-semibold text-center mt-1 mb-6">
              {email}
            </Text>

            {/* Code Label */}
            <Text className="text-gray-700 font-semibold mb-2">
              Verification Code
            </Text>

            {/* Code Input */}
            <TextInput
              className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3.5 text-center text-lg"
              placeholder="Enter 6-digit code"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={6}
            />

            {errors?.fields?.code && (
              <Text className="text-red-500 text-sm mt-2">
                {errors.fields.code.message}
              </Text>
            )}

            {/* Verify Button */}
            <TouchableOpacity
              onPress={onVerifyPress}
              disabled={isLoading}
              activeOpacity={0.8}
              className="w-full bg-blue-600 py-3.5 rounded-xl items-center mt-5"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Verify Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Resend */}
            <TouchableOpacity
              onPress={() => signUp.verifications.sendEmailCode()}
              disabled={isLoading}
              className="items-center mt-5"
            >
              <Text className="text-blue-600 font-semibold">
                Didn't receive the code? Resend
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text className="text-gray-400 text-xs text-center mt-5">
            Your account information is securely protected.
          </Text>
        </View>
      </ScrollView>
    );
  }

  // ==================================================
  // SIGN UP SCREEN
  // ==================================================
  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full items-center px-5 py-8">

        {/* Main Card */}
        <View className="w-full max-w-md bg-white rounded-3xl px-6 py-7 shadow-sm">

          {/* Logo */}
          <View className="items-center mb-4">
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-40 h-24"
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <Text className="text-2xl font-bold text-gray-800 text-center">
            Create Account
          </Text>

          <Text className="text-gray-500 text-center mt-2 mb-6">
            Find your Dream Home Today
          </Text>

          {/* First + Last Name */}
          <View className="flex-row gap-3 mb-4">

            <View className="flex-1">
              <Text className="text-gray-700 font-semibold text-sm mb-2">
                First Name
              </Text>

              <TextInput
                className="w-full border border-gray-300 bg-gray-50 rounded-xl px-3.5 py-3.5"
                placeholder="First name"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>

            <View className="flex-1">
              <Text className="text-gray-700 font-semibold text-sm mb-2">
                Last Name
              </Text>

              <TextInput
                className="w-full border border-gray-300 bg-gray-50 rounded-xl px-3.5 py-3.5"
                placeholder="Last name"
                placeholderTextColor="#9CA3AF"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>

          </View>

          {/* Email */}
          <Text className="text-gray-700 font-semibold text-sm mb-2">
            Email Address
          </Text>

          <TextInput
            className="w-full border border-gray-300 bg-gray-50 rounded-xl px-3.5 py-3.5 mb-2"
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {errors?.fields?.emailAddress && (
            <Text className="text-red-500 text-sm mb-3">
              {errors.fields.emailAddress.message}
            </Text>
          )}

          {/* Password */}
          <Text className="text-gray-700 font-semibold text-sm mb-2 mt-2">
            Password
          </Text>

          <TextInput
            className="w-full border border-gray-300 bg-gray-50 rounded-xl px-3.5 py-3.5 mb-2"
            placeholder="Create a password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {errors?.fields?.password && (
            <Text className="text-red-500 text-sm mb-3">
              {errors.fields.password.message}
            </Text>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={onSignUpPress}
            disabled={isLoading}
            activeOpacity={0.8}
            className="w-full bg-blue-600 py-3.5 rounded-xl items-center mt-4"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-gray-200" />

            <Text className="text-gray-400 text-xs mx-4">
              OR
            </Text>

            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Sign In */}
          <View className="flex-row justify-center">
            <Text className="text-gray-500">
              Already have an account?
            </Text>

            <Link href="/sign-in">
              <Text className="text-blue-600 font-semibold ml-1">
                Sign In
              </Text>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <Text className="text-gray-400 text-xs text-center mt-5">
          By creating an account, you agree to our terms and privacy policy.
        </Text>

        {/* CAPTCHA */}
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}

