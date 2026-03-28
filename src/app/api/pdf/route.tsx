import { createClient } from "@utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Logo from "@../public/autozone-logo.svg";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  renderToStream,
  Image,
} from "@react-pdf/renderer";
// import { Service } from "@lib/types";
import { format } from "date-fns";
import { formatCurrency } from "@lib/helper";

// const formatCurrency = (value: number) =>
//   new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
//     value,
//   );

const styles = StyleSheet.create({
  page: {
    paddingTop: 10,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  image: {
    height: 120,
    width: 220,
    marginTop: 2,
    marginLeft: "auto",
    marginRight: "auto",
  },
  relSections: {
    maxWidth: 250,
  },
  subTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", paddingBottom: 5 },
  relvInfo: {
    fontSize: 9,
    marginTop: 1,
  },
  // Table styles
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 7,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 3,
    marginBottom: 2,
  },
  headerCell: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  row: {
    flexDirection: "row",
    marginVertical: 4,
  },
  // Column widths for products (5 cols: Description, Price/unit, Discount/unit, Count, Total)
  colDescription: { width: "30%", paddingRight: 4 },
  colPrice: { width: "20%" },
  colDiscount: { width: "20%" },
  colCount: { width: "10%" },
  colTotal: { width: "20%" },
  // Column widths for fees (4 cols: Category, Price, Discount, Total)
  feeColCategory: { width: "35%", paddingRight: 4 },
  feeColPrice: { width: "22%" },
  feeColDiscount: { width: "18%" },
  feeColTotal: { width: "25%" },
  // Totals
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "black",
    marginTop: 4,
    paddingTop: 4,
    fontFamily: "Helvetica-Bold",
  },
  grandTotal: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#000000",
    color: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 4,
  },
  grandTotalText: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  returnedText: {
    color: "#cc0000",
    fontSize: 8,
  },
});

interface ServiceFee {
  id: number;
  categoryId: number;
  price: number;
  discount: number | null;
  notes: string | null;
  totalPriceAfterDiscount: number | null;
  isReturned: boolean | null;
  category?: { id: number; name?: string } | null;
}

interface ProductToSell {
  id: number;
  pricePerUnit: number;
  discount: number | null;
  count: number | null;
  note: string | null;
  totalPriceAfterDiscount: number | null;
  isReturned: boolean | null;
  product: {
    id: number;
    name?: string;
  } | null;
}

interface Service {
  id: number;
  created_at: string;
  servicesFee: ServiceFee[];
  productsToSell: ProductToSell[];
  clients?: {
    name?: string;
    email?: string;
    phones?: { number?: string }[];
  } | null;
  cars?: { plateNumber?: string; model?: string } | null;
}

interface InvoiceDocumentProps {
  services: Service[];
}

const ProductsTable = ({ products }: { products: ProductToSell[] }) => {
  const activeProducts = products.filter((p) => !p.isReturned);
  const totalBeforeDiscount = activeProducts.reduce(
    (sum, p) => sum + p.pricePerUnit * (p.count ?? 1),
    0,
  );
  const totalAfterDiscount = activeProducts.reduce(
    (sum, p) =>
      sum + (p.totalPriceAfterDiscount ?? p.pricePerUnit * (p.count ?? 1)),
    0,
  );
  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>Products</Text>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.colDescription]}>
          Description
        </Text>
        <Text style={[styles.headerCell, styles.colPrice]}>Price per unit</Text>
        <Text style={[styles.headerCell, styles.colDiscount]}>
          Discount per unit
        </Text>
        <Text style={[styles.headerCell, styles.colCount]}>Count</Text>
        <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
      </View>
      {products.map((p) => (
        <View key={p.id} style={styles.row}>
          <Text style={[{ fontSize: 10 }, styles.colDescription]}>
            {p.product?.name ?? `Product #${p.product?.id ?? "N/A"}`}
            {p.isReturned ? " (Returned)" : ""}
          </Text>
          <Text style={[{ fontSize: 10 }, styles.colPrice]}>
            {formatCurrency(p.pricePerUnit)}
          </Text>
          <Text style={[{ fontSize: 10 }, styles.colDiscount]}>
            {formatCurrency(p.discount)}
          </Text>
          <Text style={[{ fontSize: 10 }, styles.colCount]}>
            {p.count ?? 1}
          </Text>
          <Text style={[{ fontSize: 10 }, styles.colTotal]}>
            {formatCurrency(p.totalPriceAfterDiscount)}
          </Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.colDescription} />
        <Text style={styles.colPrice} />
        <Text style={[{ fontSize: 10 }, styles.colDiscount]}>
          Total Discount
        </Text>
        <Text style={[{ fontSize: 10 }, styles.colCount]}>Total</Text>
        <Text style={[{ fontSize: 10 }, styles.colTotal]}>
          {formatCurrency(totalAfterDiscount)}
        </Text>
      </View>
      <View style={{ flexDirection: "row", marginTop: 2 }}>
        <Text style={styles.colDescription} />
        <Text style={styles.colPrice} />
        <Text style={[{ fontSize: 10, color: "#cc0000" }, styles.colDiscount]}>
          {formatCurrency(totalDiscount)}
        </Text>
        <Text style={styles.colCount} />
        <Text style={styles.colTotal} />
      </View>
    </View>
  );
};

const ServicesFeeTable = ({ fees }: { fees: ServiceFee[] }) => {
  const activeFees = fees.filter((f) => !f.isReturned);
  const totalBeforeDiscount = activeFees.reduce((sum, f) => sum + f.price, 0);
  const totalAfterDiscount = activeFees.reduce(
    (sum, f) => sum + (f.totalPriceAfterDiscount ?? f.price),
    0,
  );
  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>Services</Text>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.feeColCategory]}>Category</Text>
        <Text style={[styles.headerCell, styles.feeColPrice]}>Price</Text>
        <Text style={[styles.headerCell, styles.feeColDiscount]}>Discount</Text>
        <Text style={[styles.headerCell, styles.feeColTotal]}>Total</Text>
      </View>
      {fees.map((fee) => (
        <View key={fee.id} style={styles.row}>
          <Text style={[{ fontSize: 10 }, styles.feeColCategory]}>
            {fee.category?.name ?? `Category #${fee.categoryId}`}
            {fee.isReturned ? " (Returned)" : ""}
          </Text>
          <Text style={[{ fontSize: 10 }, styles.feeColPrice]}>
            {formatCurrency(fee.price)}
          </Text>
          <Text style={[{ fontSize: 10 }, styles.feeColDiscount]}>
            {fee.discount ? `${formatCurrency(fee.discount)}` : "-"}
          </Text>
          <Text style={[{ fontSize: 10 }, styles.feeColTotal]}>
            {formatCurrency(fee.totalPriceAfterDiscount)}
          </Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.feeColCategory} />
        <Text style={styles.feeColPrice} />
        <Text style={[{ fontSize: 10 }, styles.feeColDiscount]}>
          Total Discount
        </Text>
        <Text style={[{ fontSize: 10 }, styles.feeColTotal]}>
          {formatCurrency(totalAfterDiscount)}
        </Text>
      </View>
      <View style={{ flexDirection: "row", marginTop: 2 }}>
        <Text style={styles.feeColCategory} />
        <Text style={styles.feeColPrice} />
        <Text
          style={[{ fontSize: 10, color: "#cc0000" }, styles.feeColDiscount]}
        >
          {formatCurrency(totalDiscount)}
        </Text>
        <Text style={styles.feeColTotal} />
      </View>
    </View>
  );
};

const InvoiceDocument = ({ services }: InvoiceDocumentProps) => (
  <Document>
    {services.map((service) => {
      const client = service.clients;
      const car = service.cars;

      const activeFees = service.servicesFee.filter((f) => !f.isReturned);
      const activeProducts = service.productsToSell.filter(
        (p) => !p.isReturned,
      );

      const feesBeforeDiscount = activeFees.reduce((s, f) => s + f.price, 0);
      const feesAfterDiscount = activeFees.reduce(
        (s, f) => s + (f.totalPriceAfterDiscount ?? f.price),
        0,
      );

      const productsBeforeDiscount = activeProducts.reduce(
        (s, p) => s + p.pricePerUnit * (p.count ?? 1),
        0,
      );
      const productsAfterDiscount = activeProducts.reduce(
        (s, p) =>
          s + (p.totalPriceAfterDiscount ?? p.pricePerUnit * (p.count ?? 1)),
        0,
      );

      const totalBeforeDiscount = feesBeforeDiscount + productsBeforeDiscount;
      const totalDiscount =
        totalBeforeDiscount - (feesAfterDiscount + productsAfterDiscount);
      const grandTotal = feesAfterDiscount + productsAfterDiscount;

      return (
        <Page key={service.id} size="A4" style={styles.page}>
          <Image
            source="https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/makerLogos//AutoZone-Logo.wine.png"
            style={styles.image}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
              {/* Client */}
              <View style={styles.relSections}>
                <Text style={styles.subTitle}>ISSUED TO</Text>
                <Text style={styles.relvInfo}>{client?.name ?? ""}</Text>
                <Text style={styles.relvInfo}>{client?.email ?? ""}</Text>
                <Text style={styles.relvInfo}>
                  Plate Num: {car?.plateNumber ?? ""}
                </Text>
                <Text style={styles.relvInfo}>
                  {client?.phones && client.phones.length
                    ? client.phones[0].number
                    : ""}
                </Text>
              </View>

              {/* Company */}
              <View style={styles.relSections}>
                <Text style={styles.subTitle}>FROM</Text>
                <Text style={styles.relvInfo}>Mohammed Osama</Text>
                <Text style={styles.relvInfo}>Auto Zone</Text>
                <Text style={styles.relvInfo}>Some addressssssssss</Text>
                <Text style={styles.relvInfo}>01129442476</Text>
              </View>
            </View>

            {/* Invoice Number */}
            <View style={{ maxWidth: 250 }}>
              <Text style={{ ...styles.subTitle, marginLeft: "auto" }}>
                INVOICE NO.
              </Text>
              <Text style={{ ...styles.relvInfo, marginLeft: "auto" }}>
                #{String(service.id).padStart(2, "0")}
              </Text>
              <Text style={{ ...styles.relvInfo, marginLeft: "auto" }}>
                Date: {format(service.created_at, "MMMM dd, yyyy")}
              </Text>
            </View>
          </View>

          {/* Tables */}
          <View style={{ marginTop: 30 }}>
            {service.servicesFee.length > 0 && (
              <ServicesFeeTable fees={service.servicesFee} />
            )}

            {service.productsToSell.length > 0 && (
              <ProductsTable products={service.productsToSell} />
            )}
          </View>

          <View style={styles.grandTotal}>
            <View>
              <Text style={styles.grandTotalText}>Grand Total</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 10, color: "#aaaaaa", marginBottom: 2 }}>
                Total Price: {formatCurrency(totalBeforeDiscount)}
              </Text>
              <Text style={{ fontSize: 10, color: "#ff6666", marginBottom: 4 }}>
                Total Discount: -{formatCurrency(totalDiscount)}
              </Text>
              <Text style={styles.grandTotalText}>
                {formatCurrency(grandTotal)}
              </Text>
            </View>
          </View>
        </Page>
      );
    })}
  </Document>
);
export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url || "");
  const idArr = searchParams.get("ids");
  const type = searchParams.get("type");

  const ids: number[] = idArr ? JSON.parse(idArr) : [];

  if (!ids.length)
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      {
        status: 500,
      },
    );
  const { data: services, error } = await supabase
    .from("services")
    .select(
      "*,productsToSell(*,product(*)),servicesFee(*,category:categoryId(*)),clients(*,phones(*)),cars(*)",
    )
    .in("id", ids);

  if (error)
    return new NextResponse(JSON.stringify({ message: `${error.message}` }), {
      status: 500,
    });
  if (!services || !services.length)
    return new NextResponse(
      JSON.stringify({ message: `No matching service found` }),
      { status: 500 },
    );

  const stream = await renderToStream(<InvoiceDocument services={services} />);
  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
    },
  });
}

// export async function GET(req: NextRequest, res: NextResponse) {
//   const token = getToken();
//   const { searchParams } = new URL(req.url || "");
//   const id = searchParams.get("id");

//   const externalApiUrl = `${process.env.API_URL}/api/Services/pdf/${id}`;

//   const response = await fetch(externalApiUrl, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   const pdfBuffer = await response.arrayBuffer();

//   return new NextResponse(pdfBuffer, {
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=downloaded.pdf",
//     },
//   });
// }
