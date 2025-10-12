import 'package:image_picker/image_picker.dart';

Future<XFile?> pickImage(ImageSource source) async {
  final picker = ImagePicker();
  final image = await picker.pickImage(source: source);
  return image;
}
