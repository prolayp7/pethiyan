import 'package:equatable/equatable.dart';

class BannerEntity extends Equatable {
  final String id;
  final String imageUrl;
  final String? linkType;   // product | category | url | none
  final String? linkValue;  // slug or URL depending on linkType
  final int sortOrder;

  const BannerEntity({
    required this.id,
    required this.imageUrl,
    this.linkType,
    this.linkValue,
    this.sortOrder = 0,
  });

  @override
  List<Object?> get props => [id, imageUrl, linkType, linkValue, sortOrder];
}
