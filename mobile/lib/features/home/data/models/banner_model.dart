import '../../domain/entities/banner_entity.dart';

class BannerModel extends BannerEntity {
  const BannerModel({
    required super.id,
    required super.imageUrl,
    super.linkType,
    super.linkValue,
    super.sortOrder,
  });

  factory BannerModel.fromJson(Map<String, dynamic> json) {
    return BannerModel(
      id:         json['id']?.toString() ?? '',
      imageUrl:   json['image_url'] as String? ?? json['image'] as String? ?? '',
      linkType:   json['link_type'] as String?,
      linkValue:  json['link_value'] as String? ?? json['slug'] as String?,
      sortOrder:  json['sort_order'] as int? ?? 0,
    );
  }
}
