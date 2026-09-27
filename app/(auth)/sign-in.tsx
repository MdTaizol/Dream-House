
import { useSignIn } from "@clerk/expo";
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

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  // ============================
  // SIGN IN
  // ============================
  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.log("Sign-in attempt not complete:", signIn);
    }
  };

  // ============================
  // VERIFY EMAIL CODE
  // ============================
  const onVerifyPress = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({
      code,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  // ==================================================
  // VERIFICATION SCREEN
  // ==================================================
  if (signIn.status === "needs_client_trust") {
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

          {/* Verification Card */}
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
            <Text className="text-gray-700 font-semibold text-sm mb-2">
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

            {/* Resend Code */}
            <TouchableOpacity
              onPress={() => signIn.mfa.sendEmailCode()}
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
  // SIGN IN SCREEN
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
            Welcome Back
          </Text>

          <Text className="text-gray-500 text-center mt-2 mb-6">
            Sign in to continue to your account
          </Text>

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

          {errors?.fields?.identifier && (
            <Text className="text-red-500 text-sm mb-3">
              {errors.fields.identifier.message}
            </Text>
          )}

          {/* Password */}
          <View className="flex-row justify-between items-center mt-2 mb-2">
            <Text className="text-gray-700 font-semibold text-sm">
              Password
            </Text>

            <TouchableOpacity>
              <Text className="text-blue-600 text-sm font-semibold">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            className="w-full border border-gray-300 bg-gray-50 rounded-xl px-3.5 py-3.5 mb-2"
            placeholder="Enter your password"
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

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={onSignInPress}
            disabled={isLoading}
            activeOpacity={0.8}
            className="w-full bg-blue-600 py-3.5 rounded-xl items-center mt-4"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                Sign In
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

          {/* Sign Up */}
          <View className="flex-row justify-center">
            <Text className="text-gray-500">
              Don't have an account?
            </Text>

            <Link href="/sign-up">
              <Text className="text-blue-600 font-semibold ml-1">
                Sign Up
              </Text>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <Text className="text-gray-400 text-xs text-center mt-5">
          Your account information is securely protected.
        </Text>

        {/* Clerk CAPTCHA */}
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}

