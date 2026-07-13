import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import type { CareGuide } from "@/features/knowledge/preview-knowledge";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

export function StageInformationalGuideSection({ guides }: { guides: readonly CareGuide[] }) {
  if (guides.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Ionicons color={colors.primary} name="book-outline" size={20} />
        <Typography variant="headlineSmall">Hướng dẫn tham khảo</Typography>
      </View>
      {guides.map((guide) => (
        <SurfaceCard key={guide.id} style={styles.card}>
          <View style={styles.guideHeading}>
            <View style={styles.icon}>
              <Ionicons color={colors.primary} name="book-outline" size={20} />
            </View>
            <Typography style={styles.title} variant="headlineSmall">{guide.title}</Typography>
          </View>
          {guide.goal !== guide.title ? <Typography variant="bodyLarge">{guide.goal}</Typography> : null}
          <GuideMarkdown markdown={guide.bodyMarkdown} />
        </SurfaceCard>
      ))}
    </View>
  );
}

function GuideMarkdown({ markdown }: { markdown: string }) {
  const lines = markdown.trim().split("\n").filter((line) => line.trim().length > 0);

  return (
    <View style={styles.content}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        const heading = trimmed.match(/^#{1,6}\s+(.+)$/);
        const bullet = trimmed.match(/^[-*]\s+(.+)$/);
        const numbered = trimmed.match(/^(\d+)\.\s+(.+)$/);

        if (heading?.[1]) {
          return <Typography key={`${index}-${trimmed}`} variant="bodyLarge">{plainText(heading[1])}</Typography>;
        }
        if (bullet?.[1]) {
          return <GuideRow key={`${index}-${trimmed}`} marker="·" text={bullet[1]} />;
        }
        if (numbered?.[1] && numbered[2]) {
          return <GuideRow key={`${index}-${trimmed}`} marker={`${numbered[1]}.`} text={numbered[2]} />;
        }
        return <Typography color="textSecondary" key={`${index}-${trimmed}`} variant="bodyMedium">{plainText(trimmed)}</Typography>;
      })}
    </View>
  );
}

function GuideRow({ marker, text }: { marker: string; text: string }) {
  return (
    <View style={styles.row}>
      <Typography color="primary" variant="bodyMedium">{marker}</Typography>
      <Typography color="textSecondary" style={styles.title} variant="bodyMedium">{plainText(text)}</Typography>
    </View>
  );
}

function plainText(value: string): string {
  return value.replaceAll("**", "").replaceAll("`", "");
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  content: { gap: spacing.sm },
  guideHeading: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  heading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  icon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 20, height: 40, justifyContent: "center", width: 40 },
  row: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  section: { gap: spacing.md },
  title: { flex: 1 },
});
