import { Camera, Filter, NotebookPen, Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import type { PlantIdentityData } from "@/features/plants";
import { PlantIdentity } from "@/features/plants";
import { getPreviewPlantKnowledge } from "@/features/knowledge";
import { EmptyState } from "@/shared/ui/EmptyState";
import { IconButton } from "@/shared/ui/IconButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { CARE_ACTIVITY_VISUALS } from "../models/care-activity-icon";
import { CARE_ACTIVITY_LABELS, CARE_ACTIVITY_ORIGIN_LABELS, type CareActivity } from "../models/care-activity";
import { createJournalItems, type JournalItem } from "../models/journal-item";
import type { PlantUpdate } from "../models/plant-update";
import { JournalFilterSheet, type JournalFilters } from "./JournalFilterSheet";

type PlantSummary = PlantIdentityData & Readonly<{ imageUri: string | null; name: string; speciesId: string; stageId: string }>;
type Row = Readonly<{ kind: "header"; label: string }> | Readonly<{ connectsToNext: boolean; kind: "item"; item: JournalItem }>;
type Props = Readonly<{
  activities?: readonly CareActivity[];
  onOpenActivity?: (id: string) => void;
  onOpenUpdate?: (id: string) => void;
  plantNames?: Readonly<Record<string, string>>;
  plants?: Readonly<Record<string, PlantSummary>>;
  updates?: readonly PlantUpdate[];
}>;

const emptyFilters: JournalFilters = { dateRange: "all", plantId: null, recordFilter: "all" };

export function JournalScreen({ activities = [], onOpenActivity = () => undefined, onOpenUpdate = () => undefined, plantNames = {}, plants = {}, updates = [] }: Props) {
  const [filters, setFilters] = useState<JournalFilters>(emptyFilters);
  const [query, setQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const rows = useMemo(() => createRows(filterItems(createJournalItems(activities, updates), filters, query)), [activities, filters, query, updates]);
  const hasFilters = filters !== emptyFilters && (filters.dateRange !== "all" || filters.plantId !== null || filters.recordFilter !== "all");
  const plantOptions = useMemo(() => Object.entries(plants).map(([id, plant]) => ({ id, name: plant.name })).sort((left, right) => left.name.localeCompare(right.name, "vi")), [plants]);

  return <Screen contentGap={spacing.md} headerAction={<View style={styles.headerActions}><IconButton accessibilityLabel="Tìm trong ghi chú" icon={Search} onPress={() => setSearchVisible((visible) => !visible)} /><IconButton accessibilityLabel="Mở bộ lọc nhật ký" icon={Filter} onPress={() => setShowFilters(true)} /></View>} scrollable={false} title="Nhật ký" titleIcon={NotebookPen}>
    {searchVisible ? <View style={styles.search}><Search color={colors.textSecondary} size={20} /><TextInput accessibilityLabel="Tìm trong ghi chú" autoCorrect autoFocus onChangeText={setQuery} placeholder="Tìm trong ghi chú" placeholderTextColor={colors.textSecondary} style={styles.searchInput} value={query} /><IconButton accessibilityLabel="Đóng tìm kiếm" icon={X} onPress={() => { setQuery(""); setSearchVisible(false); }} /></View> : null}
    {hasFilters ? <Pressable accessibilityLabel="Mở bộ lọc nhật ký đang áp dụng" accessibilityRole="button" onPress={() => setShowFilters(true)} style={styles.activeFilter}><Filter color={colors.surface} size={16} /><Typography color="surface" variant="label">Đang lọc</Typography></Pressable> : null}
    <FlatList contentContainerStyle={styles.list} data={rows} keyExtractor={(row, index) => row.kind === "header" ? `${row.label}-${index}` : row.item.id} ListEmptyComponent={activities.length || updates.length ? <EmptyState description="Thử đổi từ khóa tìm kiếm hoặc xóa bộ lọc." icon={Search} title="Không tìm thấy hoạt động phù hợp" /> : <EmptyState description="Hoạt động chăm sóc, ảnh và ghi chú đã lưu sẽ xuất hiện ở đây." icon={NotebookPen} title="Nhật ký của bạn chưa có nội dung" />} renderItem={({ item: row }) => row.kind === "header" ? <Typography color="textSecondary" style={styles.dateHeading} variant="label">{row.label}</Typography> : <JournalRow {...(plants[row.item.record.plantId] ? { plant: plants[row.item.record.plantId] } : {})} {...(plantNames[row.item.record.plantId] ? { plantName: plantNames[row.item.record.plantId] } : {})} connectsToNext={row.connectsToNext} item={row.item} onOpenActivity={onOpenActivity} onOpenUpdate={onOpenUpdate} />} style={styles.journalList} />
    <JournalFilterSheet filters={filters} onApply={setFilters} onDismiss={() => setShowFilters(false)} plants={plantOptions} visible={showFilters} />
  </Screen>;
}

function JournalRow({ connectsToNext, item, onOpenActivity, onOpenUpdate, plant, plantName }: Readonly<{ connectsToNext: boolean; item: JournalItem; onOpenActivity: (id: string) => void; onOpenUpdate: (id: string) => void; plant?: PlantSummary; plantName?: string }>) {
  const name = plant?.name ?? plantName ?? "Cây trồng";
  const occurredAt = new Date(item.occurredAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  if (item.kind === "care") {
    const record = item.record;
    const visual = CARE_ACTIVITY_VISUALS[record.type];
    const ActivityIcon = visual.icon;
    return <Pressable accessibilityLabel={`${CARE_ACTIVITY_LABELS[record.type]} · ${name}`} accessibilityRole="button" onPress={() => onOpenActivity(item.id)} style={styles.row}><View style={styles.timeline}><View style={[styles.timelineIcon, { backgroundColor: visual.backgroundColor }]}><ActivityIcon color={visual.color} size={18} /></View>{connectsToNext ? <View style={styles.timelineLine} /> : null}</View><SurfaceCard style={styles.card}><View style={styles.cardHeader}><Typography variant="headlineSmall">{CARE_ACTIVITY_LABELS[record.type]}</Typography><Typography color="textSecondary" variant="label">{occurredAt}</Typography></View>{plant ? <PlantIdentity imageUri={plant.imageUri} name={plant.name} size="list" speciesTitle={plant.speciesTitle} stageId={plant.stageId} stageTitle={plant.stageTitle} /> : <Typography color="primary" variant="bodyMedium">{name}</Typography>}{record.notes ? <Typography color="textSecondary" numberOfLines={2} variant="bodyMedium">{record.notes}</Typography> : null}<Typography color="textSecondary" variant="label">{CARE_ACTIVITY_ORIGIN_LABELS[record.origin]}</Typography></SurfaceCard></Pressable>;
  }
  const record = item.record;
  const photoUri = record.photos.slice().sort((left, right) => left.position - right.position)[0]?.localUri;
  const stageTitle = plant ? getPreviewPlantKnowledge(plant.speciesId)?.stages.find((stage) => stage.id === record.stageId)?.title ?? "Chưa xác định" : "Chưa xác định";
  const summary = record.notes ?? `Đã thêm ${record.photos.length} ảnh`;
  return <Pressable accessibilityLabel={`Cập nhật cây · ${name}`} accessibilityRole="button" onPress={() => onOpenUpdate(item.id)} style={styles.row}><View style={styles.timeline}><View style={styles.timelineIcon}><Camera color={colors.primary} size={18} /></View>{connectsToNext ? <View style={styles.timelineLine} /> : null}</View><SurfaceCard style={styles.card}><View style={styles.cardHeader}><Typography numberOfLines={2} style={styles.updateSummary} variant="headlineSmall">{summary}</Typography><Typography color="textSecondary" variant="label">{occurredAt}</Typography></View><View style={styles.updateIdentity}>{plant ? <PlantIdentity imageUri={photoUri ?? plant.imageUri} name={plant.name} size="list" speciesTitle={plant.speciesTitle} stageId={record.stageId} stageTitle={stageTitle} /> : <Typography color="primary" variant="bodyMedium">{name}</Typography>}{photoUri ? <Image accessibilityLabel="Ảnh cập nhật cây" source={{ uri: photoUri }} style={styles.photo} /> : null}</View></SurfaceCard></Pressable>;
}

function filterItems(items: readonly JournalItem[], filters: JournalFilters, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase("vi");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = today - 6 * 24 * 60 * 60 * 1000;
  return items.filter((item) => {
    const record = item.record;
    const matchesType = filters.recordFilter === "all" || filters.recordFilter === item.kind || (item.kind === "care" && filters.recordFilter === item.record.type);
    const matchesPlant = filters.plantId === null || record.plantId === filters.plantId;
    const occurredAt = new Date(item.occurredAt).getTime();
    const matchesDate = filters.dateRange === "all" || (filters.dateRange === "today" ? occurredAt >= today : occurredAt >= weekStart);
    return matchesType && matchesPlant && matchesDate && (record.notes ?? "").toLocaleLowerCase("vi").includes(normalizedQuery);
  });
}

function createRows(items: readonly JournalItem[]): readonly Row[] {
  let lastDate = "";
  return items.flatMap((item, index) => {
    const label = formatDateHeading(item.occurredAt);
    const rows: Row[] = label === lastDate ? [] : [{ kind: "header", label }];
    lastDate = label;
    rows.push({ connectsToNext: formatDateHeading(items[index + 1]?.occurredAt ?? "") === label, kind: "item", item });
    return rows;
  });
}

function formatDateHeading(occurredAt: string) {
  const date = new Date(occurredAt);
  const now = new Date();
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (day === today) return "Hôm nay";
  if (day === today - 24 * 60 * 60 * 1000) return "Hôm qua";
  return date.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.sm, minWidth: 0 },
  cardHeader: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm, justifyContent: "space-between" },
  activeFilter: { alignItems: "center", alignSelf: "flex-start", backgroundColor: colors.primary, borderRadius: radius.round, flexDirection: "row", gap: spacing.xs, minHeight: 32, paddingHorizontal: spacing.sm },
  dateHeading: { paddingTop: spacing.sm, textTransform: "uppercase" },
  headerActions: { alignItems: "center", flexDirection: "row" },
  journalList: { flex: 1 },
  list: { gap: spacing.md, paddingBottom: 96, paddingTop: spacing.md },
  photo: { borderRadius: radius.chip, height: 64, width: 64 },
  photoOnly: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  row: { flexDirection: "row", gap: spacing.sm },
  search: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, flexDirection: "row", minHeight: 48, paddingLeft: spacing.md, marginTop: spacing.md },
  searchInput: { color: colors.text, flex: 1, fontSize: 16, lineHeight: 24, minHeight: 48, paddingHorizontal: spacing.sm },
  timeline: { alignItems: "center", alignSelf: "stretch", width: 56 },
  timelineIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderColor: colors.border, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, height: 40, justifyContent: "center", marginTop: spacing.md, width: 40, zIndex: 1 },
  timelineLine: { backgroundColor: colors.border, bottom: -spacing.lg, position: "absolute", top: spacing.md + 40, width: StyleSheet.hairlineWidth },
  updateIdentity: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  updateSummary: { flex: 1 },
});
