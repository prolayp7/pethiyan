import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../app/theme/app_colors.dart';

class ShimmerBox extends StatelessWidget {
  final double? width;
  final double? height;
  final double borderRadius;

  const ShimmerBox({
    super.key,
    this.width,
    this.height,
    this.borderRadius = 8,
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.grey200,
      highlightColor: AppColors.grey100,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: AppColors.grey200,
          borderRadius: BorderRadius.circular(borderRadius),
        ),
      ),
    );
  }
}

/// Row of shimmer boxes for text lines
class ShimmerText extends StatelessWidget {
  final int lines;
  final double lineHeight;

  const ShimmerText({super.key, this.lines = 3, this.lineHeight = 14});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: List.generate(lines, (i) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: ShimmerBox(
          height: lineHeight,
          width: i == lines - 1 ? 120 : double.infinity,
        ),
      )),
    );
  }
}
