import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

export type SelectedJournalPhoto = Readonly<{ fileName: string | null; uri: string }>;

type Props = Readonly<{
  onChange: (photos: readonly SelectedJournalPhoto[]) => void;
  photos: readonly SelectedJournalPhoto[];
}>;

const MAX_PHOTOS = 5;

export function JournalPhotoField({ onChange, photos }: Props) {
  const [error, setError] = useState<string | null>(null);
  const full = photos.length >= MAX_PHOTOS;

  function addAssets(assets: readonly ImagePicker.ImagePickerAsset[]) {
    const existing = new Set(photos.map((photo) => photo.uri));
    const additions = assets.filter((asset) => !existing.has(asset.uri)).map((asset) => ({ fileName: asset.fileName ?? null, uri: asset.uri }));
    onChange([...photos, ...additions].slice(0, MAX_PHOTOS));
    setError(null);
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError("Cần quyền dùng camera để chụp ảnh cây.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled) addAssets(result.assets);
  }

  async function choosePhotos() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ["images"],
      quality: 0.8,
      selectionLimit: MAX_PHOTOS - photos.length,
    });
    if (!result.canceled) addAssets(result.assets);
  }

  return <View style={styles.field}>
    {photos.length ? <ScrollView contentContainerStyle={styles.previews} horizontal showsHorizontalScrollIndicator={false}>
      {photos.map((photo, index) => <View key={photo.uri} style={styles.previewWrap}>
        <Image accessibilityLabel={`Ảnh cây ${index + 1}`} source={{ uri: photo.uri }} style={styles.preview} />
        <Pressable accessibilityLabel={`Xóa ảnh ${index + 1}`} accessibilityRole="button" onPress={() => onChange(photos.filter((candidate) => candidate.uri !== photo.uri))} style={styles.remove}>
          <Ionicons color={colors.surface} name="close" size={18} />
        </Pressable>
      </View>)}
    </ScrollView> : null}
    <View style={styles.actions}>
      <PhotoAction disabled={full} icon="camera-outline" label="Chụp ảnh" onPress={() => void takePhoto()} />
      <PhotoAction disabled={full} icon="images-outline" label="Chọn ảnh" onPress={() => void choosePhotos()} />
    </View>
    <Typography color="textSecondary" variant="bodyMedium">Tối đa {MAX_PHOTOS} ảnh. Ảnh đầu tiên sẽ đại diện cho cập nhật này.</Typography>
    {error ? <Typography accessibilityRole="alert" color="error" variant="bodyMedium">{error}</Typography> : null}
  </View>;
}

function PhotoAction({ disabled, icon, label, onPress }: Readonly<{ disabled: boolean; icon: "camera-outline" | "images-outline"; label: string; onPress: () => void }>) {
  return <Pressable accessibilityLabel={label} accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.action, disabled && styles.disabled, pressed && styles.pressed]}>
    <Ionicons color={colors.primary} name={icon} size={22} /><Typography color="primary" variant="bodyLarge">{label}</Typography>
  </Pressable>;
}

const styles = StyleSheet.create({
  action: { alignItems: "center", borderColor: colors.primary, borderRadius: radius.control, borderWidth: 1, flex: 1, flexDirection: "row", gap: spacing.sm, justifyContent: "center", minHeight: 52, paddingHorizontal: spacing.sm },
  actions: { flexDirection: "row", gap: spacing.sm },
  disabled: { opacity: 0.45 }, field: { gap: spacing.sm }, pressed: { backgroundColor: colors.primarySoft },
  preview: { borderRadius: radius.control, height: 104, width: 104 }, previews: { gap: spacing.sm, paddingRight: spacing.md },
  previewWrap: { position: "relative" }, remove: { alignItems: "center", backgroundColor: colors.text, borderRadius: radius.round, height: 30, justifyContent: "center", position: "absolute", right: 4, top: 4, width: 30 },
});
