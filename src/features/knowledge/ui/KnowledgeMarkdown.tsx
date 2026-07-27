import { StyleSheet, View } from "react-native";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

export function KnowledgeMarkdown({ markdown }: { markdown: string }) {
  const blocks = parseMarkdownBlocks(markdown);

  return (
    <View style={styles.content}>
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          return (
            <Typography key={`${index}-${block.text}`} variant="bodyLarge">
              {plainText(block.text)}
            </Typography>
          );
        }
        if (block.kind === "bullet") {
          return (
            <MarkdownRow
              key={`${index}-${block.text}`}
              marker="·"
              text={block.text}
            />
          );
        }
        if (block.kind === "numbered") {
          return (
            <MarkdownRow
              key={`${index}-${block.text}`}
              marker={`${block.marker}.`}
              text={block.text}
            />
          );
        }
        return (
          <Typography
            color="textSecondary"
            key={`${index}-${block.text}`}
            variant="bodyMedium"
          >
            {plainText(block.text)}
          </Typography>
        );
      })}
    </View>
  );
}

type MarkdownBlock =
  | { kind: "heading" | "paragraph" | "bullet"; text: string }
  | { kind: "numbered"; marker: string; text: string };

function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let paragraphLines: string[] = [];
  const addParagraph = () => {
    if (paragraphLines.length === 0) return;
    blocks.push({ kind: "paragraph", text: paragraphLines.join(" ") });
    paragraphLines = [];
  };

  for (const line of markdown.trim().split("\n")) {
    const trimmed = line.trim();
    const heading = trimmed.match(/^#{1,6}\s+(.+)$/);
    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    const numbered = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (trimmed.length === 0) addParagraph();
    else if (heading?.[1]) {
      addParagraph();
      blocks.push({ kind: "heading", text: heading[1] });
    } else if (bullet?.[1]) {
      addParagraph();
      blocks.push({ kind: "bullet", text: bullet[1] });
    } else if (numbered?.[1] && numbered[2]) {
      addParagraph();
      blocks.push({ kind: "numbered", marker: numbered[1], text: numbered[2] });
    } else paragraphLines.push(trimmed);
  }
  addParagraph();
  return blocks;
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
