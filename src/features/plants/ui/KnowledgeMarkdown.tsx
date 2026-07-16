import { StyleSheet, View } from "react-native";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

export function KnowledgeMarkdown({ markdown }: { markdown: string }) {
  const lines = markdown
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0);

  return (
    <View style={styles.content}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        const heading = trimmed.match(/^#{1,6}\s+(.+)$/);
        const bullet = trimmed.match(/^[-*]\s+(.+)$/);
        const numbered = trimmed.match(/^(\d+)\.\s+(.+)$/);

        if (heading?.[1]) {
          return (
            <Typography key={`${index}-${trimmed}`} variant="bodyLarge">
              {plainText(heading[1])}
            </Typography>
          );
        }
        if (bullet?.[1]) {
          return (
            <MarkdownRow
              key={`${index}-${trimmed}`}
              marker="·"
              text={bullet[1]}
            />
          );
        }
        if (numbered?.[1] && numbered[2]) {
          return (
            <MarkdownRow
              key={`${index}-${trimmed}`}
              marker={`${numbered[1]}.`}
              text={numbered[2]}
            />
          );
        }
        return (
          <Typography
            color="textSecondary"
            key={`${index}-${trimmed}`}
            variant="bodyMedium"
          >
            {plainText(trimmed)}
          </Typography>
        );
      })}
    </View>
  );
}

function MarkdownRow({ marker, text }: { marker: string; text: string }) {
  return (
    <View style={styles.row}>
      <Typography color="primary" variant="bodyMedium">
        {marker}
      </Typography>
      <Typography
        color="textSecondary"
        style={styles.copy}
        variant="bodyMedium"
      >
        {plainText(text)}
      </Typography>
    </View>
  );
}

function plainText(value: string): string {
  return value.replaceAll("**", "").replaceAll("`", "");
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm },
  copy: { flex: 1 },
  row: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
});
