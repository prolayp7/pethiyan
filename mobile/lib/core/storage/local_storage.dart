import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../constants/storage_keys.dart';

class LocalStorage {
  static late Box _userBox;
  static late Box _settingsBox;
  static late Box _searchBox;

  static Future<void> init() async {
    _userBox     = await Hive.openBox(StorageKeys.userBox);
    _settingsBox = await Hive.openBox(StorageKeys.settingsBox);
    _searchBox   = await Hive.openBox(StorageKeys.searchBox);
  }

  // --- User ---
  static Future<void> saveUserProfile(Map<String, dynamic> data) =>
      _userBox.put(StorageKeys.userProfile, data);

  static Map<String, dynamic>? getUserProfile() =>
      _userBox.get(StorageKeys.userProfile)?.cast<String, dynamic>();

  static Future<void> clearUserProfile() =>
      _userBox.delete(StorageKeys.userProfile);

  // --- Settings ---
  static Future<void> saveDeliveryZone(String zoneId, String pincode) async {
    await _settingsBox.put(StorageKeys.deliveryZoneId, zoneId);
    await _settingsBox.put(StorageKeys.deliveryPincode, pincode);
  }

  static String? getDeliveryZoneId() =>
      _settingsBox.get(StorageKeys.deliveryZoneId) as String?;

  static String? getDeliveryPincode() =>
      _settingsBox.get(StorageKeys.deliveryPincode) as String?;

  static Future<void> setOnboardingDone() =>
      _settingsBox.put(StorageKeys.onboardingDone, true);

  static bool isOnboardingDone() =>
      _settingsBox.get(StorageKeys.onboardingDone, defaultValue: false) as bool;

  // --- Recent searches ---
  static List<String> getRecentSearches() {
    final raw = _searchBox.get(StorageKeys.recentSearches);
    if (raw == null) return [];
    return List<String>.from(raw as List);
  }

  static Future<void> addRecentSearch(String query, {int maxItems = 10}) async {
    final searches = getRecentSearches();
    searches.remove(query);
    searches.insert(0, query);
    if (searches.length > maxItems) searches.removeLast();
    await _searchBox.put(StorageKeys.recentSearches, searches);
  }

  static Future<void> clearRecentSearches() =>
      _searchBox.delete(StorageKeys.recentSearches);

  // --- Full wipe (logout) ---
  static Future<void> clearAll() async {
    await _userBox.clear();
    // Keep settings (zone, onboarding) across logout
  }
}

final localStorageProvider = Provider<LocalStorage>((ref) => LocalStorage());
