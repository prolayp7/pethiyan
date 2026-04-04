# Flutter
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Razorpay
-keepclassmembers class com.razorpay.** { *; }
-keep @interface proguard.annotation.Keep
-keep @proguard.annotation.Keep class *
-keepclasseswithmembers class * { @proguard.annotation.Keep <methods>; }

# Stripe
-keep class com.stripe.android.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }

# Gson / JSON serialization
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }

# OkHttp / Dio
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }

# General
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
