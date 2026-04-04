import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String name;
  final String? email;
  final String? phone;
  final String? avatarUrl;
  final bool isVerified;

  const User({
    required this.id,
    required this.name,
    this.email,
    this.phone,
    this.avatarUrl,
    this.isVerified = false,
  });

  @override
  List<Object?> get props => [id, name, email, phone, avatarUrl, isVerified];
}
