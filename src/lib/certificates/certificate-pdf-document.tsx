import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

export type CertificatePdfDocumentProps = {
  studentName: string;
  courseTitle: string;
  code: string;
  issuedAt: Date;
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    backgroundColor: "#fffef8",
  },
  border: {
    borderWidth: 3,
    borderColor: "#111111",
    padding: 32,
    flex: 1,
  },
  brand: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#444444",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111111",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#444444",
    marginBottom: 28,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111111",
    marginBottom: 8,
  },
  course: {
    fontSize: 16,
    color: "#222222",
    marginBottom: 32,
  },
  metaRow: {
    marginTop: "auto",
    borderTopWidth: 2,
    borderTopColor: "#111111",
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaLabel: {
    fontSize: 9,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#111111",
  },
});

export function CertificatePdfDocument({
  studentName,
  courseTitle,
  code,
  issuedAt,
}: CertificatePdfDocumentProps) {
  const issuedLabel = issuedAt.toLocaleDateString("es", {
    dateStyle: "long",
    timeZone: "UTC",
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.brand}>soyup.work</Text>
          <Text style={styles.title}>Certificado de finalización</Text>
          <Text style={styles.subtitle}>
            Se certifica que el siguiente estudiante completó el curso:
          </Text>
          <Text style={styles.name}>{studentName}</Text>
          <Text style={styles.course}>{courseTitle}</Text>
          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaLabel}>Código de verificación</Text>
              <Text style={styles.metaValue}>{code}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Fecha de emisión</Text>
              <Text style={styles.metaValue}>{issuedLabel}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
