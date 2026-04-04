import '../../domain/entities/user.dart';

class UserModel extends User {
  const UserModel({
    required super.id,
    required super.name,
    super.email,
    super.phone,
    super.avatarUrl,
    super.isVerified,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id:         json['id']?.toString() ?? '',
      name:       json['name'] as String? ?? '',
      email:      json['email'] as String?,
      phone:      json['phone'] as String?,
      avatarUrl:  json['avatar_url'] as String? ?? json['profile_photo_url'] as String?,
      isVerified: json['email_verified_at'] != null || json['phone_verified_at'] != null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id':       id,
    'name':     name,
    'email':    email,
    'phone':    phone,
    'avatar_url': avatarUrl,
  };
}
