import 'package:geolocator/geolocator.dart';

class LocationService {
  /// Returns current GPS position after checking/requesting permissions.
  /// Throws [LocationPermissionDeniedException] or [LocationServiceDisabledException].
  static Future<Position> getCurrentPosition() async {
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw const LocationServiceDisabledException();
    }

    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw const LocationPermissionDeniedException('Location permission denied.');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw const LocationPermissionDeniedException(
        'Location permission permanently denied. Please enable in settings.',
        isPermanent: true,
      );
    }

    return Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        timeLimit: Duration(seconds: 10),
      ),
    );
  }

  static Future<bool> hasPermission() async {
    final permission = await Geolocator.checkPermission();
    return permission == LocationPermission.always ||
        permission == LocationPermission.whileInUse;
  }
}

class LocationPermissionDeniedException implements Exception {
  final String message;
  final bool isPermanent;
  const LocationPermissionDeniedException(this.message, {this.isPermanent = false});
}

class LocationServiceDisabledException implements Exception {
  const LocationServiceDisabledException();
  String get message => 'Location services are disabled.';
}
