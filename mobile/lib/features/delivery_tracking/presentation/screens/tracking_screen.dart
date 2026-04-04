import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/network/dio_client.dart';

class TrackingScreen extends ConsumerStatefulWidget {
  final String orderSlug;
  const TrackingScreen({super.key, required this.orderSlug});

  @override
  ConsumerState<TrackingScreen> createState() => _TrackingScreenState();
}

class _TrackingScreenState extends ConsumerState<TrackingScreen> {
  GoogleMapController? _mapController;
  LatLng? _deliveryBoyPos;
  LatLng? _destinationPos;
  Timer? _pollTimer;
  Map<String, dynamic>? _deliveryBoyInfo;

  @override
  void initState() {
    super.initState();
    _fetchLocation();
    _pollTimer = Timer.periodic(
      const Duration(seconds: AppConstants.trackingPollSeconds),
      (_) => _fetchLocation(),
    );
  }

  Future<void> _fetchLocation() async {
    try {
      final client = await ref.read(dioClientProvider.future);
      final res = await client.get(
        '${ApiConstants.orders}/${widget.orderSlug}/delivery-boy-location',
        forceRefresh: true,
      );
      final data = res.data['data'] as Map<String, dynamic>?;
      if (data == null) return;

      final lat = (data['latitude']  as num?)?.toDouble();
      final lng = (data['longitude'] as num?)?.toDouble();
      final dLat = (data['destination_latitude']  as num?)?.toDouble();
      final dLng = (data['destination_longitude'] as num?)?.toDouble();

      if (!mounted) return;
      setState(() {
        if (lat != null && lng != null) {
          _deliveryBoyPos = LatLng(lat, lng);
        }
        if (dLat != null && dLng != null) {
          _destinationPos = LatLng(dLat, dLng);
        }
        _deliveryBoyInfo = data['delivery_boy'] as Map<String, dynamic>?;
      });

      if (_deliveryBoyPos != null) {
        _mapController?.animateCamera(
          CameraUpdate.newLatLng(_deliveryBoyPos!),
        );
      }
    } catch (_) {}
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    _mapController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Track Order')),
      body: Column(
        children: [
          // Map
          Expanded(
            flex: 3,
            child: _deliveryBoyPos == null
                ? const Center(child: CircularProgressIndicator())
                : GoogleMap(
                    initialCameraPosition: CameraPosition(
                      target: _deliveryBoyPos!,
                      zoom: 15,
                    ),
                    onMapCreated: (c) => _mapController = c,
                    markers: {
                      if (_deliveryBoyPos != null)
                        Marker(
                          markerId: const MarkerId('delivery_boy'),
                          position: _deliveryBoyPos!,
                          icon: BitmapDescriptor.defaultMarkerWithHue(
                              BitmapDescriptor.hueAzure),
                          infoWindow: const InfoWindow(title: 'Delivery Partner'),
                        ),
                      if (_destinationPos != null)
                        Marker(
                          markerId: const MarkerId('destination'),
                          position: _destinationPos!,
                          infoWindow: const InfoWindow(title: 'Your Location'),
                        ),
                    },
                  ),
          ),

          // Delivery boy info card
          if (_deliveryBoyInfo != null)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Colors.white,
                boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundImage: _deliveryBoyInfo!['avatar_url'] != null
                        ? NetworkImage(_deliveryBoyInfo!['avatar_url'] as String)
                        : null,
                    child: _deliveryBoyInfo!['avatar_url'] == null
                        ? const Icon(Icons.person)
                        : null,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(_deliveryBoyInfo!['name'] as String? ?? 'Delivery Partner',
                            style: const TextStyle(fontWeight: FontWeight.w600)),
                        const Text('Your delivery partner',
                            style: TextStyle(fontSize: 12, color: AppColors.grey700)),
                      ],
                    ),
                  ),
                  if (_deliveryBoyInfo!['phone'] != null)
                    IconButton(
                      icon: const Icon(Icons.call, color: AppColors.primary),
                      onPressed: () => launchUrl(
                          Uri.parse('tel:${_deliveryBoyInfo!['phone']}')),
                    ),
                ],
              ),
            )
          else
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text('Fetching delivery partner location...',
                  style: TextStyle(color: AppColors.grey700)),
            ),
        ],
      ),
    );
  }
}
